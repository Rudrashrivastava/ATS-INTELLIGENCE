import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Activity, Briefcase, Globe, 
  MapPin, Rocket, ShieldCheck, Zap, Target,
  Download, ExternalLink, BookOpen
} from 'lucide-react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CareerDetail() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const trajectory = state?.trajectory;
  
  const [steps, setSteps] = useState([]);
  const [alignmentRoadmap, setAlignmentRoadmap] = useState([]);
  const [resources, setResources] = useState([]);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (trajectory) {
      try {
        const parsedSteps = trajectory.trajectoryJson ? JSON.parse(trajectory.trajectoryJson) : [];
        const parsedOpps = trajectory.opportunitiesJson ? JSON.parse(trajectory.opportunitiesJson) : [];
        const parsedResources = trajectory.resourcesJson ? JSON.parse(trajectory.resourcesJson) : [];
        
        setSteps(parsedSteps);
        setAlignmentRoadmap(parsedOpps);
        setResources(parsedResources);
      } catch (e) {
        console.error("Neural Decoding Failed", e);
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

  if (!trajectory) return <div className="p-10">Initializing neural data...</div>;

  return (
    <div className="career-detail-container animate-fade-in custom-scroll">
      
      <div style={{marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '24px'}}>
          <button onClick={() => navigate('/')} className="glass-card hover-lift" style={{padding: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)'}}>
            <ArrowLeft size={20} color="#00E5FF" />
          </button>
          <div>
            <h1 style={{fontSize: '32px', color: '#fff', fontWeight: 'bold'}}>{trajectory.primaryRole || 'Career Node'}</h1>
            <p style={{color: 'var(--text-muted)', fontSize: '14px', letterSpacing: '2px'}}>AI STRATEGIST DOSSIER</p>
          </div>
        </div>
        
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="btn-glow" 
          style={{padding: '14px 28px', display: 'flex', alignItems: 'center', gap: '12px', borderRadius: '12px'}}
        >
          {downloading ? 'GENERATING...' : <><Download size={18} /> DOWNLOAD 4-PAGE PREP GUIDE</>}
        </button>
      </div>

      <div className="detail-grid" style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '32px'}}>
        
        {/* LARGE HEIGHT JOB ALIGNMENT ROADMAP */}
        <div className="glass-card" style={{padding: '40px', background: 'rgba(255,255,255,0.01)', borderLeft: '4px solid #00E5FF', minHeight: '800px'}}>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
            <Target size={24} color="#00E5FF" />
            <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Job Alignment Roadmap</h2>
          </div>
          
          <div style={{display: 'flex', flexDirection: 'column', gap: '24px'}}>
            {alignmentRoadmap.length > 0 ? alignmentRoadmap.map((item, i) => (
              <div key={i} className="roadmap-node glass-card" style={{padding: '28px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px'}}>
                   <div style={{width: '10px', height: '10px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF'}}></div>
                   <h3 style={{fontSize: '18px', color: '#fff', fontWeight: 'bold'}}>{item.title}</h3>
                </div>
                <p style={{fontSize: '15px', color: 'var(--text-muted)', lineHeight: '1.8'}}>{item.desc}</p>
              </div>
            )) : (
              <div style={{padding: '40px', textAlign: 'center', opacity: 0.5}}>
                <ShieldCheck size={48} style={{marginBottom: '16px'}} color="#00E5FF" />
                <p>Decoding alignment strategy...</p>
              </div>
            )}
          </div>

          <div style={{marginTop: '40px', padding: '32px', background: 'rgba(0, 229, 255, 0.05)', borderRadius: '16px', border: '1px solid rgba(0, 229, 255, 0.2)'}}>
              <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px'}}>
                 <Zap size={20} color="#00E5FF" />
                 <span style={{fontSize: '12px', fontWeight: 'bold', color: '#00E5FF', letterSpacing: '2px'}}>NEURAL STRATEGY OVERVIEW</span>
              </div>
              <p style={{fontSize: '15px', color: '#fff', lineHeight: '1.8', fontWeight: '400'}}>
                {trajectory.recommendation?.replace(/\*\*/g, '')}
              </p>
          </div>

          {/* CLICKABLE RESOURCES SECTION */}
          <div style={{marginTop: '40px'}}>
             <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px'}}>
                <BookOpen size={20} color="#00E5FF" />
                <h3 style={{fontSize: '18px', fontWeight: 'bold'}}>Study Resources & References</h3>
             </div>
             <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px'}}>
                {resources.length > 0 ? resources.map((res, i) => (
                  <a key={i} href={res.url} target="_blank" rel="noreferrer" className="glass-card hover-lift" style={{padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.03)', textDecoration: 'none', color: '#fff', border: '1px solid rgba(255,255,255,0.05)'}}>
                     <span style={{fontSize: '14px', fontWeight: '600'}}>{res.name}</span>
                     <ExternalLink size={16} color="#00E5FF" />
                  </a>
                )) : <p style={{color: 'var(--text-muted)', fontSize: '13px'}}>Analyzing study links...</p>}
             </div>
          </div>
        </div>

        {/* EVOLUTION STRATEGY (MISTRAL OUTPUT) */}
        <div className="glass-card" style={{padding: '40px', background: 'rgba(255,255,255,0.01)'}}>
           <div style={{display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px'}}>
              <Rocket size={24} color="#FFD600" />
              <h2 style={{fontSize: '24px', fontWeight: 'bold'}}>Evolution Strategy</h2>
           </div>

           <div className="trajectory-stepper">
              {steps.length > 0 ? steps.map((step, i) => (
                <div key={i} style={{display: 'flex', gap: '24px', marginBottom: '32px', position: 'relative'}}>
                   {i < steps.length - 1 && <div style={{position: 'absolute', top: '40px', left: '19px', bottom: '-16px', width: '2px', background: 'linear-gradient(to bottom, #00E5FF, transparent)'}}></div>}
                   <div style={{width: '40px', height: '40px', borderRadius: '50%', border: '1px solid #00E5FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 'bold', color: '#00E5FF', flexShrink: 0, background: 'rgba(0,229,255,0.05)'}}>
                      {i + 1}
                   </div>
                   <div className="glass-card" style={{padding: '24px', flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)'}}>
                      <p style={{fontSize: '15px', lineHeight: '1.6', color: '#fff'}}>{step}</p>
                   </div>
                </div>
              )) : (
                <div style={{padding: '40px', textAlign: 'center', opacity: 0.5}}>
                  <Activity size={32} className="spinning" style={{marginBottom: '16px'}} color="#00E5FF" />
                  <p>AI Strategist is mapping your roadmap...</p>
                </div>
              )}
           </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .career-detail-container { padding: 40px; min-height: 100vh; background: #0a0a12; color: #fff; margin-top: 70px; }
        .roadmap-node:hover { border-color: #00E5FF; transform: translateX(10px); }
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #00E5FF; border-radius: 10px; }
      `}} />
    </div>
  );
}
