import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

export default function Auth() {
  const navigate = useNavigate();
  const { handleLogin, handleRegister, error, setError, success, setSuccess, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const ok = await handleLogin({ email: formData.email, password: formData.password });
      if (ok) {
        navigate('/', { replace: true });
      }
    } else {
      const ok = await handleRegister(formData);
      if (ok) {
        setIsLogin(true);
        setFormData({ name: '', email: '', password: '' });
      }
    }
  };

  return (
    <div className="auth-container animate-fade-in">
      <div className="neural-panel auth-card glass-card">
        
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>LOGIN</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>REGISTER</div>
        </div>

        <div style={{textAlign: 'center', marginBottom: '32px', marginTop: '20px'}}>
           <div className="pulse-glow" style={{width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '1px solid var(--primary)'}}>
              <Zap size={30} color="var(--primary)" />
           </div>
           <h1 style={{fontSize: '28px', color: '#fff'}}>{isLogin ? 'Neural Access' : 'Create Operator'}</h1>
           <p className="text-muted" style={{fontSize: '14px', marginTop: '8px'}}>
             {isLogin ? 'Sync with your professional trajectory.' : 'Register a new profile in the ecosystem.'}
           </p>
        </div>

        {error && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ff1744', marginBottom: '24px', fontSize: '14px', background: 'rgba(255, 23, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 23, 68, 0.3)'}}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}
        {success && (
          <div style={{color: 'var(--primary)', marginBottom: '24px', fontSize: '14px', background: 'rgba(0, 229, 255, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)'}}>
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Register</label>
              <div style={{position: 'relative'}}>
                <User size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
                <input type="text" className="glass-input" style={{paddingLeft: '44px'}} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required={!isLogin} placeholder="John Doe" />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>Login (EMAIL)</label>
            <div style={{position: 'relative'}}>
              <Mail size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
              <input type="email" className="glass-input" style={{paddingLeft: '44px'}} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required placeholder="recruiter@neural.io" />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
              <label style={{margin: 0}}>SECURITY KEY</label>
            </div>
            <div style={{position: 'relative'}}>
              <Lock size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
              <input type="password" className="glass-input" style={{paddingLeft: '44px'}} value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required placeholder="••••••••" />
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={loading} style={{width: '100%', marginTop: '24px', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', fontWeight: 'bold', letterSpacing: '2px'}}>
            {loading ? 'SYNCHRONIZING...' : isLogin ? 'INITIALIZE LINK' : 'ESTABLISH OPERATOR'}
            {!loading && <Zap size={18} />}
          </button>
        </form>

        <div style={{marginTop: '32px', textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)'}}></div>
            <span className="neon-text" style={{fontSize: '10px', letterSpacing: '1px'}}>CORE ENGINE: OPERATIONAL</span>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 100px); }
        .auth-card { width: 100%; max-width: 450px; padding: 40px; }
        .auth-tabs { display: flex; gap: 20px; border-bottom: 1px solid rgba(255,255,255,0.05); margin-bottom: 24px; }
        .auth-tab { padding: 12px 0; color: var(--text-muted); cursor: pointer; font-size: 12px; letter-spacing: 2px; font-weight: bold; border-bottom: 2px solid transparent; transition: 0.3s; }
        .auth-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        .form-group { marginBottom: 20px; }
        .form-group label { display: block; fontSize: 10px; color: var(--primary); letterSpacing: 1.5px; marginBottom: 8px; fontWeight: bold; }
      `}} />
    </div>
  );
}
