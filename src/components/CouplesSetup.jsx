import { useState } from 'react';

export default function CouplesSetup({ onStart, onBack }) {
  const [partner1, setPartner1] = useState('');
  const [partner2, setPartner2] = useState('');

  function handleStart(e) {
    e.preventDefault();
    if (partner1.trim() && partner2.trim()) {
      onStart(partner1.trim(), partner2.trim());
    }
  }

  return (
    <div className="screen-center fade-in">
      <h2 style={{ fontSize: '2rem', color: 'var(--rose)', marginBottom: 8 }}>The Temenos</h2>
      <p style={{ color: 'var(--charcoal-light)', marginBottom: 32, maxWidth: 400, fontStyle: 'italic', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
        A sacred space for two
      </p>

      <form onSubmit={handleStart} style={{ width: '100%', maxWidth: 360 }}>
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: 4, textAlign: 'left' }}>
            Partner one
          </label>
          <input
            value={partner1}
            onChange={e => setPartner1(e.target.value)}
            placeholder="First name"
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: 4, textAlign: 'left' }}>
            Partner two
          </label>
          <input
            value={partner2}
            onChange={e => setPartner2(e.target.value)}
            placeholder="First name"
          />
        </div>

        <button
          type="submit"
          className="btn-secondary"
          disabled={!partner1.trim() || !partner2.trim()}
          style={{ width: '100%', padding: '14px', fontSize: '1.05rem', marginBottom: 12 }}
        >
          Begin
        </button>

        <button type="button" onClick={onBack} style={{
          background: 'none',
          color: 'var(--teal)',
          fontSize: '0.9rem',
          width: '100%',
        }}>
          ← Back
        </button>
      </form>
    </div>
  );
}
