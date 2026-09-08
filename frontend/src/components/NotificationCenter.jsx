import { useState, useEffect } from 'react';
import axios from 'axios';
import { Bell, Mail, CheckCircle, X, Building, Briefcase, DollarSign, Trash2, ExternalLink, ShieldCheck, Clock } from 'lucide-react';

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const res = await axios.get('/api/notifications/my-notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.notifications || []);
      setUnreadCount(res.data.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch outreach notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s for real-time outreach
    return () => clearInterval(interval);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleClearAll = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/notifications/clear-all', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications([]);
      setUnreadCount(0);
    } catch (err) {
      console.error("Failed to clear notifications", err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      
      {/* NOTIFICATION BELL BUTTON */}
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="glass-card hover-lift"
        style={{
          position: 'relative',
          background: unreadCount > 0 ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255, 255, 255, 0.05)',
          border: unreadCount > 0 ? '1.5px solid #00E5FF' : '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '10px',
          padding: '10px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: unreadCount > 0 ? '0 0 15px rgba(0, 229, 255, 0.35)' : 'none',
          transition: 'all 0.3s ease'
        }}
        title="In-Platform Recruiter Outreach Notifications"
      >
        <Bell size={18} color={unreadCount > 0 ? '#00E5FF' : 'var(--text-muted)'} />
        
        {/* UNREAD COUNT BADGE */}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#ff1744',
            color: '#fff',
            fontSize: '10px',
            fontWeight: 'bold',
            width: '18px',
            height: '18px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 8px #ff1744'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* NOTIFICATION OVERLAY DRAWER */}
      {isOpen && (
        <div 
          className="glass-card animate-fade-in"
          style={{
            position: 'fixed',
            top: '80px',
            right: '40px',
            width: '420px',
            maxHeight: '80vh',
            background: 'rgba(13, 16, 29, 0.96)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid #00E5FF',
            boxShadow: '0 20px 50px rgba(0, 240, 255, 0.3)',
            borderRadius: '16px',
            zIndex: 1000001,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}
        >
          {/* HEADER */}
          <div style={{
            padding: '18px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 229, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShieldCheck size={20} color="#00E5FF" />
              <div>
                <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff', letterSpacing: '0.5px' }}>RECRUITER OUTREACH (IN-APP)</div>
                <div style={{ fontSize: '10px', color: '#00E5FF' }}>Direct Candidate-HR Messaging Network</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {notifications.length > 0 && (
                <button
                  onClick={handleClearAll}
                  style={{
                    background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer',
                    fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px'
                  }}
                  title="Clear all notifications"
                >
                  <Trash2 size={13} /> Clear
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* NOTIFICATION LIST BODY */}
          <div style={{
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
            maxHeight: '65vh'
          }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={40} color="rgba(255,255,255,0.2)" style={{ marginBottom: '12px' }} />
                <div style={{ fontSize: '14px', color: '#fff', fontWeight: 'bold' }}>No Outreach Messages Yet</div>
                <p style={{ fontSize: '11px', marginTop: '6px' }}>When HR recruiters discover your profile and dispatch interview invitations, they will appear here instantly!</p>
              </div>
            ) : (
              notifications.map((notif) => {
                const mailtoUrl = `mailto:${notif.recruiterEmail}?subject=${encodeURIComponent(`Re: ${notif.subject || 'Interview Opportunity'}`)}&body=${encodeURIComponent(`Hi ${notif.recruiterName},\n\nThank you for reaching out via ApplySphere AI regarding the ${notif.jobTitle || 'position'}.\n\nBest regards,`)}`;

                return (
                  <div
                    key={notif.id}
                    className="glass-card"
                    style={{
                      padding: '16px',
                      background: notif.isRead ? 'rgba(255,255,255,0.02)' : 'rgba(0, 229, 255, 0.08)',
                      border: notif.isRead ? '1px solid rgba(255,255,255,0.08)' : '1px solid #00E5FF',
                      borderRadius: '12px',
                      position: 'relative',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}
                  >
                    {!notif.isRead && (
                      <div style={{
                        position: 'absolute', top: '12px', right: '12px',
                        width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF',
                        boxShadow: '0 0 8px #00E5FF'
                      }}></div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px', height: '38px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, #00E676, #00B0FF)',
                        color: '#000', fontWeight: 'bold', fontSize: '16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}>
                        {notif.recruiterName ? notif.recruiterName.charAt(0).toUpperCase() : 'H'}
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#fff' }}>{notif.recruiterName}</div>
                        <div style={{ fontSize: '11px', color: '#00E5FF' }}>{notif.companyName || 'Enterprise Partner'}</div>
                      </div>
                    </div>

                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#00E676', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Briefcase size={13} /> {notif.jobTitle || 'Career Opportunity'}
                      {notif.proposedSalary && (
                        <span style={{ fontSize: '10px', color: '#00E676', background: 'rgba(0, 230, 118, 0.15)', padding: '2px 6px', borderRadius: '4px', border: '1px solid rgba(0, 230, 118, 0.3)', marginLeft: 'auto' }}>
                          💰 {notif.proposedSalary}
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.9)', lineHeight: '1.5', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      "{notif.message}"
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '4px' }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={11} /> {notif.createdAt ? new Date(notif.createdAt).toLocaleDateString() : 'Recent'}
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!notif.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notif.id)}
                            style={{
                              background: 'none', border: '1px solid rgba(255,255,255,0.2)',
                              color: '#fff', borderRadius: '6px', padding: '4px 8px', fontSize: '10px', cursor: 'pointer'
                            }}
                          >
                            Mark Read
                          </button>
                        )}
                        
                        <a
                          href={mailtoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            background: 'rgba(0, 230, 118, 0.15)', border: '1px solid #00E676',
                            color: '#00E676', borderRadius: '6px', padding: '4px 10px', fontSize: '11px',
                            fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px'
                          }}
                        >
                          <Mail size={12} /> CONNECT VIA EMAIL ↗
                        </a>
                      </div>
                    </div>

                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
