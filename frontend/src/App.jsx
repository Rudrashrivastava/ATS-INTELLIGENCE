import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Auth from './features/auth/Auth';
import Analyzer from './features/analyzer/Analyzer';
import ResumeFit from './features/analyzer/ResumeFit';
import Dashboard from './features/dashboard/Dashboard';
import CareerDetail from './features/analyzer/CareerDetail';
import GlobalEcosystem from './features/dashboard/GlobalEcosystem';
import MappedJobs from './features/analyzer/MappedJobs';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import { LogOut, LayoutDashboard, Search, Zap, Activity } from 'lucide-react';

import { useAuth } from './features/auth/hooks/useAuth';
import { AuthProvider } from './context/AuthContext';

// Wrapper to handle location-based logic
function AppContent() {
  const { token: authToken, user, loading, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  
  const hasToken = authToken || localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    window.location.href = '/auth';
  };

  return (
    <div style={{minHeight: '100vh', background: '#0a0a12', position: 'relative'}}>
      
      {hasToken && !isAuthPage && (
        <nav className="global-navbar no-print" style={{
          position: 'fixed', top: '0', left: '0', right: '0', 
          zIndex: 1000000, height: '70px', 
          background: '#121420', borderBottom: '3px solid #00E5FF',
          boxShadow: '0 4px 30px rgba(0, 229, 255, 0.3)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 40px'
        }}>
          <Link to="/" className="nav-brand" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <Zap size={24} color="#00E5FF" />
            <span style={{color: '#00E5FF', fontWeight: 'bold', fontSize: '20px', letterSpacing: '1px'}}>ATS INTELLIGENCE</span>
          </Link>
          
          <div style={{display: 'flex', gap: '40px', alignItems: 'center'}}>
            <Link to="/" className="nav-link-neural">
              <LayoutDashboard size={18} />
              DASHBOARD
            </Link>
            
            <Link to="/analyzer" className="nav-link-neural">
              <Search size={18} />
              ATS SCAN
            </Link>

            <div style={{height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '14px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase'}}>
                  {user?.name || user?.email?.split('@')[0] || 'OPERATOR'}
                </div>
                <div style={{fontSize: '9px', color: '#00E5FF', letterSpacing: '2px'}}>NEURAL IDENTITY</div>
              </div>
              
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 23, 68, 0.1)', border: '1px solid #ff1744',
                  color: '#ff1744', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '10px', fontSize: '11px',
                  fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.3s ease'
                }}
                className="logout-btn-neural"
              >
                <LogOut size={16} />
                LOGOUT
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="app-container" style={{
        paddingTop: (hasToken && !isAuthPage) ? '100px' : '0', 
        paddingLeft: '40px', paddingRight: '40px', paddingBottom: '40px'
      }}>
        <div className="main-content">
          {loading && authToken ? (
            <div style={{height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#00E5FF'}}>
              <Activity size={48} className="pulse-slow" />
              <p style={{marginTop: '24px', letterSpacing: '4px', fontSize: '12px', fontWeight: 'bold'}}>RE-ESTABLISHING NEURAL LINK...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
              <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute><Analyzer token={authToken} /></ProtectedRoute>} />
              <Route path="/yourresumefit" element={<ProtectedRoute><ResumeFit token={authToken} /></ProtectedRoute>} />
              <Route path="/details" element={<ProtectedRoute><CareerDetail token={authToken} /></ProtectedRoute>} />
              <Route path="/usersuse" element={<ProtectedRoute><GlobalEcosystem token={authToken} /></ProtectedRoute>} />
              <Route path="/mapped-jobs" element={<ProtectedRoute><MappedJobs token={authToken} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link-neural { 
          color: #fff; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          gap: 10px; 
          font-size: 11px; 
          font-weight: 700;
          letter-spacing: 2px;
          transition: all 0.3s ease;
        }
        .nav-link-neural:hover { color: #00E5FF; transform: translateY(-1px); }
        .logout-btn-neural:hover { background: #ff1744 !important; color: #fff !important; box-shadow: 0 0 15px rgba(255, 23, 68, 0.4); }
        .pulse-slow { animation: pulse 3s infinite ease-in-out; }
        @keyframes pulse { 0%, 100% { opacity: 0.4; transform: scale(0.95); } 50% { opacity: 1; transform: scale(1.05); } }
      `}} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
