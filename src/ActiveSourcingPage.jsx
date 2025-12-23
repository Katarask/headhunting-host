import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TargetCursor from './TargetCursor';

// ══════════════════════════════════════════════════════════════════════════════
// ACTIVE SOURCING LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════════
// 
// Unique Angles:
// 1. ROI-Rechner (nicht nur Floskeln)
// 2. Make-or-Buy Entscheidungstabelle
// 3. Brutale Ehrlichkeit (Pain Points)
// 4. IT & Defense Spezialist
//
// ══════════════════════════════════════════════════════════════════════════════

// Design Tokens
const T = {
  colors: {
    sand: '#DBD6CC',
    cream: '#EFEDE5',
    burgundy: '#652126',
    black: '#0a0a0a',
    darkAlt: '#151413',
    muted: 'rgba(10, 10, 10, 0.45)',
    mutedLight: 'rgba(239, 237, 229, 0.55)',
    border: 'rgba(101, 33, 38, 0.12)',
    borderLight: 'rgba(239, 237, 229, 0.15)',
    success: '#2D5A3D',
    warning: '#8B6914',
    danger: '#652126',
  },
  font: '"JetBrains Mono", "SF Mono", monospace',
  space: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
    section: 'clamp(80px, 12vw, 140px)',
  },
  easing: {
    smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
    snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
  timing: {
    fast: '200ms',
    medium: '400ms',
    slow: '800ms',
  },
};

// Responsive Hook
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return { isMobile };
};

// Grain Overlay
const GrainOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 9999, opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
);

// Header Navigation
const Header = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      padding: '20px 10vw',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrolled ? 'rgba(219, 214, 204, 0.95)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <Link to="/" style={{
        fontFamily: T.font,
        fontSize: '12px',
        fontWeight: 500,
        color: T.colors.black,
        textDecoration: 'none',
        letterSpacing: '0.1em',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ color: T.colors.burgundy }}>←</span> DENIZ TULAY
      </Link>
      <nav style={{ display: 'flex', gap: '32px' }}>
        <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>LinkedIn</a>
        <a href="mailto:d.l.tulay@tekom-gmbh.de" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>Kontakt</a>
      </nav>
    </header>
  );
};

// Animated Number
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(0);
  
  useEffect(() => {
    const start = prevValue.current;
    const end = value;
    const duration = 1200;
    const startTime = performance.now();
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = value;
    };
    
    requestAnimationFrame(animate);
  }, [value]);
  
  return <>{prefix}{display.toLocaleString('de-DE')}{suffix}</>;
};

