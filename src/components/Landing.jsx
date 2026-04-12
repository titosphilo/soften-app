import { useState, useEffect, useRef } from 'react';

const TERMS = `SOFTEN — TERMS AND CONDITIONS

Last updated: April 2026

1. ACCEPTANCE OF TERMS
By accessing or using the Soften application ("the App"), you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the App.

2. NATURE OF THE SERVICE
Soften is an AI-powered relationship coaching tool. It is NOT a substitute for professional therapy, counselling, or medical advice. The AI coach ("Philo") provides reflective guidance based on established psychological frameworks including Jungian psychology and Emotionally Focused Therapy (EFT).

3. NOT A CRISIS SERVICE
Soften is not equipped to handle mental health emergencies, domestic violence situations, or any crisis requiring immediate professional intervention. If you are in danger, please contact emergency services (999) or the National Domestic Abuse Helpline (0808 2000 247) immediately.

4. PRIVACY AND CONFIDENTIALITY
- Conversations with Philo are processed through the Anthropic API. Messages are sent to Anthropic's servers for AI processing.
- We do not store your conversations permanently on our servers.
- You are responsible for the privacy of your own device.
- In couples mode, both partners can see all messages in the shared session.

5. COUPLES MODE — INFORMED CONSENT
When using couples mode (Temenos), both partners must be aware that:
- All messages are visible to both participants
- Messages are screened by AI for safety before delivery
- The AI may pause or intervene in the conversation if harmful communication is detected
- Either partner may leave the session at any time

6. MESSAGE SCREENING
In couples mode, messages are automatically screened for contempt, abuse, and threats. This screening is AI-powered and may not be perfect. The screening system:
- May flag passionate but non-harmful language (false positives)
- May miss subtle forms of emotional abuse (false negatives)
- Is a support tool, not a safeguarding guarantee

7. EMERGENCY INFORMATION
If you or someone you know is experiencing domestic abuse or is in immediate danger:
- Emergency Services: 999
- Samaritans: 116 123
- National Domestic Abuse Helpline: 0808 2000 247
- Men's Advice Line: 0808 801 0327
- Shout Crisis Text Line: Text 85258

8. USER RESPONSIBILITIES
- You agree to use the App respectfully and in good faith
- You must be 18 years or older to use the App
- You are responsible for any content you submit
- You agree not to use the App to harass, threaten, or harm others

9. LIMITATION OF LIABILITY
Soften, its creators, and its AI systems are provided "as is" without warranty. We are not liable for any decisions made based on interactions with the App. Relationship outcomes depend on many factors beyond the scope of any coaching tool.

10. AI LIMITATIONS
Philo is an AI system. It can be helpful, insightful, and supportive, but it:
- Cannot diagnose mental health conditions
- Cannot replace human professional support
- May occasionally provide responses that are not perfectly suited to your situation
- Does not have memory between sessions

11. MODIFICATIONS
We reserve the right to modify these terms at any time. Continued use of the App after changes constitutes acceptance of the new terms.

12. GOVERNING LAW
These terms are governed by the laws of England and Wales.

By proceeding, you confirm that you have read, understood, and agree to these Terms and Conditions.`;

export default function Landing({ onAccept }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setUnlocked(true), 3000);
    return () => clearTimeout(timerRef.current);
  }, []);

  const canProceed = unlocked && checked1 && checked2;

  return (
    <div className="screen-center fade-in" style={{ maxWidth: 600, margin: '0 auto' }}>
      <h1 style={{ fontSize: '3rem', color: 'var(--rose)', marginBottom: 8 }}>Soften</h1>
      <p style={{ fontSize: '1.1rem', color: 'var(--charcoal-light)', marginBottom: 24 }}>
        Relationship coaching, guided by Philo
      </p>

      <div style={{
        width: '100%',
        height: 320,
        overflow: 'auto',
        border: '2px solid #ddd',
        borderRadius: 12,
        padding: 20,
        textAlign: 'left',
        fontSize: '0.85rem',
        lineHeight: 1.7,
        background: 'white',
        marginBottom: 24,
        whiteSpace: 'pre-wrap',
      }}>
        {TERMS}
      </div>

      {!unlocked && (
        <p style={{ fontSize: '0.85rem', color: 'var(--rose-light)', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>
          Please take a moment to read the terms above...
        </p>
      )}

      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        textAlign: 'left',
        marginBottom: 12,
        opacity: unlocked ? 1 : 0.4,
        transition: 'opacity 0.3s',
        width: '100%',
      }}>
        <input
          type="checkbox"
          checked={checked1}
          disabled={!unlocked}
          onChange={e => setChecked1(e.target.checked)}
          style={{ marginTop: 4, width: 'auto' }}
        />
        <span style={{ fontSize: '0.9rem' }}>
          I understand that Soften is a coaching tool, not a substitute for professional therapy or crisis support.
        </span>
      </label>

      <label style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        textAlign: 'left',
        marginBottom: 24,
        opacity: unlocked ? 1 : 0.4,
        transition: 'opacity 0.3s',
        width: '100%',
      }}>
        <input
          type="checkbox"
          checked={checked2}
          disabled={!unlocked}
          onChange={e => setChecked2(e.target.checked)}
          style={{ marginTop: 4, width: 'auto' }}
        />
        <span style={{ fontSize: '0.9rem' }}>
          I have read and agree to the Terms and Conditions above.
        </span>
      </label>

      <button
        className="btn-primary"
        disabled={!canProceed}
        onClick={onAccept}
        style={{ width: '100%', padding: '14px 28px', fontSize: '1.05rem' }}
      >
        Enter Soften
      </button>
    </div>
  );
}
