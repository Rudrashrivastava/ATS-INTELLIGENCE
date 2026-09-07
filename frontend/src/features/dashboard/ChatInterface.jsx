import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Send, User, Bot, Loader2, X, Zap, Activity, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ChatInterface({ onClose, token }) {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Zora Neural AI Assistant. How can I help you optimize your career trajectory today?", isBot: true }
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
        model: response.data.model || 'Groq Neural Engine'
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
    <div className="animate-slide-up skeuo-chat-window no-scrollbar" style={{
      position: 'fixed', bottom: '90px', right: '24px',
      width: '400px', height: '540px', zIndex: 100000,
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(165deg, #131726 0%, #080a12 100%)',
      borderRadius: '20px',
      border: '1px solid rgba(0, 240, 255, 0.3)',
      borderTopColor: 'rgba(255, 255, 255, 0.25)',
      borderBottomColor: 'rgba(0, 0, 0, 0.9)',
      boxShadow: '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      overflow: 'hidden'
    }}>
      {/* 3D Metallic Header */}
      <div style={{
        padding: '14px 20px', 
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottomColor: 'rgba(0, 0, 0, 0.6)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.12) 0%, rgba(0, 240, 255, 0.02) 100%)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 3px 10px rgba(0,0,0,0.4)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '10px', height: '10px', borderRadius: '50%',
            background: '#00F0FF',
            boxShadow: '0 0 10px #00F0FF, 0 0 4px #FFF'
          }}></div>
          <span style={{ fontWeight: 'bold', fontSize: '12px', letterSpacing: '1.5px', color: '#FFF', textShadow: '0 1px 2px rgba(0,0,0,0.8)' }}>
            NEURAL ASSISTANT
          </span>
        </div>
        <button 
          onClick={onClose} 
          className="skeuo-button"
          style={{ padding: '6px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={14} color="#CBD5E1" />
        </button>
      </div>

      {/* Messages Area - NO SCROLLBAR */}
      <div 
        ref={scrollRef} 
        className="no-scrollbar" 
        style={{ 
          flex: 1, 
          overflowY: 'auto', 
          padding: '18px', 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '16px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          background: '#070912',
          boxShadow: 'inset 0 6px 15px rgba(0, 0, 0, 0.7)'
        }}
      >
        {messages.map(msg => (
          <div key={msg.id} style={{
            alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
            maxWidth: '86%', display: 'flex', gap: '10px',
            flexDirection: msg.isBot ? 'row' : 'row-reverse'
          }}>
            <div style={{
              width: '30px', height: '30px', borderRadius: '50%',
              background: msg.isBot 
                ? 'linear-gradient(145deg, rgba(0, 240, 255, 0.2), rgba(139, 92, 246, 0.2))' 
                : 'linear-gradient(145deg, #00F0FF, #0091EA)',
              border: msg.isBot ? '1px solid #00F0FF' : 'none',
              boxShadow: msg.isBot 
                ? '0 3px 8px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)' 
                : '0 4px 10px rgba(0, 240, 255, 0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '2px'
            }}>
              {msg.isBot ? <Bot size={15} color="#00F0FF" /> : <User size={15} color="#000" />}
            </div>

            <div style={{
              padding: '12px 16px', 
              borderRadius: '16px',
              borderTopLeftRadius: msg.isBot ? '3px' : '16px',
              borderTopRightRadius: msg.isBot ? '16px' : '3px',
              background: msg.isBot 
                ? 'linear-gradient(165deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)' 
                : 'linear-gradient(165deg, #00F0FF 0%, #0072FF 100%)',
              color: msg.isBot ? '#F8FAFC' : '#000',
              fontSize: '12.5px', lineHeight: '1.55', 
              fontWeight: msg.isBot ? 'normal' : '600',
              border: msg.isBot ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
              borderTopColor: msg.isBot ? 'rgba(255, 255, 255, 0.2)' : 'none',
              boxShadow: msg.isBot 
                ? '0 4px 12px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' 
                : '0 6px 20px rgba(0, 240, 255, 0.35)'
            }}>
              <div style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>{msg.text}</div>
              {msg.model && (
                <div style={{
                  marginTop: '6px', fontSize: '9px', fontWeight: 'bold', 
                  display: 'flex', alignItems: 'center', gap: '4px',
                  color: '#00F0FF', letterSpacing: '0.5px'
                }}>
                   <Activity size={10} /> {msg.model.toUpperCase()}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(0, 240, 255, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #00F0FF' }}>
              <Loader2 size={14} color="#00F0FF" className="spinning" />
            </div>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>Neural Agent processing...</span>
          </div>
        )}
      </div>

      {/* Action Shortcut */}
      <div style={{ 
        padding: '8px 16px', 
        background: 'linear-gradient(180deg, rgba(0, 240, 255, 0.05) 0%, rgba(0, 240, 255, 0.01) 100%)', 
        display: 'flex', alignItems: 'center', justifyContent: 'center', 
        borderTop: '1px solid rgba(255, 255, 255, 0.06)' 
      }}>
         <button 
           onClick={() => navigate('/analyzer')}
           className="skeuo-button" 
           style={{ fontSize: '10px', padding: '6px 14px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 'bold', letterSpacing: '1px' }}
         >
           <Zap size={12} color="#00F0FF" fill="currentColor" /> START NEW SCAN
         </button>
      </div>

      {/* Inset 3D Input Area */}
      <div style={{ 
        padding: '14px 16px', 
        background: '#0B0D16', 
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.6)'
      }}>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="skeuo-input"
            placeholder="Ask AI Assistant..."
            style={{ padding: '10px 45px 10px 14px', width: '100%', fontSize: '12.5px' }}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading}
            style={{
              position: 'absolute', right: '8px', top: '50%',
              transform: 'translateY(-50%)', background: 'none',
              border: 'none', color: '#00F0FF', cursor: 'pointer',
              padding: '6px', display: 'flex', alignItems: 'center'
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
