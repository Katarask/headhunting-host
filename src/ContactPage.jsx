import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import TargetCursor from './TargetCursor';
import Header from './Header';
import T from './designTokens';

// Grain Overlay
const GrainOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 9999, opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
);


// Input Component
const Input = ({ label, type = 'text', name, value, onChange, required = false, placeholder }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: '32px' }}>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: T.colors.muted,
        marginBottom: '16px',
      }}>
        {label} {required && <span style={{ color: T.colors.burgundy }}>*</span>}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="cursor-target"
        style={{
          width: '100%',
          padding: '24px',
          background: 'transparent',
          border: `1px solid ${focused ? T.colors.burgundy : T.colors.border}`,
          fontFamily: T.font,
          fontSize: '14px',
          color: T.colors.black,
          outline: 'none',
          transition: 'border-color 200ms',
        }}
      />
    </div>
  );
};

// Textarea Component
const Textarea = ({ label, name, value, onChange, required = false, placeholder, rows = 5 }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: '32px' }}>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: T.colors.muted,
        marginBottom: '16px',
      }}>
        {label} {required && <span style={{ color: T.colors.burgundy }}>*</span>}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        rows={rows}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="cursor-target"
        style={{
          width: '100%',
          padding: '24px',
          background: 'transparent',
          border: `1px solid ${focused ? T.colors.burgundy : T.colors.border}`,
          fontFamily: T.font,
          fontSize: '14px',
          color: T.colors.black,
          outline: 'none',
          resize: 'vertical',
          minHeight: '120px',
          transition: 'border-color 200ms',
        }}
      />
    </div>
  );
};

