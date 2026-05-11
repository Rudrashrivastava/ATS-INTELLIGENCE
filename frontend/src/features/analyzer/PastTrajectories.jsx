import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  History, ArrowLeft, Search, Clock, FileText, 
  ChevronRight, Trash2, Calendar
} from 'lucide-react';

export default function PastTrajectories() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/resume/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setHistory(res.data || []);
      } catch (err) {
        console.error("Failed to fetch history", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this trajectory?")) return;
    try {
      await axios.delete(`/api/resume/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(history.filter(item => item.id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="neural-container animate-fade-in">
      <div style={{marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '20px'}}>
        <Link to="/" className="btn-secondary" style={{padding: '12px', borderRadius: '50%'}}>
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-glow-primary" style={{fontSize: '32px'}}>Neural History Archive</h1>
          <p className="text-muted" style={{fontSize: '12px', letterSpacing: '2px'}}>FULL TRAJECTORY LOGS</p>
        </div>
      </div>

      <div className="neural-grid" style={{gridTemplateColumns: '1fr', gap: '20px'}}>
        {history.length > 0 ? history.map((item) => (
          <div key={item.id} className="glass-card animate-slide-up" style={{
            padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderLeft: '4px solid var(--primary)', background: 'rgba(0, 229, 255, 0.02)'
          }}>
            <div style={{display: 'flex', gap: '24px', alignItems: 'center'}}>
              <div style={{background: 'rgba(0, 229, 255, 0.1)', padding: '16px', borderRadius: '12px'}}>
                <FileText color="var(--primary)" size={24} />
              </div>
              <div>
                <h3 style={{fontSize: '20px', color: '#fff', marginBottom: '4px'}}>{item.primaryRole || 'General Profile'}</h3>
                <div style={{display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--text-muted)'}}>
                  <span style={{display: 'flex', alignItems: 'center', gap: '6px'}}><Calendar size={14} /> {new Date(item.analysisDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div style={{display: 'flex', gap: '16px'}}>
              <button 
                onClick={() => navigate('/yourresumefit', { state: { analysisData: item } })}
                className="btn-secondary"
                style={{padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '8px'}}
              >
                RESTORE NODES <ChevronRight size={18} />
              </button>
              <button 
                onClick={() => handleDelete(item.id)}
                className="btn-secondary"
                style={{padding: '10px', borderColor: 'rgba(255,0,0,0.3)', color: '#ff4444'}}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        )) : (
          <div className="glass-card" style={{padding: '100px', textAlign: 'center', opacity: 0.5}}>
            <History size={64} style={{marginBottom: '20px'}} />
            <h2>Archive Empty</h2>
            <p>Your previous analysis nodes will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
