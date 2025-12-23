import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TargetCursor from './TargetCursor';
import ElectricBorder from './ElectricBorder';
import Header from './Header';
import T from './designTokens';

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

// Timing constants (could be added to T later)
const timing = {
  fast: '200ms',
  medium: '400ms',
  slow: '800ms',
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
// STAGGERED PARAGRAPHS COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const StaggeredParagraphs = ({ text, isActive, resetKey }) => {
  const paragraphs = text.split('\n\n').filter(p => p.trim());
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (isActive) {
      setVisibleCount(0);
      const timers = paragraphs.map((_, i) =>
        setTimeout(() => setVisibleCount(prev => prev + 1), 150 + i * 200)
      );
      return () => timers.forEach(clearTimeout);
    } else {
      setVisibleCount(0);
    }
  }, [isActive, resetKey]);

  return (
    <div>
      {paragraphs.map((para, i) => (
        <p
          key={i}
          style={{
            fontFamily: T.font,
            fontSize: '14px',
            lineHeight: 2,
            color: T.colors.muted,
            marginBottom: i < paragraphs.length - 1 ? T.space.md : 0,
            opacity: i < visibleCount ? 1 : 0,
            transform: i < visibleCount ? 'translateY(0)' : 'translateY(15px)',
            transition: `all 500ms ${T.easing.snappy}`,
          }}
        >
          {para}
        </p>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// SCRAMBLE EFFECT HOOK
// ══════════════════════════════════════════════════════════════════════════════
const useScramble = (text, isActive) => {
  const [displayed, setDisplayed] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%&*';

  useEffect(() => {
    if (!isActive) { setDisplayed(text); return; }
    let frameId, iteration = 0;
    const startTime = performance.now();
    const duration = text.length * 60;

    const animate = (now) => {
      iteration = ((now - startTime) / duration) * text.length;
      setDisplayed(text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      if (iteration < text.length) frameId = requestAnimationFrame(animate);
      else setDisplayed(text);
    };
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isActive, text]);

  return displayed;
};

// ══════════════════════════════════════════════════════════════════════════════
// GLOWING TAB COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const GlowingTab = ({ item, isActive, onClick, isMobile }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const tabRef = useRef(null);
  const scrambledTitle = useScramble(item.title, isHovered);

  const handleMouseMove = (e) => {
    if (!tabRef.current || isActive) return;
    const rect = tabRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={tabRef}
      className="cursor-target"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: T.space.lg,
        background: isActive ? T.colors.burgundy : T.colors.cream,
        cursor: 'pointer',
        transition: `all ${T.timing.medium} ${T.easing.smooth}`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Hover Glow Effect - follows mouse */}
      {!isActive && isHovered && (
        <div
          style={{
            position: 'absolute',
            top: mousePos.y - 100,
            left: mousePos.x - 100,
            width: '200px',
            height: '200px',
            background: `radial-gradient(circle, ${T.colors.burgundy}25 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header Row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: T.space.md,
        position: 'relative',
        zIndex: 1,
      }}>
        <span style={{
          fontFamily: T.font,
          fontSize: '32px',
          fontWeight: 200,
          color: isActive ? T.colors.cream : T.colors.burgundy,
          opacity: isActive ? 0.7 : 0.5,
          lineHeight: 1,
          transition: `all ${T.timing.medium}`,
        }}>
          {item.number}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: '15px',
          fontWeight: 500,
          color: isActive ? T.colors.cream : T.colors.black,
          flex: 1,
          transition: `all ${T.timing.medium}`,
        }}>
          {scrambledTitle}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: '18px',
          color: isActive ? T.colors.cream : T.colors.burgundy,
          transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: `all ${T.timing.medium}`,
        }}>
          +
        </span>
      </div>

      {/* Mobile: Inline Description */}
      {isMobile && (
        <div style={{
          maxHeight: isActive ? '500px' : '0',
          overflow: 'hidden',
          transition: `all ${T.timing.medium} ${T.easing.smooth}`,
        }}>
          <div style={{
            paddingTop: T.space.md,
            fontFamily: T.font,
            fontSize: '13px',
            lineHeight: 1.9,
            color: 'rgba(239,237,229,0.85)',
          }}>
            {item.longDescription}
          </div>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// PAIN POINTS AKKORDEON COMPONENT
// ══════════════════════════════════════════════════════════════════════════════
const PainPointsAkkordeon = ({ items }) => {
  const [activeId, setActiveId] = useState(items[0]?.id || null);
  const { isMobile } = useResponsive();

  return (
    <div style={{
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      gap: '2px',
      background: T.colors.border,
    }}>
      {/* Left: Tab List */}
      <div style={{
        flex: isMobile ? 'none' : '0 0 45%',
        display: 'flex',
        flexDirection: 'column',
        gap: '2px',
      }}>
        {items.map((item) => (
          <GlowingTab
            key={item.id}
            item={item}
            isActive={activeId === item.id}
            onClick={() => setActiveId(item.id)}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Right: Description Panel (Desktop only) */}
      {!isMobile && (
        <div style={{
          flex: '1',
          background: T.colors.cream,
          padding: T.space.xl,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {items.map((item) => {
            const isActive = activeId === item.id;
            return (
              <div
                key={item.id}
                style={{
                  position: isActive ? 'relative' : 'absolute',
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(20px)',
                  transition: `all ${T.timing.medium} ${T.easing.smooth}`,
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div style={{
                  fontFamily: T.font,
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: T.colors.burgundy,
                  marginBottom: T.space.sm,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 400ms ${T.easing.snappy} 0ms`,
                }}>
                  {item.number} — Problem
                </div>
                <div style={{
                  fontFamily: T.font,
                  fontSize: '22px',
                  fontWeight: 400,
                  color: T.colors.black,
                  marginBottom: T.space.lg,
                  lineHeight: 1.3,
                  opacity: isActive ? 1 : 0,
                  transform: isActive ? 'translateY(0)' : 'translateY(10px)',
                  transition: `all 400ms ${T.easing.snappy} 50ms`,
                }}>
                  {item.title}
                </div>
                <StaggeredParagraphs
                  text={item.longDescription}
                  isActive={isActive}
                  resetKey={activeId}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FAQ ITEM COMPONENT (with mouse-following glow)
// ══════════════════════════════════════════════════════════════════════════════
const FAQItem = ({ item, index, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const scrambledTitle = useScramble(item.title, isHovered);

  const handleMouseMove = (e) => {
    if (!itemRef.current || isActive) return;
    const rect = itemRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={itemRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ position: 'relative' }}
    >
      {/* Glow Border when active */}
      {isActive && (
        <div style={{
          position: 'absolute',
          inset: 0,
          border: `1px solid ${T.colors.burgundy}`,
          boxShadow: `0 0 20px ${T.colors.burgundy}30`,
          pointerEvents: 'none',
          zIndex: 1,
        }} />
      )}

      {/* Mouse-following glow effect */}
      {isHovered && !isActive && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 0,
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${T.colors.burgundy}15, transparent 70%)`,
            transition: 'opacity 0.3s ease',
          }}
        />
      )}

      <button
        className="cursor-target"
        onClick={onClick}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: T.space.md,
          background: isActive
            ? `linear-gradient(90deg, ${T.colors.darkAlt}, rgba(101, 33, 38, 0.15))`
            : T.colors.darkAlt,
          border: 'none',
          borderBottom: `1px solid ${T.colors.borderLight}`,
          cursor: 'pointer',
          transition: `all ${T.timing.medium} ${T.easing.smooth}`,
        }}
      >
        <span style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: isActive ? T.colors.burgundy : T.colors.mutedLight,
          letterSpacing: '0.1em',
          opacity: 0.6,
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: '13px',
          fontWeight: 500,
          color: isHovered || isActive ? T.colors.cream : T.colors.mutedLight,
          letterSpacing: '0.02em',
          textAlign: 'left',
          flex: 1,
          transition: `all ${T.timing.medium}`,
        }}>
          {scrambledTitle}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: '18px',
          color: isActive ? T.colors.burgundy : T.colors.mutedLight,
          transform: isActive ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: `all ${T.timing.medium}`,
        }}>
          +
        </span>
      </button>

      {/* Content */}
      <div style={{
        maxHeight: isActive ? '300px' : '0',
        overflow: 'hidden',
        transition: `all ${T.timing.medium} ${T.easing.smooth}`,
        background: 'rgba(101, 33, 38, 0.05)',
      }}>
        <div style={{
          padding: isActive ? '20px 24px' : '0 24px',
          opacity: isActive ? 1 : 0,
          transition: `all ${T.timing.medium} 100ms`,
        }}>
          <p style={{
            fontFamily: T.font,
            fontSize: '13px',
            lineHeight: 1.9,
            color: T.colors.mutedLight,
            margin: 0,
          }}>
            {item.content}
          </p>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// FAQ AKKORDEON COMPONENT (unified style with Pain Points)
// ══════════════════════════════════════════════════════════════════════════════
const FAQAkkordeon = ({ items }) => {
  const [activeId, setActiveId] = useState(null);

  return (
    <div style={{
      background: T.colors.darkAlt,
      border: `1px solid ${T.colors.borderLight}`,
    }}>
      {/* Terminal Header */}
      <div style={{
        padding: '14px 24px',
        borderBottom: `1px solid ${T.colors.borderLight}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: T.colors.burgundy,
          boxShadow: `0 0 10px ${T.colors.burgundy}`,
        }} />
        <span style={{
          fontFamily: T.font,
          fontSize: '9px',
          color: T.colors.mutedLight,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}>
          FAQ_MODULE
        </span>
      </div>

      {/* FAQ Items */}
      {items.map((item, index) => (
        <FAQItem
          key={item.id}
          item={item}
          index={index}
          isActive={activeId === item.id}
          onClick={() => setActiveId(activeId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════════════════════
// STICKY CTA BUTTON
// ══════════════════════════════════════════════════════════════════════════════
const StickyCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show after scrolling past hero section (100vh)
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div style={{
      position: 'fixed',
      bottom: '32px',
      right: '32px',
      zIndex: 999,
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      pointerEvents: visible ? 'auto' : 'none',
      transition: `all 400ms ${T.easing.snappy}`,
    }}>
      <ElectricBorder color={T.colors.burgundy} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: '100px', display: 'inline-block' }}>
        <a
          href="mailto:d.l.tulay@tekom-gmbh.de"
          className="cursor-target"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '14px 24px',
            background: T.colors.black,
            border: 'none',
            borderRadius: '100px',
            color: T.colors.cream,
            fontFamily: T.font,
            fontSize: '11px',
            fontWeight: 500,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}
        >
          <span style={{
            width: '6px',
            height: '6px',
            borderRadius: '50%',
            background: T.colors.burgundy,
            boxShadow: `0 0 8px ${T.colors.burgundy}`,
          }} />
          Gespräch vereinbaren
        </a>
      </ElectricBorder>
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
      id: 'nebenbei',
      number: '01',
      title: '"Wir machen das nebenbei"',
      longDescription: `Ihr HR-Team jongliert Onboarding, Admin, Mitarbeitergespräche und Active Sourcing gleichzeitig. Das Ergebnis? 2-3 Stunden pro Woche für Sourcing – wenn überhaupt.

Das reicht vielleicht für ein paar LinkedIn-Suchen und Copy-Paste-Nachrichten. Aber für echtes Active Sourcing braucht es: Research, personalisierte Ansprache, Follow-ups, Netzwerkpflege, Marktbeobachtung.

Die Rechnung ist einfach: Ein guter Sourcer braucht 15-20 Stunden pro Woche pro Stelle. Bei 3 offenen Positionen sind das 45-60 Stunden – also mehr als ein Vollzeit-Job. "Nebenbei" funktioniert nicht.`,
    },
    {
      id: 'copypaste',
      number: '02',
      title: 'Copy-Paste LinkedIn-Nachrichten',
      longDescription: `Senior Entwickler bekommen 10-20 Recruiter-Anfragen pro Woche. Jeden Tag dasselbe: "Spannende Herausforderung", "Innovatives Unternehmen", "Attraktives Gehaltspaket".

Die Response Rate auf generische InMails liegt bei unter 3%. Das bedeutet: Von 100 Nachrichten antworten 3 Kandidaten – und davon sind vielleicht 1-2 ernsthaft interessiert.

Was funktioniert? Personalisierung. Referenz auf ein GitHub-Projekt. Ein konkreter Tech-Stack. Ein echter Grund, warum genau dieser Kandidat passt. Das kostet Zeit – 15-20 Minuten pro Nachricht statt 30 Sekunden. Aber die Response Rate steigt auf 25-40%.`,
    },
    {
      id: 'teich',
      number: '03',
      title: 'Alle fischen im selben Teich',
      longDescription: `95% aller Recruiter suchen auf LinkedIn. Das Problem: Die besten Entwickler sind dort entweder unsichtbar (kein aktives Profil) oder komplett abgestumpft (ignorieren alle Anfragen).

Wo sind die Top-Talente wirklich? Auf GitHub – wo sie Code committen. Auf Stack Overflow – wo sie Fragen beantworten. In Discord-Servern ihrer Lieblings-Frameworks. Auf Meetups und Konferenzen. In Open-Source-Communities.

Diese Kanäle zu erschließen braucht Zeit, Tech-Verständnis und Netzwerk. Ein HR-Generalist kann das nicht nebenbei lernen. Ein spezialisierter Tech-Recruiter lebt in diesen Communities.`,
    },
    {
      id: 'techverstaendnis',
      number: '04',
      title: 'Kein Tech-Verständnis',
      longDescription: `"Wir suchen jemanden mit 5 Jahren Kubernetes-Erfahrung" – Kubernetes gibt es seit 2014, also maximal 10 Jahre. Solche Fehler passieren, wenn Recruiter die Technologie nicht verstehen.

Das Problem geht tiefer: Wenn Ihr Recruiter nicht erklären kann, warum Rust spannender ist als Java, warum Ihr Microservices-Stack interessant ist, oder was der Unterschied zwischen einem Senior und einem Staff Engineer ist – verlieren Sie den Kandidaten im ersten Gespräch.

Entwickler merken in 30 Sekunden, ob ihr Gegenüber die Materie versteht. Tut er es nicht, ist das Gespräch vorbei – egal wie gut das Gehalt ist. Tech-Recruiting braucht Tech-Verständnis. Punkt.`,
    },
  ];

  return (
    <div style={{
      fontFamily: T.font,
      background: T.colors.sand,
      color: T.colors.black,
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@200;300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        ::selection { background: ${T.colors.burgundy}; color: ${T.colors.cream}; }
        .snap-section { scroll-snap-align: start; }

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
      <Header currentPage="active-sourcing" />
      <StickyCTA />

      {/* ════════════════════════════════════════════════════════════════
          HERO - Provokation
      ════════════════════════════════════════════════════════════════ */}
      <section className="snap-section" style={{
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
        className="snap-section"
        style={{
          background: T.colors.black,
          color: T.colors.cream,
          padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
          minHeight: '100vh',
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
      <section className="snap-section" style={{
        background: T.colors.sand,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        minHeight: '100vh',
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
        
        <FadeIn delay={100}>
          <PainPointsAkkordeon items={painPoints} />
        </FadeIn>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          MEINE METHODE
      ════════════════════════════════════════════════════════════════ */}
      <section className="snap-section" style={{
        background: T.colors.darkAlt,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        minHeight: '100vh',
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
          FAQ SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section className="snap-section" style={{
        background: T.colors.black,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        minHeight: '100vh',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.5fr',
          gap: T.space.xxl,
          alignItems: 'start',
        }}>
          <FadeIn>
            <div style={{
              fontSize: '11px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: T.colors.mutedLight,
              marginBottom: T.space.md,
            }}>
              Häufige Fragen
            </div>
            <h2 style={{
              fontSize: `clamp(28px, ${isMobile ? '6vw' : '3vw'}, 42px)`,
              fontWeight: 300,
              lineHeight: 1.2,
            }}>
              Alles über{' '}
              <span style={{ color: T.colors.burgundy }}>Active Sourcing</span>
            </h2>
          </FadeIn>

          <FadeIn delay={100}>
            <FAQAkkordeon items={[
              {
                id: 'was-ist',
                title: 'Was ist Active Sourcing?',
                content: 'Active Sourcing ist die proaktive Suche und Direktansprache von Kandidaten, die nicht aktiv auf Jobsuche sind. Im Gegensatz zu klassischen Stellenanzeigen gehen Sie aktiv auf potenzielle Mitarbeiter zu – über LinkedIn, GitHub, Fachforen oder persönliche Netzwerke.',
              },
              {
                id: 'kosten',
                title: 'Was kostet ein Headhunter?',
                content: 'Headhunter arbeiten meist erfolgsbasiert und berechnen 20-30% des Jahresgehalts. Bei einem Gehalt von 80.000€ sind das 16.000-24.000€. Klingt viel – aber verglichen mit den Vakanzkosten von 30.000€+ ist es oft die günstigere Option.',
              },
              {
                id: 'dauer',
                title: 'Wie lange dauert Active Sourcing?',
                content: 'Intern: 12-16 Wochen bei 45% Erfolgsquote. Mit spezialisiertem Headhunter: 4-6 Wochen bei 92% Erfolgsquote. Der Unterschied liegt in Netzwerk, Erfahrung und Vollzeit-Fokus auf eine Stelle.',
              },
              {
                id: 'wann-extern',
                title: 'Wann lohnt sich ein externer Recruiter?',
                content: 'Sobald Sie mehr als 2 Stellen parallel besetzen müssen, Senior-Positionen suchen, oder Ihre Time-to-Hire über 90 Tage liegt. Die Vakanzkosten übersteigen dann schnell die Headhunter-Kosten.',
              },
              {
                id: 'unterschied',
                title: 'Active Sourcing vs. klassisches Recruiting?',
                content: 'Klassisches Recruiting wartet auf Bewerber (Post & Pray). Active Sourcing geht proaktiv auf Kandidaten zu. Bei IT-Fachkräften mit 149.000 offenen Stellen funktioniert passives Warten nicht mehr – 70% der Entwickler sind nicht aktiv auf Jobsuche.',
              },
            ]} />
          </FadeIn>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════════ */}
      <section className="snap-section" style={{
        background: T.colors.burgundy,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
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
