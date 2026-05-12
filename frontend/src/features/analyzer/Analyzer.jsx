import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  UploadCloud, CheckCircle2, FileText, Activity, Briefcase, 
  MapPin, Globe, Zap, ShieldCheck, AlertCircle, TrendingUp, ArrowLeft 
} from 'lucide-react';

export default function Analyzer({ token }) {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // PERSISTENCE: Load saved result on mount
  useEffect(() => {
    const savedResult = sessionStorage.getItem('active_analysis');
    if (savedResult && savedResult !== "undefined") {
      try {
        setResult(JSON.parse(savedResult));
      } catch (e) {
        console.error("Neural State Corruption. Purging session...");
        sessionStorage.removeItem('active_analysis');
      }
    }
  }, []);

  // PERSISTENCE: Save result when it updates
  useEffect(() => {
    if (result) {
      sessionStorage.setItem('active_analysis', JSON.stringify(result));
    }
  }, [result]);

  const handleAnalyze = async () => {
    if (!file) return;
    const activeToken = localStorage.getItem('token'); // DIRECT FETCH FOR FRESHNESS
    
    if (!activeToken) {
      alert("Neural Session Expired. Please login again.");
      navigate('/auth');
      return;
    }

    setLoading(true);
    setResult(null);
    sessionStorage.removeItem('active_analysis');
    setProgress(0);
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    const formData = new FormData();
    formData.append('file', file);
    if (jobDesc) formData.append('jobDescription', jobDesc);

    try {
      const endpoint = '/api/resume/analyze';
      const res = await axios.post('/api/resume/analyze', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${activeToken}`
        }
      });
      
      clearInterval(interval);
      setProgress(100);
      
      // Force UI switch
      setTimeout(() => {
        setResult(res.data);
        setLoading(false);
      }, 500);
    } catch (err) {
      clearInterval(interval);
      setProgress(0);
      console.error("Neural Bridge Failure Details:", err);
      
      const errorData = err.response?.data;
      const errorMsg = typeof errorData === 'object' ? (errorData.message || JSON.stringify(errorData)) : (errorData || err.message);
      const status = err.response?.status || 'Unknown Status';
      
      alert(`NEURAL BRIDGE FAILURE [${status}]: ${errorMsg}\n\nPlease check your terminal or backend logs.`);
    }
    setLoading(false);
  };

  return (
    <div className="neural-container">
      <div className="neural-grid">
        {/* LEFT PANEL: INGESTION */}
        <div className="neural-panel">
          <div className="panel-header">
            <Activity className="neon-icon" size={20} />
            <h2 className="neon-text">SYSTEM ACTIVE</h2>
          </div>
          <h1 style={{fontSize: '28px', margin: '8px 0 24px'}}>Neural Ingestion</h1>
          <p className="text-muted" style={{marginBottom: '24px'}}>Initiate the bridge to synchronize your professional trajectory with our neural core.</p>

          <div className="dropzone">
            <UploadCloud size={48} color="var(--primary)" style={{marginBottom: '16px'}} />
            <h3 style={{marginBottom: '8px'}}>Neural Bridge</h3>
            <p className="text-muted" style={{marginBottom: '16px'}}>TAP TO UPLOAD OR DRAG RESUME</p>
            <input type="file" id="fileUpload" accept=".pdf" style={{display: 'none'}} onChange={e => setFile(e.target.files[0])} />
            <button className="btn-primary" onClick={() => document.getElementById('fileUpload').click()}>
              SELECT FILE
            </button>
            {file && <div style={{marginTop: '12px', fontSize: '14px', color: 'var(--secondary)'}}>{file.name}</div>}
          </div>

          <div style={{marginTop: '24px'}}>
            <label style={{display: 'block', marginBottom: '8px', color: 'var(--text-muted)'}}>Job Description (Optional Context)</label>
            <textarea rows="4" className="glass-input" value={jobDesc} onChange={e => setJobDesc(e.target.value)} placeholder="Provide target job parameters..."></textarea>
          </div>

          <button onClick={handleAnalyze} className="btn-primary" disabled={loading || !file} style={{width: '100%', marginTop: '24px'}}>
            {loading ? 'INITIALIZING BRIDGE...' : 'START INGESTION'}
          </button>

          {loading && (
            <div className="ingestion-queue glass-card" style={{marginTop: '32px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '16px'}}>
                <span className="text-muted">Ingestion Queue</span>
                <span className="neon-text">1 Active Task</span>
              </div>
              <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
                <FileText size={32} color="var(--text-muted)" />
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px'}}>
                    <span>{file.name}</span>
                    <span className="neon-text">{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{width: `${progress}%`}}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: RESULTS */}
        <div className="neural-panel">
          <div className="panel-header">
            <CheckCircle2 className="neon-icon" size={20} />
            <h2 className="neon-text">CORE ENGINE: OPERATIONAL</h2>
          </div>
          
          {result ? (
            <div className="results-container animate-fade-in" style={{
              background: 'rgba(10, 11, 16, 0.98)',
              borderRadius: '24px',
              padding: '40px',
              border: '1px solid rgba(0, 229, 255, 0.15)',
              boxShadow: '0 0 50px rgba(0, 229, 255, 0.05)',
              position: 'relative'
            }}>
              <div style={{display: 'flex', alignItems: 'center', gap: '32px', marginBottom: '40px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px'}}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%',
                  background: `conic-gradient(var(--primary) ${result.overallScore || 0}%, rgba(255,255,255,0.05) 0)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 0 25px rgba(0, 229, 255, 0.2)',
                  padding: '8px'
                }}>
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '50%',
                    background: '#0a0b10', display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{fontSize: '36px', fontWeight: 'bold', color: 'var(--primary)', textShadow: '0 0 10px var(--primary-glow)'}}>
                      {result.overallScore || 0}%
                    </div>
                    <div style={{fontSize: '9px', letterSpacing: '2px', opacity: 0.6}}>NEURAL MATCH</div>
                  </div>
                </div>
                
                <div style={{flex: 1}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                    <h1 style={{fontSize: '28px', fontWeight: 'bold', marginBottom: '8px', letterSpacing: '1px', color: '#fff'}}>ANALYSIS COMPLETE</h1>
                    {result.modelSource && (
                      <div className="glass-card" style={{
                        padding: '4px 12px', fontSize: '10px', borderRadius: '20px', 
                        background: result.modelSource.includes('Mistral') ? 'rgba(0, 229, 255, 0.1)' : 'rgba(255, 23, 68, 0.1)',
                        color: result.modelSource.includes('Mistral') ? 'var(--primary)' : 'var(--secondary)',
                        border: `1px solid ${result.modelSource.includes('Mistral') ? 'rgba(0, 229, 255, 0.3)' : 'rgba(255, 23, 68, 0.3)'}`,
                        display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold'
                      }}>
                        <Activity size={12} /> {result.modelSource.toUpperCase()}
                      </div>
                    )}
                  </div>
                  <p style={{fontSize: '16px', color: 'var(--text-muted)', lineHeight: '1.6'}}>
                    {result.recommendation || "System alignment synchronized with target market nodes."}
                  </p>
                </div>
              </div>

              {/* DETAILED NEURAL BREAKDOWN */}
              <div className="glass-card" style={{
                marginBottom: '32px', padding: '24px', 
                background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(0, 229, 255, 0.1)'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px'}}>
                   <Activity size={20} color="var(--primary)" />
                   <h3 style={{fontSize: '16px', letterSpacing: '1px', fontWeight: 'bold', color: 'var(--primary)'}}>INTELLIGENCE BREAKDOWN</h3>
                </div>
                
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px'}}>
                  {(() => {
                    try {
                      const cData = result.categoryScoresJson || result.categoryScores;
                      const categories = typeof cData === 'string' ? JSON.parse(cData) : cData;
                      const finalCats = (categories && typeof categories === 'object') ? categories : { "Skill Match": 0, "Keywords": 0, "Formatting": 0, "Experience": 0 };

                      return Object.entries(finalCats).map(([key, value]) => (
                        <div key={key}>
                          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '11px'}}>
                            <span style={{fontWeight: 'bold', color: '#fff'}}>{key.toUpperCase()}</span>
                            <span style={{color: 'var(--primary)'}}>{value}%</span>
                          </div>
                          <div style={{height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden'}}>
                            <div style={{
                              height: '100%', width: `${value}%`, 
                              background: 'linear-gradient(90deg, var(--primary), #00B0FF)',
                              boxShadow: '0 0 10px var(--primary-glow)',
                              transition: 'width 2s'
                            }} />
                          </div>
                        </div>
                      ));
                    } catch (e) { return null; }
                  })()}
                </div>
              </div>

              <div className="results-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px'}}>
                <div className="glass-card" style={{padding: '20px', borderLeft: '4px solid var(--primary)', background: 'rgba(0, 229, 255, 0.02)'}}>
                  <h3 style={{fontSize: '14px', color: 'var(--primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <ShieldCheck size={18} /> PROFILE STRENGTHS
                  </h3>
                  <ul style={{fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.8', listStyle: 'none', padding: 0}}>
                    {(() => {
                      try {
                        const sData = result.strengths;
                        const strengths = typeof sData === 'string' ? JSON.parse(sData) : sData;
                        return Array.isArray(strengths) && strengths.length > 0 ? 
                          strengths.map((s, i) => <li key={i} style={{marginBottom: '8px'}}>• {s}</li>) : 
                          <li>No nodes detected.</li>;
                      } catch (e) { return null; }
                    })()}
                  </ul>
                </div>
                
                <div className="glass-card" style={{padding: '20px', borderLeft: '4px solid var(--secondary)', background: 'rgba(255, 23, 68, 0.02)'}}>
                  <h3 style={{fontSize: '14px', color: 'var(--secondary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <AlertCircle size={18} /> IDENTIFIED GAPS
                  </h3>
                  <ul style={{fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.8', listStyle: 'none', padding: 0}}>
                    {(() => {
                      try {
                        const wData = result.weaknesses;
                        const weaknesses = typeof wData === 'string' ? JSON.parse(wData) : wData;
                        return Array.isArray(weaknesses) && weaknesses.length > 0 ? 
                          weaknesses.map((s, i) => <li key={i} style={{marginBottom: '8px'}}>• {s}</li>) : 
                          <li>No anomalies found.</li>;
                      } catch (e) { return null; }
                    })()}
                  </ul>
                </div>
              </div>
              
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px'}}>
                <div className="glass-card" style={{padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <h3 style={{fontSize: '14px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Briefcase size={18} /> TARGET ROLES
                  </h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {(() => {
                      try {
                        const oData = result.opportunitiesJson || result.opportunities;
                        const opps = typeof oData === 'string' ? JSON.parse(oData) : oData;
                        return Array.isArray(opps) && opps.length > 0 ? opps.slice(0, 2).map((o, i) => (
                          <div key={i} style={{padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '8px'}}>
                            <div style={{fontWeight: 'bold', fontSize: '13px'}}>{o.title}</div>
                            <div style={{fontSize: '11px', opacity: 0.6}}>{o.desc}</div>
                          </div>
                        )) : <div style={{fontSize: '11px', opacity: 0.5}}>Scanning market nodes...</div>;
                      } catch (e) { return null; }
                    })()}
                  </div>
                </div>

                <div className="glass-card" style={{padding: '20px', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <h3 style={{fontSize: '14px', color: '#fff', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                    <Zap size={18} /> SKILL RESOURCES
                  </h3>
                  <div style={{display: 'flex', flexDirection: 'column', gap: '12px'}}>
                    {(() => {
                      try {
                        const rData = result.resourcesJson || result.resources;
                        const resources = typeof rData === 'string' ? JSON.parse(rData) : rData;
                        return Array.isArray(resources) && resources.length > 0 ? resources.slice(0, 2).map((r, i) => (
                          <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" 
                             style={{padding: '12px', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '8px', display: 'block', textDecoration: 'none'}}>
                            <div style={{fontWeight: 'bold', fontSize: '13px', color: 'var(--primary)'}}>{r.name}</div>
                            <div style={{fontSize: '10px', opacity: 0.6}}>UPGRADE NODE →</div>
                          </a>
                        )) : <div style={{fontSize: '11px', opacity: 0.5}}>Curating pathways...</div>;
                      } catch (e) { return null; }
                    })()}
                  </div>
                </div>
              </div>

              <div style={{marginTop: '40px', display: 'flex', gap: '16px'}}>
                <button 
                  className="btn-primary" 
                  style={{flex: 1, padding: '18px', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', letterSpacing: '1px'}}
                  onClick={() => navigate('/yourresumefit', { state: { analysisData: result } })}
                >
                  <Zap size={20} fill="currentColor" />
                  DECODE STRATEGY
                </button>
                <button 
                  className="btn-primary" 
                  style={{flex: 1, padding: '18px', fontWeight: 'bold', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', letterSpacing: '1px', background: 'var(--secondary)', borderColor: 'var(--secondary)'}}
                  onClick={() => navigate('/mapped-jobs', { state: { analysisData: result } })}
                >
                  <Globe size={20} />
                  MARKET MATCH
                </button>
                <button 
                  className="btn-secondary" 
                  style={{flex: 1, padding: '18px', fontWeight: 'bold', fontSize: '15px', letterSpacing: '1px'}}
                  onClick={() => window.print()}
                >
                  DOWNLOAD DOSSIER
                </button>
              </div>
              <p style={{marginTop: '20px', fontSize: '11px', textAlign: 'center', opacity: 0.4, letterSpacing: '1px'}}>Neural engine processing complete. Intelligence dossier ready for export.</p>
            </div>
          ) : (
            <div className="empty-state" style={{textAlign: 'center', padding: '60px'}}>
              <Activity size={64} style={{opacity: 0.2, marginBottom: '24px'}} />
              <h3>Awaiting Input</h3>
              <p className="text-muted">Upload a profile to begin neural analysis.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
