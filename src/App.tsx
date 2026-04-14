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
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClientManagement from './pages/AdminClientManagement';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminPdfs from './pages/AdminPdfs';
import ShareRedirect from './pages/ShareRedirect';
import TeamMemberProfile from './pages/TeamMemberProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import MyLibrary from './pages/MyLibrary';
import UserProfile from './pages/UserProfile';
import ClientLogin from './pages/ClientLogin';
import ClientOnboarding from './pages/ClientOnboarding';
import ClientDashboard from './pages/ClientDashboard';
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/signup');
  const isClientRoute = location.pathname.startsWith('/clients');

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
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile/:username" element={<UserProfile />} />
          <Route path="/my-library" element={<ProtectedRoute><MyLibrary /></ProtectedRoute>} />
          
          {/* Client Routes */}
          <Route path="/clients" element={<ClientLogin />} />
          <Route path="/clients/onboarding" element={<ClientProtectedRoute><ClientOnboarding /></ClientProtectedRoute>} />
          <Route path="/clients/dashboard" element={<ClientProtectedRoute><ClientDashboard /></ClientProtectedRoute>} />
          
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/clients" element={<AdminClientManagement />} />
          <Route path="/admin/pdfeditor" element={<AdminPdfs />} />
          <Route path="/share/:slug" element={<ShareRedirect />} />
          <Route path="/admin/post/:id" element={<AdminPostEditor />} />
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
