import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';

const FloatingMessageButton = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useClientAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user?.client_id) return;

    const fetchUnreadCount = async () => {
      try {
        const { data } = await supabase
          .from('messages')
          .select('id')
          .eq('client_id', user.client_id)
          .eq('expediteur', 'admin')
          .eq('lu', false);

        setUnreadCount(data?.length || 0);
      } catch (error) {
        console.error('Error fetching unread count:', error);
      }
    };

    fetchUnreadCount();

    const subscription = supabase
      .channel(`client_mobile_messages:${user.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${user.client_id}`,
        },
        () => fetchUnreadCount()
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.client_id]);

  if (location.pathname.includes('/clients/messages')) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={() => navigate('/clients/messages')}
      className="fixed right-4 bottom-28 z-50 inline-flex items-center gap-3 rounded-full bg-[var(--brand-midnight)] px-4 py-3 text-white shadow-[0_25px_50px_rgba(25,25,112,0.25)] transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[var(--brand-gold)]/40"
      aria-label="Accéder à la messagerie"
    >
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-gold)] text-midnight shadow-lg">
        <MessageCircle className="h-6 w-6" />
      </span>
      <div className="text-left leading-tight">
        <span className="block text-xs text-white/70">Support</span>
        <span className="text-sm font-semibold">Envoi de message</span>
      </div>
      {unreadCount > 0 && (
        <span className="inline-flex min-w-[28px] items-center justify-center rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default FloatingMessageButton;
