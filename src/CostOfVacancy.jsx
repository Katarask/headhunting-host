import React, { useState, useEffect, useRef } from 'react';

// ══════════════════════════════════════════════════════════════════════════════
// COST OF VACANCY LANDING PAGE V4
// ══════════════════════════════════════════════════════════════════════════════

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
  },
  font: '"JetBrains Mono", "SF Mono", "Fira Code", monospace',
  space: {
    xs: '8px',
    sm: '16px',
    md: '24px',
    lg: '32px',
    xl: '48px',
    xxl: '64px',
    section: 'clamp(80px, 12vw, 140px)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  easing: {
    smooth: 'cubic-bezier(0.23, 1, 0.32, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    snappy: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
  timing: {
    instant: '100ms',
    fast: '200ms',
    medium: '400ms',
    slow: '800ms',
  },
  touchTarget: '48px',
};

// Responsive Hook
const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);
  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const listener = (e) => setMatches(e.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [query]);
  return matches;
};

const useResponsive = () => {
  const isMd = useMediaQuery(`(min-width: ${T.breakpoints.md})`);
  const isLg = useMediaQuery(`(min-width: ${T.breakpoints.lg})`);
  const isXl = useMediaQuery(`(min-width: ${T.breakpoints.xl})`);
  return { 
    isMobile: !isMd, 
    isTablet: isMd && !isLg, 
    isDesktop: isLg,
    isLargeDesktop: isXl,
  };
};

// DecryptedText
const DecryptedText = ({ text, speed = 50, delay = 0, style = {} }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  
  useEffect(() => {
    const timeout = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(timeout);
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    let iteration = 0;
    const interval = setInterval(() => {
      setDisplayText(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          if (i < iteration) return text[i];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );
      if (iteration >= text.length) clearInterval(interval);
      iteration += 1/3;
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed, started]);
  
  return (
    <span style={{ fontFamily: T.font, ...style }}>
      {displayText || text.split('').map(() => ' ').join('')}
    </span>
  );
};

// FadeIn
const FadeIn = ({ children, delay = 0, direction = 'up' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  
  const transforms = {
    up: 'translateY(40px)',
    down: 'translateY(-40px)',
    left: 'translateX(40px)',
    right: 'translateX(-40px)',
  };
  
  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translate(0)' : transforms[direction],
        transition: `all ${T.timing.slow} ${T.easing.snappy}`,
      }}
    >
      {children}
    </div>
  );
};

// Button
const Button = ({ children, onClick, variant = 'primary', fullWidth = false, size = 'default' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  
  const variants = {
    primary: {
      bg: isHovered ? T.colors.burgundy : 'transparent',
      border: T.colors.burgundy,
      color: isHovered ? T.colors.cream : T.colors.burgundy,
    },
    secondary: {
      bg: isHovered ? T.colors.black : 'transparent',
      border: T.colors.black,
      color: isHovered ? T.colors.cream : T.colors.black,
    },
    dark: {
      bg: isHovered ? T.colors.cream : 'transparent',
      border: T.colors.cream,
      color: isHovered ? T.colors.black : T.colors.cream,
    },
  };
  
  const v = variants[variant];
  const padding = size === 'large' ? '24px 56px' : '20px 40px';
  
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => { setIsHovered(false); setIsPressed(false); }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      style={{
        minHeight: T.touchTarget,
        padding,
        width: fullWidth ? '100%' : 'auto',
        background: v.bg,
        border: `1.5px solid ${v.border}`,
        color: v.color,
        fontFamily: T.font,
        fontSize: size === 'large' ? '13px' : '12px',
        fontWeight: 500,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: `all ${T.timing.fast} ${T.easing.smooth}`,
        transform: isPressed ? 'scale(0.98)' : 'scale(1)',
      }}
    >
      {children}
    </button>
  );
};

