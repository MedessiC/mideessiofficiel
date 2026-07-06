-- Migration: add downloads counter, book_downloads table, trigger, and RPC

-- Add downloads column to books
ALTER TABLE public.books
ADD COLUMN IF NOT EXISTS downloads bigint DEFAULT 0;

-- Create table to log downloads
CREATE TABLE IF NOT EXISTS public.book_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  book_id uuid NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  user_id uuid NULL,
  ip text NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger function to increment books.downloads after insert on book_downloads
CREATE OR REPLACE FUNCTION public._increment_book_downloads_trigger()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.books
  SET downloads = COALESCE(downloads, 0) + 1
  WHERE id = NEW.book_id;
  RETURN NEW;
END;
$$;

-- Create trigger
DROP TRIGGER IF EXISTS trg_book_downloads_after_insert ON public.book_downloads;
CREATE TRIGGER trg_book_downloads_after_insert
AFTER INSERT ON public.book_downloads
FOR EACH ROW
EXECUTE FUNCTION public._increment_book_downloads_trigger();

-- RPC function to record a download and return the current downloads count
CREATE OR REPLACE FUNCTION public.increment_book_download(p_book_id uuid, p_user_id uuid DEFAULT NULL, p_ip text DEFAULT NULL)
RETURNS bigint LANGUAGE plpgsql AS $$
DECLARE
  v_id uuid;
  v_count bigint;
BEGIN
  INSERT INTO public.book_downloads(book_id, user_id, ip) VALUES (p_book_id, p_user_id, p_ip) RETURNING id INTO v_id;
  SELECT downloads FROM public.books WHERE id = p_book_id INTO v_count;
  RETURN COALESCE(v_count, 0);
END;
$$ SECURITY DEFINER;
