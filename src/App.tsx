import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import Navbar from './components/Navbar';
import BottomNavigation from './components/BottomNavigation';
import Footer from './components/Footer';
import CookieConsent from './components/CookieConsent';
import NewHome from './pages/NewHome';
import About from './pages/About';
import Learn from './pages/Learn';
import Library from './pages/Library';
import Solutions from './pages/Solutions';
import Projects from './pages/Projects';
import SolutionDetail from './pages/SolutionDetail';
import NewBlog from './pages/NewBlog';
import NewBlogPost from './pages/NewBlogPost';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminPostEditor from './pages/AdminPostEditor';
import AdminPdfs from './pages/AdminPdfs';
import ShareRedirect from './pages/ShareRedirect';
import TeamMemberProfile from './pages/TeamMemberProfile';
function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<NewHome />} />
          <Route path="/about" element={<About />} />
          <Route path="/team/:id" element={<TeamMemberProfile />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/solutions/:slug" element={<SolutionDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/blog" element={<NewBlog />} />
          <Route path="/blog/:slug" element={<NewBlogPost />} />
          <Route path ="/learn" element={<Learn />} />
          <Route path="/library" element={<Library />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/pdfeditor" element={<AdminPdfs />} />
          <Route path="/share/:slug" element={<ShareRedirect />} />
          <Route path="/admin/post/:id" element={<AdminPostEditor />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdminRoute && <BottomNavigation />}
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <CookieConsent />}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
