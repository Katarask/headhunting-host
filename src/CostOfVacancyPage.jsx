import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import TargetCursor from './TargetCursor';

// Design Tokens
const T = {
  colors: {
    sand: '#DBD6CC',
    cream: '#EFEDE5',
    burgundy: '#652126',
    black: '#0a0a0a',
    darkAlt: '#151413',
    muted: 'rgba(207, 187, 163, 0.5)',
    mutedLight: '#DBD6CC',
    border: 'rgba(207, 187, 163, 0.15)',
  },
  font: '"JetBrains Mono", "SF Mono", monospace',
};

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

// Electric Border Button
const ElectricBorderButton = ({ children, onClick, variant = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = {
    primary: { stroke: T.colors.burgundy, text: T.colors.burgundy, hoverBg: T.colors.burgundy, hoverText: T.colors.cream },
    dark: { stroke: T.colors.cream, text: T.colors.cream, hoverBg: T.colors.cream, hoverText: T.colors.black },
  };
  const c = colors[variant];
  
  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      style={{
        position: 'relative',
        padding: '20px 48px',
        background: isHovered ? c.hoverBg : 'transparent',
        border: `1.5px solid ${c.stroke}`,
        color: isHovered ? c.hoverText : c.text,
        fontFamily: T.font,
        fontSize: '11px',
        fontWeight: 500,
        letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        transition: 'all 0.4s ease',
        boxShadow: isHovered ? `0 0 30px ${c.stroke}40` : 'none',
      }}
    >
      {children}
    </button>
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
            fontSize: '12px',
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
const AnimatedNumber = ({ value, prefix = '' }) => {
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
  
  return <>{prefix}{display.toLocaleString('de-DE')}</>;
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
        fontSize: '12px',
        fontWeight: 500,
        color: T.colors.cream,
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
          transition: 'color 0.3s',
        }}>LinkedIn</a>
        <a href="mailto:d.l.tulay@tekom-gmbh.de" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>Kontakt</a>
      </nav>
    </header>
  );
};

// Calculator
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'start' }}>
      <div>
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontFamily: T.font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '12px' }}>
            Jahresgehalt (brutto)
          </label>
          <div style={{ display: 'flex', alignItems: 'baseline', borderBottom: `1px solid ${T.colors.border}`, paddingBottom: '8px' }}>
            <span style={{ fontFamily: T.font, fontSize: '14px', color: T.colors.muted, marginRight: '8px' }}>€</span>
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
                fontSize: '36px',
                fontWeight: 300,
                color: T.colors.cream,
              }}
            />
          </div>
        </div>
        
        <div style={{ marginBottom: '40px' }}>
          <label style={{ display: 'block', fontFamily: T.font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '12px' }}>
            Senioritätslevel
          </label>
          <div style={{ display: 'flex', gap: '4px' }}>
            {[{ key: 'junior', label: 'Junior', mult: '1×' }, { key: 'senior', label: 'Senior', mult: '1.5×' }, { key: 'lead', label: 'Lead', mult: '2×' }].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setLevel(opt.key)}
                style={{
                  flex: 1,
                  padding: '14px 10px',
                  background: level === opt.key ? T.colors.burgundy : 'transparent',
                  border: `1px solid ${level === opt.key ? T.colors.burgundy : T.colors.border}`,
                  fontFamily: T.font,
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: level === opt.key ? T.colors.cream : T.colors.muted,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              >
                <div>{opt.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 300, marginTop: '4px', opacity: level === opt.key ? 1 : 0.5 }}>{opt.mult}</div>
              </button>
            ))}
          </div>
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
            <label style={{ fontFamily: T.font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.colors.muted }}>
              Stelle offen seit
            </label>
            <span style={{ fontFamily: T.font, fontSize: '20px', fontWeight: 300, color: T.colors.burgundy }}>
              {months} {months === 1 ? 'Monat' : 'Monate'}
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="12"
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            style={{ width: '100%', accentColor: T.colors.burgundy }}
          />
        </div>
      </div>
      
      <div style={{ 
        padding: '40px', 
        background: T.colors.darkAlt, 
        border: `1px solid ${T.colors.border}`,
      }}>
        <div style={{ fontFamily: T.font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '12px' }}>
          Ihre Vakanzkosten
        </div>
        <div style={{ fontFamily: T.font, fontSize: '56px', fontWeight: 300, color: T.colors.burgundy, lineHeight: 1, marginBottom: '20px' }}>
          <AnimatedNumber value={totalCost} prefix="€" />
        </div>
        <div style={{ fontFamily: T.font, fontSize: '13px', lineHeight: 1.8, color: T.colors.muted, marginBottom: '24px', paddingBottom: '24px', borderBottom: `1px solid ${T.colors.border}` }}>
          {vacancyDays} Tage × €{Math.round(dailyCost).toLocaleString('de-DE')}/Tag × {multipliers[level]}
        </div>
        
        <div style={{ padding: '20px', background: T.colors.burgundy, marginBottom: '24px' }}>
          <div style={{ fontFamily: T.font, fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: T.colors.cream, opacity: 0.7, marginBottom: '6px' }}>
            Mit Headhunter (42 Tage ø)
          </div>
          <div style={{ fontFamily: T.font, fontSize: '28px', fontWeight: 300, color: T.colors.cream }}>
            <AnimatedNumber value={headhunterCost} prefix="€" />
          </div>
          <div style={{ fontFamily: T.font, fontSize: '12px', color: T.colors.cream, opacity: 0.8, marginTop: '4px' }}>
            Ersparnis: <strong>€{savings.toLocaleString('de-DE')}</strong>
          </div>
        </div>
        
        <ElectricBorderButton variant="dark">
          Gespräch Vereinbaren
        </ElectricBorderButton>
      </div>
    </div>
  );
};