// Calculator Component
const Calculator = ({ isMobile }) => {
  const [salary, setSalary] = useState(75000);
  const [level, setLevel] = useState('senior');
  const [days, setDays] = useState(60);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const factors = { junior: 1.0, senior: 1.5, lead: 2.0 };
  const dailyCost = (salary / 220) * factors[level];
  const totalCost = dailyCost * days;
  
  const breakdown = {
    direct: totalCost * 0.30,
    productivity: totalCost * 0.50,
    opportunity: totalCost * 0.20,
  };

  useEffect(() => {
    setIsAnimating(true);
    const timeout = setTimeout(() => setIsAnimating(false), 300);
    return () => clearTimeout(timeout);
  }, [salary, level, days]);

  const formatCurrency = (val) => 
    new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  return (
    <div style={{
      background: T.colors.cream,
      border: `1px solid ${T.colors.border}`,
      padding: isMobile ? T.space.lg : T.space.xl,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: T.space.sm,
        marginBottom: T.space.lg,
        paddingBottom: T.space.md,
        borderBottom: `1px solid ${T.colors.border}`,
      }}>
        <div style={{
          width: '8px',
          height: '8px',
          background: T.colors.burgundy,
          boxShadow: `0 0 12px ${T.colors.burgundy}`,
        }} />
        <span style={{
          fontFamily: T.font,
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: T.colors.muted,
          textTransform: 'uppercase',
        }}>
          Cost of Vacancy Calculator
        </span>
      </div>

      {/* Salary Input */}
      <div style={{ marginBottom: T.space.lg }}>
        <label style={{
          display: 'block',
          fontFamily: T.font,
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: T.colors.muted,
          textTransform: 'uppercase',
          marginBottom: T.space.sm,
        }}>
          Jahresgehalt (Brutto)
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            value={formatCurrency(salary).replace('€', '').trim()}
            onChange={(e) => {
              const val = parseInt(e.target.value.replace(/\D/g, '')) || 0;
              setSalary(Math.min(300000, Math.max(0, val)));
            }}
            style={{
              width: '100%',
              padding: '16px 20px',
              paddingRight: '50px',
              fontFamily: T.font,
              fontSize: '18px',
              fontWeight: 500,
              color: T.colors.black,
              background: 'white',
              border: `1px solid ${T.colors.border}`,
              outline: 'none',
            }}
          />
          <span style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            fontFamily: T.font,
            fontSize: '14px',
            color: T.colors.muted,
          }}>€</span>
        </div>
      </div>

      {/* Level Toggle */}
      <div style={{ marginBottom: T.space.lg }}>
        <label style={{
          display: 'block',
          fontFamily: T.font,
          fontSize: '11px',
          letterSpacing: '0.15em',
          color: T.colors.muted,
          textTransform: 'uppercase',
          marginBottom: T.space.sm,
        }}>
          Senioritätslevel
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '2px',
          background: T.colors.border,
          border: `1px solid ${T.colors.border}`,
        }}>
          {['junior', 'senior', 'lead'].map((l) => (
            <button
              key={l}
              onClick={() => setLevel(l)}
              style={{
                padding: '14px 12px',
                fontFamily: T.font,
                fontSize: '11px',
                fontWeight: level === l ? 600 : 400,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: level === l ? T.colors.cream : T.colors.muted,
                background: level === l ? T.colors.burgundy : 'white',
                border: 'none',
                cursor: 'pointer',
                transition: `all ${T.timing.fast} ${T.easing.smooth}`,
              }}
            >
              {l}
              <span style={{
                display: 'block',
                fontSize: '9px',
                fontWeight: 400,
                marginTop: '4px',
                opacity: 0.7,
              }}>
                {factors[l]}×
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Days Slider */}
      <div style={{ marginBottom: T.space.xl }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: T.space.sm,
        }}>
          <label style={{
            fontFamily: T.font,
            fontSize: '11px',
            letterSpacing: '0.15em',
            color: T.colors.muted,
            textTransform: 'uppercase',
          }}>
            Tage unbesetzt
          </label>
          <span style={{
            fontFamily: T.font,
            fontSize: '24px',
            fontWeight: 300,
            color: T.colors.burgundy,
          }}>
            {days}
          </span>
        </div>
        <input
          type="range"
          min="7"
          max="180"
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '4px',
            background: `linear-gradient(to right, ${T.colors.burgundy} ${((days - 7) / 173) * 100}%, ${T.colors.border} 0%)`,
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer',
            WebkitAppearance: 'none',
          }}
        />
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: T.space.xs,
        }}>
          <span style={{ fontFamily: T.font, fontSize: '10px', color: T.colors.muted }}>1 Woche</span>
          <span style={{ fontFamily: T.font, fontSize: '10px', color: T.colors.muted }}>6 Monate</span>
        </div>
      </div>

      {/* Results */}
      <div style={{
        background: T.colors.black,
        padding: T.space.lg,
        marginBottom: T.space.md,
      }}>
        <div style={{
          fontSize: '10px',
          letterSpacing: '0.2em',
          color: T.colors.mutedLight,
          textTransform: 'uppercase',
          marginBottom: T.space.sm,
        }}>
          Geschätzte Vakanzkosten
        </div>
        <div style={{
          fontSize: isMobile ? '36px' : '48px',
          fontWeight: 300,
          color: T.colors.cream,
          fontFamily: T.font,
          transition: `all ${T.timing.fast}`,
          transform: isAnimating ? 'scale(1.02)' : 'scale(1)',
        }}>
          {formatCurrency(totalCost)}
        </div>
      </div>

      {/* Breakdown */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        background: T.colors.border,
      }}>
        {[
          { label: 'Direkte Kosten', value: breakdown.direct, desc: 'Recruiting, Anzeigen' },
          { label: 'Produktivität', value: breakdown.productivity, desc: 'Team-Output sinkt' },
          { label: 'Opportunität', value: breakdown.opportunity, desc: 'Verlorene Deals' },
        ].map((item, i) => (
          <div key={i} style={{
            background: 'white',
            padding: T.space.md,
            textAlign: 'center',
          }}>
            <div style={{
              fontSize: '9px',
              letterSpacing: '0.12em',
              color: T.colors.muted,
              textTransform: 'uppercase',
              marginBottom: T.space.xs,
            }}>
              {item.label}
            </div>
            <div style={{
              fontSize: '18px',
              fontWeight: 500,
              color: T.colors.burgundy,
              fontFamily: T.font,
            }}>
              {formatCurrency(item.value)}
            </div>
            <div style={{
              fontSize: '9px',
              color: T.colors.muted,
              marginTop: '4px',
            }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// FAQ Accordion
const FAQAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);
  
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{
          borderBottom: `1px solid ${T.colors.borderLight}`,
        }}>
          <button
            onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
            style={{
              width: '100%',
              padding: `${T.space.md} 0`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <span style={{
              fontFamily: T.font,
              fontSize: '14px',
              color: T.colors.cream,
              paddingRight: T.space.md,
            }}>
              {item.q}
            </span>
            <span style={{
              fontFamily: T.font,
              fontSize: '18px',
              color: openIndex === i ? T.colors.burgundy : T.colors.mutedLight,
              transition: `transform ${T.timing.fast}`,
              transform: openIndex === i ? 'rotate(45deg)' : 'rotate(0)',
            }}>
              +
            </span>
          </button>
          <div style={{
            maxHeight: openIndex === i ? '200px' : '0',
            overflow: 'hidden',
            transition: `all ${T.timing.medium} ${T.easing.snappy}`,
          }}>
            <p style={{
              fontFamily: T.font,
              fontSize: '13px',
              lineHeight: 1.8,
              color: T.colors.mutedLight,
              paddingBottom: T.space.lg,
              margin: 0,
            }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main Component
export default function CostOfVacancyPage() {
  const { isMobile, isDesktop } = useResponsive();
  
  const faqs = [
    { q: 'Was ist Cost of Vacancy?', a: 'Cost of Vacancy (CoV) beschreibt die Gesamtkosten, die durch eine unbesetzte Stelle entstehen. Dazu gehören direkte Kosten wie Recruiting und Anzeigen, aber auch indirekte Kosten wie Produktivitätsverlust im Team und entgangene Geschäftsmöglichkeiten.' },
    { q: 'Wie berechnet man Cost of Vacancy?', a: 'Die Grundformel: (Jahresgehalt ÷ 220 Arbeitstage) × Anzahl offener Tage × Senioritätsfaktor. Der Faktor berücksichtigt, dass Senior-Positionen höhere Kosten verursachen als Junior-Rollen.' },
    { q: 'Warum ist der Faktor bei Seniors höher?', a: 'Senior-Mitarbeiter generieren mehr Wertschöpfung, haben größere Verantwortungsbereiche und ihr Fehlen wirkt sich stärker auf Teamleistung und Projekte aus. Ein fehlender Tech Lead kann ein ganzes Team ausbremsen.' },
    { q: 'Was ist eine gute Time-to-Hire?', a: 'In Tech & Engineering liegt der Durchschnitt bei 42-60 Tagen. Top-Recruiter schaffen 30-35 Tage. Jeder Tag darüber hinaus kostet Sie bares Geld – wie der Rechner zeigt.' },
  ];

  const hiddenCosts = [
    { icon: '📉', title: 'Produktivitätsverlust', desc: 'Das Team kompensiert fehlende Kapazität. Output sinkt um 20-40%.' },
    { icon: '⏰', title: 'Überstunden', desc: 'Kollegen arbeiten mehr. Burnout-Risiko steigt, Fluktuation folgt.' },
    { icon: '💼', title: 'Verlorene Aufträge', desc: 'Projekte werden abgelehnt oder verzögert. Kunden warten nicht.' },
    { icon: '🎯', title: 'Employer Brand', desc: 'Lange Vakanzen signalisieren Probleme. Top-Talente bewerben sich woanders.' },
  ];

  return (
    <div style={{ fontFamily: T.font, background: T.colors.sand }}>
      
      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
        background: T.colors.sand,
      }}>
        <FadeIn>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            marginBottom: T.space.lg,
          }}>
            Kostenloser Rechner für HR & Geschäftsführung
          </div>
        </FadeIn>
        
        <FadeIn delay={100}>
          <h1 style={{
            fontSize: `clamp(32px, ${isMobile ? '8vw' : '5vw'}, 64px)`,
            fontWeight: 300,
            lineHeight: 1.1,
            color: T.colors.black,
            marginBottom: T.space.lg,
            maxWidth: '900px',
          }}>
            <DecryptedText text="Was kostet Ihre" delay={200} />
            <br />
            <span style={{ color: T.colors.burgundy }}>
              <DecryptedText text="unbesetzte Stelle?" delay={400} />
            </span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={200}>
          <p style={{
            fontSize: '18px',
            lineHeight: 1.8,
            color: T.colors.muted,
            maxWidth: '600px',
            marginBottom: T.space.xl,
          }}>
            Die meisten Unternehmen unterschätzen ihre Vakanzkosten um <strong style={{ color: T.colors.burgundy }}>70%</strong>. 
            Berechnen Sie die wahren Kosten – in 30 Sekunden.
          </p>
        </FadeIn>
        
        <FadeIn delay={300}>
          <Button variant="primary" size="large">
            Zum Rechner ↓
          </Button>
        </FadeIn>
      </section>

      {/* CALCULATOR */}
      <section style={{
        background: T.colors.sand,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1.2fr' : '1fr',
          gap: isDesktop ? '80px' : T.space.xl,
          alignItems: 'start',
        }}>
          {/* Left: Context */}
          <div>
            <FadeIn>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.colors.muted,
                marginBottom: T.space.md,
              }}>
                Interaktiver Rechner
              </div>
              <h2 style={{
                fontSize: `clamp(26px, ${isMobile ? '6vw' : '3vw'}, 40px)`,
                fontWeight: 300,
                lineHeight: 1.2,
                color: T.colors.black,
                marginBottom: T.space.lg,
              }}>
                Jeder Tag kostet Sie <span style={{ color: T.colors.burgundy }}>bares Geld</span>
              </h2>
              <p style={{
                fontSize: '15px',
                lineHeight: 1.9,
                color: T.colors.muted,
                marginBottom: T.space.xl,
              }}>
                Eine unbesetzte Senior-Position bei €75.000 Jahresgehalt kostet Sie 
                nach 60 Tagen bereits über €30.000. Das ist kein Schätzwert – 
                das ist Mathematik.
              </p>
            </FadeIn>
            
            {/* Stats */}
            <FadeIn delay={100}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: T.space.md,
                paddingTop: T.space.lg,
                borderTop: `1px solid ${T.colors.border}`,
              }}>
                {[
                  { value: '42', label: 'Tage', desc: 'Ø Time-to-Hire' },
                  { value: '1.5×', label: 'Faktor', desc: 'Senior-Kosten' },
                  { value: '73%', label: 'Firmen', desc: 'Unterschätzen CoV' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div style={{
                      fontSize: '28px',
                      fontWeight: 300,
                      color: T.colors.burgundy,
                    }}>
                      {stat.value}
                    </div>
                    <div style={{
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: T.colors.muted,
                    }}>
                      {stat.label}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: T.colors.muted,
                      marginTop: '4px',
                    }}>
                      {stat.desc}
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
          
          {/* Right: Calculator */}
          <FadeIn delay={150}>
            <Calculator isMobile={isMobile} />
          </FadeIn>
        </div>
      </section>

      {/* HIDDEN COSTS */}
      <section style={{
        background: T.colors.black,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <FadeIn>
          <div style={{
            fontSize: '11px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.mutedLight,
            marginBottom: T.space.md,
          }}>
            Was viele übersehen
          </div>
          <h2 style={{
            fontSize: `clamp(26px, ${isMobile ? '6vw' : '3vw'}, 40px)`,
            fontWeight: 300,
            lineHeight: 1.2,
            marginBottom: T.space.xxl,
            maxWidth: '600px',
          }}>
            Die <span style={{ color: T.colors.burgundy }}>versteckten</span> Kosten einer Vakanz
          </h2>
        </FadeIn>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? 'repeat(4, 1fr)' : isMobile ? '1fr' : 'repeat(2, 1fr)',
          gap: T.space.lg,
        }}>
          {hiddenCosts.map((item, i) => (
            <FadeIn key={i} delay={i * 100}>
              <div style={{
                padding: T.space.lg,
                borderLeft: `2px solid ${T.colors.burgundy}`,
                background: 'rgba(101, 33, 38, 0.05)',
              }}>
                <div style={{ fontSize: '32px', marginBottom: T.space.md }}>{item.icon}</div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: 500,
                  marginBottom: T.space.sm,
                  color: T.colors.cream,
                }}>
                  {item.title}
                </div>
                <p style={{
                  fontSize: '13px',
                  lineHeight: 1.7,
                  color: T.colors.mutedLight,
                  margin: 0,
                }}>
                  {item.desc}
                </p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FORMULA */}
      <section style={{
        background: T.colors.sand,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '1fr 1fr' : '1fr',
          gap: isDesktop ? '80px' : T.space.xl,
        }}>
          <div>
            <FadeIn>
              <div style={{
                fontSize: '11px',
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: T.colors.muted,
                marginBottom: T.space.md,
              }}>
                Die Mathematik
              </div>
              <h2 style={{
                fontSize: `clamp(26px, ${isMobile ? '6vw' : '3vw'}, 36px)`,
                fontWeight: 300,
                lineHeight: 1.3,
                color: T.colors.black,
                marginBottom: T.space.lg,
              }}>
                So berechnen wir <span style={{ color: T.colors.burgundy }}>Cost of Vacancy</span>
              </h2>
            </FadeIn>
            
            <FadeIn delay={100}>
              <div style={{
                background: T.colors.black,
                padding: T.space.lg,
              }}>
                <code style={{
                  fontFamily: T.font,
                  fontSize: isMobile ? '12px' : '14px',
                  color: T.colors.cream,
                  letterSpacing: '0.05em',
                }}>
                  <span style={{ color: T.colors.mutedLight }}>CoV = (</span>
                  <span style={{ color: T.colors.burgundy }}>Gehalt</span>
                  <span style={{ color: T.colors.mutedLight }}> ÷ 220) × </span>
                  <span style={{ color: T.colors.burgundy }}>Tage</span>
                  <span style={{ color: T.colors.mutedLight }}> × </span>
                  <span style={{ color: T.colors.burgundy }}>Faktor</span>
                </code>
              </div>
            </FadeIn>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: T.space.lg }}>
            {[
              { value: '220', label: 'Arbeitstage / Jahr', desc: 'Nach Abzug von Urlaub, Feiertagen und Krankheit.' },
              { value: '1.0–2.0×', label: 'Level-Faktor', desc: 'Junior: 1.0× | Senior: 1.5× | Lead: 2.0×' },
            ].map((item, i) => (
              <FadeIn key={i} delay={150 + i * 100}>
                <div style={{
                  padding: T.space.lg,
                  borderLeft: `2px solid ${T.colors.burgundy}`,
                  background: T.colors.cream,
                }}>
                  <div style={{
                    fontSize: '32px',
                    fontWeight: 300,
                    color: T.colors.burgundy,
                    marginBottom: T.space.xs,
                  }}>
                    {item.value}
                  </div>
                  <div style={{
                    fontSize: '11px',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: T.colors.muted,
                    marginBottom: T.space.xs,
                  }}>
                    {item.label}
                  </div>
                  <p style={{
                    fontSize: '13px',
                    lineHeight: 1.7,
                    color: T.colors.muted,
                    margin: 0,
                  }}>
                    {item.desc}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section style={{
        background: T.colors.darkAlt,
        color: T.colors.cream,
        padding: `${T.space.section} ${isMobile ? '6vw' : '10vw'}`,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isDesktop ? '0.8fr 1.2fr' : '1fr',
          gap: isDesktop ? '80px' : T.space.xl,
        }}>
          <FadeIn>
            <div>
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
                fontSize: `clamp(26px, ${isMobile ? '6vw' : '3vw'}, 36px)`,
                fontWeight: 300,
                lineHeight: 1.3,
              }}>
                Alles über <span style={{ color: T.colors.burgundy }}>Vakanzkosten</span>
              </h2>
            </div>
          </FadeIn>
          
          <FadeIn delay={100}>
            <FAQAccordion items={faqs} />
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
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
              fontSize: `clamp(28px, ${isMobile ? '7vw' : '4vw'}, 48px)`,
              fontWeight: 300,
              lineHeight: 1.2,
              marginBottom: T.space.lg,
            }}>
              Ihre Stelle ist seit Monaten offen?
            </h2>
            
            <p style={{
              fontSize: '15px',
              lineHeight: 1.9,
              color: 'rgba(239, 237, 229, 0.7)',
              marginBottom: T.space.xl,
            }}>
              Ich finde Menschen, nicht Lebensläufe. 500+ Placements, 
              98% Retention, 42 Tage durchschnittliche Time-to-Hire.
            </p>
            
            <Button variant="dark" size="large" fullWidth={isMobile}>
              Gespräch Vereinbaren
            </Button>
          </div>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: isMobile ? T.space.xl : '80px',
            marginTop: T.space.xxl,
            paddingTop: T.space.xl,
            borderTop: '1px solid rgba(239, 237, 229, 0.2)',
            flexWrap: 'wrap',
          }}>
            {[
              { value: '500+', label: 'Placements' },
              { value: '98%', label: 'Retention' },
              { value: '42', label: 'Tage ø' },
            ].map((stat, i) => (
              <div key={i}>
                <div style={{ fontSize: '32px', fontWeight: 300 }}>{stat.value}</div>
                <div style={{
                  fontSize: '10px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(239, 237, 229, 0.6)',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
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
        <div style={{ fontSize: '11px', color: T.colors.mutedLight }}>
          © 2024 Deniz Tulay — Tech Headhunter München
        </div>
        
        <div style={{ display: 'flex', gap: T.space.xl, flexWrap: 'wrap' }}>
          {['LinkedIn', 'Email', 'Hauptseite'].map((link) => (
            <a
              key={link}
              href="#"
              style={{
                color: T.colors.cream,
                textDecoration: 'none',
                fontSize: '11px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                padding: `${T.space.xs} 0`,
              }}
            >
              {link}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
