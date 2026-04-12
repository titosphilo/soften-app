import Mandala from './Mandala';

export default function TemenosInvitation({ partner1, partner2, onAccept }) {
  return (
    <div className="screen fade-in" style={{ background: 'var(--charcoal)' }}>
      <header style={{
        padding: '16px 20px',
        display: 'flex',
        justifyContent: 'center',
        background: 'var(--charcoal)',
      }}>
        <Mandala size={120} />
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
          fontSize: '1.8rem',
          color: 'var(--rose-light)',
          marginBottom: 32,
          fontWeight: 400,
          fontStyle: 'italic',
        }}>
          {partner1} invites {partner2}<br />into the Temenos
        </h2>

        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          color: 'rgba(255,255,255,0.7)',
          marginBottom: 48,
          maxWidth: 400,
          lineHeight: 1.6,
          fontStyle: 'italic',
        }}>
          "What is spoken here<br />is held here."
        </p>

        <p style={{
          fontSize: '0.85rem',
          color: 'rgba(255,255,255,0.4)',
          marginBottom: 32,
          maxWidth: 360,
        }}>
          This is a space of honesty and safety. Philo will be present as guardian of this space. Both partners are seen. Both voices matter.
        </p>

        <button
          className="btn-primary"
          onClick={onAccept}
          style={{ padding: '14px 48px', fontSize: '1.05rem' }}
        >
          I accept this invitation
        </button>
      </div>
    </div>
  );
}
