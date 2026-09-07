import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldAlert, Zap, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, error, setError, success, setSuccess, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  // Calculate Password Strength Meter (0 to 100)
  const calculatePasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'None', color: 'transparent' };
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[0-9!@#$%^&*()]/.test(pass)) score += 25;
    if (/[a-z]/.test(pass) && /[A-Z]/.test(pass)) score += 25;

    if (score <= 25) return { score: 25, label: 'Weak', color: '#ff1744' };
    if (score <= 50) return { score: 50, label: 'Fair', color: '#ffb300' };
    if (score <= 75) return { score: 75, label: 'Good', color: '#0284c7' };
    return { score: 100, label: 'Strong & Encrypted', color: '#00E676' };
  };

  const strength = calculatePasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (isLogin) {
      const ok = await login({ email: formData.email, password: formData.password });
      if (ok) {
        navigate('/', { replace: true });
      }
    } else {
      const ok = await register(formData);
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
              <label>FULL NAME</label>
              <div style={{position: 'relative'}}>
                <User size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{paddingLeft: '44px', width: '100%'}} 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  required={!isLogin} 
                  placeholder="John Doe" 
                />
              </div>
            </div>
          )}
          
          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div style={{position: 'relative'}}>
              <Mail size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
              <input 
                type="email" 
                className="glass-input" 
                style={{paddingLeft: '44px', width: '100%'}} 
                value={formData.email} 
                onChange={e => setFormData({...formData, email: e.target.value})} 
                required 
                placeholder="recruiter@neural.io" 
              />
            </div>
          </div>
          
          <div className="form-group">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px'}}>
              <label style={{margin: 0}}>PASSWORD</label>
            </div>
            <div style={{position: 'relative'}}>
              <Lock size={18} color="var(--text-muted)" style={{position: 'absolute', top: '12px', left: '16px'}} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="glass-input" 
                style={{paddingLeft: '44px', paddingRight: '44px', width: '100%'}} 
                value={formData.password} 
                onChange={e => setFormData({...formData, password: e.target.value})} 
                required 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
                }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* PASSWORD STRENGTH PROGRESS BAR */}
            {formData.password && (
              <div style={{marginTop: '10px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px'}}>
                  <span style={{color: 'var(--text-muted)'}}>Password Strength:</span>
                  <span style={{color: strength.color, fontWeight: 'bold'}}>{strength.label}</span>
                </div>
                <div style={{width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden'}}>
                  <div style={{
                    width: `${strength.score}%`, 
                    height: '100%', 
                    background: strength.color, 
                    transition: 'all 0.3s ease'
                  }}></div>
                </div>
              </div>
            )}
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
        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; font-size: 10px; color: var(--primary); letter-spacing: 1.5px; margin-bottom: 8px; font-weight: bold; }
      `}} />
    </div>
  );
}
