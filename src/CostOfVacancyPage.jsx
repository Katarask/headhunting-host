import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TargetCursor from './TargetCursor';
import ElectricBorder from './ElectricBorder';
import T from './designTokens';

// Decrypted Text
const DecryptedText = ({ text, speed = 50, delay = 0 }) => {
  const [displayText, setDisplayText] = useState('');
  const [started, setStarted] = useState(false);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
  
  useEffect(() => { 
    const t = setTimeout(() => setStarted(true), delay); 
    return () => clearTimeout(t); 
  }, [delay]);
  
  useEffect(() => {
    if (!started) return;
    let frameId;
    const startTime = performance.now();
    const duration = text.length * speed;
    
    const animate = (now) => {
      const elapsed = now - startTime;
      const iteration = (elapsed / duration) * text.length;
      
      setDisplayText(text.split('').map((char, i) => {
        if (char === ' ') return ' ';
        if (i < iteration) return text[i];
        return chars[Math.floor(Math.random() * chars.length)];
      }).join(''));
      
      if (iteration < text.length) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayText(text);
      }
    };
    
    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [text, speed, started]);
  
  return <span style={{ fontFamily: T.font }}>{displayText || text.replace(/./g, ' ')}</span>;
};

// FadeIn
const FadeIn = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setTimeout(() => setIsVisible(true), delay); observer.disconnect(); }
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);
  
  return (
    <div ref={ref} style={{
      opacity: isVisible ? 1 : 0, 
      transform: isVisible ? 'translateY(0)' : 'translateY(40px)',
      transition: 'all 1s cubic-bezier(0.19, 1, 0.22, 1)',
    }}>
      {children}
    </div>
  );
};

// Electric Border Button (using ElectricBorder component)
const ElectricBorderButton = ({ children, onClick, variant = 'primary' }) => {
  const colors = {
    primary: { border: T.colors.burgundy, text: T.colors.burgundy },
    dark: { border: T.colors.cream, text: T.colors.cream },
  };
  const c = colors[variant];

  return (
    <ElectricBorder color={c.border} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: '100px', display: 'inline-block' }}>
      <button
        className="cursor-target"
        onClick={onClick}
        style={{
          padding: '14px 28px',
          background: 'transparent',
          border: 'none',
          borderRadius: '100px',
          color: c.text,
          fontFamily: T.font,
          fontSize: T.type.button.size,
          fontWeight: T.type.button.weight,
          letterSpacing: T.type.button.spacing,
          textTransform: 'uppercase',
          cursor: 'pointer',
          whiteSpace: 'nowrap',
        }}
      >
        {children}
      </button>
    </ElectricBorder>
  );
};

// Marquee
const Marquee = ({ items, direction = 'left', speed = 30 }) => {
  const content = [...items, ...items, ...items, ...items];

  return (
    <div style={{
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      padding: '24px 0',
      borderTop: `1px solid ${T.colors.border}`,
      borderBottom: `1px solid ${T.colors.border}`,
    }}>
      <div style={{
        display: 'inline-flex',
        gap: '60px',
        animation: `marquee ${speed}s linear infinite`,
      }}>
        {content.map((item, i) => (
          <span key={i} style={{
            fontFamily: T.font,
            fontSize: T.type.label.size,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: T.colors.muted,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '60px',
          }}>
            {item}
            <span style={{ color: T.colors.burgundy, fontSize: '8px' }}>◆</span>
          </span>
        ))}
      </div>
    </div>
  );
};

// Animated Number
const AnimatedNumber = ({ value, prefix = '', suffix = '' }) => {
  const [display, setDisplay] = useState(0);
  const prevValue = useRef(value);

  useEffect(() => {
    const start = prevValue.current;
    const startTime = performance.now();
    const animate = (now) => {
      const progress = Math.min((now - startTime) / 800, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.floor(start + (value - start) * eased));
      if (progress < 1) requestAnimationFrame(animate);
      else prevValue.current = value;
    };
    requestAnimationFrame(animate);
  }, [value]);

  return <>{prefix}{display.toLocaleString('de-DE')}{suffix}</>;
};

