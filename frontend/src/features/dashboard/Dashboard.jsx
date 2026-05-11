import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, Cpu, Database, Globe, ArrowRight, 
  TrendingDown, TrendingUp, MessageSquare, X, Zap
} from 'lucide-react';
import ChatInterface from './ChatInterface';

export default function Dashboard() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [globalEcosystem, setGlobalEcosystem] = useState([]);
  const [userName, setUserName] = useState('User');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [stats, setStats] = useState({
    avgMatch: 0,
    personalScans: 0,
    totalProcessed: 0,
    reach: 0,
    trend: 0
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      // 2. FETCH INTEGRATED DATA PIPELINES (Personal + Global)
      Promise.all([
        axios.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/all-history', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/global-ecosystem', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/global-stats', { headers: { Authorization: `Bearer ${token}` } })
      ]).then(([userRes, historyRes, ecosystemRes, statsRes]) => {
        setUserName(userRes.data?.name || 'Rudra');
        setHistory(historyRes.data || []);
        setGlobalEcosystem(ecosystemRes.data || []);
        
        const gStats = statsRes.data;
        const pHistory = historyRes.data || [];
        
        setStats(prev => ({
          ...prev,
          avgMatch: gStats.avgMatch || 0,
          personalScans: pHistory.length, // CALCULATION: Depends on User Action
          totalProcessed: gStats.totalProcessed || 0,
          reach: 60 + (gStats.totalProcessed * 2)
        }));
        
        setLoading(false);
      }).catch(err => {
        console.error("Neural Data Pipeline Interrupted", err);
        setLoading(false);
      });
    };
    fetchDashboardData();
  }, []);

  // Trend Calculation (Depends on History state)
  useEffect(() => {
    if (history.length >= 2) {
      const latest = history[0].overallScore;
      const previous = history[1].overallScore;
      const trendValue = previous !== 0 ? ((latest - previous) / previous * 100).toFixed(1) : 0;
      setStats(prev => ({ ...prev, trend: trendValue }));
    }
  }, [history]);

  const getTimeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="dashboard-layout animate-fade-in custom-scroll">
      <div className="dashboard-main-content">
        
        {/* CALCULATIVE ANALYTICS HUB */}
        <div className="analytics-row" style={{display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px', marginBottom: '40px'}}>
          <div className="glass-card analytics-card" style={{padding: '30px', borderLeft: '2px solid var(--primary)', position: 'relative'}}>
             <div className="stat-label" style={{color: 'var(--primary)', fontSize: '11px', letterSpacing: '2px', marginBottom: '8px'}}>GLOBAL ANALYTICS</div>
             <h2 style={{fontSize: '32px', marginBottom: '20px', color: '#fff'}}>Neural Match</h2>
             <div style={{display: 'flex', alignItems: 'flex-end', gap: '15px'}}>
                <div>
                   <div style={{fontSize: '14px', color: 'var(--primary)', opacity: 0.7}}>Avg. Accuracy</div>
                   <div style={{fontSize: '52px', fontWeight: 'bold', lineHeight: '1'}} className={loading ? "pulse-slow" : ""}>
                    {loading ? "---" : `${stats.avgMatch}%`}
                   </div>
                </div>
                {!loading && (
                  <div style={{
                    color: stats.trend >= 0 ? '#00E676' : '#ff1744', 
                    fontSize: '18px', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}>
                    {stats.trend >= 0 ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                    {stats.trend > 0 ? `+${stats.trend}` : stats.trend}%
                  </div>
                )}
             </div>
             <div style={{marginTop: '20px', fontSize: '12px', letterSpacing: '1px'}}>
                <span style={{color: 'var(--text-muted)'}}>Reach: {loading ? "CALIBRATING..." : stats.reach} </span>
                <span style={{color: 'var(--primary)', fontWeight: 'bold'}}>{loading ? "" : (stats.avgMatch >= 80 ? 'OPTIMIZED' : 'ANALYZING')}</span>
             </div>
             <Activity style={{position: 'absolute', right: '30px', bottom: '30px', opacity: 0.3}} size={64} className="pulse-slow" color="var(--primary)" />
          </div>

          <div style={{display: 'flex', flexDirection: 'column', gap: '20px'}}>
             <div className="glass-card" style={{padding: '24px', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                   <div className="stat-label" style={{color: 'var(--secondary)', fontSize: '11px', letterSpacing: '2px'}}>PERSONAL NODES</div>
                   <div style={{fontSize: '48px', fontWeight: 'bold', color: 'var(--secondary)'}} className={loading ? "pulse-slow" : ""}>
                    {loading ? "--" : stats.personalScans}
                   </div>
                </div>
                <Cpu size={32} color="var(--secondary)" />
             </div>
             <div className="glass-card" style={{padding: '24px', flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div>
                   <div className="stat-label" style={{color: 'var(--primary)', fontSize: '11px', letterSpacing: '2px'}}>TOTAL PROCCESSED.</div>
                   <div style={{fontSize: '48px', fontWeight: 'bold'}} className={loading ? "pulse-slow" : ""}>
                    {loading ? "--" : stats.totalProcessed}
                   </div>
                </div>
                <Database size={32} color="var(--text-muted)" />
             </div>
          </div>
        </div>

        {/* FULL PAST TRAJECTORIES (ALL RECORDS) */}
        <div className="past-trajectories">
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px'}}>
             <h2 style={{fontSize: '32px'}}>Past Trajectories</h2>
             <span style={{fontSize: '12px', color: 'var(--text-muted)', letterSpacing: '1.5px'}}>ALL NODES ACTIVE</span>
          </div>
          <div className="trajectories-grid custom-scroll" style={{maxHeight: '600px', overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px', paddingBottom: '40px'}}>
            {history.length > 0 ? history.map((item, i) => (
              <div 
                key={item.id} 
                className="trajectory-card glass-card hover-lift" 
                onClick={() => navigate('/details', { state: { trajectory: item } })}
                style={{padding: '32px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative', cursor: 'pointer', background: 'rgba(255,255,255,0.01)'}}
              >
                 <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '24px'}}>
                    <div style={{width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(0, 229, 255, 0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(0, 229, 255, 0.1)'}}>
                       <Activity size={22} color="var(--primary)" />
                    </div>
                    <div style={{
                      fontSize: '10px', 
                      background: item.overallScore >= 80 ? 'rgba(0, 230, 118, 0.1)' : 'rgba(0, 229, 255, 0.1)', 
                      color: item.overallScore >= 80 ? '#00E676' : 'var(--primary)', 
                      padding: '5px 12px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '1px'
                    }}>
                      {item.overallScore >= 80 ? 'OPTIMIZED' : 'NEEDS TWEAK'}
                    </div>
                 </div>
                 <h3 style={{fontSize: '24px', marginBottom: '12px', color: '#fff', fontWeight: 'bold'}}>{item.primaryRole || 'Neural Analysis'}</h3>
                 <div style={{fontSize: '13px', color: 'var(--text-muted)'}}>Scanned: {new Date(item.analysisDate).toLocaleDateString()}</div>
              </div>
            )) : (
              <div style={{padding: '60px', textAlign: 'center', gridColumn: '1/-1', opacity: 0.5}}>
                <Database size={48} style={{marginBottom: '20px'}} color="var(--primary)" />
                <p>No neural records found. Start a new scan to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT GLOBAL ECOSYSTEM (LAST 5 NODES) */}
      <div className="ecosystem-sidebar glass-card custom-scroll" style={{width: '420px', padding: '0', borderLeft: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden'}}>
         <div style={{padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2 style={{fontSize: '32px', fontWeight: 'bold'}}>Global Ecosystem</h2>
            <span onClick={() => navigate('/usersuse')} style={{color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', fontWeight: 'bold'}}>View All</span>
         </div>

         <div className="ecosystem-list custom-scroll" style={{padding: '0 20px 30px', display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: 'calc(100vh - 150px)', overflowY: 'auto'}}>
            {globalEcosystem.length > 0 ? globalEcosystem.map((node, i) => (
              <div key={i} className="ecosystem-item glass-card" style={{
                padding: '20px', display: 'flex', alignItems: 'center', gap: '16px', 
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px'
              }}>
                 <div style={{
                    width: '50px', height: '50px', borderRadius: '50%', 
                    border: '1px solid rgba(0, 229, 255, 0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '22px', color: 'var(--primary)', fontWeight: 'bold',
                    background: 'rgba(0, 229, 255, 0.05)', flexShrink: 0
                 }}>{(node.user?.name || userName).charAt(0).toUpperCase()}</div>
                 <div style={{flex: 1}}>
                    <div style={{fontSize: '16px', color: '#fff', fontWeight: 'bold'}}>{node.user?.name || userName}</div>
                    <div style={{fontSize: '12px', color: 'var(--primary)', marginBottom: '4px'}}>{node.primaryRole || 'Career Strategist'}</div>
                    <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>{getTimeAgo(node.analysisDate)}</div>
                 </div>
                 <div style={{textAlign: 'right'}}>
                    <div style={{fontSize: '22px', fontWeight: 'bold', color: 'var(--secondary)'}}>{node.overallScore || 0}%</div>
                    <div style={{fontSize: '10px', color: 'var(--text-muted)'}}>MATCH</div>
                 </div>
              </div>
            )) : (
              <div style={{padding: '60px 20px', textAlign: 'center', opacity: 0.5}}>
                <Globe size={48} style={{marginBottom: '20px'}} color="var(--primary)" />
                <p>Syncing global nodes...</p>
              </div>
            )}
         </div>
      </div>

      <div onClick={() => setIsChatOpen(!isChatOpen)} className="ai-fab pulse-glow" style={{ position: 'fixed', bottom: '30px', right: '30px', width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1100, boxShadow: '0 0 20px var(--primary-glow)' }}>
        {isChatOpen ? <X color="#000" /> : <MessageSquare color="#000" />}
      </div>
      {isChatOpen && <ChatInterface token={localStorage.getItem('token')} onClose={() => setIsChatOpen(false)} />}
      <style dangerouslySetInnerHTML={{ __html: `
        .dashboard-layout { display: flex; gap: 40px; padding: 40px; min-height: 100vh; color: #fff; background: #0a0a12; }
        .dashboard-main-content { flex: 1; }
        .ecosystem-sidebar { height: fit-content; max-height: calc(100vh - 80px); overflow-y: auto; position: sticky; top: 40px; }
        .pulse-slow { animation: pulse 4s infinite; }
        .pulse-glow { animation: pulseGlow 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.6; transform: scale(1.1); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); } 70% { box-shadow: 0 0 0 20px rgba(0, 229, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); } }
        .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.01); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: linear-gradient(to bottom, var(--primary), var(--secondary)); border-radius: 10px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: var(--primary); }
      `}} />
    </div>
  );
}
