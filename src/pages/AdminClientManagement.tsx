import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, LogOut, Target, FileText, Calendar, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AdminWeeklyObjectives from '../components/admin/AdminWeeklyObjectives';
import AdminReportsEditor from '../components/admin/AdminReportsEditor';
import AdminEditorialCalendar from '../components/admin/AdminEditorialCalendar';
import AdminClientsManager from '../components/admin/AdminClientsManager';

type ManagementTab = 'clients' | 'objectives' | 'reports' | 'calendar';

interface Client {
  client_id: string;
  nom_marque: string;
  email: string;
  pack: string;
  statut: string;
}

const AdminClientManagement = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ManagementTab>('clients');
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    checkAuth();
    fetchClients();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      navigate('/admin/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admins')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (!adminData) {
      await supabase.auth.signOut();
      navigate('/admin/login');
    }
  };

  const fetchClients = async () => {
    try {
      const { data } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-midnight dark:text-white" />
            </button>
            <h1 className="text-2xl font-bold text-midnight dark:text-white flex items-center gap-2">
              <Users className="w-6 h-6" />
              Gestion des Clients
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Show Create Form or Client List */}
        {showCreateForm ? (
          <div>
            <button
              onClick={() => setShowCreateForm(false)}
              className="mb-6 text-gold hover:text-gold/80 font-semibold text-sm"
            >
              ← Retour à la liste
            </button>
            <AdminClientsManager />
          </div>
        ) : !selectedClient ? (
          <div>
            {/* Header with Create Button */}
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-midnight dark:text-white">Liste des clients</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-midnight font-bold transition-all"
              >
                <Plus className="w-5 h-5" />
                Nouveau client
              </button>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {clients.map((client) => (
              <button
                key={client.client_id}
                onClick={() => setSelectedClient(client.client_id)}
                className="text-left bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-midnight dark:text-white text-lg">
                      {client.nom_marque}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{client.email}</p>
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-semibold">
                    {client.pack.toUpperCase()}
                  </span>
                  <span className={`text-xs px-3 py-1 rounded-full font-semibold ${
                    client.statut === 'actif'
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
                  }`}>
                    {client.statut}
                  </span>
                </div>
              </button>
            ))}
            </div>
            </div>
        ) : (
          // Client Management Tabs
          <div>
            <div className="mb-6">
              <button
                onClick={() => setSelectedClient(null)}
                className="text-gold hover:text-gold/80 font-semibold text-sm mb-4"
              >
                ← Retour à la liste des clients
              </button>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 mb-6">
                <h2 className="text-2xl font-bold text-midnight dark:text-white">
                  {clients.find(c => c.client_id === selectedClient)?.nom_marque}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  ID: {selectedClient}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg">
              <button
                onClick={() => setActiveTab('objectives')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'objectives'
                    ? 'bg-gold text-midnight shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Target className="w-5 h-5" />
                Objectifs
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'reports'
                    ? 'bg-gold text-midnight shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <FileText className="w-5 h-5" />
                Rapports
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                  activeTab === 'calendar'
                    ? 'bg-gold text-midnight shadow-md'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <Calendar className="w-5 h-5" />
                Calendrier
              </button>
            </div>

            {/* Tab Content */}
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
              {activeTab === 'objectives' && (
                <AdminWeeklyObjectives clientId={selectedClient} />
              )}
              {activeTab === 'reports' && (
                <AdminReportsEditor clientId={selectedClient} />
              )}
              {activeTab === 'calendar' && (
                <AdminEditorialCalendar clientId={selectedClient} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClientManagement;
