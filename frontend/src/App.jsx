import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import Auth from './features/auth/Auth';
import LandingPage from './features/landing/LandingPage';
import Analyzer from './features/analyzer/Analyzer';
import ResumeFit from './features/analyzer/ResumeFit';
import Dashboard from './features/dashboard/Dashboard';
import CareerDetail from './features/analyzer/CareerDetail';
import GlobalEcosystem from './features/dashboard/GlobalEcosystem';
import MappedJobs from './features/analyzer/MappedJobs';
import ContactCandidate from './features/recruiter/ContactCandidate';
import { ProtectedRoute, PublicRoute } from './components/RouteGuards';
import { LogOut, LayoutDashboard, Search, Zap, Activity } from 'lucide-react';

import { useAuth } from './features/auth/hooks/useAuth';
import { AuthProvider } from './context/AuthContext';

import NotificationCenter from './components/NotificationCenter';

// Wrapper to handle location-based logic
function AppContent() {
  const { token: authToken, user, loading, logout } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === '/auth';
  const isLandingPage = location.pathname === '/home' || (location.pathname === '/' && !authToken && !localStorage.getItem('token'));
  
  const hasToken = authToken || localStorage.getItem('token');

  const handleLogout = () => {
    logout();
    window.location.href = '/home';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#030303',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      position: 'relative',
      overflowX: 'hidden'
    }}>

      {/* AMBIENT BACKGROUND GLOW FOR ALL INTERNAL PAGES */}
      {!isLandingPage && (
        <>
          <div style={{
            position: 'fixed',
            top: '-20%',
            left: '30%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(3, 3, 3, 0) 70%)',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'fixed',
            bottom: '-10%',
            right: '10%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(3, 3, 3, 0) 70%)',
            filter: 'blur(120px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
        </>
      )}

      {/* GLOBAL GLASSNAVBAR FOR AUTHENTICATED INTERNAL PAGES */}
      {hasToken && !isAuthPage && !isLandingPage && (
        <nav className="global-navbar no-print" style={{
          position: 'fixed', top: '0', left: '0', right: '0', 
          zIndex: 1000000, height: '70px', 
          background: 'rgba(8, 10, 18, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0, 240, 255, 0.25)',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.9), inset 0 -1px 0 rgba(0, 240, 255, 0.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px'
        }}>
          <Link to="/dashboard" className="nav-brand" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px'}}>
            <img src="/favicon.svg" alt="ApplySphere AI Logo" style={{ width: '32px', height: '32px', filter: 'drop-shadow(0 0 10px rgba(0, 240, 255, 0.7))' }} />
            <span style={{color: '#00F0FF', fontWeight: 'bold', fontSize: '18px', letterSpacing: '1.5px', fontFamily: "'Instrument Serif', serif"}}>APPLYSPHERE AI</span>
          </Link>
          
          <div style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
            <Link to="/dashboard" className="nav-link-neural">
              <LayoutDashboard size={16} />
              DASHBOARD
            </Link>
            
            <Link to="/analyzer" className="nav-link-neural">
              <Search size={16} />
              ATS SCAN
            </Link>

            <Link to="/mapped-jobs" className="nav-link-neural" style={{ color: '#00F0FF' }}>
              <Zap size={16} color="#00F0FF" />
              JOB MARKET (30+)
            </Link>

            <div style={{height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)'}}></div>
            
            <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
              
              {/* IN-PLATFORM RECRUITER OUTREACH NOTIFICATION BELL */}
              <NotificationCenter />

              <div style={{textAlign: 'right'}}>
                <div style={{fontSize: '12px', fontWeight: 'bold', color: '#fff', textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px'}}>
                  <span>{user?.name || user?.email?.split('@')[0] || 'OPERATOR'}</span>
                  <span style={{
                    fontSize: '9px',
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: user?.role === 'HR' || user?.role === 'RECRUITER' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                    color: user?.role === 'HR' || user?.role === 'RECRUITER' ? '#10B981' : '#06B6D4',
                    border: user?.role === 'HR' || user?.role === 'RECRUITER' ? '1px solid #10B981' : '1px solid #06B6D4',
                    fontWeight: 'bold',
                    letterSpacing: '1px'
                  }}>
                    {user?.role === 'HR' || user?.role === 'RECRUITER' ? 'HR RECRUITER' : 'CANDIDATE'}
                  </span>
                </div>
                <div style={{fontSize: '9px', color: '#00F0FF', letterSpacing: '2px', fontFamily: "'JetBrains Mono', monospace"}}>NEURAL IDENTITY</div>
              </div>
              
              <button 
                onClick={handleLogout}
                style={{
                  background: 'rgba(255, 46, 84, 0.1)', border: '1px solid #FF2E54',
                  color: '#FF2E54', padding: '7px 14px', borderRadius: '9999px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px',
                  fontWeight: 'bold', letterSpacing: '1px', transition: 'all 0.3s ease'
                }}
                className="logout-btn-neural"
              >
                <LogOut size={14} />
                LOGOUT
              </button>
            </div>
          </div>
        </nav>
      )}

      <div className="app-container" style={{
        position: 'relative',
        zIndex: 2,
        paddingTop: (hasToken && !isAuthPage && !isLandingPage) ? '90px' : '0', 
        paddingLeft: (hasToken && !isAuthPage && !isLandingPage) ? '32px' : '0', 
        paddingRight: (hasToken && !isAuthPage && !isLandingPage) ? '32px' : '0', 
        paddingBottom: (hasToken && !isAuthPage && !isLandingPage) ? '40px' : '0'
      }}>
        <div className="main-content">
          {loading && authToken ? (
            <div style={{height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#06B6D4'}}>
              <Activity size={48} className="pulse-slow" />
              <p style={{marginTop: '24px', letterSpacing: '4px', fontSize: '12px', fontWeight: 'bold', fontFamily: "'JetBrains Mono', monospace"}}>RE-ESTABLISHING NEURAL LINK...</p>
            </div>
          ) : (
            <Routes>
              <Route path="/home" element={<LandingPage />} />
              <Route path="/auth" element={<PublicRoute><Auth /></PublicRoute>} />
              <Route path="/" element={hasToken ? <ProtectedRoute><Dashboard /></ProtectedRoute> : <LandingPage />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/analyzer" element={<ProtectedRoute><Analyzer token={authToken} /></ProtectedRoute>} />
              <Route path="/yourresumefit" element={<ProtectedRoute><ResumeFit token={authToken} /></ProtectedRoute>} />
              <Route path="/details" element={<ProtectedRoute><CareerDetail token={authToken} /></ProtectedRoute>} />
              <Route path="/usersuse" element={<ProtectedRoute><GlobalEcosystem token={authToken} /></ProtectedRoute>} />
              <Route path="/mapped-jobs" element={<ProtectedRoute><MappedJobs token={authToken} /></ProtectedRoute>} />
              <Route path="/contact-candidate" element={<ProtectedRoute><ContactCandidate token={authToken} /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/home" replace />} />
            </Routes>
          )}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .nav-link-neural { 
          color: #94A3B8; 
          text-decoration: none; 
          display: flex; 
          align-items: center; 
          gap: 8px; 
          font-size: 11px; 
          font-weight: 700;
          letter-spacing: 1.5px;
          transition: all 0.25s ease;
        }
        .nav-link-neural:hover { color: #00F0FF; transform: translateY(-1px); }
        .logout-btn-neural:hover { background: #FF2E54 !important; color: #FFF !important; box-shadow: 0 0 15px rgba(255, 46, 84, 0.4); }
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
