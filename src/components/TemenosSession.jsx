import { useState, useRef, useEffect } from 'react';
import { sendMessage, screenMessage } from '../lib/api';
import { PHILO_COUPLES_SYSTEM } from '../lib/philo';
import Mandala from './Mandala';

const HELPLINES = [
  { name: 'Emergency Services', number: '999' },
  { name: 'Samaritans', number: '116 123' },
  { name: 'National Domestic Abuse Helpline', number: '0808 2000 247' },
  { name: "Men's Advice Line", number: '0808 801 0327' },
  { name: 'Shout Crisis Text Line', number: 'Text 85258' },
];

export default function TemenosSession({ partner1, partner2, onEnd }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [interception, setInterception] = useState(null);
  const [paused, setPaused] = useState(false);
  const [stopped, setStopped] = useState(false);
  const bottomRef = useRef(null);

  const partners = [partner1, partner2];
  const tabColors = ['var(--rose)', 'var(--teal)'];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading || paused || stopped) return;

    setLoading(true);
    setInput('');

    try {
      const screening = await screenMessage(text);

      if (screening.level === 4) {
        setStopped(true);
        setLoading(false);
        return;
      }

      if (screening.level === 3) {
        setPaused(true);
        setMessages(prev => [...prev, {
          role: 'system',
          content: 'Philo has called a moment of pause.',
          type: 'pause',
        }]);
        setLoading(false);
        return;
      }

      if (screening.level === 2) {
        setInterception({
          level: 2,
          original: text,
          sender: partners[activeTab],
        });
        setLoading(false);
        return;
      }

      if (screening.level === 1) {
        setInterception({
          level: 1,
          original: text,
          sender: partners[activeTab],
        });
        setLoading(false);
        return;
      }

      await deliverMessage(text);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `Connection issue. Please try again. (${err.message})`,
      }]);
      setLoading(false);
    }
  }

  async function deliverMessage(text) {
    const sender = partners[activeTab];
    const userMsg = { role: 'user', content: `[${sender}]: ${text}`, sender };
    const updated = [...messages.filter(m => m.role !== 'system'), userMsg];
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const system = PHILO_COUPLES_SYSTEM.replace(/\[Partner A\]/g, partner1).replace(/\[Partner B\]/g, partner2);
      const reply = await sendMessage(
        updated.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        })),
        system
      );
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `I'm having trouble connecting. Please try again. (${err.message})`,
      }]);
    } finally {
      setLoading(false);
    }
  }

  function handleSendAnyway() {
    const text = interception.original;
    setInterception(null);
    deliverMessage(text);
  }

  function handleRewrite() {
    setInput(interception.original);
    setInterception(null);
  }

  function handleDiscard() {
    setInterception(null);
  }

  function handleResumePause() {
    setPaused(false);
  }

  if (stopped) {
    return (
      <div className="screen fade-in" style={{ background: 'var(--charcoal)' }}>
        <header style={{ padding: '16px 20px', display: 'flex', justifyContent: 'center' }}>
          <Mandala size={80} />
        </header>
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 32,
          textAlign: 'center',
        }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem',
            color: 'var(--rose)',
            marginBottom: 24,
          }}>
            This session has been paused for safety
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32, maxWidth: 400 }}>
            If you or someone you know needs support, please reach out to one of these services:
          </p>
          <div style={{ width: '100%', maxWidth: 400 }}>
            {HELPLINES.map((h, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.05)',
                borderRadius: 8,
                marginBottom: 8,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{h.name}</span>
                <a href={`tel:${h.number.replace(/\s/g, '')}`} style={{
                  color: 'var(--rose-light)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                }}>{h.number}</a>
              </div>
            ))}
          </div>
          <button onClick={onEnd} className="btn-outline" style={{ marginTop: 32, borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.7)' }}>
            Leave session
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="screen fade-in" style={{ background: 'var(--charcoal)' }}>
      <header style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--charcoal)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Mandala size={40} />
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--rose-light)', fontWeight: 400 }}>
              The Temenos
            </h3>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)' }}>
              {partner1} & {partner2} — Philo present
            </p>
          </div>
        </div>
        <button onClick={onEnd} style={{
          background: 'rgba(255,255,255,0.08)',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '0.8rem',
          padding: '6px 14px',
          borderRadius: 20,
        }}>
          End
        </button>
      </header>

      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', marginTop: 40, color: 'rgba(255,255,255,0.5)' }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--rose-light)', marginBottom: 8, fontStyle: 'italic' }}>
              Welcome to the Temenos, {partner1} and {partner2}.
            </p>
            <p style={{ fontSize: '0.85rem' }}>
              I'm Philo, and I'll be here as guardian of this space.<br />
              Who would like to begin?
            </p>
          </div>
        )}

        {messages.map((msg, i) => {
          if (msg.type === 'pause') {
            return (
              <div key={i} style={{
                textAlign: 'center',
                padding: '16px',
                margin: '12px 0',
                background: 'rgba(196,69,107,0.1)',
                borderRadius: 12,
                color: 'var(--rose-light)',
                fontStyle: 'italic',
                fontSize: '0.9rem',
              }}>
                {msg.content}
              </div>
            );
          }

          const isPhilo = msg.role === 'assistant';
          const senderColor = msg.sender === partner1 ? 'var(--rose)' : msg.sender === partner2 ? 'var(--teal)' : undefined;

          return (
            <div key={i} style={{
              display: 'flex',
              justifyContent: isPhilo ? 'center' : msg.sender === partner1 ? 'flex-start' : 'flex-end',
              marginBottom: 12,
            }}>
              <div style={{
                maxWidth: isPhilo ? '90%' : '75%',
                padding: '12px 16px',
                borderRadius: 16,
                background: isPhilo
                  ? 'rgba(255,255,255,0.06)'
                  : msg.sender === partner1
                    ? 'rgba(196,69,107,0.15)'
                    : 'rgba(45,122,107,0.15)',
                border: isPhilo ? '1px solid rgba(196,69,107,0.15)' : 'none',
                fontSize: '0.9rem',
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
              }}>
                {!isPhilo && (
                  <p style={{ fontSize: '0.7rem', color: senderColor, fontWeight: 600, marginBottom: 4 }}>
                    {msg.sender}
                  </p>
                )}
                {isPhilo && (
                  <p style={{ fontSize: '0.7rem', color: 'var(--rose-light)', fontWeight: 600, marginBottom: 4 }}>
                    Philo
                  </p>
                )}
                <span style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {isPhilo ? msg.content : msg.content.replace(/^\[[^\]]+\]:\s*/, '')}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ textAlign: 'center', margin: '12px 0' }}>
            <span style={{ color: 'var(--rose-light)', fontSize: '0.85rem', animation: 'pulse 1.5s infinite', fontStyle: 'italic' }}>
              Philo is listening...
            </span>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {interception && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(196,69,107,0.12)',
          borderTop: '1px solid rgba(196,69,107,0.2)',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            color: 'var(--rose-light)',
            marginBottom: 8,
            fontStyle: 'italic',
          }}>
            {interception.level === 1
              ? `A gentle pause, ${interception.sender}...`
              : `Hold on, ${interception.sender}.`}
          </p>
          <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', marginBottom: 12 }}>
            {interception.level === 1
              ? 'Before this message goes through — could you read it back to yourself and feel how it might land? Sometimes the truest thing we want to say has a softer version that lands closer to home.'
              : 'I\'m sensing something beneath these words that deserves more care. What you\'re feeling is real — but the way it\'s wrapped might push away the very person you\'re trying to reach. Would you like to try again?'}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {interception.level === 1 && (
              <button onClick={handleSendAnyway} style={{
                background: 'rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                padding: '8px 16px',
              }}>
                Send anyway
              </button>
            )}
            <button onClick={handleRewrite} style={{
              background: 'var(--rose)',
              color: 'white',
              fontSize: '0.85rem',
              padding: '8px 16px',
            }}>
              Rewrite
            </button>
            <button onClick={handleDiscard} style={{
              background: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.5)',
              fontSize: '0.85rem',
              padding: '8px 16px',
            }}>
              Discard
            </button>
          </div>
        </div>
      )}

      {paused && !interception && (
        <div style={{
          padding: '16px 20px',
          background: 'rgba(196,69,107,0.12)',
          borderTop: '1px solid rgba(196,69,107,0.2)',
          textAlign: 'center',
        }}>
          <p style={{ color: 'var(--rose-light)', fontSize: '0.9rem', marginBottom: 12 }}>
            The session is paused. Take a breath.
          </p>
          <button onClick={handleResumePause} className="btn-primary" style={{ fontSize: '0.85rem', padding: '8px 20px' }}>
            Resume when ready
          </button>
        </div>
      )}

      {!paused && !interception && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex' }}>
            {partners.map((p, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: activeTab === i ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: activeTab === i ? tabColors[i] : 'rgba(255,255,255,0.3)',
                  fontSize: '0.85rem',
                  fontWeight: activeTab === i ? 600 : 400,
                  borderBottom: activeTab === i ? `2px solid ${tabColors[i]}` : '2px solid transparent',
                  borderRadius: 0,
                  transition: 'all 0.2s',
                }}
              >
                {p}
              </button>
            ))}
          </div>

          <form onSubmit={handleSend} style={{
            padding: '12px 16px',
            display: 'flex',
            gap: 10,
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={`${partners[activeTab]}, share what's present for you...`}
              disabled={loading}
              style={{
                flex: 1,
                background: 'rgba(255,255,255,0.06)',
                border: `1px solid rgba(255,255,255,0.1)`,
                color: 'white',
                borderRadius: 8,
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                background: tabColors[activeTab],
                color: 'white',
                padding: '10px 20px',
                fontSize: '0.9rem',
              }}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