// Scramble Text Animation Hook
const useScrambleText = (text, isActive, duration = 800) => {
  const [displayed, setDisplayed] = useState(text);
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';

  useEffect(() => {
    if (!isActive) return;

    let frameId;
    const startTime = performance.now();

    const animate = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      setDisplayed(
        text.split('').map((char, i) => {
          if (char === ' ') return ' ';
          const charProgress = (progress * text.length - i) / 3;
          if (charProgress > 1) return text[i];
          if (charProgress > 0) return chars[Math.floor(Math.random() * chars.length)];
          return chars[Math.floor(Math.random() * chars.length)];
        }).join('')
      );

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      } else {
        setDisplayed(text);
      }
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [text, isActive, duration]);

  return displayed;
};

// Rotating Testimonials with Scramble Effect + Number Morph
const RotatingTestimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [scrambleKey, setScrambleKey] = useState(0);

  const testimonials = [
    {
      quote: "Nach 4 Monaten erfolgloser Suche hat Deniz unseren Senior Developer in 3 Wochen gefunden.",
      author: "CTO, Tech-Startup",
    },
    {
      quote: "Endlich jemand, der den Münchner IT-Markt wirklich versteht. Qualität statt Masse.",
      author: "HR Director, Mittelstand",
    },
    {
      quote: "Die Kandidaten passten nicht nur fachlich, sondern auch kulturell perfekt ins Team.",
      author: "Engineering Lead, Scale-up",
    },
  ];

  const scrambledQuote = useScrambleText(
    testimonials[currentIndex].quote,
    scrambleKey > 0,
    1200
  );

  const scrambledAuthor = useScrambleText(
    testimonials[currentIndex].author,
    scrambleKey > 0,
    600
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
        setScrambleKey((prev) => prev + 1);
        setIsTransitioning(false);
      }, 400);
    }, 6000);

    return () => clearInterval(interval);
  }, [testimonials.length]);

  // Initial scramble on mount
  useEffect(() => {
    setScrambleKey(1);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Quote with scramble */}
      <div
        style={{
          opacity: isTransitioning ? 0.3 : 1,
          transform: isTransitioning ? 'translateX(-10px)' : 'translateX(0)',
          transition: 'all 400ms cubic-bezier(0.23, 1, 0.32, 1)',
        }}
      >
        <p style={{
          fontFamily: T.font,
          fontSize: T.type.bodyL.size,
          fontWeight: T.type.bodyL.weight,
          color: T.colors.cream,
          lineHeight: 1.7,
          marginBottom: '20px',
        }}>
          "{scrambledQuote}"
        </p>
        <div style={{
          fontFamily: T.font,
          fontSize: T.type.label.size,
          color: T.colors.muted,
          letterSpacing: T.type.label.spacing,
          textTransform: 'uppercase',
        }}>
          — {scrambledAuthor}
        </div>
      </div>
    </div>
  );
};

// Grain Overlay
const GrainOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 9999, opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
);

// Header Navigation with Terminal Breadcrumb
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
      padding: '20px 8vw',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: scrolled ? 'rgba(10, 10, 10, 0.9)' : 'transparent',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      transition: 'all 0.3s ease',
    }}>
      <Link to="/" style={{
        fontFamily: T.font,
        fontSize: T.type.label.size,
        fontWeight: 500,
        color: T.colors.cream,
        textDecoration: 'none',
        letterSpacing: T.type.label.spacing,
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
      }}>
        <span style={{ color: T.colors.burgundy }}>←</span> DENIZ TULAY
      </Link>

      {/* Terminal Breadcrumb */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: T.font,
        fontSize: T.type.label.size,
        letterSpacing: '0.05em',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: T.colors.burgundy,
          boxShadow: `0 0 8px ${T.colors.burgundy}`,
        }} />
        <span style={{ color: T.colors.muted }}>~/</span>
        <Link to="/active-sourcing" style={{
          color: T.colors.muted,
          textDecoration: 'none',
          transition: 'color 0.2s',
        }}>services</Link>
        <span style={{ color: T.colors.muted }}>/</span>
        <span style={{ color: T.colors.burgundy, fontWeight: 500 }}>cost-of-vacancy</span>
      </div>

      <nav style={{ display: 'flex', gap: '32px' }}>
        <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" style={{
          fontFamily: T.font,
          fontSize: T.type.micro.size,
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: T.type.micro.spacing,
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>LinkedIn</a>
        <Link to="/kontakt" style={{
          fontFamily: T.font,
          fontSize: T.type.micro.size,
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: T.type.micro.spacing,
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>Kontakt</Link>
      </nav>
    </header>
  );
};

