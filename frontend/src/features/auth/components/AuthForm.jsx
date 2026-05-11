import { useState } from 'react';
import { Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function AuthForm({ isLogin, onSubmit, loading, error, success }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <div className="form-group">
          <label>Operator Name</label>
          <div style={{ position: 'relative' }}>
            <User size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '16px' }} />
            <input type="text" className="glass-input" style={{ paddingLeft: '44px' }} value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required={!isLogin} placeholder="John Doe" />
          </div>
        </div>
      )}

      <div className="form-group">
        <label>Email Address</label>
        <div style={{ position: 'relative' }}>
          <Mail size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '16px' }} />
          <input type="email" className="glass-input" style={{ paddingLeft: '44px' }} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required placeholder="recruiter@neural.io" />
        </div>
      </div>

      <div className="form-group">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label style={{ margin: 0 }}>Password</label>
          {isLogin && <a href="#" style={{ fontSize: '12px', color: 'var(--primary)', textDecoration: 'none' }}>Forgot Password?</a>}
        </div>
        <div style={{ position: 'relative' }}>
          <Lock size={18} color="var(--text-muted)" style={{ position: 'absolute', top: '12px', left: '16px' }} />
          <input type="password" className="glass-input" style={{ paddingLeft: '44px' }} value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} required placeholder="••••••••" />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '24px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>{loading ? 'PROCESSING...' : isLogin ? 'INITIALIZE SESSION' : 'ESTABLISH LINK'}</span>
        <span>&rarr;</span>
      </button>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--error)', marginTop: '24px', fontSize: '14px', background: 'rgba(255, 23, 68, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255, 23, 68, 0.3)' }}>
          <ShieldAlert size={16} /> {error}
        </div>
      )}
      {success && (
        <div style={{ color: 'var(--primary)', marginTop: '24px', fontSize: '14px', background: 'rgba(0, 229, 255, 0.1)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(0, 229, 255, 0.3)' }}>
          {success}
        </div>
      )}
    </form>
  );
}
