import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useClientAuth } from '../../contexts/ClientContext';

export function FloatingMessageButton() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useClientAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.client_id) return;

    const fetchCount = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id')
          .eq('client_id', user.client_id)
          .eq('expediteur', 'admin')
          .eq('lu', false);

        if (!error) {
          setUnreadCount(data?.length || 0);
        }
      } catch (err) {
        console.error('Unread message fetch failed', err);
      }
    };

    fetchCount();

    const subscription = supabase
      .channel(`client_messages:${user.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${user.client_id}`,
        },
        fetchCount
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.client_id]);

  if (location.pathname === '/clients/messages') {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/clients/messages')}
      className="fixed right-5 bottom-24 z-50 inline-flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[var(--brand-midnight)] text-white shadow-[0_14px_30px_rgba(25,25,112,0.22)] transition-transform duration-150 hover:-translate-y-1 active:scale-[0.94] focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40"
      aria-label={`Messagerie MIDEESSI${unreadCount > 0 ? ` — ${unreadCount} non lus` : ''}`}
    >
      <MessageCircle className="h-6 w-6" />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 inline-flex h-5 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white shadow-lg">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
}
