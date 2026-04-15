import { useEffect, useState, useRef } from 'react';
import { useClientAuth } from '../../contexts/ClientContext';
import { supabase } from '../../lib/supabase';
import { Send, MessageCircle, CheckCheck, Clock } from 'lucide-react';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  // Format date for grouping messages
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  // Group messages by date
  const groupedMessages = messages.reduce((groups, message) => {
    const date = formatDate(message.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h2 className="text-3xl font-bold text-midnight dark:text-white mb-2">Messagerie</h2>
          <p className="text-gray-600 dark:text-gray-400">Communiquez directement avec notre équipe MIDEESSI</p>
        </div>
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800/50 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">Messages reçus</p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">{messages.filter(m => m.expediteur === 'admin').length}</p>
              </div>
              <CheckCheck className="w-10 h-10 text-green-400" />
            </div>
          </div>

          <div className={`border rounded-xl p-4 transition-all ${
            unreadAdminMessages > 0
              ? 'bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800/50'
              : 'bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wide ${
                  unreadAdminMessages > 0
                    ? 'text-amber-700 dark:text-amber-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}>
                  {unreadAdminMessages > 0 ? 'Nouveaux messages' : 'Statut'}
                </p>
                <p className={`text-2xl font-bold ${
                  unreadAdminMessages > 0
                    ? 'text-amber-900 dark:text-amber-100'
                    : 'text-gray-900 dark:text-gray-100'
                }`}>
                  {unreadAdminMessages > 0 ? unreadAdminMessages : '✓ À jour'}
                </p>
              </div>
              {unreadAdminMessages > 0 && <Clock className="w-10 h-10 text-amber-400" />}
            </div>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
                Aucune conversation
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                Envoyez un message à notre équipe et nous vous répondrons sous 24h
              </p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, dayMessages]) => (
              <div key={date} className="space-y-4">
                {/* Date separator */}
                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                  <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase px-3 bg-white dark:bg-gray-800 rounded-full">
                    {date === formatDate(new Date().toISOString()) ? 'Aujourd\'hui' : date}
                  </span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Messages */}
                {dayMessages.map(message => (
                  <div
                    key={message.id}
                    className={`flex gap-3 animate-in fade-in slide-in-from-bottom-2 ${
                      message.expediteur === 'client' ? 'flex-row-reverse' : 'flex-row'
                    }`}
                  >
                    {/* Avatar */}
                    <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white ${
                      message.expediteur === 'client'
                        ? 'bg-gold'
                        : 'bg-blue-600 dark:bg-blue-500'
                    }`}>
                      {message.expediteur === 'client' ? 'V' : 'M'}
                    </div>

                    {/* Message bubble */}
                    <div className={`flex flex-col ${message.expediteur === 'client' ? 'items-end' : 'items-start'} max-w-xs`}>
                      <div
                        className={`px-5 py-3 rounded-2xl shadow-sm transition-all ${
                          message.expediteur === 'client'
                            ? 'bg-gradient-to-br from-gold to-yellow-400 text-midnight rounded-br-sm'
                            : 'bg-gray-100 dark:bg-gray-700 text-midnight dark:text-white rounded-bl-sm border border-gray-200 dark:border-gray-600'
                        }`}
                      >
                        <p className="text-sm leading-relaxed break-words">
                          {message.contenu}
                        </p>
                      </div>

                      {/* Time and status */}
                      <div className={`flex items-center gap-2 mt-1 text-xs font-medium ${
                        message.expediteur === 'client'
                          ? 'text-gold'
                          : 'text-gray-500 dark:text-gray-400'
                      }`}>
                        {new Date(message.created_at).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                        {message.expediteur === 'client' && (
                          <span className="ml-1">#{message.lu ? '✓✓' : '✓'}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gradient-to-t from-gray-50 to-white dark:from-gray-800 dark:to-gray-800">
          <form onSubmit={handleSendMessage} className="space-y-3">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={sending}
              placeholder="Écrivez votre message ici (Enter pour envoyer, Shift+Enter pour nouvelle ligne)..."
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              className="w-full px-5 py-4 rounded-xl bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed resize-none"
            />
            <div className="flex items-end justify-between">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {newMessage.length} caractères
              </p>
              <button
                type="submit"
                disabled={!newMessage.trim() || sending}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-midnight/30 border-t-midnight rounded-full animate-spin"></div>
                    Envoi...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Envoyer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientMessages;
