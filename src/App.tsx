import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NavigationProvider } from './contexts/NavigationContext';
import { ClientProvider, useClientAuth } from './contexts/ClientContext';
import { ROUTES } from './utils/routes';
import { ProtectedRoute } from './components/ProtectedRoute';
import ClientProtectedRoute from './components/ClientProtectedRoute';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import LoadingSpinner from './components/LoadingSpinner';
import SupportButton from './components/SupportButton';
import ScrollToTop from './components/ScrollToTop';
import NewHome from './pages/NewHome';
import { ProjectProvider } from './contexts/ProjectContext';

const About = lazy(() => import('./pages/About'));
const Learn = lazy(() => import('./pages/Learn'));
const Laboratoire = lazy(() => import('./pages/Laboratoire'));
const Library = lazy(() => import('./pages/Library'));
const BookDetail = lazy(() => import('./pages/BookDetail'));
const PdfReaderPage = lazy(() => import('./pages/PdfReaderPage'));
const Solutions = lazy(() => import('./pages/Solutions'));
const SiteWebPage = lazy(() => import('./pages/Solutions').then(({ SiteWebPage: Page }) => ({ default: Page })));
const Projects = lazy(() => import('./pages/Projects'));
const SolutionDetail = lazy(() => import('./pages/SolutionDetail'));
const Ateliers = lazy(() => import('./pages/Ateliers'));
const AtelierDetail = lazy(() => import('./pages/AtelierDetail'));
const ModernBlog = lazy(() => import('./pages/ModernBlog'));
const NewBlogPost = lazy(() => import('./pages/NewBlogPost'));
const Contact = lazy(() => import('./pages/Contact'));
const Careers = lazy(() => import('./pages/Careers'));
const OfferApplication = lazy(() => import('./pages/OfferApplication'));
const Legal = lazy(() => import('./pages/Legal'));
const DetailOffre = lazy(() => import('./pages/DetailOffre'));
const DetailDevService = lazy(() => import('./pages/DetailDevService'));
const NotFound = lazy(() => import('./pages/NotFound'));
const UnifiedLogin = lazy(() => import('./pages/UnifiedLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminClientManagement = lazy(() => import('./pages/AdminClientManagement'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminPostEditor = lazy(() => import('./pages/AdminPostEditor'));
const AdminPdfs = lazy(() => import('./pages/AdminPdfs'));
const AdminSolutions = lazy(() => import('./pages/AdminSolutions'));
const ShareRedirect = lazy(() => import('./pages/ShareRedirect'));
const TeamMemberProfile = lazy(() => import('./pages/TeamMemberProfile'));
const Signup = lazy(() => import('./pages/Signup'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const MyLibrary = lazy(() => import('./pages/MyLibrary'));
const ProfileOverview = lazy(() => import('./pages/ProfileOverview'));
const SearchProfiles = lazy(() => import('./pages/SearchProfiles'));
const UserProfileEdit = lazy(() => import('./pages/UserProfileEdit'));
const ClientShell = lazy(() => import('./components/layout/ClientShell').then(({ ClientShell: Layout }) => ({ default: Layout })));
const ClientOnboarding = lazy(() => import('./pages/ClientOnboarding'));
const ClientDashboard = lazy(() => import('./pages/ClientDashboard'));
const ClientLivrables = lazy(() => import('./pages/ClientLivrables'));
const ClientMessages = lazy(() => import('./pages/ClientMessages'));
const ClientFactures = lazy(() => import('./pages/ClientFactures'));
const ClientCompte = lazy(() => import('./pages/ClientCompte'));
const ClientInfos = lazy(() => import('./pages/ClientInfos'));
const ClientKpis = lazy(() => import('./pages/ClientKpis'));
const ClientCalendar = lazy(() => import('./pages/ClientCalendar'));
const ClientReportsPage = lazy(() => import('./pages/ClientReports'));
const ClientObjectives = lazy(() => import('./pages/ClientObjectives'));
const ClientQuoteRequests = lazy(() => import('./pages/ClientQuoteRequests'));
const ClientDossiers = lazy(() => import('./pages/ClientDossiers'));
const SubmitDossier = lazy(() => import('./pages/SubmitDossier'));
const ClientProjects = lazy(() => import('./pages/ClientProjects'));
const ClientProjectDetail = lazy(() => import('./pages/ClientProjectDetail'));
const AdminQuoteRequests = lazy(() => import('./pages/AdminQuoteRequests'));
const AdminProjectsManagement = lazy(() => import('./pages/AdminProjectsManagement'));
const CommanderPage = lazy(() => import('./pages/CommanderPage'));

const InitialAppLoader = () => (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-white">
    <div
      className="w-10 h-10 rounded-full border-4 border-[#e8ecf1] border-t-[#8e9ab4] animate-spin"
      style={{ animationDuration: '0.8s' }}
    />
  </div>
);

const RouteContentFallback = () => (
  <div className="mx-auto w-full max-w-[1200px] px-6 py-16 lg:px-12" aria-label="Chargement de la page">
    <div className="h-8 w-48 animate-pulse rounded-full bg-[#E8ECF1]" />
    <div className="mt-5 h-4 w-full max-w-2xl animate-pulse rounded-full bg-[#F0F2F5]" />
    <div className="mt-3 h-4 w-4/5 max-w-xl animate-pulse rounded-full bg-[#F0F2F5]" />
    <div className="mt-10 grid gap-5 md:grid-cols-3">
      {[0, 1, 2].map((item) => <div key={item} className="h-52 animate-pulse rounded-2xl bg-[#F0F2F5]" />)}
    </div>
  </div>
);
function AppContent() {
  const location = useLocation();
  const { loading: authLoading } = useAuth();
  const { loading: clientLoading } = useClientAuth();

  const isAdminRoute = location.pathname.startsWith('/admin');
  // Keep global header/footer visible for admin pages to match site styling.
  // Only hide global nav for public auth flows (non-admin) like unified login and signup.
  const isAuthRoute = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP || location.pathname === ROUTES.CLIENTS || location.pathname === ROUTES.FORGOT_PASSWORD || location.pathname === ROUTES.RESET_PASSWORD;
  const isClientRoute = location.pathname.startsWith('/clients/');

  // Only block rendering for the main auth session.
  // clientLoading is scoped to /clients/* routes and must not stall the whole site.
  if (authLoading) {
    return <InitialAppLoader />;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <ScrollToTop />
      {/* PageLoader removed — loading handled via context components or inline fallbacks */}
      {!isAdminRoute && !isAuthRoute && <Navbar />}
      <main id="main-content" role="main">
        <Suspense fallback={<RouteContentFallback />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<NewHome />} />
            <Route path={ROUTES.ABOUT} element={<About />} />
            <Route path={ROUTES.MISSION} element={<About />} />
            <Route path={ROUTES.METHODE} element={<About />} />
            <Route path={ROUTES.TEAM_MEMBER} element={<TeamMemberProfile />} />
            <Route path={ROUTES.SOLUTIONS} element={<Solutions />} />
            <Route path={ROUTES.SOLUTION_SITEWEB} element={<SiteWebPage />} />
            <Route path={ROUTES.SOLUTION_SITEWEB_DETAIL} element={<SolutionDetail />} />
            <Route path={ROUTES.SOLUTION_DETAIL} element={<SolutionDetail />} />
            <Route path={ROUTES.PROJECTS} element={<Projects />} />
            <Route path={ROUTES.ATELIERS} element={<Ateliers />} />
            <Route path={ROUTES.ATELIER_DETAIL} element={<AtelierDetail />} />
            <Route path={ROUTES.OFFRES} element={<Navigate to="/" replace />} />
            <Route path={ROUTES.OFFRES_DETAIL} element={<DetailOffre />} />
            <Route path={ROUTES.DEV_SERVICES_DETAIL} element={<DetailDevService />} />
            <Route path={ROUTES.BLOG} element={<ModernBlog />} />
            <Route path={ROUTES.BLOG_POST} element={<NewBlogPost />} />
            <Route path={ROUTES.APPRENDRE} element={<Learn />} />
            <Route path={ROUTES.LABORATOIRE} element={<Laboratoire />} />
            <Route path={ROUTES.LABS} element={<Navigate to="/laboratoire" replace />} />
            <Route path={ROUTES.LIBRARY} element={<Library />} />
            <Route path={ROUTES.LIBRARY_DETAIL} element={<BookDetail />} />
            <Route path={ROUTES.LIBRARY_READ} element={<PdfReaderPage />} />
            <Route path={ROUTES.CONTACT} element={<Contact />} />
            <Route path={ROUTES.CAREERS} element={<Careers />} />
            <Route path={ROUTES.CAREERS + '/apply/:offerId'} element={<OfferApplication />} />
            <Route path={ROUTES.LEGAL} element={<Legal />} />
            <Route path={ROUTES.LOGIN} element={<UnifiedLogin />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
            <Route path={ROUTES.ADMIN_LOGIN || '/admin/login'} element={<AdminLogin />} />
            <Route path={ROUTES.CLIENTS} element={<UnifiedLogin />} />
            <Route path={ROUTES.SIGNUP} element={<Signup />} />
            <Route path={ROUTES.PROFILE_OVERVIEW} element={<ProfileOverview />} />
            <Route path={ROUTES.USER_PROFILE_EDIT} element={<ProtectedRoute><UserProfileEdit /></ProtectedRoute>} />
            <Route path={ROUTES.MY_LIBRARY} element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
            <Route path={ROUTES.SEARCH_PROFILES} element={<SearchProfiles />} />

            <Route path={ROUTES.SUBMIT_DOSSIER} element={<SubmitDossier />} />

            {/* Client Routes */}
            <Route path="/clients/*" element={<ClientShell />}>
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
              <Route path="objectives" element={<ClientProtectedRoute><ClientObjectives /></ClientProtectedRoute>} />
              <Route path="compte" element={<ClientProtectedRoute><ClientCompte /></ClientProtectedRoute>} />
            </Route>

            <Route path={ROUTES.COMMANDER} element={<CommanderPage />} />
            <Route path={ROUTES.COMMANDER_DETAIL} element={<CommanderPage />} />
            <Route path={ROUTES.CLIENT_PROJECTS} element={<ClientProjects />} />
            <Route path={ROUTES.CLIENT_PROJECT_DETAIL} element={<ClientProjectDetail />} />

            <Route path={ROUTES.ADMIN_DASHBOARD} element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_SOLUTIONS} element={<ProtectedRoute requiredRole="admin"><AdminSolutions /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_CLIENTS} element={<ProtectedRoute requiredRole="admin"><AdminClientManagement /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_PROJECTS} element={<ProtectedRoute requiredRole="admin"><AdminProjectsManagement /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_PDFS} element={<ProtectedRoute requiredRole="admin"><AdminPdfs /></ProtectedRoute>} />
            <Route path={ROUTES.ADMIN_QUOTES} element={<ProtectedRoute requiredRole="admin"><AdminQuoteRequests /></ProtectedRoute>} />
            <Route path={ROUTES.SHARE_REDIRECT} element={<ShareRedirect />} />
            <Route path={ROUTES.ADMIN_POST_EDIT} element={<ProtectedRoute requiredRole="admin"><AdminPostEditor /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!isAdminRoute && !isAuthRoute && <BottomNavigation />}
      {!isAdminRoute && !isAuthRoute && <Footer />}
      {!isAdminRoute && !isAuthRoute && <CookieConsent />}
      {!isAdminRoute && !isAuthRoute && <SupportButton />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ClientProvider>
          <ProjectProvider>
            <NavigationProvider>
              <Router>
                <AppContent />
              </Router>
            </NavigationProvider>
          </ProjectProvider>
        </ClientProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
