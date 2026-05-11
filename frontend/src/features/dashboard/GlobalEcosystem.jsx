import { useState, useEffect } from 'react';
import axios from 'axios';
import { ArrowLeft, Globe, Activity, ShieldCheck, Users, Filter, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function GlobalEcosystem() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [personalHistory, setPersonalHistory] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [scoreFilter, setScoreFilter] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [activeTab, setActiveTab] = useState('activity'); // 'activity', 'global', or 'personal'

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [globalRes, personalRes, recentRes] = await Promise.all([
          axios.get('/api/resume/leaderboard', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/resume/all-history', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('/api/resume/global-ecosystem-full', { headers: { Authorization: `Bearer ${token}` } })
        ]);
        setHistory(globalRes.data || []);
        setPersonalHistory(personalRes.data || []);
        setRecentActivity(recentRes.data || []);
        setFilteredHistory(recentRes.data || []); // Default to activity matching full feed
      } catch (err) {
        console.error('Failed to fetch ecosystem data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categories = ['All', 'Java', 'Python', 'React', 'Full-Stack', 'Security', 'Data'];

  useEffect(() => {
    let source = [];
    if (activeTab === 'activity') source = recentActivity;
    else if (activeTab === 'global') source = history;
    else source = personalHistory;
    
    let result = [...source];

    // Filter by Score
    if (scoreFilter > 0) {
      result = result.filter(item => item.overallScore >= scoreFilter);
    }

    // Filter by Category
    if (categoryFilter !== 'All') {
      result = result.filter(item => 
        item.primaryRole && item.primaryRole.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    // Filter by Search
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(item => 
        (item.user?.name || '').toLowerCase().includes(s) || 
        (item.primaryRole || '').toLowerCase().includes(s)
      );
    }

    setFilteredHistory(result);
  }, [search, scoreFilter, categoryFilter, history, personalHistory, activeTab]);

  const getRelativeTime = (date) => {
    if (!date) return 'Just now';
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) {
      const hours = Math.floor(seconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    }
    const days = Math.floor(seconds / 86400);
    return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  };

  return (
    <div className="neural-container animate-fade-in" style={{padding: '40px', maxWidth: '1400px', margin: '0 auto'}}>
      <div style={{marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: '20px'}}>
          <button onClick={() => navigate('/')} className="glass-card" style={{padding: '12px', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'rgba(255,255,255,0.05)'}}>
            <ArrowLeft size={20} color="var(--primary)" />
          </button>
          <div>
            <h1 style={{fontSize: '32px', color: '#fff', fontWeight: 'bold'}}>Global Talent Ecosystem</h1>
            <p style={{color: 'var(--text-muted)', fontSize: '14px'}}>Real-time neural activity across the platform history.</p>
          </div>
        </div>
        
        <div className="glass-card" style={{padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.02)'}}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="Search candidate or role..." 
            style={{border: 'none', background: 'none', width: '250px', color: '#fff', outline: 'none'}}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div style={{display: 'flex', gap: '20px', marginBottom: '24px'}}>
        <button 
          onClick={() => setActiveTab('activity')}
          style={{
            flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'activity' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'activity' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          GLOBAL ACTIVITY
        </button>
        <button 
          onClick={() => setActiveTab('global')}
          style={{
            flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'global' ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'global' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          TOP PERFORMANCE
        </button>
        <button 
          onClick={() => setActiveTab('personal')}
          style={{
            flex: 1, padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)',
            background: activeTab === 'personal' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
            color: activeTab === 'personal' ? '#000' : '#fff', fontWeight: 'bold', cursor: 'pointer', transition: 'all 0.3s'
          }}
        >
          MY TRAJECTORIES
        </button>
      </div>

      <div style={{display: 'flex', gap: '16px', marginBottom: '24px'}}>
        <div className="glass-card" style={{padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flex: 1}}>
          <Filter size={18} color="var(--primary)" />
          <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>THRESHOLD:</span>
          {[0, 50, 70, 80, 90].map(val => (
            <button 
              key={val}
              onClick={() => setScoreFilter(val)}
              style={{
                background: scoreFilter === val ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                color: scoreFilter === val ? '#000' : '#fff',
                border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer', fontWeight: 'bold'
              }}
            >
              {val === 0 ? 'ALL' : `${val}%+`}
            </button>
          ))}
        </div>

        <div className="glass-card" style={{padding: '16px 24px', display: 'flex', alignItems: 'center', gap: '16px', flex: 2}}>
          <Globe size={18} color="var(--secondary)" />
          <span style={{fontSize: '12px', color: 'var(--text-muted)'}}>CATEGORY:</span>
          <div style={{display: 'flex', gap: '8px'}}>
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                style={{
                  background: categoryFilter === cat ? 'var(--secondary)' : 'rgba(255,255,255,0.05)',
                  color: categoryFilter === cat ? '#000' : '#fff',
                  border: 'none', padding: '6px 14px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer'
                }}
              >
                {cat.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <div style={{textAlign: 'center', padding: '100px'}}>
          <Activity className="pulse-slow" size={48} color="var(--primary)" />
          <p style={{marginTop: '24px', color: 'var(--primary)', letterSpacing: '2px'}}>RECONSTRUCTING NEURAL DATA...</p>
        </div>
      ) : (
        <div className="glass-card" style={{padding: 0, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)'}}>
          <div style={{
            display: 'grid', gridTemplateColumns: '80px 2fr 2fr 1fr 1fr', 
            padding: '24px 32px', background: 'rgba(255,255,255,0.03)', 
            borderBottom: '1px solid rgba(255,255,255,0.05)',
            fontSize: '11px', color: 'var(--primary)', fontWeight: 'bold', letterSpacing: '1px'
          }}>
            <span>NODE</span>
            <span>CANDIDATE</span>
            <span>IDENTIFIED ROLE</span>
            <span>MATCH SCORE</span>
            <span>SYNC TIME</span>
          </div>

          <div style={{maxHeight: '65vh', overflowY: 'auto'}}>
            {filteredHistory.length > 0 ? filteredHistory.map((item, idx) => (
              <div key={idx} style={{
                display: 'grid', gridTemplateColumns: '80px 2fr 2fr 1fr 1fr', 
                padding: '20px 32px', borderBottom: '1px solid rgba(255,255,255,0.03)',
                alignItems: 'center', background: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)'
              }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.05)',
                  border: '1px solid rgba(0, 229, 255, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--primary)', fontWeight: 'bold'
                }}>
                  {(item.user?.name || 'U')[0].toUpperCase()}
                </div>
                <div style={{fontWeight: 'bold', color: '#fff'}}>{item.user?.name || 'Anonymous'}</div>
                <div style={{color: 'var(--text-muted)', fontSize: '13px'}}>{item.primaryRole || 'Analyzed Record'}</div>
                <div style={{fontSize: '20px', fontWeight: 'bold', color: item.overallScore >= 80 ? 'var(--primary)' : 'var(--secondary)'}}>
                  {item.overallScore}%
                </div>
                <div style={{fontSize: '11px', color: 'var(--text-muted)'}}>
                  {getRelativeTime(item.analysisDate)}
                </div>
              </div>
            )) : (
              <div style={{padding: '100px', textAlign: 'center', opacity: 0.5}}>
                <Globe size={48} style={{marginBottom: '20px'}} color="var(--primary)" />
                <p>No neural records found in this category.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
