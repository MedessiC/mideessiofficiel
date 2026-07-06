import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { lazy, Suspense } from 'react';
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
import LoadingSpinner from './components/LoadingSpinner';
import NewHome from './pages/NewHome';
import About from './pages/About';
import Learn from './pages/Learn';
import Library from './pages/Library';
import BookDetail from './pages/BookDetail';
import PdfReaderPage from './pages/PdfReaderPage';
import Solutions from './pages/Solutions';
import Projects from './pages/Projects';
import SolutionDetail from './pages/SolutionDetail';
import Ateliers from './pages/Ateliers';
import AtelierDetail from './pages/AtelierDetail';
import ModernBlog from './pages/ModernBlog';
import NewBlogPost from './pages/NewBlogPost';
import Contact from './pages/Contact';
import Careers from './pages/Careers';
import OfferApplication from './pages/OfferApplication';
import Legal from './pages/Legal';
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
import AdminSolutions from './pages/AdminSolutions';
import ShareRedirect from './pages/ShareRedirect';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MyLibrary from './pages/MyLibrary';
import ProfileOverview from './pages/ProfileOverview';
import SearchProfiles from './pages/SearchProfiles';
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
import ClientQuoteRequests from './pages/ClientQuoteRequests';
import ClientDossiers from './pages/ClientDossiers';
import SubmitDossier from './pages/SubmitDossier';
import { ClientShell } from './components/layout/ClientShell';
import AdminQuoteRequests from './pages/AdminQuoteRequests';

const LazyClientShell = lazy(() => import('./components/layout/ClientShell'));
const LazyAdminPdfs = lazy(() => import('./pages/AdminPdfs'));
const LazyAdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const LazyAdminSolutions = lazy(() => import('./pages/AdminSolutions'));
const LazyAdminClientManagement = lazy(() => import('./pages/AdminClientManagement'));
const LazyAdminQuoteRequests = lazy(() => import('./pages/AdminQuoteRequests'));
const LazyAdminPostEditor = lazy(() => import('./pages/AdminPostEditor'));
const LazyBookDetail = lazy(() => import('./pages/BookDetail'));
const LazyNewBlogPost = lazy(() => import('./pages/NewBlogPost'));

const RouteFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-16">
    <LoadingSpinner size="lg" />
  </div>
);
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  // Keep global header/footer visible for admin pages to match site styling.
  // Only hide global nav for public auth flows (non-admin) like unified login and signup.
  const isAuthRoute = location.pathname === '/login' || location.pathname === '/signup' || location.pathname === '/clients' || location.pathname === '/forgot-password' || location.pathname === '/reset-password';
  const isClientRoute = location.pathname.startsWith('/clients/');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <PageLoader />
      {!isAdminRoute && !isAuthRoute && <Navbar />}
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
          <Route path="/blog/:slug" element={<Suspense fallback={<RouteFallback />}><LazyNewBlogPost /></Suspense>} />
          <Route path ="/learn" element={<Learn />} />
          <Route path="/library" element={<Library />} />
          <Route path="/library/:id" element={<Suspense fallback={<RouteFallback />}><LazyBookDetail /></Suspense>} />
          <Route path="/library/:id/read" element={<Suspense fallback={<RouteFallback />}><PdfReaderPage /></Suspense>} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/careers/apply/:offerId" element={<OfferApplication />} />
          <Route path="/legal" element={<Legal />} />
          <Route path="/login" element={<UnifiedLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/clients" element={<UnifiedLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<ProfileOverview />} />
          <Route path="/profile/edit" element={<ProtectedRoute><UserProfileEdit /></ProtectedRoute>} />
          <Route path="/my-library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
          <Route path="/search-profiles" element={<SearchProfiles />} />
          
          {/* Client Routes */}
          <Route path="/clients/*" element={<Suspense fallback={<RouteFallback />}><LazyClientShell /></Suspense>}>
            <Route path="onboarding" element={<ClientProtectedRoute><ClientOnboarding /></ClientProtectedRoute>} />
            <Route path="dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
            <Route path="livrables" element={<ClientProtectedRoute><ClientLivrables /></ClientProtectedRoute>} />
            <Route path="messages" element={<ClientProtectedRoute><ClientMessages /></ClientProtectedRoute>} />
            <Route path="factures" element={<ClientProtectedRoute><ClientFactures /></ClientProtectedRoute>} />
            <Route path="infos" element={<ClientProtectedRoute><ClientInfos /></ClientProtectedRoute>} />
            <Route path="kpis" element={<ClientProtectedRoute><ClientKpis /></ClientProtectedRoute>} />
            <Route path="calendar" element={<ClientProtectedRoute><ClientCalendar /></ClientProtectedRoute>} />
            <Route path="reports" element={<ClientProtectedRoute><ClientReportsPage /></ClientProtectedRoute>} />
            <Route path="quotes" element={<ClientProtectedRoute><ClientQuoteRequests /></ClientProtectedRoute>} />
            <Route path="dossiers" element={<ClientProtectedRoute><ClientDossiers /></ClientProtectedRoute>} />
            <Route path="submit-dossier" element={<SubmitDossier />} />
            <Route path="objectives" element={<ClientProtectedRoute><ClientObjectives /></ClientProtectedRoute>} />
            <Route path="compte" element={<ClientProtectedRoute><ClientCompte /></ClientProtectedRoute>} />
          </Route>
          
          <Route path="/admin/dashboard" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminDashboard /></Suspense></ProtectedRoute>} />
          <Route path="/admin/solutions" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminSolutions /></Suspense></ProtectedRoute>} />
          <Route path="/admin/clients" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminClientManagement /></Suspense></ProtectedRoute>} />
          <Route path="/admin/pdfeditor" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminPdfs /></Suspense></ProtectedRoute>} />
          <Route path="/admin/quotes" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminQuoteRequests /></Suspense></ProtectedRoute>} />
          <Route path="/share/:slug" element={<ShareRedirect />} />
          <Route path="/admin/post/:id" element={<ProtectedRoute requiredRole="admin"><Suspense fallback={<RouteFallback />}><LazyAdminPostEditor /></Suspense></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && !isAuthRoute && <BottomNavigation />}
      {!isAdminRoute && !isAuthRoute && <Footer />}
      {!isAdminRoute && !isAuthRoute && <CookieConsent />}
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