// Select Component
const Select = ({ label, name, value, onChange, options, required = false }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: '32px' }}>
      <label style={{
        display: 'block',
        fontFamily: T.font,
        fontSize: '10px',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: T.colors.muted,
        marginBottom: '16px',
      }}>
        {label} {required && <span style={{ color: T.colors.burgundy }}>*</span>}
      </label>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="cursor-target"
        style={{
          width: '100%',
          padding: '24px',
          background: T.colors.sand,
          border: `1px solid ${focused ? T.colors.burgundy : T.colors.border}`,
          fontFamily: T.font,
          fontSize: '14px',
          color: T.colors.black,
          outline: 'none',
          cursor: 'pointer',
          transition: 'border-color 200ms',
        }}
      >
        {options.map((opt, i) => (
          <option key={i} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
};

// Button Component
const Button = ({ children, disabled = false, loading = false, fullWidth = false }) => {
  const [hover, setHover] = useState(false);

  return (
    <button
      type="submit"
      disabled={disabled || loading}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="cursor-target"
      style={{
        padding: '20px 48px',
        width: fullWidth ? '100%' : 'auto',
        background: hover && !disabled ? T.colors.burgundy : 'transparent',
        border: `1.5px solid ${T.colors.burgundy}`,
        color: hover && !disabled ? T.colors.cream : T.colors.burgundy,
        fontFamily: T.font,
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)',
      }}
    >
      {loading ? 'Wird gesendet...' : children}
    </button>
  );
};

// Success Message
const SuccessMessage = () => (
  <div style={{
    padding: '48px',
    background: T.colors.black,
    textAlign: 'center',
  }}>
    <div style={{
      fontSize: '48px',
      marginBottom: '24px',
      color: T.colors.cream,
    }}>
      &#10003;
    </div>
    <div style={{
      fontFamily: T.font,
      fontSize: '18px',
      color: T.colors.cream,
      marginBottom: '16px',
    }}>
      Nachricht gesendet
    </div>
    <div style={{
      fontFamily: T.font,
      fontSize: '13px',
      color: T.colors.mutedLight,
    }}>
      Ich melde mich innerhalb von 24 Stunden.
    </div>
  </div>
);

// Error Message
const ErrorMessage = ({ message }) => (
  <div style={{
    padding: '24px',
    background: T.colors.danger,
    marginBottom: '32px',
  }}>
    <div style={{
      fontFamily: T.font,
      fontSize: '13px',
      color: T.colors.cream,
    }}>
      {message}
    </div>
  </div>
);

// Main Contact Page
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    betreff: 'Allgemeine Anfrage',
    nachricht: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          betreff: formData.betreff,
          nachricht: formData.nachricht,
          quelle: 'Kontaktformular',
        }),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Senden');
      }

      setStatus('success');
      setFormData({ name: '', email: '', betreff: 'Allgemeine Anfrage', nachricht: '' });

    } catch (error) {
      console.error('Form error:', error);
      setStatus('error');
      setErrorMessage('Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut oder schreiben Sie mir direkt: d.l.tulay@tekom-gmbh.de');
    }
  };

  const betreffOptions = [
    { value: 'Allgemeine Anfrage', label: 'Allgemeine Anfrage' },
    { value: 'Kandidat', label: 'Ich bin Kandidat' },
    { value: 'Unternehmen', label: 'Ich suche Talente' },
    { value: 'Partnerschaft', label: 'Partnerschaft' },
    { value: 'Sonstiges', label: 'Sonstiges' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: T.colors.sand,
      fontFamily: T.font,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${T.colors.burgundy}; color: ${T.colors.cream}; }
      `}</style>

      <TargetCursor targetSelector=".cursor-target, a, button, input, textarea, select" color={T.colors.black} />
      <GrainOverlay />
      <Header currentPage="kontakt" />

      <div style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '140px 24px 64px',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            marginBottom: '24px',
          }}>
            Kontakt
          </div>

          <h1 style={{
            fontSize: 'clamp(28px, 5vw, 36px)',
            fontWeight: 300,
            color: T.colors.black,
            marginBottom: '24px',
          }}>
            Lassen Sie uns{' '}
            <span style={{ color: T.colors.burgundy }}>sprechen</span>
          </h1>

          <p style={{
            fontSize: '14px',
            lineHeight: 1.8,
            color: T.colors.muted,
          }}>
            Erzaehlen Sie mir von Ihrer Herausforderung.
            Ich melde mich innerhalb von 24 Stunden.
          </p>
        </div>

        {/* Form */}
        {status === 'success' ? (
          <SuccessMessage />
        ) : (
          <form onSubmit={handleSubmit}>
            {status === 'error' && <ErrorMessage message={errorMessage} />}

            <Input
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Ihr Name"
            />

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="ihre@email.de"
            />

            <Select
              label="Betreff"
              name="betreff"
              value={formData.betreff}
              onChange={handleChange}
              options={betreffOptions}
              required
            />

            <Textarea
              label="Nachricht"
              name="nachricht"
              value={formData.nachricht}
              onChange={handleChange}
              required
              placeholder="Wie kann ich Ihnen helfen?"
              rows={6}
            />

            <Button
              disabled={status === 'loading'}
              loading={status === 'loading'}
              fullWidth
            >
              Nachricht senden
            </Button>
          </form>
        )}

        {/* Alternative Contact */}
        <div style={{
          marginTop: '64px',
          paddingTop: '48px',
          borderTop: `1px solid ${T.colors.border}`,
        }}>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            marginBottom: '24px',
          }}>
            Oder direkt
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <a
              href="mailto:d.l.tulay@tekom-gmbh.de"
              className="cursor-target"
              style={{
                fontFamily: T.font,
                fontSize: '14px',
                color: T.colors.black,
                textDecoration: 'none',
              }}
            >
              d.l.tulay@tekom-gmbh.de
            </a>
            <a
              href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025"
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-target"
              style={{
                fontFamily: T.font,
                fontSize: '14px',
                color: T.colors.black,
                textDecoration: 'none',
              }}
            >
              LinkedIn
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        background: T.colors.black,
        padding: '40px 8vw',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: `1px solid ${T.colors.borderLight}`
      }}>
        <div style={{ fontSize: '10px', color: T.colors.mutedLight }}>
          2024 Deniz Tulay - Tech Headhunter Muenchen
        </div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" className="cursor-target" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>LinkedIn</a>
          <a href="mailto:d.l.tulay@tekom-gmbh.de" className="cursor-target" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Email</a>
          <Link to="/" className="cursor-target" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hauptseite</Link>
        </div>
      </footer>
    </div>
  );
}
