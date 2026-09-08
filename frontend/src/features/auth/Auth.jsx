import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldAlert, Zap, Eye, EyeOff, Briefcase, UserCheck } from 'lucide-react';
import { useAuth } from './hooks/useAuth';

export default function Auth() {
  const navigate = useNavigate();
  const { login, register, error, setError, success, setSuccess, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'USER' });

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

  const handleQuickAutofill = (roleType) => {
    if (roleType === 'HR') {
      setFormData({
        name: 'HR Recruiter Demo',
        email: 'hr.recruiter@applysphere.ai',
        password: 'password123',
        role: 'HR'
      });
    } else {
      setFormData({
        name: 'Candidate Seeker Demo',
        email: 'candidate@applysphere.ai',
        password: 'password123',
        role: 'USER'
      });
    }
  };

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
        setSuccess(`Operator profile created as [${formData.role === 'HR' ? 'HR RECRUITER' : 'CANDIDATE'}]. Please log in.`);
        setFormData({ name: '', email: '', password: '', role: formData.role });
      }
    }
  };

  const isHR = formData.role === 'HR';
  const themeColor = isHR ? '#00E676' : '#00E5FF';

  return (
    <div className="auth-container animate-fade-in">
      <div className="neural-panel auth-card glass-card">
        
        {/* COMPACT TOP TABS */}
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>LOGIN</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>REGISTER</div>
        </div>

        {/* HEADER: COMPACT ICON + TITLE */}
        <div style={{ textAlign: 'center', marginBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%', 
              background: isHR ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 229, 255, 0.15)', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: `1.5px solid ${themeColor}`,
              boxShadow: `0 0 12px ${themeColor}40`
            }}>
              {isHR ? <Briefcase size={18} color="#00E676" /> : <UserCheck size={18} color="#00E5FF" />}
            </div>
            <h1 style={{ fontSize: '20px', color: '#fff', letterSpacing: '0.5px', margin: 0 }}>
              {isLogin ? 'Neural Access Portal' : 'Create Operator Profile'}
            </h1>
          </div>
          <p className="text-muted" style={{ fontSize: '11px', margin: '2px 0 0' }}>
            {isLogin 
              ? `Sign in to access ${isHR ? 'HR Recruiter' : 'Candidate'} Dashboard.` 
              : `Create new ${isHR ? 'HR Recruiter' : 'Candidate'} account.`}
          </p>
        </div>

        {/* SEGMENTED ROLE SWITCHER (SLIM HORIZONTAL PILL) */}
        <div style={{ marginBottom: '14px' }}>
          <div className="role-segmented-control">
            <button
              type="button"
              className={`role-btn ${!isHR ? 'active candidate' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'USER' })}
            >
              <span>👤</span> Candidate
            </button>
            <button
              type="button"
              className={`role-btn ${isHR ? 'active hr' : ''}`}
              onClick={() => setFormData({ ...formData, role: 'HR' })}
            >
              <span>💼</span> HR Recruiter
            </button>
          </div>
        </div>

        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ff1744', marginBottom: '12px', fontSize: '12px', background: 'rgba(255, 23, 68, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(255, 23, 68, 0.3)' }}>
            <ShieldAlert size={14} /> {error}
          </div>
        )}
        {success && (
          <div style={{ color: '#00E5FF', marginBottom: '12px', fontSize: '12px', background: 'rgba(0, 229, 255, 0.1)', padding: '8px 12px', borderRadius: '6px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>FULL NAME</label>
              <div style={{ position: 'relative' }}>
                <User size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '10px', left: '12px' }} />
                <input 
                  type="text" 
                  className="glass-input" 
                  style={{ paddingLeft: '36px', width: '100%', height: '36px', fontSize: '13px' }} 
                  value={formData.name} 
                  onChange={e => setFormData({ ...formData, name: e.target.value })} 
                  required={!isLogin} 
                  placeholder={isHR ? "Sarah Jenkins (Recruiter)" : "Alex Mercer (Candidate)"} 
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label>EMAIL ADDRESS</label>
            <div style={{ position: 'relative' }}>
              <Mail size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '10px', left: '12px' }} />
              <input 
                type="email" 
                className="glass-input" 
                style={{ paddingLeft: '36px', width: '100%', height: '36px', fontSize: '13px' }} 
                value={formData.email} 
                onChange={e => setFormData({ ...formData, email: e.target.value })} 
                required 
                placeholder={isHR ? "recruiter@techcorp.com" : "candidate@applysphere.ai"} 
              />
            </div>
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <label style={{ margin: 0 }}>PASSWORD</label>
              {formData.password && (
                <span style={{ fontSize: '10px', color: strength.color, fontWeight: 'bold' }}>{strength.label}</span>
              )}
            </div>
            <div style={{ position: 'relative' }}>
              <Lock size={15} color="var(--text-muted)" style={{ position: 'absolute', top: '10px', left: '12px' }} />
              <input 
                type={showPassword ? 'text' : 'password'} 
                className="glass-input" 
                style={{ paddingLeft: '36px', paddingRight: '36px', width: '100%', height: '36px', fontSize: '13px' }} 
                value={formData.password} 
                onChange={e => setFormData({ ...formData, password: e.target.value })} 
                required 
                placeholder="••••••••" 
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0
                }}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>

            {/* SLIM PASSWORD STRENGTH BAR */}
            {formData.password && (
              <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden', marginTop: '6px' }}>
                <div style={{
                  width: `${strength.score}%`, 
                  height: '100%', 
                  background: strength.color, 
                  transition: 'all 0.3s ease'
                }}></div>
              </div>
            )}
          </div>

          {/* QUICK DEMO AUTOFILL CHIPS */}
          <div style={{ marginTop: '10px', display: 'flex', gap: '6px', justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => handleQuickAutofill('USER')}
              style={{
                background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.25)',
                color: '#00E5FF', borderRadius: '12px', padding: '3px 10px', fontSize: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s ease'
              }}
            >
              <span>👤</span> Demo Candidate
            </button>

            <button 
              type="button"
              onClick={() => handleQuickAutofill('HR')}
              style={{
                background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.25)',
                color: '#00E676', borderRadius: '12px', padding: '3px 10px', fontSize: '10px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px', transition: 'all 0.2s ease'
              }}
            >
              <span>💼</span> Demo HR Recruiter
            </button>
          </div>

          {/* SUBMIT BUTTON */}
          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{
              width: '100%', marginTop: '14px', padding: '10px 16px', display: 'flex', 
              justifyContent: 'center', alignItems: 'center', gap: '8px', fontWeight: 'bold', 
              letterSpacing: '1px', fontSize: '13px', borderRadius: '8px',
              background: isHR 
                ? 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)' 
                : 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)',
              border: 'none',
              boxShadow: isHR 
                ? '0 0 15px rgba(0, 230, 118, 0.3)' 
                : '0 0 15px rgba(0, 229, 255, 0.3)'
            }}
          >
            {loading ? 'SYNCHRONIZING...' : isLogin ? `ACCESS AS ${isHR ? 'HR RECRUITER' : 'CANDIDATE'}` : `CREATE ${isHR ? 'HR' : 'CANDIDATE'} ACCOUNT`}
            {!loading && <Zap size={15} />}
          </button>
        </form>

        <div style={{ marginTop: '14px', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: themeColor, boxShadow: `0 0 6px ${themeColor}` }}></div>
            <span className="neon-text" style={{ fontSize: '9px', letterSpacing: '1px' }}>RBAC SECURITY ENGINE: ONLINE</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 120px); padding: 20px 0; }
        .auth-card { width: 100%; max-width: 390px; padding: 20px 24px; border-radius: 14px; backdrop-filter: blur(16px); }
        .auth-tabs { display: flex; gap: 16px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 14px; }
        .auth-tab { padding: 8px 0; color: var(--text-muted); cursor: pointer; font-size: 11px; letter-spacing: 1.5px; font-weight: bold; border-bottom: 2px solid transparent; transition: 0.3s; }
        .auth-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        .form-group { margin-bottom: 10px; }
        .form-group label { display: block; font-size: 9.5px; color: var(--primary); letter-spacing: 1.2px; margin-bottom: 4px; font-weight: bold; }
        
        .role-segmented-control {
          display: flex;
          background: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 3px;
          gap: 4px;
        }
        .role-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 6px 10px;
          font-size: 11px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
        }
        .role-btn.active.candidate {
          background: rgba(0, 229, 255, 0.15);
          color: #00E5FF;
          border: 1px solid rgba(0, 229, 255, 0.4);
          box-shadow: 0 0 10px rgba(0, 229, 255, 0.2);
        }
        .role-btn.active.hr {
          background: rgba(0, 230, 118, 0.15);
          color: #00E676;
          border: 1px solid rgba(0, 230, 118, 0.4);
          box-shadow: 0 0 10px rgba(0, 230, 118, 0.2);
        }
      `}} />
    </div>
  );
}


