import { useState, useEffect } from 'react';
import Mandala from './Mandala';

export default function TemenosThreshold({ partner1, partner2, onEnter }) {
  const [p1Arrived, setP1Arrived] = useState(false);
  const [p2Arrived, setP2Arrived] = useState(false);

  useEffect(() => {
    if (p1Arrived && p2Arrived) {
      const t = setTimeout(onEnter, 1500);
      return () => clearTimeout(t);
    }
  }, [p1Arrived, p2Arrived, onEnter]);

  return (
    <div className="screen fade-in" style={{ background: 'var(--charcoal)' }}>
      <header style={{
        padding: '24px 20px',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--charcoal)',
      }}>
        <Mandala size={100} />
      </header>

      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.5rem',
          color: 'var(--rose-light)',
          marginBottom: 48,
          fontWeight: 400,
        }}>
          The Threshold
        </h2>

        <div style={{ display: 'flex', gap: 48, marginBottom: 48 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `3px solid ${p1Arrived ? 'var(--rose)' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              transition: 'all 0.5s ease',
              background: p1Arrived ? 'var(--rose-faint)' : 'transparent',
            }}>
              <span style={{ fontSize: '1.6rem', color: p1Arrived ? 'var(--rose)' : 'rgba(255,255,255,0.3)' }}>
                {partner1[0]}
              </span>
            </div>
            <p style={{ color: p1Arrived ? 'var(--rose-light)' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              {partner1}
            </p>
            {!p1Arrived && (
              <button
                onClick={() => setP1Arrived(true)}
                style={{
                  marginTop: 8,
                  background: 'rgba(196,69,107,0.15)',
                  color: 'var(--rose-light)',
                  fontSize: '0.8rem',
                  padding: '6px 16px',
                  borderRadius: 20,
                }}
              >
                I'm here
              </button>
            )}
            {p1Arrived && (
              <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--rose)', fontStyle: 'italic' }}>arrived</p>
            )}
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              border: `3px solid ${p2Arrived ? 'var(--teal)' : 'rgba(255,255,255,0.2)'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
              transition: 'all 0.5s ease',
              background: p2Arrived ? 'rgba(45,122,107,0.1)' : 'transparent',
            }}>
              <span style={{ fontSize: '1.6rem', color: p2Arrived ? 'var(--teal)' : 'rgba(255,255,255,0.3)' }}>
                {partner2[0]}
              </span>
            </div>
            <p style={{ color: p2Arrived ? 'var(--teal-light)' : 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>
              {partner2}
            </p>
            {!p2Arrived && (
              <button
                onClick={() => setP2Arrived(true)}
                style={{
                  marginTop: 8,
                  background: 'rgba(45,122,107,0.15)',
                  color: 'var(--teal-light)',
                  fontSize: '0.8rem',
                  padding: '6px 16px',
                  borderRadius: 20,
                }}
              >
                I'm here
              </button>
            )}
            {p2Arrived && (
              <p style={{ marginTop: 8, fontSize: '0.8rem', color: 'var(--teal)', fontStyle: 'italic' }}>arrived</p>
            )}
          </div>
        </div>

        {p1Arrived && p2Arrived && (
          <p className="fade-in" style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.6)',
            fontStyle: 'italic',
          }}>
            Both present. Entering the Temenos...
          </p>
        )}
      </div>
    </div>
  );
}
