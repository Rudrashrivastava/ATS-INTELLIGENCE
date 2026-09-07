import React from 'react';
import { ShieldAlert, RefreshCw, Home } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Neural Error Boundary Caught Exception:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      sessionStorage.clear();
      localStorage.removeItem('active_trajectory');
    } catch (e) {
      console.warn("Clear session failed", e);
    }
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#060811',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div className="glass-card" style={{
            maxWidth: '520px',
            width: '100%',
            padding: '40px',
            background: 'rgba(13, 16, 29, 0.9)',
            border: '1px solid rgba(255, 46, 84, 0.4)',
            borderRadius: '16px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: 'rgba(255, 46, 84, 0.12)', border: '1px solid #FF2E54',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px', boxShadow: '0 0 20px rgba(255, 46, 84, 0.3)'
            }}>
              <ShieldAlert size={32} color="#FF2E54" />
            </div>

            <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '8px', color: '#fff' }}>
              Neural Link Interrupted
            </h2>
            
            <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: '1.6', marginBottom: '24px' }}>
              An unexpected client runtime exception occurred. The self-healing neural recovery system isolated the error to prevent session loss.
            </p>

            {this.state.error?.message && (
              <div style={{
                padding: '12px 16px',
                background: 'rgba(0,0,0,0.4)',
                border: '1px solid rgba(255, 46, 84, 0.2)',
                borderRadius: '8px',
                fontSize: '11px',
                color: '#FF2E54',
                fontFamily: 'JetBrains Mono, monospace',
                wordBreak: 'break-all',
                marginBottom: '24px',
                textAlign: 'left'
              }}>
                {this.state.error.toString()}
              </div>
            )}

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 24px',
                  background: '#00F0FF',
                  border: 'none',
                  color: '#000',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                }}
              >
                <RefreshCw size={16} /> RESET NEURAL SESSION
              </button>

              <button
                onClick={() => { window.location.href = '/auth'; }}
                style={{
                  padding: '12px 20px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Home size={16} /> GO TO LOGIN
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
