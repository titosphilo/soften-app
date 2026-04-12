export default function Home({ onSolo, onCouples }) {
  return (
    <div className="screen-center fade-in">
      <h1 style={{ fontSize: '2.8rem', color: 'var(--rose)', marginBottom: 8 }}>Soften</h1>
      <p style={{ color: 'var(--charcoal-light)', marginBottom: 48, maxWidth: 400 }}>
        Welcome. How would you like to work with Philo today?
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, width: '100%', maxWidth: 340 }}>
        <button className="btn-primary" onClick={onSolo} style={{ padding: '16px 28px', fontSize: '1.05rem' }}>
          Solo Session
        </button>
        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: -8 }}>
          A private conversation with Philo
        </p>

        <button className="btn-secondary" onClick={onCouples} style={{ padding: '16px 28px', fontSize: '1.05rem' }}>
          Couples Session
        </button>
        <p style={{ fontSize: '0.85rem', color: '#888', marginTop: -8 }}>
          Enter the Temenos together
        </p>
      </div>
    </div>
  );
}
