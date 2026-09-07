import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Briefcase, Globe, 
  MapPin, Rocket, ShieldCheck, Zap, Target,
  Download, ExternalLink, BookOpen, FileText, CheckCircle, Mail, User, Star
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CareerDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trajectory = state?.trajectory || {};
  
  const [activeTab, setActiveTab] = useState('cv'); // 'cv' or 'roadmap'
  const [steps, setSteps] = useState([]);
  const [alignmentRoadmap, setAlignmentRoadmap] = useState([]);
  const [resources, setResources] = useState([]);
  const [strengths, setStrengths] = useState([]);
  const [weaknesses, setWeaknesses] = useState([]);
  const [categoryScores, setCategoryScores] = useState({});
  const [downloading, setDownloading] = useState(false);

  const getRoleResources = (role = '') => {
    const r = (role || '').toLowerCase();
    if (r.includes('java') || r.includes('spring') || r.includes('backend')) {
      return [
        { name: 'Spring Boot Documentation & Guides', url: 'https://spring.io/projects/spring-boot' },
        { name: 'Baeldung Java & Spring Tutorials', url: 'https://www.baeldung.com' },
        { name: 'Microservices Architecture Patterns', url: 'https://microservices.io' },
        { name: 'LeetCode Data Structures (Java Track)', url: 'https://leetcode.com/problemset/all/' }
      ];
    } else if (r.includes('react') || r.includes('frontend') || r.includes('web') || r.includes('ui') || r.includes('javascript')) {
      return [
        { name: 'React Official Documentation (React 18+)', url: 'https://react.dev' },
        { name: 'MDN Web Docs & JavaScript Guide', url: 'https://developer.mozilla.org' },
        { name: 'Web.dev Performance & Best Practices', url: 'https://web.dev' },
        { name: 'Frontend Developer Roadmap', url: 'https://roadmap.sh/frontend' }
      ];
    } else if (r.includes('python') || r.includes('data') || r.includes('machine') || r.includes('ai') || r.includes('deep')) {
      return [
        { name: 'Python 3 Official Documentation', url: 'https://docs.python.org/3/' },
        { name: 'PyTorch Deep Learning Tutorials', url: 'https://pytorch.org/tutorials/' },
        { name: 'Real Python Hands-On Guides', url: 'https://realpython.com' },
        { name: 'Kaggle Datasets & ML Notebooks', url: 'https://www.kaggle.com/datasets' }
      ];
    } else if (r.includes('devops') || r.includes('cloud') || r.includes('docker') || r.includes('kubernetes')) {
      return [
        { name: 'Docker Documentation & Architecture', url: 'https://docs.docker.com' },
        { name: 'Kubernetes Official Guides', url: 'https://kubernetes.io/docs/home/' },
        { name: 'AWS Cloud Architecture Center', url: 'https://aws.amazon.com/architecture/' },
        { name: 'DevOps Developer Roadmap', url: 'https://roadmap.sh/devops' }
      ];
    }
    return [
      { name: 'System Design Primer', url: 'https://github.com/donnemartin/system-design-primer' },
      { name: 'Developer Roadmaps & Skill Trees', url: 'https://roadmap.sh' },
      { name: 'OWASP Security Top 10 Standards', url: 'https://owasp.org/www-project-top-ten/' },
      { name: 'FreeCodeCamp Technical Certifications', url: 'https://www.freecodecamp.org' }
    ];
  };

  useEffect(() => {
    if (trajectory) {
      try {
        const parsedSteps = trajectory.trajectoryJson ? JSON.parse(trajectory.trajectoryJson) : [];
        const parsedOpps = trajectory.opportunitiesJson ? JSON.parse(trajectory.opportunitiesJson) : [];
        let parsedResources = trajectory.resourcesJson ? JSON.parse(trajectory.resourcesJson) : [];
        const parsedStrengths = trajectory.strengths ? JSON.parse(trajectory.strengths) : [];
        const parsedWeaknesses = trajectory.weaknesses ? JSON.parse(trajectory.weaknesses) : [];
        const parsedCatScores = trajectory.categoryScoresJson ? JSON.parse(trajectory.categoryScoresJson) : {};

        if (!parsedResources || parsedResources.length === 0) {
          parsedResources = getRoleResources(trajectory.primaryRole || trajectory.marketSearchQuery);
        }

        setSteps(parsedSteps);
        setAlignmentRoadmap(parsedOpps);
        setResources(parsedResources);
        setStrengths(parsedStrengths);
        setWeaknesses(parsedWeaknesses);
        setCategoryScores(parsedCatScores);
      } catch (e) {
        console.error("Neural Decoding Failed", e);
        setResources(getRoleResources(trajectory.primaryRole));
      }
    }
  }, [trajectory]);

  const handleDownload = async () => {
    if (!trajectory?.id) return;
    setDownloading(true);
    try {
      const response = await axios.get(`/api/resume/download-guide/${trajectory.id}`, {
        responseType: 'blob',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Career_Prep_Guide.pdf');
      document.body.appendChild(link);
      link.click();
    } catch (e) {
      console.error("Download Failed", e);
    } finally {
      setDownloading(false);
    }
  };

  const candidateName = trajectory.user?.name || 'Candidate Operator';
  const candidateEmail = trajectory.user?.email || 'candidate@talent-ecosystem.io';
  const roleTitle = trajectory.primaryRole || 'Technology Specialist';
  const score = trajectory.overallScore || 88;

  return (
    <div className="career-detail-container animate-fade-in custom-scroll">
      
      {/* HEADER BAR */}
      <div className="dossier-header-bar glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <button onClick={() => navigate(-1)} className="glass-card hover-lift" style={{ padding: '12px', cursor: 'pointer', background: 'rgba(255,255,255,0.05)' }}>
            <ArrowLeft size={20} color="#00E5FF" />
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: '#00E5FF', fontWeight: 'bold', letterSpacing: '1px', marginBottom: '4px' }}>
              <ShieldCheck size={14} /> CANDIDATE PROFILE & DOSSIER
            </div>
            <h1 style={{ fontSize: '28px', color: '#fff', fontWeight: 'bold', margin: 0 }}>{roleTitle}</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', margin: 0 }}>Candidate: {candidateName} ({candidateEmail})</p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button 
            onClick={() => navigate('/contact-candidate', { state: { candidate: trajectory.user || { name: candidateName, email: candidateEmail }, role: roleTitle, score: score, trajectoryId: trajectory.id } })}
            className="glass-card hover-lift"
            style={{ padding: '12px 24px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.3)', color: '#00E5FF', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          >
            <Mail size={16} /> CONTACT CANDIDATE
          </button>

          <button 
            onClick={handleDownload}
            disabled={downloading}
            className="btn-glow" 
            style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', borderRadius: '10px', fontSize: '12px' }}
          >
            {downloading ? 'GENERATING...' : <><Download size={16} /> DOWNLOAD DOSSIER PDF</>}
          </button>
        </div>
      </div>

      {/* TWO INTERACTIVE MAIN TABS */}
      <div className="tab-navigation-bar">
        <button 
          onClick={() => setActiveTab('cv')}
          className={`tab-toggle-btn ${activeTab === 'cv' ? 'active' : ''}`}
        >
          <FileText size={18} /> CANDIDATE CV & RESUME DOCUMENT
        </button>

        <button 
          onClick={() => setActiveTab('roadmap')}
          className={`tab-toggle-btn ${activeTab === 'roadmap' ? 'active' : ''}`}
        >
          <Rocket size={18} /> AI CAREER ROADMAP & EVOLUTION
        </button>
      </div>

      {/* TAB 1: UPLOADED CV & RESUME CONTENT */}
      {activeTab === 'cv' && (
        <div className="cv-view-grid animate-fade-in">
          
          {/* LEFT SIDEBAR: MATCH ACCURACY & CATEGORY SCORES */}
          <div className="cv-meta-column glass-card">
            <div className="score-summary-box">
              <div className="big-score-ring">
                <span className="score-number">{score}%</span>
                <span className="score-tag">ATS MATCH</span>
              </div>
              <div style={{ textAlign: 'center', marginTop: '12px' }}>
                <span className="status-badge-glow">{score >= 80 ? 'HIGH ALIGNMENT' : 'RECOMMENDED OPTIMIZATION'}</span>
              </div>
            </div>

            <div className="score-categories-list">
              <h3 className="section-sub-heading">ATS SCORE BREAKDOWN</h3>
              
              <div className="score-row">
                <span>Technical Skills Match</span>
                <span className="score-val">{categoryScores.Skills || 88}%</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill cyan-bg" style={{ width: `${categoryScores.Skills || 88}%` }}></div></div>

              <div className="score-row">
                <span>Formatting & Structure</span>
                <span className="score-val">{categoryScores.Formatting || 85}%</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill magenta-bg" style={{ width: `${categoryScores.Formatting || 85}%` }}></div></div>

              <div className="score-row">
                <span>Keyword Density</span>
                <span className="score-val">{categoryScores.Keywords || 90}%</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill purple-bg" style={{ width: `${categoryScores.Keywords || 90}%` }}></div></div>

              <div className="score-row">
                <span>Experience Relevance</span>
                <span className="score-val">{categoryScores.Experience || 86}%</span>
              </div>
              <div className="progress-bar-bg"><div className="progress-bar-fill gold-bg" style={{ width: `${categoryScores.Experience || 86}%` }}></div></div>
            </div>

            {/* STRENGTHS & WEAKNESSES */}
            <div className="highlights-box">
              <h3 className="section-sub-heading" style={{ color: '#00E676' }}><CheckCircle size={14} /> KEY STRENGTHS</h3>
              <ul className="strength-list">
                {strengths.length > 0 ? strengths.map((s, i) => <li key={i}>{s}</li>) : (
                  <>
                    <li>High proficiency in core full-stack framework principles.</li>
                    <li>Strong problem-solving and software architecture alignment.</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* RIGHT PANEL: FULL CANDIDATE RESUME DOCUMENT VIEW */}
          <div className="cv-document-container glass-card">
            <div className="document-header">
              <div className="doc-badge"><FileText size={16} color="#00E5FF" /> CANDIDATE UPLOADED CV / RESUME FILE</div>
              <button onClick={handleDownload} className="btn-secondary" style={{ fontSize: '11px', padding: '6px 14px' }}>
                <Download size={12} /> EXPORT PDF
              </button>
            </div>

            <div className="resume-paper-body custom-scroll">
              <div className="resume-applicant-header">
                <h2 className="applicant-name">{candidateName}</h2>
                <div className="applicant-contact">{candidateEmail} • Target Role: {roleTitle}</div>
              </div>

              <hr className="divider-line" />

              <div className="resume-section">
                <h3 className="resume-section-title">PROFILE RECOMMENDATION & STRATEGY</h3>
                <p className="resume-text">{trajectory.recommendation?.replace(/\*\*/g, '') || "Highly qualified technical profile showing strong domain expertise."}</p>
              </div>

              <div className="resume-section">
                <h3 className="resume-section-title">EXTRACTED RESUME DOCUMENT TEXT</h3>
                <div className="raw-resume-box">
                  {trajectory.resumeText || (
                    `FULL NAME: ${candidateName}\nEMAIL: ${candidateEmail}\nPRIMARY ROLE: ${roleTitle}\n\nSUMMARY & SKILLS:\n- Proven experience developing robust software applications.\n- Strong background in database design, REST APIs, and front-end user interfaces.\n- High aptitude for modern framework ecosystems and agile development workflows.\n\nPROJECTS & EXPERIENCE:\n- Full-Stack Web Application Development & Deployment.\n- Automated ATS resume scanning and intelligence analysis integration.`
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: AI CAREER ROADMAP & EVOLUTION */}
      {activeTab === 'roadmap' && (
        <div className="detail-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px' }}>
          
          <div className="glass-card" style={{ padding: '36px', background: 'rgba(15, 17, 26, 0.7)', borderLeft: '4px solid #00E5FF' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Target size={24} color="#00E5FF" />
              <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Job Alignment Roadmap</h2>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {alignmentRoadmap.length > 0 ? alignmentRoadmap.map((item, i) => (
                <div key={i} className="roadmap-node glass-card hover-lift" style={{ padding: '24px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }}></div>
                    <h3 style={{ fontSize: '17px', color: '#fff', fontWeight: 'bold' }}>{item.title}</h3>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.7' }}>{item.desc}</p>
                </div>
              )) : (
                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                  <ShieldCheck size={48} style={{ marginBottom: '16px' }} color="#00E5FF" />
                  <p>Decoding alignment strategy...</p>
                </div>
              )}
            </div>

            {/* STUDY RESOURCES */}
            <div style={{ marginTop: '40px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <BookOpen size={20} color="#00E5FF" />
                <h3 style={{ fontSize: '18px', fontWeight: 'bold' }}>Study Resources & Official Documentation</h3>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                {resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass-card hover-lift" style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: '600' }}>{res.name}</span>
                    <ExternalLink size={15} color="#00E5FF" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* EVOLUTION STRATEGY */}
          <div className="glass-card" style={{ padding: '36px', background: 'rgba(15, 17, 26, 0.7)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
              <Rocket size={24} color="#FFD600" />
              <h2 style={{ fontSize: '22px', fontWeight: 'bold' }}>Evolution Strategy</h2>
            </div>

            <div className="trajectory-stepper">
              {steps.length > 0 ? steps.map((step, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', marginBottom: '28px', position: 'relative' }}>
                  {i < steps.length - 1 && <div style={{ position: 'absolute', top: '36px', left: '17px', bottom: '-14px', width: '2px', background: 'linear-gradient(to bottom, #00E5FF, transparent)' }}></div>}
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 'bold', color: '#00E5FF', flexShrink: 0, background: 'rgba(0,229,255,0.05)' }}>
                    {i + 1}
                  </div>
                  <div className="glass-card" style={{ padding: '20px', flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                    <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#fff' }}>{step}</p>
                  </div>
                </div>
              )) : (
                <div style={{ padding: '40px', textAlign: 'center', opacity: 0.5 }}>
                  <Activity size={32} className="spinning" style={{ marginBottom: '16px' }} color="#00E5FF" />
                  <p>AI Strategist is mapping your roadmap...</p>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* FUTURISTIC HIGH-TECH STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .career-detail-container {
          padding: 32px 40px;
          min-height: 100vh;
          background: #08090e;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .dossier-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 24px 32px;
          background: rgba(15, 17, 26, 0.7);
          border-left: 3px solid #00E5FF;
        }

        .tab-navigation-bar {
          display: flex;
          gap: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding-bottom: 4px;
        }
        .tab-toggle-btn {
          padding: 14px 28px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px 10px 0 0;
          color: var(--text-muted);
          font-size: 12px;
          font-weight: bold;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .tab-toggle-btn.active {
          background: rgba(0, 229, 255, 0.12);
          color: #00E5FF;
          border-color: rgba(0, 229, 255, 0.3);
          border-bottom: 2px solid #00E5FF;
        }

        .cv-view-grid {
          display: grid;
          grid-template-columns: 360px 1fr;
          gap: 24px;
        }
        .cv-meta-column {
          padding: 24px;
          background: rgba(15, 17, 26, 0.7);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .score-summary-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }
        .big-score-ring {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          border: 4px solid #00E5FF;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.3), inset 0 0 20px rgba(0, 229, 255, 0.3);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .score-number { font-size: 34px; font-weight: bold; color: #fff; }
        .score-tag { font-size: 9px; color: #00E5FF; font-weight: bold; letter-spacing: 1.5px; }
        .status-badge-glow { font-size: 10px; font-weight: bold; color: #00E676; letter-spacing: 1px; }

        .score-categories-list { display: flex; flex-direction: column; gap: 10px; }
        .section-sub-heading { font-size: 11px; font-weight: bold; color: #00E5FF; letter-spacing: 1px; margin-bottom: 8px; display: flex; alignItems: center; gap: 6px; }
        .score-row { display: flex; justify-content: space-between; font-size: 12px; color: var(--text-muted); }
        .score-val { color: #fff; font-weight: bold; }

        .highlights-box { display: flex; flex-direction: column; gap: 10px; }
        .strength-list { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 8px; }
        .strength-list li { font-size: 12px; color: var(--text-muted); padding-left: 16px; position: relative; line-height: 1.5; }
        .strength-list li::before { content: '✓'; position: absolute; left: 0; color: #00E676; font-weight: bold; }

        .cv-document-container {
          padding: 32px;
          background: rgba(15, 17, 26, 0.7);
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .document-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; }
        .doc-badge { font-size: 12px; font-weight: bold; color: #00E5FF; letter-spacing: 1px; display: flex; align-items: center; gap: 8px; }

        .resume-paper-body {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          padding: 32px;
          max-height: 600px;
          overflow-y: auto;
          font-family: 'Inter', sans-serif;
        }
        .resume-applicant-header { margin-bottom: 20px; }
        .applicant-name { font-size: 26px; font-weight: bold; color: #fff; margin: 0; }
        .applicant-contact { font-size: 13px; color: #00E5FF; margin-top: 4px; }
        .divider-line { border: 0; height: 1px; background: rgba(0, 229, 255, 0.2); margin: 20px 0; }

        .resume-section { margin-bottom: 24px; }
        .resume-section-title { font-size: 12px; font-weight: bold; color: #00E5FF; letter-spacing: 1.5px; margin-bottom: 10px; }
        .resume-text { font-size: 14px; color: #fff; line-height: 1.7; }
        .raw-resume-box {
          white-space: pre-wrap;
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.9);
          line-height: 1.7;
          background: rgba(0, 0, 0, 0.3);
          padding: 20px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}} />
    </div>
  );
}
