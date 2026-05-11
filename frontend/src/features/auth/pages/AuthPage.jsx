import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

export default function AuthPage({ handleLogin, handleRegister, loading, error, success, setError, setSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = async (formData) => {
    if (isLogin) {
      const success = await handleLogin({ email: formData.email, password: formData.password });
      if (success) navigate('/', { replace: true });
    } else {
      const success = await handleRegister(formData);
      if (success) setIsLogin(true);
    }
  };

  return (
    <div className="auth-container">
      <div className="neural-panel auth-card">
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(true); setError(''); setSuccess(''); }}>Login</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => { setIsLogin(false); setError(''); setSuccess(''); }}>Register</div>
        </div>

        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>{isLogin ? 'Welcome Back' : 'Initialize Node'}</h1>
        <p className="text-muted" style={{ marginBottom: '32px' }}>
          {isLogin ? 'Access your recruitment neural engine.' : 'Register a new operator profile.'}
        </p>

        <AuthForm 
          isLogin={isLogin} 
          onSubmit={handleSubmit} 
          loading={loading} 
          error={error} 
          success={success} 
        />

        <div style={{ textAlign: 'center', marginTop: '32px', borderTop: '1px dashed var(--glass-border)', paddingTop: '24px' }}>
          <span className="text-muted" style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '2px' }}>Neural Bridge Connect</span>
          <div className="social-login">
            <div className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 12a10 10 0 1 0-1.8 5.7M12 2v10l5 5"/></svg>
              <span>Google</span>
            </div>
            <div className="social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
              <span>LinkedIn</span>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '32px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }}></div>
            <span className="neon-text" style={{ fontSize: '10px' }}>CORE ENGINE: OPERATIONAL</span>
          </div>
        </div>
      </div>
    </div>
  );
}
