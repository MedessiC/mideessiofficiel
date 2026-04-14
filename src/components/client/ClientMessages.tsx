import { useEffect, useState } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Send, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  contenu: string;
  expediteur: 'client' | 'admin';
  lu: boolean;
  created_at: string;
}

const ClientMessages = () => {
  const { user } = useClientAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`messages:${user?.client_id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `client_id=eq.${user?.client_id}`,
        },
        () => {
          fetchMessages();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user?.client_id]);

  const fetchMessages = async () => {
    try {
      if (!user?.client_id) return;

      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', user.client_id)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);

        // Mark unread messages as read
        const unreadIds = data
          .filter(m => !m.lu && m.expediteur === 'admin')
          .map(m => m.id);

        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            .update({ lu: true })
            .in('id', unreadIds);
        }
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user?.client_id) return;

    setSending(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          client_id: user.client_id,
          expediteur: 'client',
          contenu: newMessage,
          lu: false,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
    </div>;
  }

  const unreadAdminMessages = messages.filter(m => m.expediteur === 'admin' && !m.lu).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
        <p className="text-blue-800 dark:text-blue-300">
          💬 Communiquez directement avec notre équipe MIDEESSI. Nous vous répondons sous 24h.
        </p>
      </div>

      {/* Messages Container */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[600px]">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <MessageCircle className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                Aucun message pour le moment.
              </p>
              <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                Envoyez un message à notre équipe et nous vous répondrons rapidement.
              </p>
            </div>
          ) : (
            messages.map(message => (
              <div
                key={message.id}
                className={`flex ${message.expediteur === 'client' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-3 rounded-2xl ${
                    message.expediteur === 'client'
                      ? 'bg-gold/20 text-midnight dark:text-white border border-gold/30'
                      : 'bg-gray-100 dark:bg-gray-700 text-midnight dark:text-white border border-gray-200 dark:border-gray-600'
                  }`}
                >
                  <p className="text-sm mb-1">
                    {message.contenu}
                  </p>
                  <p className={`text-xs font-semibold ${
                    message.expediteur === 'client'
                      ? 'text-gold'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                    {message.expediteur === 'client' && ' (Vous)'}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-700/50">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              placeholder="Écrivez votre message..."
              className="flex-1 px-4 py-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold/90 text-midnight font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Status Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-center">
          <p className="text-green-800 dark:text-green-300 text-sm">
            ✓ {messages.filter(m => m.expediteur === 'admin').length} message{messages.filter(m => m.expediteur === 'admin').length !== 1 ? 's' : ''} de notre équipe
          </p>
        </div>
        <div className={`border rounded-lg p-4 text-center ${
          unreadAdminMessages > 0
            ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
            : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
        }`}>
          <p className={unreadAdminMessages > 0 ? 'text-red-800 dark:text-red-300' : 'text-gray-600 dark:text-gray-400'}>
            {unreadAdminMessages > 0
              ? `🔔 ${unreadAdminMessages} nouveau message${unreadAdminMessages !== 1 ? 's' : ''}`
              : '✓ Tous les messages lus'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientMessages;