// FadeIn Component
const FadeIn = ({ children, delay = 0 }) => {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all ${T.timing.slow} ${T.easing.snappy}`,
      }}
    >
      {children}
    </div>
  );
};

// Button Component
const Button = ({ children, onClick, variant = 'primary', fullWidth = false }) => {
  const [hover, setHover] = useState(false);
  
  const styles = {
    primary: {
      bg: hover ? T.colors.burgundy : 'transparent',
      border: T.colors.burgundy,
      color: hover ? T.colors.cream : T.colors.burgundy,
    },
    dark: {
      bg: hover ? T.colors.cream : 'transparent',
      border: T.colors.cream,
      color: hover ? T.colors.black : T.colors.cream,
    },
  };
  
  const s = styles[variant];
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '20px 48px',
        width: fullWidth ? '100%' : 'auto',
        background: s.bg,
        border: `1.5px solid ${s.border}`,
        color: s.color,
        fontFamily: T.font,
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: `all ${T.timing.fast} ${T.easing.smooth}`,
      }}
    >
      {children}
    </button>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// ROI RECHNER COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const ROIRechner = () => {
  const { isMobile } = useResponsive();
  
  const [stellen, setStellen] = useState(3);
  const [hrStundensatz, setHrStundensatz] = useState(45);
  const [aktuelleTimeToHire, setAktuelleTimeToHire] = useState(120);
  const [level, setLevel] = useState('senior');
  
  // Berechnungslogik
  const levelData = {
    junior: { gehalt: 50000, faktor: 1.0 },
    senior: { gehalt: 75000, faktor: 1.5 },
    lead: { gehalt: 95000, faktor: 2.0 },
  };
  
  const gehalt = levelData[level].gehalt;
  
  // Intern: HR-Zeit + Opportunitätskosten
  const stundenProStelle = 80; // 80h Active Sourcing pro Stelle
  const internKosten = stellen * stundenProStelle * hrStundensatz;
  const internZeit = '12-16 Wochen';
  const internErfolg = 45;
  
  // Freelancer: Tagessatz + Zeit
  const freelancerTagessatz = 600;
  const freelancerTage = 15;
  const freelancerKosten = stellen * freelancerTagessatz * freelancerTage;
  const freelancerZeit = '8-12 Wochen';
  const freelancerErfolg = 60;
  
  // Headhunter: % vom Gehalt, aber schneller
  const headhunterProzent = 0.22;
  const headhunterKosten = stellen * gehalt * headhunterProzent;
  const headhunterZeit = '4-6 Wochen';
  const headhunterErfolg = 92;
  
  // Günstigste Option ermitteln
  const options = [
    { name: 'intern', kosten: internKosten },
    { name: 'freelancer', kosten: freelancerKosten },
    { name: 'headhunter', kosten: headhunterKosten },
  ];
  const cheapest = options.reduce((a, b) => a.kosten < b.kosten ? a : b).name;
  const fastest = 'headhunter';
  
  // Empfehlung
  const getEmpfehlung = () => {
    if (stellen <= 1 && level === 'junior') {
      return { text: 'Für 1 Junior-Stelle lohnt sich internes Sourcing.', winner: 'intern' };
    }
    if (stellen >= 3 || level === 'lead') {
      return { text: `Bei ${stellen} ${level === 'lead' ? 'Lead' : 'Senior'}-Stellen sparen Sie mit Headhunter Zeit und Nerven.`, winner: 'headhunter' };
    }
    return { text: 'Ein Freelancer könnte hier der Sweet Spot sein.', winner: 'freelancer' };
  };
  
  const empfehlung = getEmpfehlung();
  
  return (
    <div>
      {/* Inputs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
        gap: T.space.xl,
        marginBottom: T.space.xxl,
      }}>
        {/* Anzahl Stellen */}
        <div>
          <label style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: T.font,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            <span>Offene IT-Stellen</span>
            <span style={{ color: T.colors.burgundy, fontSize: '16px' }}>{stellen}</span>
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={stellen}
            onChange={(e) => setStellen(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        {/* HR Stundensatz */}
        <div>
          <label style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: T.font,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            <span>HR-Stundensatz (intern)</span>
            <span style={{ color: T.colors.burgundy, fontSize: '16px' }}>€{hrStundensatz}</span>
          </label>
          <input
            type="range"
            min="30"
            max="80"
            step="5"
            value={hrStundensatz}
            onChange={(e) => setHrStundensatz(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        {/* Time to Hire */}
        <div>
          <label style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: T.font,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            <span>Aktuelle Time-to-Hire</span>
            <span style={{ color: T.colors.burgundy, fontSize: '16px' }}>{aktuelleTimeToHire} Tage</span>
          </label>
          <input
            type="range"
            min="30"
            max="200"
            step="10"
            value={aktuelleTimeToHire}
            onChange={(e) => setAktuelleTimeToHire(parseInt(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>
        
        {/* Level */}
        <div>
          <label style={{
            display: 'block',
            fontFamily: T.font,
            fontSize: '11px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            Senioritätslevel
          </label>
          <div style={{ display: 'flex', gap: '2px' }}>
            {['junior', 'senior', 'lead'].map((l) => (
              <button
                key={l}
                onClick={() => setLevel(l)}
                style={{
                  flex: 1,
                  padding: '16px',
                  background: level === l ? T.colors.burgundy : T.colors.darkAlt,
                  border: `1px solid ${level === l ? T.colors.burgundy : T.colors.borderLight}`,
                  color: T.colors.cream,
                  fontFamily: T.font,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: `all ${T.timing.fast}`,
                }}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Results - 3 Column Comparison */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: '2px',
        background: T.colors.borderLight,
        marginBottom: T.space.xl,
      }}>
        {/* Intern */}
        <div style={{
          padding: T.space.lg,
          background: empfehlung.winner === 'intern' ? T.colors.burgundy : T.colors.darkAlt,
          transition: `all ${T.timing.medium}`,
        }}>
          <div style={{
            fontFamily: T.font,
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            Intern
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '32px',
            fontWeight: 300,
            color: T.colors.cream,
            marginBottom: T.space.md,
          }}>
            €<AnimatedNumber value={internKosten} />
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '12px',
            color: T.colors.mutedLight,
            lineHeight: 1.8,
          }}>
            <div>⏱ {internZeit}</div>
            <div>📊 {internErfolg}% Erfolgsquote</div>
            <div>⚠️ Kein Garantie</div>
          </div>
        </div>
        
        {/* Freelancer */}
        <div style={{
          padding: T.space.lg,
          background: empfehlung.winner === 'freelancer' ? T.colors.burgundy : T.colors.darkAlt,
          transition: `all ${T.timing.medium}`,
        }}>
          <div style={{
            fontFamily: T.font,
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            Freelancer
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '32px',
            fontWeight: 300,
            color: T.colors.cream,
            marginBottom: T.space.md,
          }}>
            €<AnimatedNumber value={freelancerKosten} />
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '12px',
            color: T.colors.mutedLight,
            lineHeight: 1.8,
          }}>
            <div>⏱ {freelancerZeit}</div>
            <div>📊 {freelancerErfolg}% Erfolgsquote</div>
            <div>⚠️ Selten Garantie</div>
          </div>
        </div>
        
        {/* Headhunter */}
        <div style={{
          padding: T.space.lg,
          background: empfehlung.winner === 'headhunter' ? T.colors.burgundy : T.colors.darkAlt,
          transition: `all ${T.timing.medium}`,
          position: 'relative',
        }}>
          {empfehlung.winner === 'headhunter' && (
            <div style={{
              position: 'absolute',
              top: T.space.sm,
              right: T.space.sm,
              background: T.colors.cream,
              color: T.colors.burgundy,
              fontFamily: T.font,
              fontSize: '9px',
              letterSpacing: '0.1em',
              padding: '4px 8px',
              textTransform: 'uppercase',
            }}>
              Empfohlen
            </div>
          )}
          <div style={{
            fontFamily: T.font,
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            Headhunter
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '32px',
            fontWeight: 300,
            color: T.colors.cream,
            marginBottom: T.space.md,
          }}>
            €<AnimatedNumber value={headhunterKosten} />
          </div>
          <div style={{
            fontFamily: T.font,
            fontSize: '12px',
            color: T.colors.mutedLight,
            lineHeight: 1.8,
          }}>
            <div>⏱ {headhunterZeit}</div>
            <div>📊 {headhunterErfolg}% Erfolgsquote</div>
            <div>✓ 6-12 Monate Garantie</div>
          </div>
        </div>
      </div>
      
      {/* Empfehlung */}
      <div style={{
        padding: T.space.lg,
        background: T.colors.burgundy,
        marginBottom: T.space.xl,
      }}>
        <div style={{
          fontFamily: T.font,
          fontSize: '10px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: T.colors.cream,
          opacity: 0.7,
          marginBottom: T.space.sm,
        }}>
          Fazit für Ihre Situation
        </div>
        <div style={{
          fontFamily: T.font,
          fontSize: '16px',
          color: T.colors.cream,
          lineHeight: 1.6,
        }}>
          {empfehlung.text}
        </div>
      </div>
      
      <Button variant="dark" fullWidth>
        Kostenlose Potenzialanalyse →
      </Button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PAIN POINT COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const PainPoint = ({ number, title, description }) => {
  const [hover, setHover] = useState(false);
  
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: T.space.xl,
        background: hover ? T.colors.burgundy : T.colors.cream,
        border: `1px solid ${T.colors.border}`,
        transition: `all ${T.timing.medium} ${T.easing.smooth}`,
        cursor: 'default',
      }}
    >
      <div style={{
        fontFamily: T.font,
        fontSize: '64px',
        fontWeight: 200,
        color: hover ? T.colors.cream : T.colors.burgundy,
        opacity: 0.3,
        lineHeight: 1,
        marginBottom: T.space.md,
        transition: `all ${T.timing.medium}`,
      }}>
        {number}
      </div>
      <div style={{
        fontFamily: T.font,
        fontSize: '18px',
        fontWeight: 500,
        color: hover ? T.colors.cream : T.colors.black,
        marginBottom: T.space.sm,
        transition: `all ${T.timing.medium}`,
      }}>
        {title}
      </div>
      <div style={{
        fontFamily: T.font,
        fontSize: '13px',
        lineHeight: 1.8,
        color: hover ? 'rgba(239,237,229,0.8)' : T.colors.muted,
        transition: `all ${T.timing.medium}`,
      }}>
        {description}
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// MAIN LANDING PAGE
// ══════════════════════════════════════════════════════════════════════════════
export default function ActiveSourcingLanding() {
  const { isMobile } = useResponsive();
  
  const painPoints = [
    {
      number: '01',
      title: '"Wir machen das nebenbei"',
      description: 'Ihr HR-Team jongliert Onboarding, Admin und Active Sourcing gleichzeitig. 2 Stunden pro Woche reichen nicht für gutes Sourcing.',
    },
    {
      number: '02',
      title: 'Copy-Paste LinkedIn-Nachrichten',
      description: 'Senior Devs bekommen 10-20 Anfragen pro Woche. Ihre generische InMail landet im digitalen Papierkorb. Response Rate: <3%.',
    },
    {
      number: '03',
      title: 'Alle fischen im selben Teich',
      description: 'LinkedIn ist überfischt. Die besten Kandidaten sind auf GitHub, Stack Overflow, Discord – aber wer hat Zeit, das zu lernen?',
    },
    {
      number: '04',
      title: 'Kein Tech-Verständnis',
      description: 'Wenn Ihr Recruiter nicht erklären kann, warum Rust spannender ist als Java, verlieren Sie den Kandidaten im ersten Call.',
    },
  ];

  return (
    <div style={{
      fontFamily: T.font,
      background: T.colors.sand,
      color: T.colors.black,
      minHeight: '100vh',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: ${T.colors.burgundy}; color: ${T.colors.cream}; }
        
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 2px;
          background: ${T.colors.borderLight};
          outline: none;
        }
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: ${T.colors.burgundy};
          cursor: pointer;
        }
      `}</style>

      <TargetCursor targetSelector=".cursor-target, a, button" color={T.colors.black} />
      <GrainOverlay />
      <Header />

      {/* ════════════════════════════════════════════════════════════════
          HERO - Provokation
      ════════════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        position: 'relative',
      }}>
        <FadeIn>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            marginBottom: T.space.lg,
          }}>
            Active Sourcing für IT & Engineering
          </div>
        </FadeIn>
        
        <FadeIn delay={100}>
          <h1 style={{
            fontSize: `clamp(36px, ${isMobile ? '8vw' : '5vw'}, 64px)`,
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            marginBottom: T.space.lg,
            maxWidth: '900px',
          }}>
            Warum Ihr Active Sourcing{' '}
            <span style={{ 
              color: T.colors.burgundy, 
              fontWeight: 400,
              textDecoration: 'line-through',
              textDecorationColor: T.colors.burgundy,
            }}>
              nicht funktioniert
            </span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p style={{
            fontSize: '16px',
            lineHeight: 1.8,
            color: T.colors.muted,
            maxWidth: '520px',
            marginBottom: T.space.xl,
          }}>
            Und wann Sie es trotzdem selbst machen sollten. 
            Der ehrliche Vergleich: Intern vs. Freelancer vs. Headhunter.
          </p>
        </FadeIn>
        
        <FadeIn delay={300}>
          <Button onClick={() => document.getElementById('rechner').scrollIntoView({ behavior: 'smooth' })}>
            Rechnet es sich für Sie? →
          </Button>
        </FadeIn>
        
        {/* Stats */}
        <div style={{
          position: 'absolute',
          right: isMobile ? '6vw' : '10vw',
          top: '50%',
          transform: 'translateY(-50%)',
          textAlign: 'right',
          display: isMobile ? 'none' : 'block',
        }}>
          <FadeIn delay={400}>
            <div style={{ marginBottom: T.space.xl }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 200,
                color: T.colors.burgundy,
                lineHeight: 1,
              }}>10-20</div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: T.colors.muted,
                marginTop: T.space.xs,
              }}>LinkedIn-Anfragen/Woche<br/>bekommt jeder Senior Dev</div>
            </div>
          </FadeIn>
          
          <FadeIn delay={500}>
            <div style={{ marginBottom: T.space.xl }}>
              <div style={{
                fontSize: '48px',
                fontWeight: 200,
                color: T.colors.burgundy,
                lineHeight: 1,
              }}>&lt;3%</div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: T.colors.muted,
                marginTop: T.space.xs,
              }}>Response Rate<br/>auf Standard-InMails</div>
            </div>
          </FadeIn>
          
          <FadeIn delay={600}>
            <div>
              <div style={{
                fontSize: '48px',
                fontWeight: 200,
                color: T.colors.burgundy,
                lineHeight: 1,
              }}>143+</div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: T.colors.muted,
                marginTop: T.space.xs,
              }}>Tage ø Time-to-Hire<br/>in Deutschland</div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          ROI RECHNER
      ════════════════════════════════════════════════════════════════ */}
      <section
        id="rechner"
        style={{
          background: T.colors.black,
          color: T.colors.cream,
          padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        }}
      >
        <FadeIn>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            ROI Rechner
          </div>
          
          <h2 style={{
            fontSize: `clamp(28px, ${isMobile ? '6vw' : '3vw'}, 42px)`,
            fontWeight: 300,
            marginBottom: T.space.xxl,
            maxWidth: '600px',
          }}>
            Lohnt sich Active Sourcing{' '}
            <span style={{ color: T.colors.burgundy }}>intern</span>?
          </h2>
        </FadeIn>
        
        <ROIRechner />
      </section>

      {/* ════════════════════════════════════════════════════════════════
          PAIN POINTS - Brutal ehrlich
      ════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: T.colors.sand,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <FadeIn>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            marginBottom: T.space.md,
          }}>
            Die unbequeme Wahrheit
          </div>
          
          <h2 style={{
            fontSize: `clamp(28px, ${isMobile ? '6vw' : '3vw'}, 42px)`,
            fontWeight: 300,
            marginBottom: T.space.xxl,
            maxWidth: '700px',
          }}>
            Warum Ihre LinkedIn-Nachrichten{' '}
            <span style={{ color: T.colors.burgundy }}>ignoriert</span> werden
          </h2>
        </FadeIn>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: T.space.md,
        }}>
          {painPoints.map((point, i) => (
            <FadeIn key={i} delay={i * 100}>
              <PainPoint {...point} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MEINE METHODE
      ════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: T.colors.darkAlt,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: T.space.xxl,
        }}>
          <div>
            <FadeIn>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.colors.mutedLight,
                marginBottom: T.space.md,
              }}>
                Meine Methode
              </div>
              
              <h2 style={{
                fontSize: `clamp(28px, ${isMobile ? '6vw' : '3vw'}, 42px)`,
                fontWeight: 300,
                marginBottom: T.space.xl,
              }}>
                Wie ich Active Sourcing{' '}
                <span style={{ color: T.colors.burgundy }}>anders</span> mache
              </h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: T.space.lg,
              }}>
                {[
                  { title: 'Multi-Channel', desc: 'Nicht nur LinkedIn. GitHub Commits, Stack Overflow, Discord, Meetups.' },
                  { title: 'Personalisiert', desc: 'Jede Nachricht referenziert echte Projekte. Kein Copy-Paste.' },
                  { title: 'Tech-Verständnis', desc: 'Ich spreche IT, nicht HR-Deutsch. Gespräche auf Augenhöhe.' },
                  { title: 'Schnell', desc: '42 Tage ø Time-to-Hire. Weil ich nur IT & Engineering mache.' },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: T.space.lg,
                      borderLeft: `2px solid ${T.colors.burgundy}`,
                    }}
                  >
                    <div style={{
                      fontFamily: T.font,
                      fontSize: '14px',
                      fontWeight: 500,
                      color: T.colors.cream,
                      marginBottom: T.space.xs,
                    }}>
                      {item.title}
                    </div>
                    <div style={{
                      fontFamily: T.font,
                      fontSize: '13px',
                      color: T.colors.mutedLight,
                      lineHeight: 1.7,
                    }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
          
          {/* Track Record */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: isMobile ? 'flex-start' : 'flex-end',
            textAlign: isMobile ? 'left' : 'right',
          }}>
            <FadeIn delay={200}>
              {[
                { value: '500+', label: 'Placements' },
                { value: '98%', label: 'Retention Rate' },
                { value: '42', label: 'Tage ø Time-to-Hire' },
              ].map((stat, i) => (
                <div key={i} style={{ marginBottom: T.space.xl }}>
                  <div style={{
                    fontSize: '56px',
                    fontWeight: 200,
                    color: T.colors.burgundy,
                    lineHeight: 1,
                  }}>
                    {stat.value}
                  </div>
                  <div style={{
                    fontSize: '10px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: T.colors.mutedLight,
                    marginTop: T.space.xs,
                  }}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════════ */}
      <section style={{
        background: T.colors.burgundy,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        textAlign: 'center',
      }}>
        <FadeIn>
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(239, 237, 229, 0.6)',
              marginBottom: T.space.md,
            }}>
              Nächster Schritt
            </div>
            
            <h2 style={{
              fontSize: `clamp(28px, ${isMobile ? '6vw' : '4vw'}, 48px)`,
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: T.space.lg,
            }}>
              Keine Zeit für Active Sourcing?
            </h2>
            
            <p style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(239, 237, 229, 0.7)',
              marginBottom: T.space.xl,
            }}>
              Ich übernehme das. Erfolgsbasiert, mit Garantie.<br/>
              Spezialisiert auf IT, Engineering & Defense.
            </p>
            
            <Button variant="dark">
              Kostenlose Potenzialanalyse →
            </Button>
          </div>
        </FadeIn>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: T.colors.black,
        color: T.colors.cream,
        padding: `${T.space.xl} ${isMobile ? '6vw' : '10vw'}`,
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: T.space.lg,
      }}>
        <div style={{
          fontSize: '11px',
          color: T.colors.mutedLight,
        }}>
          © 2024 Deniz Tulay — Tech Headhunter München
        </div>
        <div style={{
          display: 'flex',
          gap: T.space.xl,
        }}>
          <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>LinkedIn</a>
          <a href="mailto:d.l.tulay@tekom-gmbh.de" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Email</a>
          <Link to="/" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hauptseite</Link>
        </div>
      </footer>
    </div>
  );
}
