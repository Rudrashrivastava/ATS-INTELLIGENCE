import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Briefcase, TrendingUp, Zap, ShieldCheck, 
  ArrowLeft, ArrowRight, Globe, MapPin, Loader2, AlertCircle
} from 'lucide-react';

export default function ResumeFit() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  
  const [analysisData, setAnalysisData] = useState(() => {
    try {
      if (location.state?.analysisData) {
        sessionStorage.setItem('active_trajectory', JSON.stringify(location.state.analysisData));
        return location.state.analysisData;
      }
      const saved = sessionStorage.getItem('active_trajectory');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      console.error("Neural Hydration Failed", e);
      return null;
    }
  });

  const [jobs, setJobs] = useState([]);
  const [roadmap, setRoadmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncAiData = async () => {
      if (!analysisData) {
        setLoading(false);
        return;
      }

      // 1. EXTRACT REAL AI AGENT RESPONSE FROM ANALYSIS DATA
      // Decoding JSON strings stored in the backend
      try {
        let realTrajectory = [];
        let realOpps = [];

        if (analysisData.trajectoryJson) {
          realTrajectory = typeof analysisData.trajectoryJson === 'string' 
            ? JSON.parse(analysisData.trajectoryJson) 
            : analysisData.trajectoryJson;
        } else if (analysisData.trajectory) {
          realTrajectory = analysisData.trajectory;
        }

        if (analysisData.opportunitiesJson) {
          realOpps = typeof analysisData.opportunitiesJson === 'string' 
            ? JSON.parse(analysisData.opportunitiesJson) 
            : analysisData.opportunitiesJson;
        } else if (analysisData.opportunities) {
          realOpps = analysisData.opportunities;
        }

        if (realTrajectory.length > 0 || realOpps.length > 0) {
          setRoadmap(realTrajectory);
          setJobs(realOpps);
          setLoading(false);
          return;
        }
      } catch (e) {
        console.error("Neural Decoding Failed", e);
      }

      // 2. FALLBACK: If data is missing from state, ping history
      try {
        const res = await axios.get('/api/resume/all-history', {
          headers: { Authorization: `Bearer ${token}` }
        });
          const latest = res.data[0];
          if (latest && latest.trajectoryJson) {
            setRoadmap(JSON.parse(latest.trajectoryJson));
            setJobs(JSON.parse(latest.opportunitiesJson));
          }
        } catch (e) {
          console.error("Neural Recovery Failed", e);
        } finally {
          setLoading(false);
        }
    };

    syncAiData();
  }, [analysisData, token]);

  if (loading) return (
    <div className="neural-container flex-center" style={{height: '80vh', background: '#0a0b10', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div style={{textAlign: 'center'}}>
        <Loader2 className="spinning" size={48} color="var(--primary)" />
        <p className="neon-text" style={{marginTop: '20px', letterSpacing: '4px', color: 'var(--primary)', fontSize: '12px'}}>SYNCHRONIZING AI STRATEGY...</p>
      </div>
    </div>
  );

  if (!analysisData) return (
    <div className="neural-container flex-center" style={{height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div className="glass-card" style={{padding: '60px', textAlign: 'center'}}>
        <AlertCircle size={64} color="var(--secondary)" style={{marginBottom: '20px'}} />
        <h2 className="text-glow-secondary">Neural Link Interrupted</h2>
        <p style={{margin: '20px 0'}}>No active analysis found. Please initiate a new scan.</p>
        <Link to="/analyzer" className="btn-primary">GO TO ANALYZER</Link>
      </div>
    </div>
  );

  return (
    <div className="neural-container animate-fade-in" style={{minHeight: '100vh', background: '#0a0b10', padding: '40px'}}>
      
      <div style={{marginBottom: '40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button onClick={() => navigate('/analyzer')} className="glass-card" style={{padding: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)'}}>
            <ArrowLeft size={20} color="var(--primary)" />
          </button>
          <div>
            <h1 className="text-glow-primary" style={{fontSize: '32px'}}>Neural Fit Analysis</h1>
            <p className="text-muted" style={{fontSize: '12px', letterSpacing: '2px'}}>TARGETING: {analysisData.marketSearchQuery?.toUpperCase() || 'TECHNOLOGY ROLES'}</p>
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px'}}>
        
        {/* AGENT-VERIFIED OPPORTUNITIES (REAL AI DATA) */}
        <section className="glass-card" style={{minHeight: '500px', background: 'rgba(255,255,255,0.01)', padding: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
            <Briefcase color="var(--primary)" size={24} />
            <h2 style={{fontSize: '20px', letterSpacing: '1px', fontWeight: 'bold'}}>AGENT-VERIFIED OPPORTUNITIES</h2>
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
            {jobs.length > 0 ? jobs.map((job, i) => (
              <div key={i} className="glass-card hover-lift" style={{
                padding: '24px', 
                borderLeft: '4px solid var(--primary)',
                background: 'rgba(255,255,255,0.02)',
                cursor: 'pointer'
              }} onClick={() => navigate('/details', { state: { trajectory: analysisData } })}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px'}}>
                  <div>
                    <h3 style={{fontSize: '18px', color: '#fff', marginBottom: '4px'}}>{job.title}</h3>
                    <div style={{display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)'}}>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><Globe size={14} /> {job.company}</span>
                      <span style={{display: 'flex', alignItems: 'center', gap: '4px'}}><MapPin size={14} /> {job.location}</span>
                    </div>
                  </div>
                  <span className="badge-neural" style={{background: 'rgba(0, 229, 255, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold'}}>COMPETITIVE</span>
                </div>
                <p style={{fontSize: '13px', color: 'var(--text-muted)', lineHeight: '1.5'}}>{job.desc || 'Optimized for your skill profile.'}</p>
              </div>
            )) : (
              <div style={{padding: '100px 20px', textAlign: 'center', opacity: 0.5}}>
                <ShieldCheck size={48} style={{marginBottom: '16px'}} color="var(--primary)" />
                <p>Decoding market opportunities...</p>
              </div>
            )}
          </div>
        </section>

        {/* GLOBAL CAREER TRAJECTORY (REAL AI DATA) */}
        <section className="glass-card" style={{background: 'rgba(255,255,255,0.01)', padding: '32px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
            <TrendingUp color="var(--secondary)" size={24} />
            <h2 style={{fontSize: '20px', letterSpacing: '1px', fontWeight: 'bold'}}>GLOBAL CAREER TRAJECTORY</h2>
          </div>

          <div className="trajectory-stepper">
            {roadmap.length > 0 ? roadmap.map((step, i) => (
              <div key={i} style={{display: 'flex', gap: '20px', marginBottom: '24px', position: 'relative'}}>
                <div style={{
                  width: '32px', height: '32px', borderRadius: '50%', 
                  background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '14px', fontWeight: 'bold', color: 'var(--primary)', flexShrink: 0
                }}>
                  {i + 1}
                </div>
                <div className="glass-card" style={{padding: '16px', flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'}}>
                  <p style={{fontSize: '13px', color: '#fff', lineHeight: '1.5'}}>{step}</p>
                </div>
                {i < roadmap.length - 1 && (
                  <div style={{
                    position: 'absolute', left: '16px', top: '32px', bottom: '-24px',
                    width: '1px', background: 'linear-gradient(to bottom, var(--primary), transparent)'
                  }} />
                )}
              </div>
            )) : (
              <div style={{padding: '100px 40px', textAlign: 'center', opacity: 0.5}}>
                <Zap size={32} style={{marginBottom: '16px'}} color="var(--primary)" />
                <p style={{fontSize: '12px', letterSpacing: '2px'}}>SYNTHESIZING CAREER NODES...</p>
              </div>
            )}
          </div>
        </section>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .text-glow-primary { color: var(--primary); text-shadow: 0 0 10px var(--primary-glow); }
        .text-glow-secondary { color: var(--secondary); text-shadow: 0 0 10px var(--secondary-glow); }
        .hover-lift:hover { transform: translateY(-5px); border-color: var(--primary); box-shadow: 0 0 30px rgba(0, 229, 255, 0.1); }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .spinning { animation: spin 2s linear infinite; }
      `}} />
    </div>
  );
}
