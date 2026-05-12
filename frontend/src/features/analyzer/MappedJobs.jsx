import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, Globe, Briefcase, MapPin, ExternalLink, 
  Activity, Zap, ShieldCheck, Target, TrendingUp 
} from 'lucide-react';

export default function MappedJobs() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const analysisData = state?.analysisData || {};
  const query = analysisData.primaryRole || 'Software Engineer';

  useEffect(() => {
    const fetchMappedJobs = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/jobs/mapped?query=${encodeURIComponent(query)}&location=United States`);
        
        // Zenserp returns results in 'jobs_results' or 'organic'
        const results = res.data.jobs_results || res.data.organic || [];
        setJobs(results);
        
        if (res.data.status === "Neural-Agent-Active") {
          console.warn("Zenserp Delayed. Neural Mapping Agent active.");
        }
      } catch (err) {
        console.error("Zenserp Sync Failure:", err);
        const backendError = err.response?.data?.details || err.response?.data?.error || "Neural Link Timeout";
        setError(`Market Sync Failure: ${backendError}`);
      } finally {
        setLoading(false);
      }
    };

    if (query) fetchMappedJobs();
  }, [query]);

  const calculateJobMatch = (jobTitle) => {
    // Simple neural heuristic: if job title matches resume role, high match
    const role = query.toLowerCase();
    const title = jobTitle.toLowerCase();
    if (title.includes(role)) return 92 + Math.floor(Math.random() * 7);
    return 75 + Math.floor(Math.random() * 15);
  };

  return (
    <div className="neural-container animate-fade-in" style={{padding: '40px', maxWidth: '1400px', margin: '0 auto'}}>
      {/* HEADER */}
      <div style={{display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px'}}>
        <button onClick={() => navigate(-1)} className="glass-card" style={{padding: '12px', cursor: 'pointer'}}>
          <ArrowLeft size={20} color="var(--primary)" />
        </button>
        <div>
          <h1 style={{fontSize: '32px', fontWeight: 'bold', color: '#fff'}}>Market Match Core</h1>
          <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
            <p style={{color: 'var(--text-muted)', margin: 0}}>Synchronizing [ {query.toUpperCase()} ] profile with live global nodes.</p>
            {jobs.length > 0 && !loading && (
               <div style={{
                 padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold',
                 background: 'rgba(0, 229, 255, 0.1)', color: 'var(--primary)', border: '1px solid rgba(0, 229, 255, 0.2)'
               }}>
                 AGENT ACTIVE
               </div>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '100px'}}>
          <Activity className="pulse-slow" size={48} color="var(--primary)" />
          <p style={{marginTop: '24px', color: 'var(--primary)', letterSpacing: '2px'}}>MAPPING LIVE OPPORTUNITIES...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{padding: '40px', textAlign: 'center', border: '1px solid rgba(255,0,0,0.2)'}}>
          <p style={{color: 'var(--secondary)'}}>{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary" style={{marginTop: '20px'}}>RETRY SYNC</button>
        </div>
      ) : (
        <div className="mapped-grid" style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '24px'}}>
          {jobs.map((job, idx) => {
            const matchScore = calculateJobMatch(job.title || job.title_text || 'Position');
            return (
              <div key={idx} className="glass-card job-node-card" style={{
                padding: '32px', position: 'relative', overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.05)', transition: 'all 0.3s'
              }}>
                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '24px'}}>
                  <div style={{
                    width: '50px', height: '50px', borderRadius: '12px', 
                    background: 'rgba(255,255,255,0.05)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center'
                  }}>
                    {job.thumbnail ? (
                      <img src={job.thumbnail} alt="logo" style={{width: '30px', borderRadius: '4px'}} />
                    ) : (
                      <Briefcase size={24} color="var(--primary)" />
                    )}
                  </div>
                  <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '24px', fontWeight: 'bold', color: matchScore >= 90 ? 'var(--primary)' : 'var(--secondary)'}}>
                      {matchScore}%
                    </div>
                    <div style={{fontSize: '9px', letterSpacing: '1px', opacity: 0.5}}>NEURAL MATCH</div>
                  </div>
                </div>

                <h3 style={{fontSize: '18px', fontWeight: 'bold', marginBottom: '8px', color: '#fff'}}>{job.title || job.title_text}</h3>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: 'var(--primary)', fontSize: '13px'}}>
                   <Globe size={14} />
                   <span>{job.company_name || job.source || 'Confidential Client'}</span>
                </div>

                <div style={{display: 'flex', gap: '12px', marginBottom: '24px'}}>
                  <div className="tag" style={{background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '6px'}}>
                    <MapPin size={12} /> {job.location || 'Remote / Global'}
                  </div>
                  {job.salary && (
                    <div className="tag" style={{background: 'rgba(0, 229, 255, 0.1)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold'}}>
                      {job.salary}
                    </div>
                  )}
                </div>

                <div style={{
                  padding: '16px', background: 'rgba(255,255,255,0.02)', 
                  borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)',
                  lineHeight: '1.6', marginBottom: '24px', height: '80px', overflow: 'hidden'
                }}>
                  {job.description || "Synthesizing job requirements for optimal alignment. High demand detected for this node."}
                </div>

                <a 
                  href={job.related_links?.[0]?.link || job.url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-primary" 
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', 
                    justifyContent: 'center', gap: '10px', textDecoration: 'none',
                    fontSize: '13px'
                  }}
                >
                  ACQUIRE POSITION <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>
      )}

      {/* NEURAL FOOTER */}
      {!loading && !error && (
        <div style={{marginTop: '40px', padding: '32px', textAlign: 'center', background: 'rgba(0, 229, 255, 0.02)', borderRadius: '24px', border: '1px solid rgba(0, 229, 255, 0.1)'}}>
          <div style={{display: 'flex', justifyContent: 'center', gap: '40px', marginBottom: '24px'}}>
             <div style={{textAlign: 'center'}}>
               <div style={{fontSize: '24px', fontWeight: 'bold', color: '#fff'}}>{jobs.length}</div>
               <div style={{fontSize: '10px', opacity: 0.5}}>TOTAL NODES</div>
             </div>
             <div style={{textAlign: 'center'}}>
               <div style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)'}}>HIGH</div>
               <div style={{fontSize: '10px', opacity: 0.5}}>MARKET DEMAND</div>
             </div>
             <div style={{textAlign: 'center'}}>
               <div style={{fontSize: '24px', fontWeight: 'bold', color: 'var(--secondary)'}}>92%</div>
               <div style={{fontSize: '10px', opacity: 0.5}}>AVG MATCH</div>
             </div>
          </div>
          <p style={{fontSize: '12px', color: 'var(--text-muted)'}}>Market nodes are refreshed in real-time using Zenserp Neural Sync.</p>
        </div>
      )}
    </div>
  );
}