// Calculator - Z-Pattern Layout (Result first, inputs below, no boxes)
const Calculator = () => {
  const [salary, setSalary] = useState(75000);
  const [level, setLevel] = useState('senior');
  const [months, setMonths] = useState(3);

  const multipliers = { junior: 1.0, senior: 1.5, lead: 2.0 };
  const vacancyDays = months * 22;
  const dailyCost = salary / 220;
  const totalCost = Math.round(dailyCost * vacancyDays * multipliers[level]);
  const headhunterCost = Math.round(dailyCost * 42 * multipliers[level]);
  const savings = totalCost - headhunterCost;

  const labelStyle = {
    fontFamily: T.font,
    fontSize: T.type.label.size,
    fontWeight: T.type.label.weight,
    letterSpacing: T.type.label.spacing,
    textTransform: 'uppercase',
    color: T.colors.mutedDark,
  };

  return (
    <div>
      {/* ROW 1: Hero Result - volle Breite, Blickfang */}
      <div style={{
        textAlign: 'center',
        marginBottom: T.space.xxl,
        paddingBottom: T.space.xl,
        borderBottom: `1px solid ${T.colors.borderDark}`,
      }}>
        <div style={{ ...labelStyle, marginBottom: T.space.sm }}>
          Ihre aktuellen Vakanzkosten
        </div>
        <div style={{
          fontFamily: T.font,
          fontSize: T.type.displayL.size,
          fontWeight: T.type.displayL.weight,
          color: T.colors.burgundy,
          lineHeight: 1,
          letterSpacing: '-0.02em',
        }}>
          €<AnimatedNumber value={totalCost} prefix="" />
        </div>
        <div style={{
          fontFamily: T.font,
          fontSize: T.type.bodyS.size,
          color: T.colors.mutedDark,
          marginTop: T.space.sm,
        }}>
          {vacancyDays} Arbeitstage × €{Math.round(dailyCost).toLocaleString('de-DE')}/Tag × {multipliers[level]}
        </div>
      </div>

      {/* ROW 2: Inputs - 3 Spalten, kompakt */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: T.space.xl,
        marginBottom: T.space.xxl,
      }}>
        {/* Gehalt */}
        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: T.space.sm }}>
            Jahresgehalt
          </label>
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            borderBottom: `1px solid ${T.colors.borderDark}`,
            paddingBottom: T.space.xs,
          }}>
            <span style={{ fontFamily: T.font, fontSize: T.type.bodyM.size, color: T.colors.mutedDark, marginRight: '4px' }}>€</span>
            <input
              type="text"
              inputMode="numeric"
              value={salary.toLocaleString('de-DE')}
              onChange={(e) => setSalary(Math.min(parseInt(e.target.value.replace(/\D/g, '')) || 0, 500000))}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                fontFamily: T.font,
                fontSize: T.type.input.size,
                fontWeight: T.type.input.weight,
                color: T.colors.black,
                width: '100%',
              }}
            />
          </div>
        </div>

        {/* Level */}
        <div>
          <label style={{ ...labelStyle, display: 'block', marginBottom: T.space.sm }}>
            Level
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[
              { key: 'junior', label: 'Jr', mult: '1×' },
              { key: 'senior', label: 'Sr', mult: '1.5×' },
              { key: 'lead', label: 'Lead', mult: '2×' }
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLevel(opt.key)}
                style={{
                  flex: 1,
                  padding: `${T.space.sm} 4px`,
                  background: level === opt.key ? T.colors.burgundy : 'transparent',
                  border: `1px solid ${level === opt.key ? T.colors.burgundy : T.colors.borderDark}`,
                  fontFamily: T.font,
                  fontSize: T.type.micro.size,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: level === opt.key ? T.colors.cream : T.colors.black,
                  cursor: 'pointer',
                  transition: `all 200ms ${T.easing.snappy}`,
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Monate */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: T.space.sm }}>
            <label style={labelStyle}>Vakanzzeit</label>
            <span style={{ fontFamily: T.font, fontSize: T.type.bodyL.size, fontWeight: T.type.bodyL.weight, color: T.colors.burgundy }}>
              {months}M
            </span>
          </div>
          <div style={{ position: 'relative', height: '24px', display: 'flex', alignItems: 'center' }}>
            <div style={{ position: 'absolute', left: 0, right: 0, height: '1px', background: T.colors.borderDark }} />
            <div style={{
              position: 'absolute',
              left: 0,
              width: `${((months - 1) / 11) * 100}%`,
              height: '1px',
              background: T.colors.burgundy,
            }} />
            <div style={{
              position: 'absolute',
              left: `calc(${((months - 1) / 11) * 100}% - 6px)`,
              width: '12px',
              height: '12px',
              background: T.colors.burgundy,
              borderRadius: '50%',
              transition: `all 150ms ${T.easing.snappy}`,
            }} />
            <input
              type="range"
              min="1"
              max="12"
              value={months}
              onChange={(e) => setMonths(parseInt(e.target.value))}
              style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      {/* ROW 3: Comparison + CTA */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr auto',
        gap: T.space.xl,
        alignItems: 'end',
      }}>
        {/* Mit Headhunter */}
        <div>
          <div style={{ ...labelStyle, marginBottom: T.space.xs }}>Mit Headhunter</div>
          <div style={{ fontFamily: T.font, fontSize: T.type.h3.size, fontWeight: T.type.h3.weight, color: T.colors.black }}>
            €<AnimatedNumber value={headhunterCost} prefix="" />
          </div>
          <div style={{ fontFamily: T.font, fontSize: T.type.label.size, color: T.colors.mutedDark }}>
            42 Tage Durchschnitt
          </div>
        </div>

        {/* Ersparnis */}
        <div>
          <div style={{ ...labelStyle, marginBottom: T.space.xs, color: T.colors.burgundy }}>Ihre Ersparnis</div>
          <div style={{ fontFamily: T.font, fontSize: T.type.h3.size, fontWeight: T.type.h3.weight, color: T.colors.burgundy }}>
            €<AnimatedNumber value={savings} prefix="" />
          </div>
          <div style={{ fontFamily: T.font, fontSize: T.type.label.size, color: T.colors.mutedDark }}>
            {Math.round((savings / totalCost) * 100)}% weniger Kosten
          </div>
        </div>

        {/* CTA */}
        <Link to="/kontakt" style={{ textDecoration: 'none' }}>
          <ElectricBorderButton variant="primary">
            Jetzt Gespräch vereinbaren
          </ElectricBorderButton>
        </Link>
      </div>
    </div>
  );
};

