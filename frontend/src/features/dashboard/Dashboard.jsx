import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  Activity, Cpu, Database, Globe, ArrowRight, 
  TrendingDown, TrendingUp, MessageSquare, X, Zap, Mail, FileText, Sparkles, ShieldCheck
} from 'lucide-react';
import ChatInterface from './ChatInterface';
import { useAuth } from '../auth/hooks/useAuth';

export default function Dashboard() {
  const { user: authUser } = useAuth();
  const navigate = useNavigate();

  const cachedDashboard = (() => {
    try {
      const raw = sessionStorage.getItem('dashboard_cache');
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  })();

  const [history, setHistory] = useState(cachedDashboard?.history || []);
  const [globalEcosystem, setGlobalEcosystem] = useState(cachedDashboard?.globalEcosystem || []);
  const [userName, setUserName] = useState(authUser?.name || authUser?.email?.split('@')[0] || 'User');
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const [stats, setStats] = useState(cachedDashboard?.stats || {
    avgMatch: 0,
    personalScans: 0,
    totalProcessed: 0,
    reach: 0,
    trend: 0
  });
  
  const [loading, setLoading] = useState(!cachedDashboard);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      if (authUser?.name) setUserName(authUser.name);

      Promise.all([
        axios.get('/api/user/me', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/all-history', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/global-ecosystem', { headers: { Authorization: `Bearer ${token}` } }),
        axios.get('/api/resume/global-stats', { headers: { Authorization: `Bearer ${token}` } })
      ]).then(([userRes, historyRes, ecosystemRes, statsRes]) => {
        const fetchedName = userRes.data?.name || authUser?.name || 'User';
        const fetchedHistory = historyRes.data || [];
        const fetchedEcosystem = ecosystemRes.data || [];
        const gStats = statsRes.data;

        setUserName(fetchedName);
        setHistory(fetchedHistory);
        setGlobalEcosystem(fetchedEcosystem);
        
        let calculatedTrend = 0;
        if (fetchedHistory.length >= 2) {
          const latest = fetchedHistory[0].overallScore;
          const previous = fetchedHistory[1].overallScore;
          calculatedTrend = previous !== 0 ? Number(((latest - previous) / previous * 100).toFixed(1)) : 0;
        }

        const newStats = {
          avgMatch: gStats.avgMatch || 0,
          personalScans: fetchedHistory.length,
          totalProcessed: gStats.totalProcessed || 0,
          reach: 60 + (gStats.totalProcessed * 2),
          trend: calculatedTrend
        };

        setStats(newStats);
        setLoading(false);

        try {
          sessionStorage.setItem('dashboard_cache', JSON.stringify({
            history: fetchedHistory,
            globalEcosystem: fetchedEcosystem,
            stats: newStats
          }));
        } catch (e) {
          console.warn("Failed to update dashboard cache", e);
        }
      }).catch(err => {
        console.error("Neural Data Pipeline Interrupted", err);
        setLoading(false);
      });
    };
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (authUser) {
      setUserName(authUser.name || authUser.email?.split('@')[0] || 'User');
    }
  }, [authUser]);

  const getTimeAgo = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours}h ago`;
    }
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="compact-dashboard animate-fade-in custom-scroll">
      
      {/* ANIMATED TOP CYBER HEADER BAR */}
      <div className="cyber-header glass-card">
        <div className="header-info">
          <div className="live-status-pill">
            <span className="pulse-dot"></span>
            <span className="status-text">NEURAL NETWORK ACTIVE</span>
          </div>
          <h1 className="header-title">
            Welcome, <span className="neon-name">{userName}</span>
          </h1>
          <p className="header-sub">Real-time resume analytics, ecosystem candidates, and AI trajectories.</p>
        </div>

        <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button 
            onClick={() => navigate('/mapped-jobs')}
            className="btn-glow flex-center"
            style={{ padding: '12px 20px', borderRadius: '10px', gap: '8px', fontSize: '12px', fontWeight: 'bold', background: 'rgba(139, 92, 246, 0.2)', border: '1px solid #8B5CF6', color: '#fff' }}
          >
            <Building size={16} color="#8B5CF6" /> EXPLORE 30+ JOBS
          </button>

          <button 
            onClick={() => navigate('/analyzer')}
            className="btn-glow flex-center"
            style={{ padding: '12px 24px', borderRadius: '10px', gap: '8px', fontSize: '12px', fontWeight: 'bold' }}
          >
            <Zap size={16} /> NEW ATS SCAN
          </button>
        </div>
      </div>

      {/* COMPACT 4-CARD KPI METRICS GRID */}
      <div className="kpi-grid">
        
        {/* CARD 1: AVG MATCH */}
        <div className="kpi-card glass-card hover-glow">
          <div className="kpi-top">
            <span className="kpi-label">AVG MATCH ACCURACY</span>
            <div className="kpi-icon-box cyan">
              <Activity size={18} color="#00E5FF" />
            </div>
          </div>
          <div className="kpi-body">
            <span className="kpi-value cyan-text">
              {loading ? "---" : `${stats.avgMatch}%`}
            </span>
            {stats.trend !== 0 && (
              <span className={`trend-pill ${stats.trend >= 0 ? 'positive' : 'negative'}`}>
                {stats.trend >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {stats.trend > 0 ? `+${stats.trend}` : stats.trend}%
              </span>
            )}
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill cyan-bg" style={{ width: `${stats.avgMatch}%` }}></div>
          </div>
        </div>

        {/* CARD 2: PERSONAL SCANS */}
        <div className="kpi-card glass-card hover-glow">
          <div className="kpi-top">
            <span className="kpi-label">PERSONAL NODES</span>
            <div className="kpi-icon-box magenta">
              <Cpu size={18} color="#E040FB" />
            </div>
          </div>
          <div className="kpi-body">
            <span className="kpi-value magenta-text">
              {loading ? "--" : stats.personalScans}
            </span>
            <span className="kpi-subtext">Uploaded Trajectories</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill magenta-bg" style={{ width: `${Math.min(stats.personalScans * 10, 100)}%` }}></div>
          </div>
        </div>

        {/* CARD 3: TOTAL PROCESSED */}
        <div className="kpi-card glass-card hover-glow">
          <div className="kpi-top">
            <span className="kpi-label">GLOBAL PROCESSED</span>
            <div className="kpi-icon-box purple">
              <Database size={18} color="#7C4DFF" />
            </div>
          </div>
          <div className="kpi-body">
            <span className="kpi-value purple-text">
              {loading ? "--" : stats.totalProcessed}
            </span>
            <span className="kpi-subtext">Total Resumes Scanned</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill purple-bg" style={{ width: `${Math.min(stats.totalProcessed * 2, 100)}%` }}></div>
          </div>
        </div>

        {/* CARD 4: NETWORK REACH */}
        <div className="kpi-card glass-card hover-glow">
          <div className="kpi-top">
            <span className="kpi-label">NETWORK REACH</span>
            <div className="kpi-icon-box gold">
              <Globe size={18} color="#FFD600" className="spin-slow" />
            </div>
          </div>
          <div className="kpi-body">
            <span className="kpi-value gold-text">
              {loading ? "--" : stats.reach}
            </span>
            <span className="kpi-subtext">Connected Recruiter Nodes</span>
          </div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill gold-bg" style={{ width: '85%' }}></div>
          </div>
        </div>
      </div>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="dashboard-content-grid">
        
        {/* LEFT COLUMN: PAST TRAJECTORIES */}
        <div className="main-section glass-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Past Trajectories</h2>
              <span className="section-subtitle">YOUR RECENT RESUME SCANS & MATCH DOSSIERS</span>
            </div>
            <button 
              onClick={() => navigate('/past-trajectories')} 
              className="view-all-link"
            >
              View All Archive <ArrowRight size={14} />
            </button>
          </div>

          <div className="trajectories-compact-grid">
            {history.length > 0 ? history.map((item) => (
              <div 
                key={item.id} 
                className="compact-trajectory-card glass-card hover-lift"
              >
                <div className="card-header-row">
                  <div className="role-icon">
                    <Activity size={18} color="#00E5FF" />
                  </div>
                  <span className={`score-badge ${item.overallScore >= 80 ? 'optimized' : 'tweak'}`}>
                    {item.overallScore}% MATCH
                  </span>
                </div>

                <h3 className="role-title">{item.primaryRole || 'Neural Analysis'}</h3>
                <div className="scan-date">Scanned: {new Date(item.analysisDate).toLocaleDateString()}</div>

                <div className="card-actions-row">
                  <button 
                    onClick={() => navigate('/details', { state: { trajectory: item } })}
                    className="action-btn view-btn"
                  >
                    <FileText size={12} /> DOSSIER
                  </button>
                  <button 
                    onClick={() => navigate('/contact-candidate', { state: { candidate: item.user || { name: userName }, role: item.primaryRole, score: item.overallScore, trajectoryId: item.id } })}
                    className="action-btn contact-btn"
                  >
                    <Mail size={12} /> CONTACT
                  </button>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <Database size={40} color="var(--primary)" />
                <p>No neural records found. Start a new scan to populate trajectories.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: GLOBAL ECOSYSTEM */}
        <div className="sidebar-section glass-card">
          <div className="section-header">
            <div>
              <h2 className="section-title">Global Ecosystem</h2>
              <span className="section-subtitle">CANDIDATE FEED & HR OUTREACH</span>
            </div>
            <button 
              onClick={() => navigate('/usersuse')} 
              className="view-all-link"
            >
              View Feed
            </button>
          </div>

          <div className="ecosystem-compact-list custom-scroll">
            {globalEcosystem.length > 0 ? globalEcosystem.map((node, i) => (
              <div key={i} className="ecosystem-compact-item glass-card hover-lift">
                <div className="node-avatar">
                  {(node.user?.name || userName).charAt(0).toUpperCase()}
                </div>

                <div className="node-info">
                  <div className="node-name">{node.user?.name || userName}</div>
                  <div className="node-role">{node.primaryRole || 'Career Strategist'}</div>
                  <div className="node-time">{getTimeAgo(node.analysisDate)}</div>
                </div>

                <div className="node-actions">
                  <div className="node-score">{node.overallScore || 0}%</div>
                  <div className="btn-group-row">
                    <button 
                      onClick={() => navigate('/contact-candidate', { state: { candidate: node.user || { name: node.user?.name || 'Candidate' }, role: node.primaryRole, score: node.overallScore, trajectoryId: node.id } })}
                      className="mini-action-btn contact-mini"
                      title="Contact Candidate"
                    >
                      <Mail size={11} /> CONTACT
                    </button>
                    <button 
                      onClick={() => navigate('/details', { state: { trajectory: node } })}
                      className="mini-action-btn view-mini"
                      title="View Candidate CV"
                    >
                      <FileText size={11} /> CV
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className="empty-state">
                <Globe size={40} color="var(--primary)" />
                <p>Syncing global talent nodes...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* FLOATING AI ASSISTANT FAB */}
      <div 
        onClick={() => setIsChatOpen(!isChatOpen)} 
        className="ai-fab pulse-glow" 
      >
        {isChatOpen ? <X color="#000" size={24} /> : <MessageSquare color="#000" size={24} />}
      </div>
      
      {isChatOpen && <ChatInterface token={localStorage.getItem('token')} onClose={() => setIsChatOpen(false)} />}

      {/* COMPACT & SLEEK DASHBOARD STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        .compact-dashboard {
          padding: 24px 32px;
          min-height: 100vh;
          background: #08090e;
          color: #fff;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        /* CYBER HEADER */
        .cyber-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 28px;
          border-left: 3px solid var(--primary);
          background: rgba(15, 17, 26, 0.7);
        }
        .live-status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          padding: 3px 10px;
          border-radius: 20px;
          font-size: 10px;
          font-weight: bold;
          color: var(--primary);
          letter-spacing: 1px;
          margin-bottom: 8px;
        }
        .pulse-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary);
          animation: pulseGlow 1.5s infinite;
        }
        .header-title {
          font-size: 22px;
          font-weight: bold;
          margin: 0;
          color: #fff;
        }
        .neon-name {
          color: var(--primary);
          text-shadow: 0 0 10px rgba(0, 229, 255, 0.4);
        }
        .header-sub {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 4px;
        }

        /* KPI METRICS GRID */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .kpi-card {
          padding: 16px 20px;
          background: rgba(15, 17, 26, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s ease, border-color 0.2s ease;
        }
        .kpi-card:hover {
          transform: translateY(-3px);
          border-color: rgba(0, 229, 255, 0.3);
        }
        .kpi-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .kpi-label {
          font-size: 10px;
          font-weight: bold;
          letter-spacing: 1px;
          color: var(--text-muted);
        }
        .kpi-icon-box {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .kpi-icon-box.cyan { background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.2); }
        .kpi-icon-box.magenta { background: rgba(224, 64, 251, 0.1); border: 1px solid rgba(224, 64, 251, 0.2); }
        .kpi-icon-box.purple { background: rgba(124, 77, 255, 0.1); border: 1px solid rgba(124, 77, 255, 0.2); }
        .kpi-icon-box.gold { background: rgba(255, 214, 0, 0.1); border: 1px solid rgba(255, 214, 0, 0.2); }

        .kpi-body {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }
        .kpi-value {
          font-size: 28px;
          font-weight: bold;
          line-height: 1;
        }
        .cyan-text { color: #00E5FF; }
        .magenta-text { color: #E040FB; }
        .purple-text { color: #B388FF; }
        .gold-text { color: #FFD600; }
        .kpi-subtext { font-size: 11px; color: var(--text-muted); }

        .trend-pill {
          font-size: 11px;
          font-weight: bold;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .trend-pill.positive { background: rgba(0, 230, 118, 0.1); color: #00E676; }
        .trend-pill.negative { background: rgba(255, 23, 68, 0.1); color: #ff1744; }

        .progress-bar-bg {
          width: 100%;
          height: 3px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 2px;
          overflow: hidden;
        }
        .progress-bar-fill { height: 100%; transition: width 0.8s ease; }
        .cyan-bg { background: #00E5FF; box-shadow: 0 0 6px #00E5FF; }
        .magenta-bg { background: #E040FB; box-shadow: 0 0 6px #E040FB; }
        .purple-bg { background: #7C4DFF; box-shadow: 0 0 6px #7C4DFF; }
        .gold-bg { background: #FFD600; box-shadow: 0 0 6px #FFD600; }

        /* CONTENT GRID */
        .dashboard-content-grid {
          display: grid;
          grid-template-columns: 1.4fr 0.6fr;
          gap: 20px;
        }
        .main-section, .sidebar-section {
          padding: 24px;
          background: rgba(15, 17, 26, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding-bottom: 12px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          margin: 0;
          color: #fff;
        }
        .section-subtitle {
          font-size: 10px;
          color: var(--text-muted);
          letter-spacing: 1px;
        }
        .view-all-link {
          background: none;
          border: none;
          color: var(--primary);
          font-size: 11px;
          font-weight: bold;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        /* COMPACT TRAJECTORIES GRID */
        .trajectories-compact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
          max-height: 480px;
          overflow-y: auto;
        }
        .compact-trajectory-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: all 0.2s ease;
        }
        .compact-trajectory-card:hover {
          border-color: var(--primary);
          background: rgba(0, 229, 255, 0.03);
          transform: translateY(-2px);
        }
        .card-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .role-icon {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          background: rgba(0, 229, 255, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .score-badge {
          font-size: 10px;
          font-weight: bold;
          padding: 3px 8px;
          border-radius: 4px;
        }
        .score-badge.optimized { background: rgba(0, 230, 118, 0.1); color: #00E676; border: 1px solid rgba(0, 230, 118, 0.3); }
        .score-badge.tweak { background: rgba(0, 229, 255, 0.1); color: #00E5FF; border: 1px solid rgba(0, 229, 255, 0.3); }
        .role-title {
          font-size: 14px;
          font-weight: bold;
          color: #fff;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .scan-date { font-size: 11px; color: var(--text-muted); }
        
        .card-actions-row {
          display: flex;
          gap: 8px;
          margin-top: 4px;
        }
        .action-btn {
          flex: 1;
          padding: 6px 8px;
          font-size: 10px;
          font-weight: bold;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          transition: 0.2s;
        }
        .view-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: #fff;
        }
        .contact-btn {
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          color: #00E5FF;
        }
        .action-btn:hover { opacity: 0.85; transform: scale(1.02); }

        /* COMPACT ECOSYSTEM LIST */
        .ecosystem-compact-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 480px;
          overflow-y: auto;
        }
        .ecosystem-compact-item {
          padding: 12px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          transition: all 0.2s ease;
        }
        .ecosystem-compact-item:hover {
          border-color: rgba(0, 229, 255, 0.2);
          background: rgba(255, 255, 255, 0.04);
        }
        .node-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(0, 229, 255, 0.1);
          border: 1px solid rgba(0, 229, 255, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: #00E5FF;
          font-size: 14px;
          flex-shrink: 0;
        }
        .node-info { flex: 1; min-width: 0; }
        .node-name { font-size: 13px; font-weight: bold; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .node-role { font-size: 11px; color: var(--primary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .node-time { font-size: 10px; color: var(--text-muted); }
        .node-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
        .node-score { font-size: 12px; font-weight: bold; color: #00E676; }
        .btn-group-row { display: flex; gap: 4px; }
        .mini-action-btn {
          padding: 4px 8px;
          font-size: 9px;
          font-weight: bold;
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 3px;
          border: none;
        }
        .contact-mini { background: rgba(0, 229, 255, 0.12); color: #00E5FF; border: 1px solid rgba(0, 229, 255, 0.3); }
        .view-mini { background: rgba(255, 255, 255, 0.08); color: #fff; border: 1px solid rgba(255, 255, 255, 0.15); }
        .mini-action-btn:hover { filter: brightness(1.2); }

        .empty-state {
          padding: 40px 20px;
          text-align: center;
          opacity: 0.5;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-size: 12px;
        }

        /* FAB */
        .ai-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 1100;
          box-shadow: 0 0 20px rgba(0, 229, 255, 0.5);
        }
        .pulse-glow { animation: pulseGlow 2s infinite; }
        .spin-slow { animation: spin 10s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(0, 229, 255, 0); } 100% { box-shadow: 0 0 0 0 rgba(0, 229, 255, 0); } }

        @media (max-width: 1024px) {
          .kpi-grid { grid-template-columns: repeat(2, 1fr); }
          .dashboard-content-grid { grid-template-columns: 1fr; }
        }
      `}} />
    </div>
  );
}
