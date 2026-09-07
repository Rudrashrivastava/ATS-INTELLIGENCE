import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, X, Zap, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatInterface({ onClose, token }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Neural ATS Assistant. How can I help you optimize your career trajectory today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // FETCH COMPACT CONTEXT FROM NEURAL REPOSITORY
  const getNeuralContext = () => {
    try {
      const saved = sessionStorage.getItem('active_trajectory');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      // Keep payload lightweight to prevent 413 Payload Too Large
      return {
        role: parsed.primaryRole || 'Developer',
        score: parsed.overallScore || 0,
        recommendation: (parsed.recommendation || '').slice(0, 200)
      };
    } catch (e) { 
      return null; 
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userText = input.trim();
    const userMessage = { id: Date.now(), text: userText, isBot: false };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const context = getNeuralContext();

    try {
      const response = await axios.post('/api/chat/query', 
        { 
          query: userText,
          context: context
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const botMessage = { 
        id: Date.now() + 1, 
        text: response.data.response || "I've analyzed your query.", 
        isBot: true,
        model: response.data.model || 'Groq Neural'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || "Neural Link interrupted.";
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        text: `Neural Assistant Notice: ${errorMsg}`, 
        isBot: true,
        isError: true
      }]);
    }
    setLoading(false);
  };

  return (
    <div className="animate-slide-up" style={{
      position: 'fixed', bottom: '95px', right: '24px',
      width: '380px', height: '520px', zIndex: 100000,
      display: 'flex', flexDirection: 'column',
      background: 'rgba(18, 20, 32, 0.95)',
      backdropFilter: 'blur(20px)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 229, 255, 0.3)',
      boxShadow: '0 20px 50px rgba(0, 229, 255, 0.25)',
      overflow: 'hidden'
    }}>
      {/* Header */}
      <div style={{
        padding: '16px 20px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'rgba(0, 229, 255, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00E5FF', boxShadow: '0 0 10px #00E5FF' }}></div>
          <span style={{ fontWeight: 'bold', fontSize: '13px', letterSpacing: '1.5px', color: '#fff' }}>NEURAL ASSISTANT</span>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', padding: '4px' }}>
          <X size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="custom-scroll" style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
            maxWidth: '85%', display: 'flex', gap: '10px',
            flexDirection: msg.isBot ? 'row' : 'row-reverse'
          }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              background: msg.isBot ? 'rgba(0, 229, 255, 0.15)' : 'linear-gradient(135deg, #00E5FF, #0072FF)',
              border: msg.isBot ? '1px solid #00E5FF' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '2px'
            }}>
              {msg.isBot ? <Bot size={14} color="#00E5FF" /> : <User size={14} color="#000" />}
            </div>
            <div style={{
              padding: '12px 16px', borderRadius: '16px',
              borderTopLeftRadius: msg.isBot ? '2px' : '16px',
              borderTopRightRadius: msg.isBot ? '16px' : '2px',
              background: msg.isBot ? 'rgba(255, 255, 255, 0.06)' : 'linear-gradient(135deg, #00E5FF 0%, #0072FF 100%)',
              color: msg.isBot ? '#fff' : '#000',
              fontSize: '13px', lineHeight: '1.5', fontWeight: msg.isBot ? 'normal' : '600',
              border: msg.isBot ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
              boxShadow: msg.isBot ? 'none' : '0 4px 15px rgba(0, 229, 255, 0.3)'
            }}>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</div>
              {msg.model && (
                <div style={{
                  marginTop: '6px', fontSize: '9px', fontWeight: 'bold', 
                  opacity: 0.8, display: 'flex', alignItems: 'center', gap: '4px',
                  color: '#00E5FF', letterSpacing: '0.5px'
                }}>
                   <Activity size={10} /> {msg.model.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #00E5FF' }}>
              <Loader2 size={14} color="#00E5FF" className="spinning" />
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Neural Agent processing...</span>
          </div>
        )}
      </div>

      {/* Action Shortcut */}
      <div style={{ padding: '8px 16px', background: 'rgba(0, 229, 255, 0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
         <button 
           onClick={() => navigate('/analyzer')}
           className="btn-glow" 
           style={{ fontSize: '10px', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '6px', border: 'none', cursor: 'pointer' }}
         >
           <Zap size={12} fill="currentColor" /> START NEW SCAN
         </button>
      </div>

      {/* Input */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="glass-input"
            placeholder="Ask AI Assistant..."
            style={{ paddingRight: '45px', width: '100%', fontSize: '13px', borderRadius: '12px' }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{
              position: 'absolute', right: '10px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', color: '#00E5FF', cursor: 'pointer'
            }}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