// Scramble Effect Hook
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

// FAQ Accordion Item with Glow Effect + Scramble
const FAQAccordionItem = ({ title, content, isOpen, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const scrambledTitle = useScramble(title, isHovered);

  const handleMouseMove = (e) => {
    if (!itemRef.current || isOpen) return;
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
      {/* Glow border when active */}
      {isOpen && (
        <div style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${T.colors.burgundy}`,
          boxShadow: `0 0 20px ${T.colors.burgundy}30`,
          pointerEvents: 'none', zIndex: 1,
        }} />
      )}

      {/* Mouse-following glow effect */}
      {isHovered && !isOpen && (
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
          padding: '20px 28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: isOpen ? `linear-gradient(90deg, ${T.colors.darkAlt}, rgba(101, 33, 38, 0.1))` : T.colors.darkAlt,
          border: 'none',
          borderBottom: `1px solid ${T.colors.border}`,
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
      >
        <span style={{
          fontFamily: T.font,
          fontSize: T.type.micro.size,
          color: isOpen ? T.colors.burgundy : T.colors.muted,
          letterSpacing: T.type.micro.spacing,
          marginRight: '20px'
        }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: T.type.label.size,
          fontWeight: 500,
          color: isHovered || isOpen ? T.colors.cream : T.colors.muted,
          letterSpacing: '0.02em',
          textAlign: 'left',
          flex: 1,
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
        }}>
          {scrambledTitle}
        </span>
        <span style={{
          fontFamily: T.font,
          fontSize: T.type.bodyL.size,
          color: isOpen ? T.colors.burgundy : T.colors.muted,
          transition: 'transform 0.3s ease',
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      <div style={{
        maxHeight: isOpen ? '300px' : '0',
        overflow: 'hidden',
        transition: 'all 0.5s cubic-bezier(0.19, 1, 0.22, 1)',
        background: 'rgba(101, 33, 38, 0.05)',
      }}>
        <div style={{
          padding: isOpen ? '24px 28px' : '0 28px',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.4s ease 0.1s',
        }}>
          <p style={{
            fontFamily: T.font,
            fontSize: T.type.bodyS.size,
            lineHeight: 1.8,
            color: T.colors.mutedLight,
            margin: 0
          }}>
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};

const DenizAccordion = ({ items }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div style={{ background: T.colors.darkAlt, border: `1px solid ${T.colors.border}` }}>
      {/* Terminal Header */}
      <div style={{
        padding: '14px 28px',
        borderBottom: `1px solid ${T.colors.border}`,
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: T.colors.burgundy,
          boxShadow: `0 0 10px ${T.colors.burgundy}`
        }} />
        <span style={{
          fontFamily: T.font,
          fontSize: T.type.micro.size,
          color: T.colors.muted,
          letterSpacing: '0.2em',
          textTransform: 'uppercase'
        }}>
          FAQ_MODULE
        </span>
      </div>
      {items.map((item, index) => (
        <FAQAccordionItem
          key={index}
          index={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
        />
      ))}
    </div>
  );
};

// Sticky CTA Button
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
      transition: 'all 0.4s cubic-bezier(0.19, 1, 0.22, 1)',
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
            fontSize: T.type.button.size,
            fontWeight: T.type.button.weight,
            letterSpacing: T.type.button.spacing,
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

// Main Page
export default function CostOfVacancyPage() {
  const faqs = [
    { title: 'Was ist Cost of Vacancy?', content: 'Cost of Vacancy beschreibt die Kosten einer unbesetzten Stelle – inklusive entgangener Produktivität, Überlastung des Teams und verpasster Geschäftschancen. Durchschnitt: 29.000€, IT: 37.300€.' },
    { title: 'Wie berechnet man Vakanzkosten?', content: 'Formel: (Jahresgehalt ÷ 220) × Vakanz-Tage × Level-Faktor. Junior: 1×, Senior: 1,5×, Lead: 2×. Bei 75.000€ und 3 Monaten = ca. 34.000€.' },
    { title: 'Was kostet eine Stelle pro Tag?', content: 'Bei 60.000€ Jahresgehalt: 273€/Tag (Basis). Senior: 409€/Tag. Lead: bis 818€/Tag.' },
    { title: 'Was kostet ein Headhunter?', content: '20-33% des Jahresgehalts (Ø 27,8%). Bei 80.000€ = 22.000€. Aber: Eingesparte Vakanzkosten machen es oft günstiger.' },
  ];

  const marqueeItems = ['Cost of Vacancy', 'Vakanzkosten', 'Tech Recruiting', 'München', 'IT-Fachkräfte', 'Time-to-Hire'];

  return (
    <div style={{
      fontFamily: T.font,
      background: T.colors.black,
      minHeight: '100vh',
      height: '100vh',
      overflowY: 'scroll',
      scrollSnapType: 'y mandatory',
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${T.colors.burgundy}; color: ${T.colors.cream}; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .snap-section { scroll-snap-align: start; }
      `}</style>

      <TargetCursor targetSelector=".cursor-target, a, button" color={T.colors.cream} />
      <GrainOverlay />
      <Header />
      <StickyCTA />

      {/* HERO */}
      <section className="snap-section" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${T.colors.burgundy}15 0%, transparent 50%), ${T.colors.black}`,
        }} />
        <div style={{ position: 'relative', padding: '0 8vw' }}>
          <FadeIn>
            <div style={{ fontSize: T.type.micro.size, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '28px' }}>
              <span style={{ color: T.colors.burgundy }}>01</span> Cost of Vacancy Rechner
            </div>
          </FadeIn>

          <FadeIn delay={100}>
            <h1 style={{ fontSize: T.type.displayM.size, fontWeight: T.type.displayM.weight, lineHeight: 1.0, color: T.colors.cream, marginBottom: '28px', maxWidth: '800px' }}>
              <DecryptedText text="Was kostet" delay={200} /><br />
              <DecryptedText text="Ihre Vakanz?" delay={600} />
            </h1>
          </FadeIn>

          <FadeIn delay={200}>
            <p style={{ fontSize: T.type.bodyM.size, lineHeight: 1.9, color: T.colors.sand, maxWidth: '450px', marginBottom: '40px' }}>
              Jede unbesetzte Stelle kostet 29.000€.
              IT sogar 37.300€.
              München: +37%.
            </p>
          </FadeIn>
          
          <FadeIn delay={300}>
            <ElectricBorderButton onClick={() => document.getElementById('rechner')?.scrollIntoView({ behavior: 'smooth' })}>
              Jetzt berechnen ↓
            </ElectricBorderButton>
          </FadeIn>
        </div>

        </section>

      <Marquee items={marqueeItems} speed={35} />

      {/* CALCULATOR */}
      <section id="rechner" className="snap-section" style={{ background: T.colors.sand, padding: '100px 8vw', minHeight: '100vh' }}>
        <FadeIn>
          <div style={{ fontSize: T.type.micro.size, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.mutedDark, marginBottom: '14px' }}>
            <span style={{ color: T.colors.burgundy }}>02</span> Rechner
          </div>
          <h2 style={{ fontSize: T.type.h2.size, fontWeight: T.type.h2.weight, lineHeight: 1.2, color: T.colors.black, marginBottom: '60px', maxWidth: '500px' }}>
            Jeder Tag kostet bares Geld
          </h2>
        </FadeIn>
        <FadeIn delay={100}><Calculator /></FadeIn>
      </section>

      {/* SOCIAL PROOF - Split Design: Schwarz oben, Burgundy unten */}
      <section className="snap-section" style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* OBERE HÄLFTE - Schwarz mit Headline + Testimonials */}
        <div style={{
          flex: 1,
          background: T.colors.black,
          padding: '80px 8vw',
          display: 'flex',
          alignItems: 'center',
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '80px',
            width: '100%',
            alignItems: 'center',
          }}>
            {/* Links: Headline */}
            <FadeIn>
              <div>
                <div style={{ fontSize: T.type.micro.size, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '14px' }}>
                  <span style={{ color: T.colors.burgundy }}>03</span> Track Record
                </div>
                <h2 style={{
                  fontSize: T.type.h2.size,
                  fontWeight: T.type.h2.weight,
                  lineHeight: 1.2,
                  color: T.colors.cream,
                }}>
                  Warum Unternehmen mit mir arbeiten
                </h2>
              </div>
            </FadeIn>

            {/* Rechts: Rotierende Testimonials - direkt an der Trennlinie */}
            <div style={{ alignSelf: 'flex-end', marginBottom: '-40px' }}>
              <RotatingTestimonials />
            </div>
          </div>
        </div>

        {/* SVG Diagonal Clip Path Divider */}
        <div style={{ position: 'relative', height: '80px', marginTop: '-40px', marginBottom: '-40px', zIndex: 10 }}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
            }}
          >
            <polygon
              points="0,0 100,100 0,100"
              fill={T.colors.darkAlt}
            />
          </svg>
        </div>

        {/* UNTERE HÄLFTE - Dunkel mit Zahlen + Dot Pattern */}
        <div style={{
          flex: 1,
          background: T.colors.darkAlt,
          padding: '80px 8vw',
          paddingTop: '40px',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Dot Pattern Background */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(${T.colors.burgundy}22 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none',
          }} />

          <div style={{
            display: 'flex',
            width: '100%',
            gap: '80px',
            position: 'relative',
            zIndex: 1,
          }}>
            {[
              { number: '50+', label: 'Platzierungen', sub: 'IT & Defense' },
              { number: '42', label: 'Tage Ø Time-to-Hire', sub: 'Markt: 120+ Tage' },
              { number: '100%', label: 'München Fokus', sub: 'Lokales Netzwerk' },
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 100}>
                <div style={{
                  textAlign: 'left',
                }}>
                  <div style={{
                    fontFamily: T.font,
                    fontSize: T.type.displayL.size,
                    fontWeight: T.type.displayL.weight,
                    color: T.colors.burgundy,
                    lineHeight: 1,
                    marginBottom: T.space.sm,
                  }}>
                    <AnimatedNumber value={parseInt(stat.number) || 0} suffix={stat.number.replace(/\d+/, '')} />
                  </div>
                  <div style={{
                    fontFamily: T.font,
                    fontSize: T.type.bodyM.size,
                    fontWeight: T.type.bodyM.weight,
                    color: T.colors.cream,
                    letterSpacing: '0.05em',
                    marginBottom: '8px',
                  }}>
                    {stat.label}
                  </div>
                  <div style={{
                    fontFamily: T.font,
                    fontSize: T.type.label.size,
                    color: T.colors.muted,
                  }}>
                    {stat.sub}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="snap-section" style={{ background: T.colors.darkAlt, padding: '100px 8vw', minHeight: '100vh' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'start' }}>
          <FadeIn>
            <div style={{ fontSize: T.type.micro.size, letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '14px' }}>
              <span style={{ color: T.colors.burgundy }}>04</span> FAQ
            </div>
            <h2 style={{ fontSize: T.type.h2.size, fontWeight: T.type.h2.weight, lineHeight: 1.2, color: T.colors.cream }}>
              Alles über Vakanzkosten
            </h2>
          </FadeIn>
          <FadeIn delay={100}><DenizAccordion items={faqs} /></FadeIn>
        </div>
      </section>

      {/* CTA - Layout wie Mainpage */}
      <section className="snap-section" style={{
        background: T.colors.burgundy,
        padding: '60px 8vw',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}>
        {/* Top - Section Number */}
        <FadeIn>
          <div style={{ fontSize: T.type.micro.size, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(239, 237, 229, 0.5)', marginBottom: '14px' }}>
            <span style={{ color: T.colors.cream }}>05</span> Kontakt
          </div>
        </FadeIn>

        {/* Center - Big Headline */}
        <FadeIn delay={100}>
          <h2 style={{
            fontSize: T.type.displayXL.size,
            fontWeight: T.type.displayXL.weight,
            color: T.colors.cream,
            fontFamily: T.font,
            letterSpacing: '-0.04em',
            margin: 0,
            lineHeight: 0.9,
            marginLeft: '-8px',
          }}>
            <DecryptedText text="Sprechen?" delay={200} />
          </h2>
        </FadeIn>

        {/* Bottom - Links + CTA */}
        <FadeIn delay={200}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            {/* Left - Links */}
            <div style={{ display: 'flex', gap: '48px' }}>
              <a
                href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025"
                target="_blank"
                rel="noopener noreferrer"
                className="cursor-target"
                style={{
                  fontSize: T.type.label.size,
                  color: T.colors.mutedLight,
                  fontFamily: T.font,
                  textDecoration: 'none',
                  letterSpacing: T.type.label.spacing,
                  position: 'relative',
                }}
              >
                LinkedIn
              </a>
              <Link
                to="/kontakt"
                className="cursor-target"
                style={{
                  fontSize: T.type.label.size,
                  color: T.colors.mutedLight,
                  fontFamily: T.font,
                  textDecoration: 'none',
                  letterSpacing: T.type.label.spacing,
                }}
              >
                Email
              </Link>
            </div>

            {/* Right - CTA Button */}
            <Link to="/kontakt" style={{ textDecoration: 'none' }}>
              <ElectricBorderButton variant="primary">
                Kontakt
              </ElectricBorderButton>
            </Link>
          </div>
        </FadeIn>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.colors.black, padding: '40px 8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.colors.border}` }}>
        <div style={{ fontSize: T.type.micro.size, color: T.colors.muted }}>© 2024 Deniz Tulay — Tech Headhunter Muenchen</div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: T.type.micro.size, letterSpacing: T.type.micro.spacing, textTransform: 'uppercase' }}>LinkedIn</a>
          <Link to="/kontakt" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: T.type.micro.size, letterSpacing: T.type.micro.spacing, textTransform: 'uppercase' }}>Email</Link>
          <Link to="/" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: T.type.micro.size, letterSpacing: T.type.micro.spacing, textTransform: 'uppercase' }}>Hauptseite</Link>
        </div>
      </footer>
    </div>
  );
}
