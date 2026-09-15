import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cpu, Zap, Shield, Sparkles, Activity, CheckCircle, ArrowRight, 
  Terminal, Copy, Check, Layers, Search, Code, UserCheck, ChevronRight
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));
  const [copied, setCopied] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleCopyCode = () => {
    const codeText = `// ApplySphere Dual-Agent LLM Circuit
ATSScore result = callAgent(mistralUrl, mistralKey, "mistral-small-latest", resume, job);
if (result == null) {
  log.warn("Activating Groq LPU Fallback Bridge...");
  result = callAgent(groqUrl, groqKey, "llama-3.1-8b-instant", resume, job);
}`;
    navigator.clipboard.writeText(codeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="synapse-landing-root" style={{
      background: '#030303',
      color: '#FFFFFF',
      fontFamily: "'Inter', sans-serif",
      minHeight: '100vh',
      position: 'relative',
      overflowX: 'hidden',
      paddingBottom: '0'
    }}>

      {/* AMBIENT BACKGROUND GLOW ORBS */}
      <div style={{
        position: 'fixed',
        top: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.25) 0%, rgba(3, 3, 3, 0) 70%)',
        filter: 'blur(100px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'fixed',
        top: '40%',
        left: '-10%',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.18) 0%, rgba(3, 3, 3, 0) 70%)',
        filter: 'blur(120px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{
        position: 'fixed',
        bottom: '10%',
        right: '-5%',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, rgba(3, 3, 3, 0) 70%)',
        filter: 'blur(110px)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      {/* DYNAMIC MOUSE CURSOR GLOW */}
      <div style={{
        position: 'fixed',
        left: `${mousePos.x}px`,
        top: `${mousePos.y}px`,
        width: '350px',
        height: '350px',
        transform: 'translate(-50%, -50%)',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.06) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'left 0.15s ease-out, top 0.15s ease-out'
      }} />

      {/* FIXED NAVIGATION PILL */}
      <nav style={{
        position: 'fixed',
        top: '24px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '92%',
        maxWidth: '820px',
        height: '56px',
        borderRadius: '9999px',
        background: 'rgba(10, 10, 10, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        boxShadow: '0 10px 35px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        display: 'flex',
        alignItems: 'center',
        justify: 'space-between',
        padding: '0 24px',
        gap: '20px',
        zIndex: 10000
      }}>
        {/* Logo */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }}
        >
          <div style={{
            width: '10px',
            height: '10px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #8B5CF6 0%, #06B6D4 100%)',
            boxShadow: '0 0 12px #8B5CF6'
          }} />
          <span style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: '20px',
            fontWeight: 500,
            letterSpacing: '-0.02em',
            color: '#FFF',
            whiteSpace: 'nowrap'
          }}>
            APPLYSPHERE
          </span>
        </div>

        {/* Links */}
        <div className="synapse-nav-links-container">
          <a href="#features" className="synapse-nav-link">FEATURES</a>
          <a href="#metrics" className="synapse-nav-link">SPECS</a>
          <a href="#architecture" className="synapse-nav-link">ENGINE</a>
          <a href="#integration" className="synapse-nav-link">API</a>
        </div>

        {/* Action Button */}
        <button
          onClick={handleCtaClick}
          style={{
            background: '#FFFFFF',
            color: '#030303',
            border: 'none',
            borderRadius: '9999px',
            padding: '8px 20px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '1px',
            cursor: 'pointer',
            transition: 'all 0.25s cubic-bezier(0.23, 1, 0.32, 1)',
            boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
            whiteSpace: 'nowrap',
            flexShrink: 0
          }}
          className="synapse-pill-btn"
        >
          {isAuthenticated ? 'DASHBOARD →' : 'GET STARTED'}
        </button>
      </nav>

      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        zIndex: 2,
        paddingTop: '160px',
        paddingBottom: '100px',
        maxWidth: '1140px',
        margin: '0 auto',
        textAlign: 'center',
        paddingLeft: '24px',
        paddingRight: '24px'
      }}>
        {/* Status Pill Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 18px',
          borderRadius: '9999px',
          background: 'rgba(139, 92, 246, 0.08)',
          border: '1px solid rgba(139, 92, 246, 0.25)',
          marginBottom: '28px'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px #10B981' }} />
          <span style={{ fontSize: '11px', fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.15em', color: '#A78BFA', textTransform: 'uppercase' }}>
            UNIFIED AI CAREER & JOB PLACEMENT ENGINE
          </span>
        </div>

        {/* Hero Title */}
        <h1 style={{
          fontFamily: "'Instrument Serif', serif",
          fontSize: 'clamp(46px, 7.5vw, 92px)',
          fontWeight: 400,
          lineHeight: 0.98,
          letterSpacing: '-0.03em',
          marginBottom: '24px',
          color: '#F8FAFC'
        }}>
          Unified AI Career Intelligence & <br />
          <span className="synapse-shimmer-text">One-Stop Job Application Engine</span>
        </h1>

        {/* Hero Feature Chips */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <span className="synapse-hero-chip">🎯 Dual-Agent ATS Scoring</span>
          <span className="synapse-hero-chip">💼 30+ Live Market Jobs</span>
          <span className="synapse-hero-chip">🚀 6-Step Career Roadmap</span>
          <span className="synapse-hero-chip">⚡ Sub-300ms Groq AI Assistant</span>
        </div>

        {/* Hero Subtext */}
        <p style={{
          maxWidth: '720px',
          margin: '0 auto 40px auto',
          fontSize: '17px',
          lineHeight: '1.65',
          color: '#94A3B8',
          fontWeight: 300
        }}>
          Beyond basic ATS scanning — ApplySphere unifies multi-model AI resume analysis, 30+ live job portal aggregations, customized skill roadmaps, and sub-300ms real-time Groq AI career coaching into a single powerful platform.
        </p>

        {/* Hero CTAs */}
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Shiny Border Button */}
          <div className="synapse-shiny-container" onClick={handleCtaClick}>
            <div className="synapse-shiny-inner">
              <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, letterSpacing: '1.5px' }}>
                <Zap size={14} color="#06B6D4" fill="#06B6D4" />
                {isAuthenticated ? 'OPEN DASHBOARD' : 'LAUNCH ATS ENGINE'}
                <ArrowRight size={14} />
              </span>
            </div>
          </div>

          <a 
            href="#architecture" 
            style={{
              padding: '14px 28px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              background: 'rgba(255, 255, 255, 0.03)',
              color: '#CBD5E1',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '1px',
              textDecoration: 'none',
              transition: 'all 0.25s ease'
            }}
            className="synapse-sec-btn"
          >
            VIEW ARCHITECTURE ↓
          </a>
        </div>
      </section>

      {/* METRICS TICKER */}
      <section id="metrics" style={{
        position: 'relative',
        zIndex: 2,
        height: '64px',
        background: 'rgba(0, 0, 0, 0.6)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center'
      }}>
        <div className="synapse-ticker-track">
          {[1, 2].map((loopKey) => (
            <div key={loopKey} style={{ display: 'flex', gap: '48px', alignItems: 'center', paddingRight: '48px' }}>
              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">LATENCY:</span>
                <span className="synapse-ticker-val" style={{ color: '#06B6D4' }}>&lt;300MS LPU</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>

              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">AVAILABILITY:</span>
                <span className="synapse-ticker-val" style={{ color: '#10B981' }}>99.99% UPTIME</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>

              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">INTELLIGENCE SHIELD:</span>
                <span className="synapse-ticker-val" style={{ color: '#A78BFA' }}>MISTRAL + GROQ</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>

              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">JOB MARKET AGGREGATION:</span>
                <span className="synapse-ticker-val" style={{ color: '#FFF' }}>30+ PORTALS</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>

              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">MATCHING ACCURACY:</span>
                <span className="synapse-ticker-val" style={{ color: '#06B6D4' }}>98.4% VECTOR FIT</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>

              <div className="synapse-ticker-item">
                <span className="synapse-ticker-label">PDF STRUCTURE PARSER:</span>
                <span className="synapse-ticker-val" style={{ color: '#10B981' }}>APACHE PDFBOX</span>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.15)' }}>/</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE GRID SECTION */}
      <section id="features" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '120px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '70px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#06B6D4',
            textTransform: 'uppercase'
          }}>
            PLATFORM CAPABILITIES
          </span>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 400,
            marginTop: '12px',
            color: '#F8FAFC'
          }}>
            Engineered for High-Velocity Placement
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {/* Card 1 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <Cpu size={22} color="#A78BFA" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              Dual-Agent Failover Shield
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Primary scoring executes via Mistral Core. If latency spikes or rate-limits occur, execution seamlessly switches to Groq LPU Bridge within milliseconds.
            </p>
          </div>

          {/* Card 2 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <Zap size={22} color="#06B6D4" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              Sub-300ms Neural Assistant
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Powered by Groq's high-speed inference engine, pre-conditioned with candidate ATS score metrics and role weaknesses for real-time career coaching.
            </p>
          </div>

          {/* Card 3 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <Search size={22} color="#10B981" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              30+ Live Job Aggregation
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Real-time job search integrated with Glassdoor, LinkedIn, Naukri, and RapidAPI endpoints tailored to candidate trajectory and exact tech stack.
            </p>
          </div>

          {/* Card 4 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(139, 92, 246, 0.12)', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
              <Layers size={22} color="#A78BFA" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              Apache PDFBox Text Parser
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Deep server-side document parsing extracts structural skills, experience timelines, and domain keyword density directly from PDF uploads.
            </p>
          </div>

          {/* Card 5 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(6, 182, 212, 0.12)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
              <Sparkles size={22} color="#06B6D4" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              6-Step Career Roadmap
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Generates customized milestone roadmaps, curated tech documentation URLs (Spring Docs, React.dev, Kaggle), and target growth opportunities.
            </p>
          </div>

          {/* Card 6 */}
          <div className="synapse-feature-card">
            <div className="synapse-card-icon" style={{ background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
              <UserCheck size={22} color="#10B981" />
            </div>
            <h3 style={{ fontFamily: "'Instrument Serif', serif", fontSize: '28px', color: '#FFF', marginBottom: '12px' }}>
              Recruiter Outreach Gateway
            </h3>
            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', fontWeight: 300 }}>
              Built-in HR Candidate discovery portal enabling direct recruitment messaging and real-time candidate notifications with role verification.
            </p>
          </div>
        </div>
      </section>

      {/* CODE INTEGRATION BLOCK */}
      <section id="integration" style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1000px',
        margin: '0 auto',
        padding: '0 24px 120px 24px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.2em',
            color: '#A78BFA',
            textTransform: 'uppercase'
          }}>
            RELIABILITY ARCHITECTURE
          </span>
          <h2 style={{
            fontFamily: "'Instrument Serif', serif",
            fontSize: 'clamp(32px, 4vw, 52px)',
            fontWeight: 400,
            marginTop: '8px',
            color: '#F8FAFC'
          }}>
            Programmatic Resilience Pipeline
          </h2>
        </div>

        <div style={{
          background: 'rgba(8, 8, 8, 0.85)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '24px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
          overflow: 'hidden'
        }}>
          {/* IDE Window Top Bar */}
          <div style={{
            padding: '14px 20px',
            background: 'rgba(255, 255, 255, 0.03)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justify: 'space-between'
          }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#EF4444', opacity: 0.8 }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#F59E0B', opacity: 0.8 }} />
              <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10B981', opacity: 0.8 }} />
            </div>

            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: '12px',
              color: '#94A3B8',
              letterSpacing: '0.05em'
            }}>
              ATSScoreService.java — DualAgentCircuit.java
            </span>

            <button 
              onClick={handleCopyCode}
              style={{
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: copied ? '#10B981' : '#94A3B8',
                borderRadius: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>

          {/* IDE Code Area */}
          <pre style={{
            margin: 0,
            padding: '24px 28px',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: '13px',
            lineHeight: '1.7',
            overflowX: 'auto',
            color: '#E2E8F0'
          }}>
            <code>
              <span style={{ color: '#A78BFA' }}>// 1. PRIMARY EXECUTION: Mistral Core Model</span>{'\n'}
              <span style={{ color: '#06B6D4' }}>try</span> {'{\n'}
              {'  '}log.info(<span style={{ color: '#10B981' }}>"Initiating Mistral Core Analysis..."</span>);{'\n'}
              {'  '}ATSScore result = callAgent(mistralUrl, mistralKey, <span style={{ color: '#10B981' }}>"mistral-small-latest"</span>, resume, job);{'\n'}
              {'  '}result.setModelSource(<span style={{ color: '#10B981' }}>"Mistral Core"</span>);{'\n'}
              {'  '}<span style={{ color: '#06B6D4' }}>return</span> result;{'\n'}
              {'}'} <span style={{ color: '#06B6D4' }}>catch</span> (Exception e) {'{\n'}
              {'  '}log.warn(<span style={{ color: '#F59E0B' }}>"Mistral Node Unstable. Activating Groq Bridge..."</span>);{'\n'}
              {'  '}<span style={{ color: '#A78BFA' }}>// 2. SECONDARY FAILOVER: Groq Ultra-Fast LPU Engine</span>{'\n'}
              {'  '}<span style={{ color: '#06B6D4' }}>try</span> {'{\n'}
              {'    '}ATSScore result = callAgent(groqUrl, groqKey, <span style={{ color: '#10B981' }}>"llama-3.1-8b-instant"</span>, resume, job);{'\n'}
              {'    '}result.setModelSource(<span style={{ color: '#10B981' }}>"Groq Bridge"</span>);{'\n'}
              {'    '}<span style={{ color: '#06B6D4' }}>return</span> result;{'\n'}
              {'  '}	{'}'} <span style={{ color: '#06B6D4' }}>catch</span> (Exception ex) {'{\n'}
              {'    '}log.error(<span style={{ color: '#EF4444' }}>"Neural Shield Depleted: Self-healing baseline engaged."</span>);{'\n'}
              {'    '}<span style={{ color: '#06B6D4' }}>return</span> fallbackScore();{'\n'}
              {'  '}{'}'}\n
              {'}'}
            </code>
          </pre>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="architecture" style={{
        position: 'relative',
        zIndex: 2,
        background: '#050505',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '40px',
            marginBottom: '60px'
          }}>
            {/* Branding Column */}
            <div style={{ gridColumn: 'span 1' }}>
              <div style={{
                fontFamily: "'Instrument Serif', serif",
                fontSize: '28px',
                color: '#FFF',
                marginBottom: '16px'
              }}>
                APPLYSPHERE AI
              </div>
              <p style={{ color: '#64748B', fontSize: '13px', lineHeight: '1.6', fontWeight: 300 }}>
                Unified Dual-Agent AI Job Application Engine & Resume Analyzer. Sub-300ms inference with 99.99% uptime guarantee.
              </p>
            </div>

            {/* Col 2 */}
            <div>
              <div className="synapse-footer-header">CORE ARCHITECTURE</div>
              <ul className="synapse-footer-list">
                <li>Mistral Core Primary</li>
                <li>Groq LPU Secondary</li>
                <li>Apache PDFBox Parser</li>
                <li>Spring Boot 3 API Proxy</li>
              </ul>
            </div>

            {/* Col 3 */}
            <div>
              <div className="synapse-footer-header">PLATFORM SERVICES</div>
              <ul className="synapse-footer-list">
                <li>ATS Score Matrix</li>
                <li>Career Roadmap 6-Step</li>
                <li>30+ Job Aggregator</li>
                <li>Real-Time Assistant Chat</li>
              </ul>
            </div>

            {/* Col 4 */}
            <div>
              <div className="synapse-footer-header">SECURITY & DEPLOYMENT</div>
              <ul className="synapse-footer-list">
                <li>JWT Neural Token Auth</li>
                <li>Docker Containerized</li>
                <li>MySQL 8 Database</li>
                <li>OpenWebNinja Integration</li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div style={{
            paddingTop: '30px',
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justify: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <span style={{ color: '#475569', fontSize: '12px' }}>
              © {new Date().getFullYear()} ApplySphere AI. Synapse Design System. All rights reserved.
            </span>

            {/* Emerald Operational Status Indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              borderRadius: '9999px',
              background: 'rgba(16, 185, 129, 0.08)',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              <span className="synapse-pulse-dot" />
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: '11px',
                fontWeight: 600,
                color: '#10B981',
                letterSpacing: '0.05em'
              }}>
                ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* SYNAPSE INLINE STYLES FOR ANIMATIONS & INTERACTIONS */}
      <style dangerouslySetInnerHTML={{ __html: `
        .synapse-hero-chip {
          display: inline-flex;
          align-items: center;
          padding: 5px 14px;
          border-radius: 9999px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #CBD5E1;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(10px);
          transition: all 0.25s ease;
        }
        .synapse-hero-chip:hover {
          border-color: rgba(6, 182, 212, 0.4);
          color: #FFF;
          background: rgba(6, 182, 212, 0.08);
          transform: translateY(-2px);
        }

        .synapse-nav-links-container {
          display: flex;
          gap: 20px;
          align-items: center;
        }
        @media (max-width: 640px) {
          .synapse-nav-links-container {
            display: none;
          }
        }

        .synapse-nav-link {
          color: #94A3B8;
          text-decoration: none;
          font-size: 11px;
          font-family: 'Inter', sans-serif;
          font-weight: 600;
          letterSpacing: 0.12em;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .synapse-nav-link:hover {
          color: #FFFFFF;
          transform: translateY(-1px);
        }
        .synapse-pill-btn:hover {
          background: #A78BFA !important;
          color: #FFFFFF !important;
          box-shadow: 0 0 20px rgba(167, 139, 250, 0.5) !important;
          transform: translateY(-1px);
        }

        .synapse-shimmer-text {
          background: linear-gradient(90deg, #A78BFA 0%, #FFFFFF 40%, #FFFFFF 60%, #06B6D4 100%);
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: synapseShimmer 6s linear infinite;
        }
        @keyframes synapseShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        /* SHINY BORDER BUTTON */
        .synapse-shiny-container {
          position: relative;
          padding: 1px;
          border-radius: 9999px;
          overflow: hidden;
          cursor: pointer;
          display: inline-block;
        }
        .synapse-shiny-container::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent 0%, #8B5CF6 40%, #06B6D4 50%, transparent 60%);
          animation: synapseSpin 4s linear infinite;
        }
        .synapse-shiny-inner {
          position: relative;
          background: #0A0A0A;
          border-radius: 9999px;
          padding: 14px 36px;
          color: #FFF;
          z-index: 1;
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .synapse-shiny-container:hover .synapse-shiny-inner {
          background: #12121A;
          box-shadow: 0 0 25px rgba(139, 92, 246, 0.4);
        }
        @keyframes synapseSpin {
          100% { transform: rotate(360deg); }
        }

        .synapse-sec-btn:hover {
          border-color: rgba(255, 255, 255, 0.3) !important;
          color: #FFF !important;
          background: rgba(255, 255, 255, 0.08) !important;
        }

        /* TICKER ANIMATION */
        .synapse-ticker-track {
          display: flex;
          white-space: nowrap;
          animation: synapseTicker 35s linear infinite;
        }
        @keyframes synapseTicker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .synapse-ticker-item {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .synapse-ticker-label {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #64748B;
        }
        .synapse-ticker-val {
          font-family: 'JetBrains Mono', monospace;
          font-size: 13px;
          font-weight: 700;
        }

        /* FEATURE CARDS */
        .synapse-feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 24px;
          padding: 36px 30px;
          transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
          position: relative;
        }
        .synapse-feature-card:hover {
          transform: translateY(-10px);
          border-color: rgba(139, 92, 246, 0.4);
          background: rgba(255, 255, 255, 0.04);
          box-shadow: 0 15px 35px -10px rgba(139, 92, 246, 0.25);
        }
        .synapse-card-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 24px;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
        .synapse-feature-card:hover .synapse-card-icon {
          transform: scale(1.1) rotate(-3deg);
        }

        .synapse-footer-header {
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: #94A3B8;
          margin-bottom: 18px;
        }
        .synapse-footer-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          color: #64748B;
          font-size: 13px;
          font-weight: 300;
        }

        .synapse-pulse-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 10px #10B981;
          animation: synapsePulse 2s infinite ease-in-out;
        }
        @keyframes synapsePulse {
          0%, 100% { opacity: 0.4; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.15); }
        }
      `}} />
    </div>
  );
}
