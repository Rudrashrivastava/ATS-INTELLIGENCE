import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, User, ShieldAlert, Zap, Eye, EyeOff, ShieldCheck, Briefcase, UserCheck } from 'lucide-react';
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

  return (
    <div className="auth-container animate-fade-in">
      <div className="neural-panel auth-card glass-card">
        
        <div className="auth-tabs">
          <div className={`auth-tab ${isLogin ? 'active' : ''}`} onClick={() => setIsLogin(true)}>LOGIN</div>
          <div className={`auth-tab ${!isLogin ? 'active' : ''}`} onClick={() => setIsLogin(false)}>REGISTER</div>
        </div>

        <div style={{textAlign: 'center', marginBottom: '24px', marginTop: '16px'}}>
           <div className="pulse-glow" style={{
             width: '60px', height: '60px', borderRadius: '50%', 
             background: formData.role === 'HR' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(0, 229, 255, 0.15)', 
             display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', 
             border: formData.role === 'HR' ? '1.5px solid #00E676' : '1.5px solid #00E5FF',
             boxShadow: formData.role === 'HR' ? '0 0 20px rgba(0,230,118,0.3)' : '0 0 20px rgba(0,229,255,0.3)'
           }}>
              {formData.role === 'HR' ? <Briefcase size={28} color="#00E676" /> : <UserCheck size={28} color="#00E5FF" />}
           </div>
           
           <h1 style={{fontSize: '26px', color: '#fff', letterSpacing: '0.5px'}}>
             {isLogin ? 'Neural Access Portal' : 'Create Operator Profile'}
           </h1>
           <p className="text-muted" style={{fontSize: '13px', marginTop: '6px'}}>
             {isLogin 
               ? `Sign in to access your ${formData.role === 'HR' ? 'HR Talent Acquisition' : 'Candidate Career'} Dashboard.` 
               : `Establish a new ${formData.role === 'HR' ? 'HR Recruiter' : 'Candidate'} identity in the ecosystem.`}
           </p>
        </div>

        {/* PROMINENT RBAC ROLE SELECTOR (VISIBLE ON BOTH LOGIN AND REGISTER) */}
        <div className="form-group" style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '11px', color: formData.role === 'HR' ? '#00E676' : '#00E5FF', letterSpacing: '1.5px', margin: 0, fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} /> ROLE-BASED ACCESS CONTROL (RBAC)
            </label>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px' }}>
              ACTIVE: {formData.role === 'HR' ? 'HR RECRUITER' : 'CANDIDATE'}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* CANDIDATE ROLE CARD */}
            <div 
              onClick={() => setFormData({ ...formData, role: 'USER' })}
              className="glass-card hover-lift"
              style={{
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: '10px',
                border: formData.role === 'USER' ? '2px solid #00E5FF' : '1px solid rgba(255,255,255,0.1)',
                background: formData.role === 'USER' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.02)',
                boxShadow: formData.role === 'USER' ? '0 0 15px rgba(0, 229, 255, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>👤</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: formData.role === 'USER' ? '#00E5FF' : '#fff' }}>CANDIDATE</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>ATS Scan & Roadmap</div>
              {formData.role === 'USER' && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 8px #00E5FF' }}></div>
              )}
            </div>

            {/* HR RECRUITER ROLE CARD */}
            <div 
              onClick={() => setFormData({ ...formData, role: 'HR' })}
              className="glass-card hover-lift"
              style={{
                padding: '14px 12px',
                cursor: 'pointer',
                textAlign: 'center',
                borderRadius: '10px',
                border: formData.role === 'HR' ? '2px solid #00E676' : '1px solid rgba(255,255,255,0.1)',
                background: formData.role === 'HR' ? 'rgba(0, 230, 118, 0.15)' : 'rgba(255,255,255,0.02)',
                boxShadow: formData.role === 'HR' ? '0 0 15px rgba(0, 230, 118, 0.2)' : 'none',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>💼</div>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: formData.role === 'HR' ? '#00E676' : '#fff' }}>HR RECRUITER</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '4px' }}>Talent Search Directory</div>
              {formData.role === 'HR' && (
                <div style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', borderRadius: '50%', background: '#00E676', boxShadow: '0 0 8px #00E676' }}></div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#ff1744', marginBottom: '20px', fontSize: '13px', background: 'rgba(255, 23, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 23, 68, 0.3)'}}>
            <ShieldAlert size={16} /> {error}
          </div>
        )}
        {success && (
          <div style={{color: '#00E5FF', marginBottom: '20px', fontSize: '13px', background: 'rgba(0, 229, 255, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)'}}>
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
                  placeholder={formData.role === 'HR' ? "Sarah Jenkins (Recruitment)" : "Alex Mercer (Engineer)"} 
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
                placeholder={formData.role === 'HR' ? "recruiter@techcorp.com" : "candidate@applysphere.ai"} 
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

          {/* QUICK DEMO ROLE AUTOFILL BUTTONS */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button 
              type="button"
              onClick={() => handleQuickAutofill('USER')}
              style={{
                background: 'rgba(0, 229, 255, 0.08)', border: '1px solid rgba(0, 229, 255, 0.3)',
                color: '#00E5FF', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <span>👤</span> Candidate Autofill
            </button>

            <button 
              type="button"
              onClick={() => handleQuickAutofill('HR')}
              style={{
                background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.3)',
                color: '#00E676', borderRadius: '6px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              <span>💼</span> HR Recruiter Autofill
            </button>
          </div>

          <button 
            type="submit" 
            className="btn-primary" 
            disabled={loading} 
            style={{
              width: '100%', marginTop: '20px', padding: '15px', display: 'flex', 
              justifyContent: 'center', alignItems: 'center', gap: '12px', fontWeight: 'bold', 
              letterSpacing: '2px',
              background: formData.role === 'HR' 
                ? 'linear-gradient(135deg, #00E676 0%, #00B0FF 100%)' 
                : 'linear-gradient(135deg, #00E5FF 0%, #7C4DFF 100%)',
              border: 'none',
              boxShadow: formData.role === 'HR' 
                ? '0 0 20px rgba(0, 230, 118, 0.35)' 
                : '0 0 20px rgba(0, 229, 255, 0.35)'
            }}
          >
            {loading ? 'SYNCHRONIZING...' : isLogin ? `ACCESS AS ${formData.role === 'HR' ? 'HR RECRUITER' : 'CANDIDATE'}` : `ESTABLISH ${formData.role === 'HR' ? 'HR' : 'CANDIDATE'} ACCOUNT`}
            {!loading && <Zap size={18} />}
          </button>
        </form>

        <div style={{marginTop: '28px', textAlign: 'center'}}>
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'}}>
            <div style={{width: '8px', height: '8px', borderRadius: '50%', background: formData.role === 'HR' ? '#00E676' : '#00E5FF', boxShadow: `0 0 8px ${formData.role === 'HR' ? '#00E676' : '#00E5FF'}`}}></div>
            <span className="neon-text" style={{fontSize: '10px', letterSpacing: '1px'}}>RBAC SECURITY ENGINE: ONLINE</span>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        .auth-container { display: flex; align-items: center; justify-content: center; min-height: calc(100vh - 100px); }
        .auth-card { width: 100%; max-width: 460px; padding: 36px; border-radius: 16px; backdrop-filter: blur(16px); }
        .auth-tabs { display: flex; gap: 20px; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 20px; }
        .auth-tab { padding: 12px 0; color: var(--text-muted); cursor: pointer; font-size: 12px; letter-spacing: 2px; font-weight: bold; border-bottom: 2px solid transparent; transition: 0.3s; }
        .auth-tab.active { color: var(--primary); border-bottom-color: var(--primary); }
        .form-group { margin-bottom: 18px; }
        .form-group label { display: block; font-size: 10px; color: var(--primary); letter-spacing: 1.5px; margin-bottom: 6px; font-weight: bold; }
        .hover-lift:hover { transform: translateY(-2px); border-color: rgba(255,255,255,0.3) !important; }
      `}} />
    </div>
  );
}

