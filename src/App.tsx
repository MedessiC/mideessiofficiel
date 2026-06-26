import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { LoadingProvider } from './contexts/LoadingContext';
import { ClientProvider } from './contexts/ClientContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ClientProtectedRoute from './components/ClientProtectedRoute';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Footer from './components/Footer';
import PageLoader from './components/PageLoader';
import CookieConsent from './components/CookieConsent';
import NewHome from './pages/NewHome';
import About from './pages/About';
import Learn from './pages/Learn';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import Solutions from './pages/Solutions';
import Projects from './pages/Projects';
import SolutionDetail from './pages/SolutionDetail';
import Ateliers from './pages/Ateliers';
import AtelierDetail from './pages/AtelierDetail';
import ModernBlog from './pages/ModernBlog';
import NewBlogPost from './pages/NewBlogPost';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import Offres from './pages/Offres';
import DetailOffre from './pages/DetailOffre';
import DetailDevService from './pages/DetailDevService';
import NotFound from './pages/NotFound';
import UnifiedLogin from './pages/UnifiedLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClientManagement from './pages/AdminClientManagement';
import AdminLogin from './pages/AdminLogin';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminPdfs from './pages/AdminPdfs';
import ShareRedirect from './pages/ShareRedirect';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Signup from './pages/Signup';
import MyLibrary from './pages/MyLibrary';
import UserProfile from './pages/UserProfile';
import UserProfileEdit from './pages/UserProfileEdit';
import ClientOnboarding from './pages/ClientOnboarding';
import ClientDashboard from './pages/ClientDashboard';
import ClientLivrables from './pages/ClientLivrables';
import ClientMessages from './pages/ClientMessages';
import ClientFactures from './pages/ClientFactures';
import ClientCompte from './pages/ClientCompte';
import ClientInfos from './pages/ClientInfos';
import ClientKpis from './pages/ClientKpis';
import ClientCalendar from './pages/ClientCalendar';
import ClientReportsPage from './pages/ClientReports';
import ClientObjectives from './pages/ClientObjectives';
import { ClientShell } from './components/layout/ClientShell';
import { Navigate } from 'react-router-dom';
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/admin/login' || location.pathname === '/signup' || location.pathname === '/clients';
  const isClientRoute = location.pathname.startsWith('/clients/');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageLoader />
      {!isAdminRoute && !isAuthRoute && !isClientRoute && <Navbar />}
      <main className="animate-fade-in">
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/team/:id" element={<TeamMemberProfile />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/ateliers" element={<Ateliers />} />
          <Route path="/ateliers/:slug" element={<AtelierDetail />} />
          <Route path="/offres" element={<Offres />} />
          <Route path="/offres/:slug" element={<DetailOffre />} />
          <Route path="/dev-services/:slug" element={<DetailDevService />} />
          <Route path="/blog" element={<ModernBlog />} />
          <Route path="/blog/:slug" element={<NewBlogPost />} />
          <Route path ="/learn" element={<Learn />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<BookDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/clients" element={<UnifiedLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/profile/edit" element={<ProtectedRoute><UserProfileEdit /></ProtectedRoute>} />
          <Route path="/my-library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
          
          {/* Client Routes */}
          <Route path="/clients/*" element={<ClientShell />}>
            <Route index element={<Navigate to="/clients/dashboard" replace />} />
            <Route path="onboarding" element={<ClientProtectedRoute><ClientOnboarding /></ClientProtectedRoute>} />
            <Route path="dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
            <Route path="livrables" element={<ClientProtectedRoute><ClientLivrables /></ClientProtectedRoute>} />
            <Route path="messages" element={<ClientProtectedRoute><ClientMessages /></ClientProtectedRoute>} />
            <Route path="factures" element={<ClientProtectedRoute><ClientFactures /></ClientProtectedRoute>} />
            <Route path="infos" element={<ClientProtectedRoute><ClientInfos /></ClientProtectedRoute>} />
            <Route path="kpis" element={<ClientProtectedRoute><ClientKpis /></ClientProtectedRoute>} />
            <Route path="calendar" element={<ClientProtectedRoute><ClientCalendar /></ClientProtectedRoute>} />
            <Route path="reports" element={<ClientProtectedRoute><ClientReportsPage /></ClientProtectedRoute>} />
            <Route path="objectives" element={<ClientProtectedRoute><ClientObjectives /></ClientProtectedRoute>} />
            <Route path="compte" element={<ClientProtectedRoute><ClientCompte /></ClientProtectedRoute>} />
          </Route>
          
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><AdminClientManagement /></ProtectedRoute>} />
          <Route path="/admin/pdfeditor" element={<ProtectedRoute requiredRole="admin"><AdminPdfs /></ProtectedRoute>} />
          <Route path="/share/:slug" element={<ShareRedirect />} />
          <Route path="/admin/post/:id" element={<ProtectedRoute requiredRole="admin"><AdminPostEditor /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && !isAuthRoute && !isClientRoute && <BottomNavigation />}
      {!isAdminRoute && !isAuthRoute && !isClientRoute && <Footer />}
      {!isAdminRoute && !isAuthRoute && !isClientRoute && <CookieConsent />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientProvider>
          <NavigationProvider>
            <Router>
              <LoadingProvider>
                <AppContent />
              </LoadingProvider>
            </Router>
          </NavigationProvider>
        </ClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
