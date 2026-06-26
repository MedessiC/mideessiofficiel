import { useEffect, useMemo, useState } from 'react';
import { useClientAuth } from '../contexts/ClientContext';
import { supabase } from '../lib/supabase';
import SEO from '../components/SEO';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCard } from '../components/ui/SkeletonCard';
import { MessageBubble } from '../components/features/chat/MessageBubble';
import { MessageInput } from '../components/features/chat/MessageInput';
import { DateSeparator } from '../components/features/chat/DateSeparator';

interface MessageItem {
  id: string;
  client_id: string;
  contenu: string;
  expediteur: 'client' | 'admin';
  created_at: string;
  lu: boolean;
  tag?: string;
}

function formatDateLabel(dateString: string) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Aujourd’hui';
  if (date.toDateString() === yesterday.toDateString()) return 'Hier';
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function ClientMessages() {
  const { user } = useClientAuth();
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.client_id) return;

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', user.client_id)
        .order('created_at', { ascending: true });
      if (error) {
        console.error('Messages load failed', error);
      } else {
        setMessages((data || []) as MessageItem[]);
      }
      setLoading(false);
    };

    fetchMessages();

    const subscription = supabase
      .channel(`client_messages_live:${user.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${user.client_id}`,
        },
        fetchMessages
      )
      .subscribe();

    return () => subscription.unsubscribe();
  }, [user?.client_id]);

  const grouped = useMemo(() => {
    return messages.reduce<Record<string, MessageItem[]>>((acc, message) => {
      const label = formatDateLabel(message.created_at);
      acc[label] = acc[label] || [];
      acc[label].push(message);
      return acc;
    }, {});
  }, [messages]);

  const handleSend = async () => {
    const content = draft.trim();
    if (!content || !user?.client_id) return;

    await supabase.from('messages').insert([{ client_id: user.client_id, contenu: content, expediteur: 'client', lu: false }]);
    setDraft('');
  };

  return (
    <div className="pb-28">
      <SEO title="Messagerie | Client MIDEESSI" description="Échangez avec l'équipe MIDEESSI en temps réel." />
      <div className="space-y-3">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--brand-gold)]/90">Messagerie</p>
        <h1 className="text-2xl font-semibold text-[var(--brand-midnight)]">Vos échanges avec MIDEESSI</h1>
        <p className="max-w-2xl text-sm text-[var(--text-secondary)]">Les messages les plus récents s’affichent automatiquement. Restez en contact depuis votre espace privé.</p>
      </div>

      <div className="mt-6 min-h-[60vh] rounded-[26px] border border-[var(--border)] bg-[var(--bg-card)] p-4 shadow-soft">
        {loading ? (
          <div className="space-y-4">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : messages.length === 0 ? (
          <EmptyState
            title="Aucun message pour l'instant"
            description="Envoyez votre premier message à l’équipe MIDEESSI — le support vous répondra sous 24h ouvrées."
          />
        ) : (
          <div className="space-y-4">
            {Object.entries(grouped).map(([label, group]) => (
              <div key={label}>
                <DateSeparator label={label} />
                <div className="space-y-3">
                  {group.map((item) => (
                    <MessageBubble
                      key={item.id}
                      author={item.expediteur}
                      message={item.contenu}
                      timestamp={new Date(item.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      read={item.lu}
                      tag={item.expediteur === 'client' && item.contenu.toLowerCase().includes('demande') ? 'demande' : undefined}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <MessageInput value={draft} onChange={setDraft} onSend={handleSend} disabled={loading} />
      </div>
    </div>
  );
}
