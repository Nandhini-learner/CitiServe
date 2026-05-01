import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Sidebar from './components/Sidebar';
import Chatbot from './components/Chatbot';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Laws from './pages/Laws';
import Schemes from './pages/Schemes';
import ComplaintForm from './pages/ComplaintForm';
import ComplaintTracking from './pages/ComplaintTracking';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';

function App() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F5F7FA',
          gap: '20px',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#F5F7FA',
            boxShadow: '6px 6px 18px rgba(0,0,0,0.08), -6px -6px 18px rgba(255,255,255,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '3px solid rgba(0,0,0,0.06)',
              borderTopColor: '#FF9933',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
        <span
          style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: '0.8125rem',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#A0AEC0',
          }}
        >
          Loading CitiServe...
        </span>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const currentRole = user?.role || 'citizen';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans">
      {!isAuthPage && <Navbar role={currentRole} />}
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar is only shown if not on auth pages */}
        {!isAuthPage && <Sidebar role={currentRole} />}
        
        <main className={`flex-grow overflow-y-auto w-full ${isAuthPage ? '' : 'p-6 md:p-8 bg-slate-50 relative'}`}>
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard role={currentRole} />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Login />} />
              <Route path="/laws" element={<Laws />} />
              <Route path="/schemes" element={<Schemes />} />
              <Route path="/complaint-form" element={<ComplaintForm />} />
              <Route path="/complaint-tracking" element={<ComplaintTracking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin" element={currentRole === 'admin' ? <AdminPanel /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </main>
      </div>
      
      {!isAuthPage && <Footer />}
      {!isAuthPage && <Chatbot />}
    </div>
  );
}

export default App;
