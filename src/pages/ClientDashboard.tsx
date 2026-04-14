import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, X, Home, FileText, BarChart3, Calendar, Download, MessageCircle, Target } from 'lucide-react';
import { useClientAuth } from '../contexts/ClientContext';
import SEO from '../components/SEO';
import ClientDashboardHome from '../components/client/ClientDashboardHome';
import ClientInfoForm from '../components/client/ClientInfoForm';
import ClientKPIs from '../components/client/ClientKPIs';
import ClientEditorialCalendar from '../components/client/ClientEditorialCalendar';
import ClientReports from '../components/client/ClientReports';
import ClientMessages from '../components/client/ClientMessages';
import ClientWeeklyObjectives from '../components/client/ClientWeeklyObjectives';
import BottomNavigation from '../components/client/BottomNavigation';

type DashboardSection = 'home' | 'infos' | 'kpis' | 'calendar' | 'reports' | 'messages' | 'objectives';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const { user, signOut, loading } = useClientAuth();
  const [activeSection, setActiveSection] = useState<DashboardSection>('home');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Accueil', icon: Home },
    { id: 'objectives', label: 'Objectifs', icon: Target },
    { id: 'infos', label: 'Mes infos', icon: FileText },
    { id: 'kpis', label: 'Perfs', icon: BarChart3 },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: Download },
    { id: 'messages', label: 'Messages', icon: MessageCircle },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/clients');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/clients');
    return null;
  }

  const renderSection = () => {
    switch (activeSection) {
      case 'home':
        return <ClientDashboardHome />;
      case 'objectives':
        return <ClientWeeklyObjectives clientId={user.client_id} />;
      case 'infos':
        return <ClientInfoForm />;
      case 'kpis':
        return <ClientKPIs />;
      case 'calendar':
        return <ClientEditorialCalendar />;
      case 'reports':
        return <ClientReports />;
      case 'messages':
        return <ClientMessages />;
      default:
        return <ClientDashboardHome />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <SEO
        title={`Dashboard | ${user.nom_marque} - MIDEESSI`}
        description="Votre espace client MIDEESSI"
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <img
              src="/mideessi.webp"
              alt="Logo"
              className="h-8 object-contain"
              loading="eager"
              decoding="async"
            />
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-midnight dark:text-white" />
            </button>
          </div>
          <div>
            <h2 className="font-bold text-midnight dark:text-white text-lg">{user.nom_marque}</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">{user.pack.toUpperCase()}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id as DashboardSection);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-gold/20 text-gold border-l-4 border-gold'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Se déconnecter</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <Menu className="w-6 h-6 text-midnight dark:text-white" />
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-midnight dark:text-white text-center flex-1 lg:text-left lg:flex-none">
            {menuItems.find(item => item.id === activeSection)?.label}
          </h1>

          <div className="hidden lg:flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold text-midnight dark:text-white">{user.nom_responsable}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user.email}</p>
            </div>
            <img
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`}
              alt={user.nom_responsable}
              className="w-10 h-10 rounded-full"
            />
          </div>
        </div>

      {/* Content Area - Add bottom padding on mobile for nav */}
        <div className="flex-1 overflow-auto pb-24 lg:pb-0">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </div>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNavigation activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default ClientDashboard;
