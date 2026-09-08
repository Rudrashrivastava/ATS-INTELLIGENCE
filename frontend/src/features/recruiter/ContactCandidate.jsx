import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Mail, Send, CheckCircle, ShieldCheck, User, Building, Calendar, DollarSign, Sparkles, FileText, Download } from 'lucide-react';
import { useAuth } from '../auth/hooks/useAuth';

export default function ContactCandidate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: authUser } = useAuth();

  // Extract candidate state passed from Ecosystem / Dashboard
  const candidateInfo = location.state?.candidate || {};
  const candidateRole = location.state?.role || candidateInfo.primaryRole || 'Fullstack Engineer';
  const matchScore = location.state?.score || candidateInfo.overallScore || 85;
  const trajectoryId = location.state?.trajectoryId || candidateInfo.id || 1;

  const candidateName = candidateInfo.name || candidateInfo.user?.name || 'Candidate';
  const candidateEmail = candidateInfo.email || candidateInfo.user?.email || `${candidateName.toLowerCase().replace(/\s+/g, '')}@talent-ecosystem.io`;

  // Two-Way Binding Form State
  const [formData, setFormData] = useState({
    recruiterName: authUser?.name || 'HR Recruiter',
    recruiterEmail: authUser?.email || 'recruiter@company.com',
    companyName: 'Tech Corp Global',
    candidateName: candidateName,
    candidateEmail: candidateEmail,
    jobTitle: candidateRole,
    subject: `Interview Invitation for ${candidateRole} Position`,
    interviewDate: '',
    proposedSalary: '$120,000 - $140,000 / year',
    message: `Hi ${candidateName},\n\nWe were impressed by your ATS match score of ${matchScore}% in our Global Talent Ecosystem for the ${candidateRole} role. We would love to invite you for an initial interview to discuss exciting career opportunities with our team.`
  });

  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleDownloadPDF = async () => {
    if (!trajectoryId) return;
    setDownloading(true);
    try {
      const response = await axios.get(`/api/resume/download-guide/${trajectoryId}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${candidateName.replace(/\s+/g, '_')}_Dossier.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error("PDF Download Failure:", e);
      setError("Failed to download PDF dossier. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  // Handle Input Changes with Secure Two-Way Data Binding
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recruiterName.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      await axios.post('/api/notifications/dispatch', formData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Outreach Dispatch Failure:", err);
      setError(err.response?.data?.message || "Failed to dispatch outreach. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="neural-container animate-fade-in" style={{ padding: '40px', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* Top Header */}
      <div style={{ marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button 
            onClick={() => navigate(-1)} 
            className="glass-card hover-lift" 
            style={{ padding: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}
          >
            <ArrowLeft size={20} color="#00E5FF" />
          </button>
          <div>
            <h1 style={{ fontSize: '32px', color: '#fff', fontWeight: 'bold' }}>Recruiter Outreach Dispatch</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Directly connect with top-matched candidates in the ecosystem.</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 229, 255, 0.05)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
          <ShieldCheck size={18} color="#00E5FF" />
          <span style={{ fontSize: '12px', color: '#00E5FF', fontWeight: 'bold', letterSpacing: '1px' }}>ENCRYPTED OUTREACH</span>
        </div>
      </div>

      {submitted ? (
        <div className="glass-card animate-slide-up" style={{ padding: '60px', textAlign: 'center', border: '1px solid rgba(0, 230, 118, 0.3)', background: 'rgba(0, 230, 118, 0.03)' }}>
          <CheckCircle size={64} color="#00E676" style={{ marginBottom: '24px' }} className="pulse-slow" />
          <h2 style={{ fontSize: '28px', color: '#fff', marginBottom: '12px' }}>Message Dispatched to {formData.candidateName}!</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '600px', margin: '0 auto 32px' }}>
            Your interview invitation and position details have been securely delivered to <strong style={{ color: '#00E5FF' }}>{formData.candidateEmail}</strong>.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button 
              onClick={() => navigate('/usersuse')}
              className="btn-glow" 
              style={{ padding: '12px 28px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              RETURN TO ECOSYSTEM
            </button>
            <button 
              onClick={() => setSubmitted(false)}
              className="glass-card" 
              style={{ padding: '12px 28px', cursor: 'pointer', fontSize: '13px', color: '#fff' }}
            >
              SEND ANOTHER MESSAGE
            </button>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '40px', border: '1px solid rgba(255,255,255,0.08)' }}>
          
          {/* Candidate Card Summary */}
          <div className="glass-card" style={{ padding: '24px', marginBottom: '20px', background: 'rgba(0, 229, 255, 0.03)', border: '1px solid rgba(0, 229, 255, 0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'linear-gradient(135deg, #00E5FF, #0072FF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', color: '#000', fontWeight: 'bold' }}>
                {candidateName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '20px', color: '#fff', fontWeight: 'bold', marginBottom: '4px' }}>{candidateName}</h3>
                <div style={{ fontSize: '13px', color: 'var(--primary)' }}>Target Role: {candidateRole}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Email: {candidateEmail}</div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '28px', fontWeight: 'bold', color: matchScore >= 80 ? '#00E676' : '#00E5FF' }}>{matchScore}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', letterSpacing: '1px' }}>MATCH ACCURACY</div>
            </div>
          </div>

          {/* CANDIDATE CV & DOSSIER ACCESS BUTTONS FOR HR */}
          <div style={{ display: 'flex', gap: '14px', marginBottom: '32px' }}>
            <button
              type="button"
              onClick={() => {
                const traj = location.state?.trajectory || { 
                  id: trajectoryId, 
                  primaryRole: candidateRole, 
                  overallScore: matchScore,
                  user: candidateInfo.user || candidateInfo || { name: candidateName, email: candidateEmail }
                };
                navigate('/details', { state: { trajectory: traj } });
              }}
              className="glass-card hover-lift"
              style={{
                flex: 1, padding: '12px 18px', background: 'rgba(0, 229, 255, 0.1)',
                border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00E5FF',
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '12px', fontWeight: 'bold'
              }}
            >
              <FileText size={16} /> VIEW CANDIDATE CV & DOSSIER
            </button>

            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="glass-card hover-lift"
              style={{
                flex: 1, padding: '12px 18px', background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.15)', color: '#fff',
                borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                fontSize: '12px', fontWeight: 'bold'
              }}
            >
              <Download size={16} /> {downloading ? 'GENERATING PDF...' : 'DOWNLOAD CANDIDATE DOSSIER (PDF)'}
            </button>
          </div>

          {error && (
            <div style={{ padding: '12px 20px', background: 'rgba(255, 23, 68, 0.1)', border: '1px solid #ff1744', color: '#ff1744', borderRadius: '8px', marginBottom: '24px', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {/* Recruiter Outreach Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                  RECRUITER NAME *
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    name="recruiterName"
                    value={formData.recruiterName}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ paddingLeft: '42px', width: '100%' }}
                    placeholder="Enter your name"
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                  RECRUITER EMAIL *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="email"
                    name="recruiterEmail"
                    value={formData.recruiterEmail}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ paddingLeft: '42px', width: '100%' }}
                    placeholder="recruiter@company.com"
                    required
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                  COMPANY / ORGANIZATION
                </label>
                <div style={{ position: 'relative' }}>
                  <Building size={16} color="var(--primary)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ paddingLeft: '42px', width: '100%' }}
                    placeholder="Company Name"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                  PROPOSED SALARY RANGE
                </label>
                <div style={{ position: 'relative' }}>
                  <DollarSign size={16} color="#00E676" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input 
                    type="text"
                    name="proposedSalary"
                    value={formData.proposedSalary}
                    onChange={handleChange}
                    className="glass-input"
                    style={{ paddingLeft: '42px', width: '100%' }}
                    placeholder="$100k - $130k"
                  />
                </div>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                MESSAGE SUBJECT *
              </label>
              <input 
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="glass-input"
                style={{ width: '100%' }}
                placeholder="Enter subject"
                required
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px', display: 'block', fontWeight: 'bold' }}>
                OUTREACH MESSAGE *
              </label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="glass-input"
                rows={6}
                style={{ width: '100%', resize: 'vertical', lineHeight: '1.6' }}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', marginTop: '12px' }}>
              <button 
                type="button" 
                onClick={() => navigate(-1)}
                className="glass-card" 
                style={{ padding: '14px 28px', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
              >
                CANCEL
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="btn-glow" 
                style={{ padding: '14px 36px', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                {loading ? 'SENDING...' : 'DISPATCH OUTREACH'} <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
