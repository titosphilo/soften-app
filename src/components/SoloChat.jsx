import { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../lib/api';
import { PHILO_SOLO_SYSTEM } from '../lib/philo';

export default function SoloChat({ onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const userMsg = { role: 'user', content: text };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setInput('');
    setLoading(true);

    try {
      const reply = await sendMessage(
        updated.map(m => ({ role: m.role, content: m.content })),
        PHILO_SOLO_SYSTEM
      );
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: `I'm having trouble connecting right now. Please check your API key and try again.\n\n(${err.message})` }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="screen fade-in" style={{ background: 'var(--cream)' }}>
      <header style={{
        padding: '14px 20px',
        borderBottom: '1px solid #e8e4e0',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'white',
      }}>
        <button onClick={onBack} style={{
          background: 'none',
          padding: '4px 8px',
          fontSize: '0.9rem',
          color: 'var(--teal)',
        }}>← Back</button>
        <div>
          <h3 style={{ fontSize: '1.2rem', color: 'var(--charcoal)' }}>Philo</h3>
          <p style={{ fontSize: '0.75rem', color: '#999' }}>Solo session</p>
        </div>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 60, color: '#999' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', color: 'var(--rose-light)', marginBottom: 8 }}>
              Hello. I'm Philo.
            </p>
            <p style={{ fontSize: '0.9rem' }}>
              What's on your heart today?
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} style={{
            display: 'flex',
            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
            marginBottom: 12,
          }}>
            <div style={{
              maxWidth: '80%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              background: msg.role === 'user' ? 'var(--teal)' : 'white',
              color: msg.role === 'user' ? 'white' : 'var(--charcoal)',
              fontSize: '0.95rem',
              lineHeight: 1.6,
              boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              whiteSpace: 'pre-wrap',
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 12 }}>
            <div style={{
              padding: '12px 16px',
              borderRadius: '16px 16px 16px 4px',
              background: 'white',
              color: '#999',
              fontSize: '0.9rem',
              animation: 'pulse 1.5s infinite',
            }}>
              Philo is reflecting...
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{
        padding: '12px 16px',
        borderTop: '1px solid #e8e4e0',
        display: 'flex',
        gap: 10,
        background: 'white',
      }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Share what's on your mind..."
          style={{ flex: 1 }}
          disabled={loading}
        />
        <button type="submit" className="btn-primary" disabled={loading || !input.trim()}>
          Send
        </button>
      </form>
    </div>
  );
}