// Stat Card
const StatCard = ({ value, label, source, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: '28px',
        background: isHovered ? T.colors.burgundy : 'transparent',
        border: `1px solid ${isHovered ? T.colors.burgundy : T.colors.border}`,
        transition: 'all 0.4s ease',
        cursor: 'default',
      }}
    >
      <div style={{ 
        fontFamily: T.font, fontSize: '36px', fontWeight: 300, 
        color: isHovered ? T.colors.cream : T.colors.burgundy,
        marginBottom: '10px', transition: 'color 0.3s',
      }}>
        {value}
      </div>
      <div style={{ 
        fontFamily: T.font, fontSize: '11px', fontWeight: 500,
        color: isHovered ? T.colors.cream : T.colors.black,
        marginBottom: '6px', transition: 'color 0.3s',
        textTransform: 'uppercase', letterSpacing: '0.05em',
      }}>
        {label}
      </div>
      <div style={{ 
        fontFamily: T.font, fontSize: '9px', letterSpacing: '0.1em',
        color: isHovered ? 'rgba(239,237,229,0.6)' : T.colors.muted,
        textTransform: 'uppercase', transition: 'color 0.3s',
      }}>
        {source}
      </div>
    </div>
  );
};

// Accordion
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

const AccordionItem = ({ title, content, isOpen, onClick, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const scrambledTitle = useScramble(title, isHovered);
  
  return (
    <div style={{ position: 'relative' }}>
      {isOpen && (
        <div style={{
          position: 'absolute', inset: 0,
          border: `1px solid ${T.colors.burgundy}`,
          boxShadow: `0 0 20px ${T.colors.burgundy}30`,
          pointerEvents: 'none', zIndex: 1,
        }} />
      )}
      
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          width: '100%', padding: '20px 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: isOpen ? `linear-gradient(90deg, ${T.colors.darkAlt}, rgba(101, 33, 38, 0.1))` : T.colors.darkAlt,
          border: 'none', borderBottom: `1px solid ${T.colors.border}`,
          cursor: 'pointer', transition: 'all 0.3s ease',
        }}
      >
        <span style={{ fontFamily: T.font, fontSize: '10px', color: isOpen ? T.colors.burgundy : T.colors.muted, letterSpacing: '0.1em', marginRight: '20px' }}>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span style={{
          fontFamily: T.font, fontSize: '12px', fontWeight: 500,
          color: isHovered || isOpen ? T.colors.cream : T.colors.muted,
          letterSpacing: '0.02em', textAlign: 'left', flex: 1, textTransform: 'uppercase',
        }}>
          {scrambledTitle}
        </span>
        <span style={{ fontFamily: T.font, fontSize: '18px', color: isOpen ? T.colors.burgundy : T.colors.muted }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>
      
      <div style={{
        maxHeight: isOpen ? '300px' : '0',
        overflow: 'hidden',
        transition: 'all 0.5s ease',
        background: 'rgba(101, 33, 38, 0.05)',
      }}>
        <div style={{
          padding: isOpen ? '24px 28px' : '0 28px',
          opacity: isOpen ? 1 : 0,
          transition: 'all 0.4s ease 0.1s',
        }}>
          <p style={{ fontFamily: T.font, fontSize: '13px', lineHeight: 1.8, color: T.colors.mutedLight, margin: 0 }}>
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
      <div style={{ padding: '14px 28px', borderBottom: `1px solid ${T.colors.border}`, display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ width: '6px', height: '6px', background: T.colors.burgundy, boxShadow: `0 0 10px ${T.colors.burgundy}` }} />
        <span style={{ fontFamily: T.font, fontSize: '9px', color: T.colors.muted, letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          FAQ_MODULE.exe
        </span>
      </div>
      {items.map((item, index) => (
        <AccordionItem key={index} index={index} title={item.title} content={item.content}
          isOpen={openIndex === index} onClick={() => setOpenIndex(openIndex === index ? -1 : index)} />
      ))}
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

  const marketStats = [
    { value: '29.000€', label: 'Ø Vakanzkosten', source: 'Stepstone' },
    { value: '37.300€', label: 'IT-Positionen', source: 'Stepstone' },
    { value: '172', label: 'Tage Vakanzzeit', source: 'Statista' },
    { value: '149K', label: 'Offene IT-Stellen', source: 'Bitkom' },
    { value: '+37%', label: 'München vs. Ø', source: 'Glassdoor' },
    { value: '42', label: 'Tage Headhunter', source: 'Deniz Tulay' },
  ];

  const marqueeItems = ['Cost of Vacancy', 'Vakanzkosten', 'Tech Recruiting', 'München', 'IT-Fachkräfte', 'Time-to-Hire'];

  return (
    <div style={{ fontFamily: T.font, background: T.colors.black, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        ::selection { background: ${T.colors.burgundy}; color: ${T.colors.cream}; }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <TargetCursor targetSelector=".cursor-target, a, button" color={T.colors.cream} />
      <GrainOverlay />
      <Header />

      {/* HERO */}
      <section style={{ 
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
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `linear-gradient(${T.colors.border} 1px, transparent 1px), linear-gradient(90deg, ${T.colors.border} 1px, transparent 1px)`,
          backgroundSize: '80px 80px', opacity: 0.3,
        }} />

        <div style={{ position: 'relative', padding: '0 8vw' }}>
          <FadeIn>
            <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '28px' }}>
              <span style={{ color: T.colors.burgundy }}>●</span> Cost of Vacancy Rechner
            </div>
          </FadeIn>
          
          <FadeIn delay={100}>
            <h1 style={{ fontSize: 'clamp(40px, 7vw, 90px)', fontWeight: 300, lineHeight: 1.0, color: T.colors.cream, marginBottom: '28px', maxWidth: '800px' }}>
              <DecryptedText text="Was kostet" delay={200} /><br />
              <span style={{ color: T.colors.burgundy }}><DecryptedText text="Ihre Vakanz?" delay={600} /></span>
            </h1>
          </FadeIn>
          
          <FadeIn delay={200}>
            <p style={{ fontSize: '15px', lineHeight: 1.9, color: T.colors.muted, maxWidth: '450px', marginBottom: '40px' }}>
              Jede unbesetzte Stelle kostet <strong style={{ color: T.colors.cream }}>29.000€</strong>. 
              IT sogar <strong style={{ color: T.colors.cream }}>37.300€</strong>. 
              München: <strong style={{ color: T.colors.burgundy }}>+37%</strong>.
            </p>
          </FadeIn>
          
          <FadeIn delay={300}>
            <ElectricBorderButton>Jetzt berechnen ↓</ElectricBorderButton>
          </FadeIn>
        </div>

        <div style={{
          position: 'absolute', bottom: '8vh', right: '8vw',
          fontFamily: T.font, fontSize: '180px', fontWeight: 300,
          color: T.colors.burgundy, opacity: 0.05,
        }}>€</div>
      </section>

      <Marquee items={marqueeItems} speed={35} />

      {/* CALCULATOR */}
      <section style={{ background: T.colors.black, padding: '100px 8vw' }}>
        <FadeIn>
          <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '14px' }}>
            <span style={{ color: T.colors.burgundy }}>02</span> Rechner
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.2, color: T.colors.cream, marginBottom: '60px', maxWidth: '500px' }}>
            Jeder Tag kostet <span style={{ color: T.colors.burgundy }}>bares Geld</span>
          </h2>
        </FadeIn>
        <FadeIn delay={100}><Calculator /></FadeIn>
      </section>

      {/* MARKET DATA */}
      <section style={{ background: T.colors.sand, padding: '100px 8vw' }}>
        <FadeIn>
          <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '14px' }}>
            <span style={{ color: T.colors.burgundy }}>03</span> Marktdaten
          </div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 48px)', fontWeight: 300, lineHeight: 1.2, color: T.colors.black, marginBottom: '50px' }}>
            Was Vakanzen <span style={{ color: T.colors.burgundy }}>kosten</span>
          </h2>
        </FadeIn>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
          {marketStats.map((stat, i) => (
            <FadeIn key={i} delay={i * 60}>
              <StatCard value={stat.value} label={stat.label} source={stat.source} index={i} />
            </FadeIn>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={{ background: T.colors.darkAlt, padding: '100px 8vw' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px', alignItems: 'start' }}>
          <FadeIn>
            <div style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: T.colors.muted, marginBottom: '14px' }}>
              <span style={{ color: T.colors.burgundy }}>04</span> FAQ
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', fontWeight: 300, lineHeight: 1.2, color: T.colors.cream }}>
              Alles über <span style={{ color: T.colors.burgundy }}>Vakanzkosten</span>
            </h2>
          </FadeIn>
          <FadeIn delay={100}><DenizAccordion items={faqs} /></FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: T.colors.burgundy, padding: '100px 8vw', textAlign: 'center' }}>
        <FadeIn>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 300, lineHeight: 1.1, color: T.colors.cream, marginBottom: '20px' }}>
            Sprechen?
          </h2>
          <p style={{ fontSize: '14px', lineHeight: 1.9, color: 'rgba(239,237,229,0.7)', maxWidth: '400px', margin: '0 auto 40px' }}>
            Ich finde Menschen, nicht Lebensläufe. Tech & Engineering in München.
          </p>
          <ElectricBorderButton variant="dark">Gespräch Vereinbaren</ElectricBorderButton>
        </FadeIn>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '60px', marginTop: '60px', paddingTop: '40px', borderTop: '1px solid rgba(239,237,229,0.2)' }}>
          {[{ value: '500+', label: 'Placements' }, { value: '98%', label: 'Retention' }, { value: '42', label: 'Tage ø' }].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: '40px', fontWeight: 300, color: T.colors.cream }}>{stat.value}</div>
              <div style={{ fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(239,237,229,0.5)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: T.colors.black, padding: '40px 8vw', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: `1px solid ${T.colors.border}` }}>
        <div style={{ fontSize: '10px', color: T.colors.muted }}>© 2024 Deniz Tulay — Tech Headhunter Muenchen</div>
        <div style={{ display: 'flex', gap: '40px' }}>
          <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>LinkedIn</a>
          <a href="mailto:d.l.tulay@tekom-gmbh.de" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Email</a>
          <Link to="/" style={{ color: T.colors.cream, textDecoration: 'none', fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Hauptseite</Link>
        </div>
      </footer>
    </div>
  );
}
