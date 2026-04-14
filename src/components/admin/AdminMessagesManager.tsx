import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Send, MessageCircle, User } from 'lucide-react';

interface Message {
  id: string;
  client_id: string;
  expediteur: 'client' | 'admin';
  contenu: string;
  lu: boolean;
  created_at: string;
}

interface AdminMessagesManagerProps {
  clientId: string;
}

const AdminMessagesManager = ({ clientId }: AdminMessagesManagerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (clientId) {
      fetchMessages();
      fetchClientName();
    }
  }, [clientId]);

  const fetchMessages = async () => {
    try {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: true });

      if (data) {
        setMessages(data);
        // Mark unread messages as read
        const unreadIds = data
          .filter(m => m.expediteur === 'client' && !m.lu)
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
    }
  };

  const fetchClientName = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('nom_marque')
        .eq('client_id', clientId)
        .single();

      if (data) {
        setClientName(data.nom_marque);
      }
    } catch (error) {
      console.error('Error fetching client name:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          client_id: clientId,
          expediteur: 'admin',
          contenu: newMessage,
        });

      if (error) throw error;

      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-gold" />
          <div>
            <h2 className="text-2xl font-bold text-midnight dark:text-white">
              Messages avec {clientName}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{clientId}</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">
            <p>Aucun message pour le moment</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.expediteur === 'admin' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`flex gap-3 max-w-xs lg:max-w-md ${
                  msg.expediteur === 'admin' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.expediteur === 'admin'
                      ? 'bg-gold text-midnight'
                      : 'bg-gray-300 dark:bg-gray-600 text-midnight'
                  }`}
                >
                  {msg.expediteur === 'admin' ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <MessageCircle className="w-5 h-5" />
                  )}
                </div>
                <div
                  className={`px-4 py-3 rounded-lg ${
                    msg.expediteur === 'admin'
                      ? 'bg-gold text-midnight'
                      : 'bg-gray-100 dark:bg-gray-700 text-midnight dark:text-white'
                  }`}
                >
                  <p className="text-sm">{msg.contenu}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(msg.created_at).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="border-t border-gray-200 dark:border-gray-700 p-6 space-y-4"
      >
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre réponse..."
          rows={3}
          className="w-full px-4 py-3 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-midnight dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold resize-none"
        />
        <button
          type="submit"
          disabled={loading || !newMessage.trim()}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-gold hover:bg-gold/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-midnight font-bold transition-all"
        >
          <Send className="w-5 h-5" />
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default AdminMessagesManager;
