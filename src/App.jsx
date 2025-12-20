import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';
import ElectricBorder from './ElectricBorder';

// ============================================
// DESIGN TOKENS
// ============================================
const tokens = {
  colors: {
    white: '#EFEDE5',
    black: '#0a0a0a',
    dark: '#0a0a0a',
    darkAlt: '#151413',
    accent: '#652126',
    muted: 'rgba(207, 187, 163, 0.5)',
    mutedLight: '#DBD6CC',
    border: 'rgba(207, 187, 163, 0.15)',
    navActive: 'rgba(207, 187, 163, 0.2)',
    sand: '#DBD6CC',
    cream: '#EFEDE5',
    burgundy: '#652126',
  },
  font: '"JetBrains Mono", "SF Mono", monospace',
  fontMono: '"JetBrains Mono", "SF Mono", monospace',
  easing: {
    hover: 'cubic-bezier(0.215, 0.61, 0.355, 1)',
    page: 'cubic-bezier(0.19, 1, 0.22, 1)',
  },
  timing: {
    fast: '150ms',
    medium: '500ms',
    slow: '1000ms',
  },
};

// ============================================
// JOB TITLES FOR DECRYPT EFFECT
// ============================================
const JOB_TITLES = [
  'Software Developer',
  'DevOps Engineer',
  'System Engineer',
  'ML Expert',
  'Frontend Developer',
  'Backend Developer',
  'Data Engineer',
  'Cloud Architect',
  'IT Security',
  'Embedded Engineer',
  'Full Stack Developer',
];

// ============================================
// CONTENT
// ============================================
const CONTENT = {
  hero: {
    name: 'Deniz',
    role: 'Headhunter',
    location: 'München',
  },
  about: {
    statement: 'Ich finde Menschen,',
    statementLine2: 'nicht Lebensläufe.',
    stats: [
      { value: '7', unit: 'Jahre', detail: 'Tech Recruiting' },
      { value: '500', unit: '+', detail: 'Placements' },
      { value: '98', unit: '%', detail: 'bleiben' },
    ],
  },
  expertise: {
    words: ['Search', 'Strategy', 'Speaking', 'Content'],
  },
  marquee: {
    items: ['Tech Recruiting', 'Engineering', 'Aerospace', 'Defense', 'IT', 'Automatisierung', 'Headhunting', 'München'],
  },
  blog: {
    posts: [
      { id: 1, title: 'Warum 90% der Tech-Recruiter scheitern', category: 'Recruiting', date: '15. Dez 2024', readTime: '5 min', preview: 'Die meisten Recruiter behandeln Kandidaten wie Nummern. Sie kopieren LinkedIn-Nachrichten, spammen Postfächer voll und wundern sich über 2% Response-Raten. Hier ist was ich anders mache.' },
      { id: 2, title: 'Der perfekte Tech-Stack für Recruiting Automation', category: 'Automatisierung', date: '10. Dez 2024', readTime: '8 min', preview: 'Make.com, Apify, Hunter.io – wie ich meinen Workflow automatisiert habe und jetzt 3x so viele Kandidaten erreiche mit der Hälfte der Zeit.' },
      { id: 3, title: 'Aerospace & Defense: Der unterschätzte Markt', category: 'Markt', date: '5. Dez 2024', readTime: '6 min', preview: 'Während alle auf AI-Startups schauen, explodiert der Aerospace-Sektor in München. Hier ist warum das die beste Nische ist.' },
      { id: 4, title: 'LinkedIn Outreach: Was wirklich funktioniert', category: 'Recruiting', date: '1. Dez 2024', readTime: '7 min', preview: 'Nach 500+ Placements weiß ich genau, welche Nachrichten Antworten bekommen. Die Antwort wird dich überraschen.' },
      { id: 5, title: 'Gehälter in Tech 2024: Der komplette Guide', category: 'Markt', date: '28. Nov 2024', readTime: '10 min', preview: 'Was verdienen Entwickler, DevOps und Engineering Manager wirklich? Echte Zahlen aus meiner täglichen Arbeit.' },
      { id: 6, title: 'Warum ich keine Job-Descriptions mehr lese', category: 'Recruiting', date: '25. Nov 2024', readTime: '4 min', preview: 'Die meisten JDs sind nutzlos. Hier ist wie ich stattdessen die richtigen Kandidaten finde.' },
      { id: 7, title: 'Remote vs. Hybrid vs. Office: Was Kandidaten wollen', category: 'Markt', date: '20. Nov 2024', readTime: '6 min', preview: 'Die Daten aus 200+ Gesprächen zeigen ein klares Bild. Und es ist nicht was die meisten Firmen denken.' },
      { id: 8, title: 'Apify für Recruiter: Ein Walkthrough', category: 'Automatisierung', date: '15. Nov 2024', readTime: '12 min', preview: 'Schritt für Schritt: Wie ich Apify nutze um LinkedIn Profile zu scrapen und in mein CRM zu pushen.' },
      { id: 9, title: 'Die Kunst des Nein-Sagens im Recruiting', category: 'Recruiting', date: '10. Nov 2024', readTime: '5 min', preview: 'Nicht jeder Kunde ist der richtige. Hier ist wie ich entscheide mit wem ich arbeite.' },
      { id: 10, title: 'Engineering Manager finden: Mein Playbook', category: 'Recruiting', date: '5. Nov 2024', readTime: '9 min', preview: 'Die schwierigste Rolle zu besetzen. Hier ist mein kompletter Prozess von Sourcing bis Offer.' },
      { id: 11, title: 'Warum Kandidaten absagen (und was du dagegen tun kannst)', category: 'Recruiting', date: '1. Nov 2024', readTime: '6 min', preview: 'Die Top 5 Gründe warum gute Kandidaten im Prozess abspringen. Nummer 3 ist vermeidbar.' },
      { id: 12, title: 'Hunter.io vs. Lusha vs. Apollo: Der Vergleich', category: 'Automatisierung', date: '28. Okt 2024', readTime: '8 min', preview: 'Welches Tool ist das beste für Email-Finding? Ich habe alle drei getestet.' },
      { id: 13, title: 'Wie ich 500+ Placements in 7 Jahren geschafft habe', category: 'Karriere', date: '25. Okt 2024', readTime: '7 min', preview: 'Ein ehrlicher Rückblick auf meinen Weg. Die Fehler, die Learnings, die Durchbrüche.' },
      { id: 14, title: 'Tech-Recruiting in München: Ein Insider-Guide', category: 'Markt', date: '20. Okt 2024', readTime: '11 min', preview: 'Die wichtigsten Companies, die versteckten Champions, und wo die besten Talente arbeiten.' },
      { id: 15, title: 'Cold Calling ist nicht tot', category: 'Recruiting', date: '15. Okt 2024', readTime: '5 min', preview: 'Unpopuläre Meinung: Manchmal ist ein Anruf effektiver als 100 LinkedIn-Nachrichten.' },
      { id: 16, title: 'Mein CRM-Setup für maximale Effizienz', category: 'Automatisierung', date: '10. Okt 2024', readTime: '9 min', preview: 'Pipedrive, Make.com, und ein paar Tricks die mir Stunden pro Woche sparen.' },
      { id: 17, title: 'Was CTOs wirklich von Recruitern erwarten', category: 'Recruiting', date: '5. Okt 2024', readTime: '6 min', preview: 'Ich habe 20 CTOs gefragt. Die Antworten waren überraschend einheitlich.' },
      { id: 18, title: 'Der perfekte Kandidaten-Pitch', category: 'Recruiting', date: '1. Okt 2024', readTime: '5 min', preview: 'Wie du einen Job so präsentierst, dass Top-Talente nicht nein sagen können.' },
      { id: 19, title: 'Freelancer vs. Festanstellung: Der Trend 2024', category: 'Markt', date: '28. Sep 2024', readTime: '7 min', preview: 'Immer mehr Entwickler gehen in die Selbstständigkeit. Was bedeutet das für Recruiter?' },
      { id: 20, title: 'Meine Morgenroutine als Headhunter', category: 'Karriere', date: '25. Sep 2024', readTime: '4 min', preview: 'Die ersten 2 Stunden entscheiden über den Tag. Hier ist wie ich sie nutze.' },
    ],
  },
  podcast: {
    headline: 'Lade mich ein.',
    topics: ['Recruiting', 'Karriere', 'Automatisierung', 'Markt'],
  },
  contact: {
    headline: 'Sprechen?',
    email: 'd.l.tulay@tekom-gmbh.de',
    linkedin: 'www.linkedin.com/in/deniz-levent-tulay-tekom2025',
  },
};
// ============================================
// COST OF VACANCY CALCULATOR
// ============================================
const CostOfVacancyCalculator = () => {
  const [salary, setSalary] = useState(85000);
  const [level, setLevel] = useState('senior');
  const [months, setMonths] = useState(3);
  const [displayedTotal, setDisplayedTotal] = useState(0);

  const levelFactors = {
    junior: { factor: 1.0, label: 'Junior', sublabel: '0.5-1x' },
    senior: { factor: 1.5, label: 'Senior', sublabel: '1-1.5x' },
    lead: { factor: 2.5, label: 'Lead/Exec', sublabel: '2-3x' },
  };

  const dailyCost = salary / 220;
  const days = months * 22;
  const totalCost = Math.round(dailyCost * days * levelFactors[level].factor);
  const weeklyLoss = Math.round((totalCost / months) / 4);

  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startValue = displayedTotal;
    const endValue = totalCost;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedTotal(Math.round(startValue + (endValue - startValue) * eased));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [totalCost]);

  const breakdown = [
    { label: 'Produktivitätsverlust', percent: 50, color: tokens.colors.white },
    { label: 'Überstunden Team', percent: 20, color: tokens.colors.white },
    { label: 'Recruiting intern', percent: 15, color: 'rgba(255, 255, 255, 0.7)' },
    { label: 'Opportunitätskosten', percent: 15, color: 'rgba(255, 255, 255, 0.5)' },
  ];

  return (
    <div style={{
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRadius: '16px',
      padding: '28px',
      maxWidth: '360px',
      border: '1px solid rgba(255,255,255,0.15)',
      fontFamily: tokens.font,
    }}>
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontSize: '10px', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.7)', fontFamily: tokens.fontMono, margin: '0 0 6px 0', textTransform: 'uppercase' }}>
          Talent-Kosten Rechner
        </p>
        <h3 style={{ fontSize: '16px', fontWeight: 500, color: tokens.colors.white, margin: 0, letterSpacing: '-0.02em' }}>
          Was kostet eine offene Stelle?
        </h3>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label htmlFor="salary-input" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>JAHRESGEHALT</label>
        <div style={{ position: 'relative' }}>
          <input id="salary-input" type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} style={{
            width: '100%', padding: '10px 50px 10px 14px', backgroundColor: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '8px', color: tokens.colors.white, fontSize: '15px', fontFamily: tokens.fontMono, outline: 'none', boxSizing: 'border-box',
          }} />
          <span style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.5)', fontSize: '13px', fontFamily: tokens.fontMono }}>EUR</span>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>LEVEL</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {Object.entries(levelFactors).map(([key, { label, sublabel }]) => (
            <button key={key} onClick={() => setLevel(key)} style={{
              flex: 1, padding: '8px 6px', backgroundColor: level === key ? tokens.colors.white : 'rgba(0,0,0,0.3)',
              color: level === key ? tokens.colors.black : 'rgba(255,255,255,0.6)', border: level === key ? 'none' : '1px solid rgba(255,255,255,0.2)',
              borderRadius: '6px', cursor: 'pointer', transition: 'all 150ms ease', fontFamily: tokens.fontMono, fontSize: '10px', textAlign: 'center',
            }}>
              <div style={{ fontWeight: 600 }}>{label}</div>
              <div style={{ fontSize: '8px', opacity: 0.7, marginTop: '1px' }}>{sublabel}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <label htmlFor="months-input" style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, letterSpacing: '0.1em' }}>OFFEN SEIT</label>
          <span style={{ fontSize: '13px', color: tokens.colors.white, fontFamily: tokens.fontMono, fontWeight: 600 }}>{months} {months === 1 ? 'Monat' : 'Monate'}</span>
        </div>
        <input id="months-input" type="range" min="1" max="12" value={months} onChange={(e) => setMonths(Number(e.target.value))} style={{
          width: '100%', height: '4px', borderRadius: '2px', background: `linear-gradient(to right, ${tokens.colors.burgundy} ${((months - 1) / 11 * 100)}%, rgba(0,0,0,0.3) ${((months - 1) / 11 * 100)}%)`,
          appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
        }} />
      </div>

      <div style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '10px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
        <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, letterSpacing: '0.15em', margin: '0 0 6px 0', textTransform: 'uppercase' }}>GESCHÄTZTER VERLUST</p>
        <div style={{ fontSize: '36px', fontWeight: 300, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.03em', lineHeight: 1 }}>
          {displayedTotal.toLocaleString('de-DE')}<span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.5)', marginLeft: '4px' }}>€</span>
        </div>
        <p style={{ fontSize: '11px', color: tokens.colors.white, fontFamily: tokens.fontMono, margin: '6px 0 0 0' }}>+{weeklyLoss.toLocaleString('de-DE')} € / Woche</p>
      </div>

      <div style={{ marginBottom: '16px' }}>
        {breakdown.map((item, i) => (
          <div key={i} style={{ marginBottom: '6px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', fontFamily: tokens.fontMono }}>{item.label}</span>
              <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontMono }}>{item.percent}%</span>
            </div>
            <div style={{ height: '2px', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '1px', overflow: 'hidden' }}>
              <div style={{ width: item.percent + '%', height: '100%', backgroundColor: item.color, borderRadius: '1px' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontMono, letterSpacing: '0.03em', margin: 0, lineHeight: 1.4 }}>
          Basierend auf SHRM, CAP, Gallup & BLS Forschung
        </p>
      </div>
    </div>
  );
};




// ============================================
// BLOG SCROLL LIST (Auto + Manual Drag)
// ============================================
const BlogScrollList = ({ posts, selectedPost, onSelectPost, hoveredId, onHover, onLeave, isActive }) => {
  const [offset, setOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const dragStartY = useRef(0);
  const dragStartOffset = useRef(0);
  const velocityRef = useRef(0);
  const lastYRef = useRef(0);
  const animationRef = useRef(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  
  const doubledPosts = [...posts, ...posts];
  const itemHeight = 80; // Approximate height per item
  const totalHeight = posts.length * itemHeight;

  // Auto scroll
  useEffect(() => {
    if (!isActive || isDragging || !autoScroll) return;
    
    const interval = setInterval(() => {
      setOffset(prev => {
        const newOffset = prev - 0.5;
        // Reset when we've scrolled through one set
        if (Math.abs(newOffset) >= totalHeight) {
          return 0;
        }
        return newOffset;
      });
    }, 16);
    
    return () => clearInterval(interval);
  }, [isActive, isDragging, autoScroll, totalHeight]);

  // Momentum animation after drag
  useEffect(() => {
    if (!isDragging && Math.abs(velocityRef.current) > 0.5) {
      const animate = () => {
        velocityRef.current *= 0.95;
        setOffset(prev => {
          let newOffset = prev + velocityRef.current;
          // Wrap around
          if (newOffset > 0) newOffset = -totalHeight + newOffset;
          if (newOffset < -totalHeight) newOffset = newOffset + totalHeight;
          return newOffset;
        });
        
        if (Math.abs(velocityRef.current) > 0.5) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          // Resume auto scroll after momentum ends
          setTimeout(() => setAutoScroll(true), 1000);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDragging, totalHeight]);

  const handleDragStart = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    setAutoScroll(false);
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
    dragStartY.current = clientY;
    dragStartOffset.current = offset;
    lastYRef.current = clientY;
    velocityRef.current = 0;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !isActive) return;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
    const deltaY = clientY - dragStartY.current;
    velocityRef.current = (clientY - lastYRef.current) * 0.8;
    lastYRef.current = clientY;
    
    let newOffset = dragStartOffset.current + deltaY;
    // Wrap around
    if (newOffset > 0) newOffset = -totalHeight + newOffset;
    if (newOffset < -totalHeight) newOffset = newOffset + totalHeight;
    
    setOffset(newOffset);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e) => {
    if (!isActive) return;
    e.preventDefault();
    setAutoScroll(false);
    setOffset(prev => {
      let newOffset = prev + e.deltaY * 0.5;
      if (newOffset > 0) newOffset = -totalHeight + newOffset;
      if (newOffset < -totalHeight) newOffset = newOffset + totalHeight;
      return newOffset;
    });
    // Resume auto scroll after wheel
    setTimeout(() => setAutoScroll(true), 2000);
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleDragStart}
      onMouseMove={handleDragMove}
      onMouseUp={handleDragEnd}
      onMouseLeave={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchMove={handleDragMove}
      onTouchEnd={handleDragEnd}
      onWheel={handleWheel}
      style={{ 
        flex: 1,
        overflow: 'hidden',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
        position: 'relative',
        cursor: isDragging ? 'grabbing' : 'grab',
        userSelect: 'none',
      }}
    >
      <div 
        ref={trackRef}
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '28px', 
          paddingTop: '20px',
          transform: `translateY(${offset}px)`,
          transition: isDragging ? 'none' : 'transform 0.1s linear',
        }}
      >
        {doubledPosts.map((post, index) => (
          <div 
            key={`${post.id}-${index}`}
            className="cursor-target"
            onClick={() => onSelectPost(post)}
            onMouseEnter={() => onHover(post.id)}
            onMouseLeave={onLeave}
            style={{ 
              cursor: 'pointer',
              opacity: selectedPost.id === post.id ? 1 : (hoveredId === post.id ? 0.8 : 0.4),
              transform: selectedPost.id === post.id ? 'translateX(8px)' : 'translateX(0)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <span style={{ fontSize: '11px', color: selectedPost.id === post.id ? tokens.colors.accent : tokens.colors.muted, fontFamily: tokens.fontMono, marginTop: '3px', minWidth: '20px' }}>
                {String((index % posts.length) + 1).padStart(2, '0')}
              </span>
              <div>
                <span style={{ fontSize: '9px', color: tokens.colors.muted, fontFamily: tokens.fontMono, display: 'block', marginBottom: '6px', letterSpacing: '0.1em' }}>{post.category.toUpperCase()}</span>
                <h3 style={{ fontSize: '15px', fontWeight: selectedPost.id === post.id ? 500 : 400, color: selectedPost.id === post.id ? tokens.colors.white : tokens.colors.mutedLight, margin: 0, lineHeight: 1.4 }}>{post.title}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// TALENT CAROUSEL COMPONENT
// ============================================
const CANDIDATES = [
  { id: 1, position: 'Senior Backend Developer', skills: ['Python', 'AWS', 'Kubernetes', 'PostgreSQL'], salary: '75-85k', availability: 'Ab sofort', experience: '6 Jahre' },
  { id: 2, position: 'DevOps Engineer', skills: ['Terraform', 'Docker', 'CI/CD', 'Azure'], salary: '80-90k', availability: 'Q1 2025', experience: '5 Jahre' },
  { id: 3, position: 'Frontend Developer', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'], salary: '65-75k', availability: 'Ab sofort', experience: '4 Jahre' },
  { id: 4, position: 'Engineering Manager', skills: ['Team Lead', 'Agile', 'System Design', 'Hiring'], salary: '95-110k', availability: 'Q2 2025', experience: '8 Jahre' },
  { id: 5, position: 'ML Engineer', skills: ['Python', 'TensorFlow', 'MLOps', 'Data Pipelines'], salary: '85-100k', availability: 'Ab sofort', experience: '5 Jahre' },
  { id: 6, position: 'Full Stack Developer', skills: ['Node.js', 'React', 'MongoDB', 'GraphQL'], salary: '70-80k', availability: 'Januar 2025', experience: '4 Jahre' },
  { id: 7, position: 'Cloud Architect', skills: ['AWS', 'GCP', 'Terraform', 'Security'], salary: '100-120k', availability: 'Q1 2025', experience: '9 Jahre' },
  { id: 8, position: 'iOS Developer', skills: ['Swift', 'SwiftUI', 'Objective-C', 'CoreData'], salary: '70-85k', availability: 'Ab sofort', experience: '5 Jahre' },
];

const CandidateCard = ({ candidate, angle, isCenter }) => {
  const radians = (angle * Math.PI) / 180;
  const radius = 320;
  const translateX = Math.sin(radians) * radius;
  const translateZ = Math.cos(radians) * radius - radius;
  const visibility = Math.cos(radians);
  const opacity = Math.max(0, Math.min(1, visibility * 1.3));
  const blur = isCenter ? 0 : Math.max(0, (1 - visibility) * 5);
  const scale = isCenter ? 1 : 0.85 + visibility * 0.1;
  const zIndex = Math.round(visibility * 100);

  return (
    <div style={{
      position: 'absolute', left: '50%', top: '50%',
      transform: `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${angle}deg) scale(${scale})`,
      opacity, filter: `blur(${blur}px)`, zIndex,
      transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      pointerEvents: 'none', backfaceVisibility: 'hidden',
    }}>
      <div style={{
        width: '260px', backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        borderRadius: '14px', padding: '20px',
        border: isCenter ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(255,255,255,0.05)',
        boxShadow: isCenter ? '0 20px 60px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.3)',
        fontFamily: tokens.font,
      }}>
        <div style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '9px', letterSpacing: '0.2em', color: tokens.colors.white, fontFamily: tokens.fontMono, margin: '0 0 4px 0', textTransform: 'uppercase', opacity: 0.6 }}>
            Kandidat #{candidate.id}
          </p>
          <h3 style={{ fontSize: '15px', fontWeight: 600, color: tokens.colors.white, margin: 0, letterSpacing: '-0.02em' }}>
            {candidate.position}
          </h3>
        </div>
        <div style={{ marginBottom: '14px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {candidate.skills.slice(0, 3).map((skill, i) => (
              <span key={i} style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '100px', color: 'rgba(255,255,255,0.7)', fontFamily: tokens.fontMono }}>{skill}</span>
            ))}
            {candidate.skills.length > 3 && <span style={{ fontSize: '9px', padding: '2px 6px', color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontMono }}>+{candidate.skills.length - 3}</span>}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontMono, letterSpacing: '0.1em', margin: '0 0 2px 0' }}>GEHALT</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.white, margin: 0 }}>{candidate.salary}</p>
          </div>
          <div>
            <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.4)', fontFamily: tokens.fontMono, letterSpacing: '0.1em', margin: '0 0 2px 0' }}>VERFÜGBAR</p>
            <p style={{ fontSize: '13px', fontWeight: 600, color: tokens.colors.white, margin: 0 }}>{candidate.availability}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TalentCarousel = ({ isActive }) => {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const dragStartRotation = useRef(0);
  const velocityRef = useRef(0);
  const lastXRef = useRef(0);
  const animationRef = useRef(null);

  const anglePerCard = 360 / CANDIDATES.length;
  const normalizedRotation = (((-rotation % 360) + 360) % 360);
  const activeIndex = Math.round(normalizedRotation / anglePerCard) % CANDIDATES.length;
  const activeCandidate = CANDIDATES[activeIndex];

  useEffect(() => {
    if (!isDragging && Math.abs(velocityRef.current) > 0.1) {
      const animate = () => {
        velocityRef.current *= 0.95;
        setRotation(prev => prev + velocityRef.current);
        if (Math.abs(velocityRef.current) > 0.1) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      animationRef.current = requestAnimationFrame(animate);
    }
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [isDragging]);

  const handleDragStart = (e) => {
    if (!isActive) return;
    setIsDragging(true);
    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    dragStartX.current = clientX;
    dragStartRotation.current = rotation;
    lastXRef.current = clientX;
    velocityRef.current = 0;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleDragMove = (e) => {
    if (!isDragging || !isActive) return;
    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const deltaX = clientX - dragStartX.current;
    velocityRef.current = (clientX - lastXRef.current) * 0.3;
    lastXRef.current = clientX;
    setRotation(dragStartRotation.current + (deltaX * 0.4));
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleWheel = (e) => {
    if (!isActive) return;
    e.preventDefault();
    setRotation(prev => prev - e.deltaY * 0.3);
  };

  const getAngle = (index) => {
    const baseAngle = index * anglePerCard;
    let angle = (baseAngle + rotation) % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 20px' }}>
      <div
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        onWheel={handleWheel}
        style={{
          position: 'relative', width: '100%', maxWidth: '600px', height: '340px',
          cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none',
          perspective: '800px', perspectiveOrigin: 'center center',
        }}
      >
        <div style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          {CANDIDATES.map((candidate, index) => {
            const angle = getAngle(index);
            const isCenter = Math.abs(angle) < anglePerCard / 2;
            if (Math.abs(angle) > 90) return null;
            return <CandidateCard key={candidate.id} candidate={candidate} angle={angle} isCenter={isCenter} />;
          })}
        </div>
      </div>
      <div style={{ marginTop: '30px', textAlign: 'center' }}>
        <ElectricBorder color={tokens.colors.burgundy} speed={1.5} chaos={0.3} thickness={2} style={{ borderRadius: '100px' }}>
          <button
            onClick={() => window.location.href = `mailto:${CONTENT.contact.email}?subject=Anfrage: ${activeCandidate.position} (Kandidat %23${activeCandidate.id})`}
            style={{
              padding: '14px 36px', backgroundColor: 'transparent', color: tokens.colors.burgundy, border: 'none',
              fontSize: '11px', fontWeight: 600, fontFamily: tokens.fontMono, letterSpacing: '0.1em',
              cursor: 'pointer', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '8px',
            }}
          >
            <span style={{ opacity: 0.6 }}>#{activeCandidate.id}</span> Profil Anfragen
          </button>
        </ElectricBorder>
        <p style={{ marginTop: '12px', fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono }}>{activeCandidate.position}</p>
      </div>
    </div>
  );
};


// ============================================
const TargetCursor = ({
  targetSelector = '.cursor-target',
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true
}) => {
  const cursorRef = useRef(null);
  const cornersRef = useRef(null);
  const spinTl = useRef(null);
  const dotRef = useRef(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef(null);
  const tickerFnRef = useRef(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    return hasTouchScreen && isSmallScreen;
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x, y) => {
    if (!cursorRef.current) return;
    gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: 'power3.out' });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) return;

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = 'none';
      document.querySelectorAll('*').forEach(el => el.style.cursor = 'none');
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll('.target-cursor-corner');

    let activeTarget = null;
    let currentLeaveHandler = null;
    let resumeTimeout = null;

    const cleanupTarget = (target) => {
      if (currentLeaveHandler) {
        target.removeEventListener('mouseleave', currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });

    const createSpinTimeline = () => {
      if (spinTl.current) spinTl.current.kill();
      spinTl.current = gsap.timeline({ repeat: -1 })
        .to(cursor, { rotation: '+=360', duration: spinDuration, ease: 'none' });
    };
    createSpinTimeline();

    const tickerFn = () => {
      if (!targetCornerPositionsRef.current || !cursorRef.current || !cornersRef.current) return;
      const strength = activeStrengthRef.current.current;
      if (strength === 0) return;
      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, 'x') || 0;
        const currentY = gsap.getProperty(corner, 'y') || 0;
        const targetX = targetCornerPositionsRef.current[i].x - cursorX;
        const targetY = targetCornerPositionsRef.current[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration = strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX, y: finalY, duration,
          ease: duration === 0 ? 'none' : 'power1.out',
          overwrite: 'auto'
        });
      });
    };
    tickerFnRef.current = tickerFn;

    const moveHandler = (e) => moveCursor(e.clientX, e.clientY);
    window.addEventListener('mousemove', moveHandler);

    const scrollHandler = () => {
      if (!activeTarget || !cursorRef.current) return;
      const mouseX = gsap.getProperty(cursorRef.current, 'x');
      const mouseY = gsap.getProperty(cursorRef.current, 'y');
      const el = document.elementFromPoint(mouseX, mouseY);
      if (!el || (el !== activeTarget && el.closest(targetSelector) !== activeTarget)) {
        currentLeaveHandler?.();
      }
    };
    window.addEventListener('scroll', scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };
    const mouseUpHandler = () => {
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };
    window.addEventListener('mousedown', mouseDownHandler);
    window.addEventListener('mouseup', mouseUpHandler);

    const enterHandler = (e) => {
      let current = e.target;
      let target = null;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) { target = current; break; }
        current = current.parentElement;
      }
      if (!target || !cursorRef.current || !cornersRef.current) return;
      if (activeTarget === target) return;
      if (activeTarget) cleanupTarget(activeTarget);
      if (resumeTimeout) { clearTimeout(resumeTimeout); resumeTimeout = null; }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      corners.forEach(corner => gsap.killTweensOf(corner));
      gsap.killTweensOf(cursorRef.current, 'rotation');
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, 'x');
      const cursorY = gsap.getProperty(cursorRef.current, 'y');

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.top - borderWidth },
        { x: rect.right + borderWidth - cornerSize, y: rect.bottom + borderWidth - cornerSize },
        { x: rect.left - borderWidth, y: rect.bottom + borderWidth - cornerSize }
      ];

      isActiveRef.current = true;
      gsap.ticker.add(tickerFnRef.current);
      gsap.to(activeStrengthRef.current, { current: 1, duration: hoverDuration, ease: 'power2.out' });

      corners.forEach((corner, i) => {
        gsap.to(corner, {
          x: targetCornerPositionsRef.current[i].x - cursorX,
          y: targetCornerPositionsRef.current[i].y - cursorY,
          duration: 0.2, ease: 'power2.out'
        });
      });

      const leaveHandler = () => {
        gsap.ticker.remove(tickerFnRef.current);
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const { cornerSize } = constants;
          const positions = [
            { x: -cornerSize * 1.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: -cornerSize * 1.5 },
            { x: cornerSize * 0.5, y: cornerSize * 0.5 },
            { x: -cornerSize * 1.5, y: cornerSize * 0.5 }
          ];
          Array.from(cornersRef.current).forEach((corner, i) => {
            gsap.killTweensOf(corner);
            gsap.to(corner, { x: positions[i].x, y: positions[i].y, duration: 0.3, ease: 'power3.out' });
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current) createSpinTimeline();
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener('mouseleave', leaveHandler);
    };
    window.addEventListener('mouseover', enterHandler);

    const hideOnLeave = () => gsap.to(cursor, { opacity: 0, duration: 0.2 });
    const showOnEnter = () => gsap.to(cursor, { opacity: 1, duration: 0.2 });
    document.addEventListener('mouseleave', hideOnLeave);
    document.addEventListener('mouseenter', showOnEnter);

    return () => {
      if (tickerFnRef.current) gsap.ticker.remove(tickerFnRef.current);
      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('mouseover', enterHandler);
      window.removeEventListener('scroll', scrollHandler);
      window.removeEventListener('mousedown', mouseDownHandler);
      window.removeEventListener('mouseup', mouseUpHandler);
      document.removeEventListener('mouseleave', hideOnLeave);
      document.removeEventListener('mouseenter', showOnEnter);
      if (activeTarget) cleanupTarget(activeTarget);
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
    };
  }, [targetSelector, spinDuration, moveCursor, constants, hideDefaultCursor, isMobile, hoverDuration, parallaxOn]);

  if (isMobile) return null;

  return (
    <div ref={cursorRef} style={{
      position: 'fixed', top: 0, left: 0, width: 0, height: 0,
      pointerEvents: 'none', zIndex: 99999, willChange: 'transform',
    }}>
      <div ref={dotRef} style={{
        position: 'absolute', top: '50%', left: '50%',
        width: '4px', height: '4px', background: tokens.colors.white,
        borderRadius: '50%', transform: 'translate(-50%, -50%)', willChange: 'transform',
      }} />
      {[
        { borderRight: 0, borderBottom: 0, transform: 'translate(-150%, -150%)' },
        { borderLeft: 0, borderBottom: 0, transform: 'translate(50%, -150%)' },
        { borderLeft: 0, borderTop: 0, transform: 'translate(50%, 50%)' },
        { borderRight: 0, borderTop: 0, transform: 'translate(-150%, 50%)' },
      ].map((style, i) => (
        <div key={i} className="target-cursor-corner" style={{
          position: 'absolute', top: '50%', left: '50%',
          width: '12px', height: '12px', border: `3px solid ${tokens.colors.white}`,
          willChange: 'transform', ...style,
        }} />
      ))}
    </div>
  );
};

// ============================================
// GRAIN OVERLAY
// ============================================
const GrainOverlay = () => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
    pointerEvents: 'none', zIndex: 9999, opacity: 0.03,
    background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
  }} />
);

// ============================================
// LINE DRAW LINK
// ============================================
const LineDrawLink = ({ href, children, style, className = '' }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} className={className}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', textDecoration: 'none',
        letterSpacing: hovered ? '0.15em' : '0.1em',
        transition: `letter-spacing ${tokens.timing.fast} ${tokens.easing.hover}`, ...style,
      }}>
      {children}
      <span style={{
        position: 'absolute', bottom: '-2px', left: 0,
        width: hovered ? '100%' : '0%', height: '1px',
        backgroundColor: tokens.colors.white,
        transition: `width ${tokens.timing.medium} ${tokens.easing.page}`,
      }} />
    </a>
  );
};

// ============================================
// MARQUEE
// ============================================
const Marquee = ({ items }) => (
  <div style={{
    overflow: 'hidden', whiteSpace: 'nowrap',
    borderTop: `1px dashed ${tokens.colors.border}`,
    borderBottom: `1px dashed ${tokens.colors.border}`, padding: '24px 0',
  }}>
    <div style={{ display: 'inline-block', animation: 'marquee 20s linear infinite' }}>
      {[...items, ...items].map((item, i) => (
        <span key={i} style={{
          display: 'inline-block', marginRight: '64px', fontSize: '14px',
          fontFamily: tokens.fontMono, color: tokens.colors.muted,
          letterSpacing: '0.2em', textTransform: 'uppercase',
        }}>{item}</span>
      ))}
    </div>
    <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
  </div>
);

// ============================================
// DECRYPTED TEXT - Shows job titles while scrambling
// ============================================
// ============================================
// ANDURIL-STYLE SCRAMBLE TEXT
// Sequential character reveal with random scramble
// ============================================
const DecryptedText = ({ 
  text, 
  speed = 30,           // ms per character (lower = faster)
  isActive = false, 
  delay = 0,
  scrambleOut = false,  // Also scramble out when leaving section
  // Legacy props (kept for compatibility)
  maxIterations = 10,
  sequential = true,
  useJobTitles = false,
}) => {
  const elRef = useRef(null);
  const stateRef = useRef({
    running: false,
    direction: 'in',
    position: 0,
    startTime: 0,
    contents: [],
    animFrameId: null,
    hasCompletedIn: false,
    lastActiveState: null,
  });

  // Character sets
  const DEFAULT_CHARS = useMemo(() => [
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
    'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'
  ], []);
  const NUMBER_CHARS = useMemo(() => ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'], []);

  // Determine charset based on text content
  const isNumberOnly = useMemo(() => /^[\d.,%+x]+$/.test(text.replace(/\s/g, '')), [text]);
  const chars = isNumberOnly ? NUMBER_CHARS : DEFAULT_CHARS;

  // Split text into characters, preserving spaces
  const splitText = useCallback((str) => {
    return str.split('').map((char, i) => ({
      type: /\s/.test(char) ? 'space' : 'character',
      content: char,
      index: i
    }));
  }, []);

  // Get random character
  const getRandChar = useCallback(() => {
    const char = chars[Math.floor(Math.random() * chars.length)];
    return Math.random() < 0.5 ? char.toLowerCase() : char;
  }, [chars]);

  // Generate display text based on position
  const generateDisplay = useCallback((contents, position, direction) => {
    return contents.map((item, i) => {
      if (item.type === 'space') return item.content;
      
      if (direction === 'in') {
        return i < position ? item.content : getRandChar();
      } else {
        return i < position ? getRandChar() : item.content;
      }
    }).join('');
  }, [getRandChar]);

  // Animation loop
  const animate = useCallback(() => {
    const state = stateRef.current;
    const el = elRef.current;
    if (!el || !state.running) return;

    const elapsed = Date.now() - state.startTime;
    state.position = Math.floor(elapsed / speed);

    // Check completion
    if (state.position >= state.contents.length) {
      state.running = false;
      
      if (state.direction === 'in') {
        el.textContent = text;
        state.hasCompletedIn = true;
      } else {
        el.textContent = generateDisplay(state.contents, state.contents.length, 'out');
        state.hasCompletedIn = false;
      }
      return;
    }

    // Continue animation
    el.textContent = generateDisplay(state.contents, state.position, state.direction);
    state.animFrameId = requestAnimationFrame(animate);
  }, [speed, text, generateDisplay]);

  // Start animation
  const startAnimation = useCallback((direction) => {
    const state = stateRef.current;
    const el = elRef.current;
    if (!el) return;

    if (state.animFrameId) {
      cancelAnimationFrame(state.animFrameId);
    }

    state.contents = splitText(text);
    state.direction = direction;
    state.position = 0;
    state.startTime = Date.now();
    state.running = true;

    // Initial display
    if (direction === 'in') {
      el.textContent = generateDisplay(state.contents, 0, 'in');
    }

    animate();
  }, [text, splitText, generateDisplay, animate]);

  // Handle isActive changes
  useEffect(() => {
    const state = stateRef.current;
    
    // First render - initialize lastActiveState
    if (state.lastActiveState === null) {
      state.lastActiveState = isActive;
      if (isActive) {
        const timeoutId = setTimeout(() => startAnimation('in'), delay);
        return () => clearTimeout(timeoutId);
      }
      return;
    }
    
    // Detect transition
    const wasActive = state.lastActiveState;
    state.lastActiveState = isActive;

    if (isActive && !wasActive) {
      // Becoming active - start reveal
      const timeoutId = setTimeout(() => startAnimation('in'), delay);
      return () => clearTimeout(timeoutId);
    } else if (!isActive && wasActive && scrambleOut && state.hasCompletedIn) {
      // Becoming inactive - scramble out
      startAnimation('out');
    }
  }, [isActive, delay, scrambleOut, startAnimation]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (stateRef.current.animFrameId) {
        cancelAnimationFrame(stateRef.current.animFrameId);
      }
    };
  }, []);

  // Initial scrambled display
  const initialDisplay = useMemo(() => {
    const contents = splitText(text);
    return generateDisplay(contents, 0, 'in');
  }, [text, splitText, generateDisplay]);

  return (
    <span style={{ position: 'relative' }}>
      <span style={{ 
        position: 'absolute', width: '1px', height: '1px', padding: 0, 
        margin: '-1px', overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', 
        whiteSpace: 'nowrap', border: 0 
      }}>
        {text}
      </span>
      <span ref={elRef} aria-hidden="true">{initialDisplay}</span>
    </span>
  );
};

// ============================================
// FIXED NAVBAR - Gray/transparent active state
// ============================================
const NavButton = ({ num, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <button 
      onClick={onClick} 
      className="cursor-target"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '36px', 
        height: '36px', 
        borderRadius: '18px', 
        border: 'none', 
        cursor: 'none',
        backgroundColor: isActive ? tokens.colors.navActive : 'transparent',
        color: isActive ? tokens.colors.white : isHovered ? tokens.colors.accent : tokens.colors.muted,
        fontSize: '11px', 
        fontWeight: 500, 
        fontFamily: tokens.fontMono,
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: `all ${tokens.timing.fast} ${tokens.easing.hover}`,
      }}
    >
      {num}
    </button>
  );
};

const FixedNavbar = ({ activeSection, onNavigate }) => {
  return (
    <nav className="cursor-target"
      style={{
        position: 'fixed', left: '32px', bottom: '32px', zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', borderRadius: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <NavButton 
          key={num} 
          num={num} 
          isActive={activeSection === num} 
          onClick={() => onNavigate(num)} 
        />
      ))}
    </nav>
  );
};

// ============================================
// FADE IN
// ============================================
const FadeIn = ({ children, delay = 0, isActive = true }) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (!isActive) {
      setVisible(false);
      return;
    }
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay, isActive]);

  return (
    <div style={{
      opacity: visible ? 1 : 0, 
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity ${tokens.timing.slow} ${tokens.easing.page}, transform ${tokens.timing.slow} ${tokens.easing.page}`,
    }}>{children}</div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function App() {
  const [activeSection, setActiveSection] = useState(1);
  const [selectedBlogPost, setSelectedBlogPost] = useState(CONTENT.blog.posts[0]);
  const [hoveredBlogId, setHoveredBlogId] = useState(null);

  // Disable scroll - only navbar navigation
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, []);

  const navTo = (id) => {
    setActiveSection(id);
  };

  // Expertise words with fading opacity (white to muted)
  const getExpertiseOpacity = (index) => {
    const opacities = [1, 0.7, 0.5, 0.3];
    return opacities[index] || 0.3;
  };

  const cardBase = {
    position: 'absolute', top: 0, left: 0, height: '100vh', width: '100vw', overflow: 'hidden',
  };

  // Shared padding with extra left space for navbar
  const sectionPadding = { padding: '60px 80px 60px 120px' };

  return (
    <div style={{ backgroundColor: tokens.colors.black, height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <GrainOverlay />
      <TargetCursor targetSelector=".cursor-target, a, button" />
      <FixedNavbar activeSection={activeSection} onNavigate={navTo} />

      {/* HERO - Section 1 */}
      <section style={{ 
        ...cardBase, 
        backgroundColor: tokens.colors.black, 
        zIndex: activeSection === 1 ? 10 : 1,
        opacity: activeSection === 1 ? 1 : 0,
        pointerEvents: activeSection === 1 ? 'auto' : 'none',
        transition: 'opacity 0.8s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
        ...sectionPadding, position: "relative", overflow: "hidden" 
      }}>
        {/* Background Video */}
        {/* Vimeo Background Video */}
        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "hidden", zIndex: 0 }}>
          <iframe
            src="https://player.vimeo.com/video/1148318879?background=1&autoplay=1&muted=1&loop=1&byline=0&title=0"
            style={{ position: "absolute", top: "50%", left: "50%", width: "177.78vh", height: "100vh", minWidth: "100%", minHeight: "56.25vw", transform: "translate(-50%, -50%)", opacity: 0.4 }}
            frameBorder="0"
            allow="autoplay; fullscreen"
          />
        </div>
        {/* Dark overlay */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(10, 10, 10, 0.5)", zIndex: 1 }} />
        <div style={{ position: "relative", zIndex: 2, display: "flex", flexDirection: "column", justifyContent: "center", gap: "40px", flex: 1 }}><FadeIn delay={200} isActive={activeSection === 1}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0, textTransform: 'uppercase' }}>01</p>
        </FadeIn>
        
        <FadeIn delay={400} isActive={activeSection === 1}>
          <h1 style={{ 
            fontSize: 'clamp(32px, 4.5vw, 56px)', 
            fontWeight: 400, 
            lineHeight: 1.1, 
            margin: 0, 
            fontFamily: tokens.font,
          }}>
            {/* Zeile 1: Ich bin Headhunter, spezialisiert */}
            <span style={{ color: tokens.colors.muted, fontWeight: 300, fontStyle: 'italic' }}>
              <DecryptedText text="Ich bin" speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={0} />
            </span>{' '}
            <span className="cursor-target" style={{ color: tokens.colors.white, fontWeight: 600 }}>
              <DecryptedText text="Headhunter," speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={200} />
            </span>{' '}
            <span style={{ color: tokens.colors.muted, fontWeight: 300, fontStyle: 'italic' }}>
              <DecryptedText text="spezialisiert" speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={400} />
            </span>
            <br />
            {/* Zeile 2: auf Tech & Engineering */}
            <span style={{ color: tokens.colors.muted, fontWeight: 300, fontStyle: 'italic' }}>
              <DecryptedText text="auf" speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={500} />
            </span>{' '}
            <span className="cursor-target" style={{ color: tokens.colors.white, fontWeight: 600 }}>
              <DecryptedText text="Tech & Engineering" speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={600} />
            </span>
            <br />
            {/* Zeile 3: in München */}
            <span style={{ color: tokens.colors.muted, fontWeight: 300, fontStyle: 'italic' }}>
              <DecryptedText text="in" speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={800} />
            </span>{' '}
            <span className="cursor-target" style={{ color: tokens.colors.white, fontWeight: 600 }}>
              <DecryptedText text="München." speed={80} sequential={false} maxIterations={12} isActive={activeSection === 1} delay={1000} />
            </span>
          </h1>
          
          {/* Button unter dem Text */}
          <div style={{ marginTop: "40px", display: "inline-block" }}>
            <ElectricBorder color={tokens.colors.burgundy} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: "100px" }}>
              <button className="cursor-target" onClick={() => window.location.href = `mailto:${CONTENT.contact.email}`} style={{ padding: "16px 40px", backgroundColor: "transparent", color: tokens.colors.white, border: "none", borderRadius: "100px", fontSize: "12px", fontWeight: 500, fontFamily: tokens.fontMono, letterSpacing: "0.1em", cursor: "none", textTransform: "uppercase" }}>Kontakt</button>
            </ElectricBorder>
          </div>
        </FadeIn>

        </div>
      </section>

      {/* ABOUT - Section 2: Cost of Vacancy */}
      <section style={{
        ...cardBase,
        backgroundColor: tokens.colors.sand, 
        borderRadius: '32px 32px 0 0',
        zIndex: activeSection === 2 ? 10 : 1,
        opacity: activeSection === 2 ? 1 : 0,
        pointerEvents: activeSection === 2 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        display: 'grid', gridTemplateColumns: '1fr 400px', gap: '60px',
      }}>
        {/* Left - Pain Point Text */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 40px 60px 120px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.accent, fontFamily: tokens.fontMono, margin: '0 0 32px 0', textTransform: 'uppercase' }}>
            <DecryptedText text="02 — Das Problem" speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={0} />
          </p>
          
          <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 400, color: tokens.colors.black, margin: '0 0 28px 0', lineHeight: 1.2, fontFamily: tokens.font, letterSpacing: '-0.02em' }}>
            <DecryptedText text="Jede offene Stelle kostet " speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={800} />
            <span style={{ color: tokens.colors.black }}><DecryptedText text="bares Geld." speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={1600} /></span>
          </h2>
          
          <p style={{ fontSize: '15px', color: tokens.colors.black, lineHeight: 1.7, margin: '0 0 20px 0', fontFamily: tokens.font, maxWidth: '540px' }}>
            <DecryptedText text="Während Sie nach dem perfekten Kandidaten suchen, verlieren Sie täglich Produktivität. Ihr Team arbeitet über Kapazität, Projekte verzögern sich, und die besten Talente gehen zur Konkurrenz." speed={100} sequential={false} maxIterations={18} isActive={activeSection === 2} delay={2400} />
          </p>
          
          <p style={{ fontSize: '15px', color: tokens.colors.black, lineHeight: 1.7, margin: '0 0 36px 0', fontFamily: tokens.font, maxWidth: '540px' }}>
            <DecryptedText text="Die durchschnittliche Tech-Position bleibt 42 Tage unbesetzt. Bei Senior-Rollen oft 3-6 Monate. Rechnen Sie selbst." speed={100} sequential={false} maxIterations={18} isActive={activeSection === 2} delay={4200} />
          </p>

          {/* Quick Stats Row */}
          <div style={{ display: 'flex', gap: '40px', paddingTop: '20px', borderTop: `1px solid ${tokens.colors.border}` }}>
            <div>
              <span style={{ fontSize: '36px', fontWeight: 300, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.02em' }}>
                <DecryptedText text="42" speed={150} sequential={false} maxIterations={20} isActive={activeSection === 2} delay={6000} />
              </span>
              <p style={{ fontSize: '11px', color: tokens.colors.black, fontFamily: tokens.fontMono, margin: '4px 0 0 0', letterSpacing: '0.05em' }}>
                <DecryptedText text="Tage ⌀ unbesetzt" speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={6200} />
              </p>
            </div>
            <div>
              <span style={{ fontSize: '36px', fontWeight: 300, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.02em' }}>
                <DecryptedText text="1.5x" speed={150} sequential={false} maxIterations={20} isActive={activeSection === 2} delay={6800} />
              </span>
              <p style={{ fontSize: '11px', color: tokens.colors.black, fontFamily: tokens.fontMono, margin: '4px 0 0 0', letterSpacing: '0.05em' }}>
                <DecryptedText text="Gehalt = Verlust" speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={7000} />
              </p>
            </div>
            <div>
              <span style={{ fontSize: '36px', fontWeight: 300, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.02em' }}>
                <DecryptedText text="73%" speed={150} sequential={false} maxIterations={20} isActive={activeSection === 2} delay={7600} />
              </span>
              <p style={{ fontSize: '11px', color: tokens.colors.black, fontFamily: tokens.fontMono, margin: '4px 0 0 0', letterSpacing: '0.05em' }}>
                <DecryptedText text="versteckte Kosten" speed={120} sequential={false} maxIterations={15} isActive={activeSection === 2} delay={7800} />
              </p>
            </div>
          </div>
        </div>
        
        {/* Right - Calculator */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '60px 80px 60px 0' }}>
          <CostOfVacancyCalculator />
        </div>
      </section>














      {/* EXPERTISE - Section 3 */}
      <section style={{ 
        ...cardBase, 
        backgroundColor: tokens.colors.black, 
        borderRadius: '32px 32px 0 0',
        zIndex: activeSection === 3 ? 10 : 1,
        opacity: activeSection === 3 ? 1 : 0,
        pointerEvents: activeSection === 3 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        <Marquee items={CONTENT.marquee.items} />
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          flex: 1,
        }}>
          {/* Left - Expertise Words */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '60px 40px 60px 120px', 
            justifyContent: 'center',
          }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, margin: '0 0 48px 0', textTransform: 'uppercase' }}>03 — Was ich mache</p>
            {CONTENT.expertise.words.map((word, i) => (
              <span key={word} className="cursor-target" style={{ 
                fontSize: 'clamp(40px, 7vw, 90px)', 
                fontWeight: 400, 
                color: `rgba(255, 255, 255, ${getExpertiseOpacity(i)})`, 
                fontFamily: tokens.font, 
                letterSpacing: '-0.03em', 
                lineHeight: 1.0, 
                display: 'block',
                marginLeft: '-4px',
              }}>
                <DecryptedText text={word} speed={60} useJobTitles={true} isActive={activeSection === 3} delay={i * 150} />
              </span>
            ))}
          </div>
          
          {/* Right - Talent Carousel */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            borderLeft: '1px solid rgba(255,255,255,0.1)',
          }}>
            <TalentCarousel isActive={activeSection === 3} />
          </div>
        </div>
        <Marquee items={[...CONTENT.marquee.items].reverse()} />
      </section>


      {/* BLOG - Section 4 */}
      <section style={{ 
        ...cardBase, 
        backgroundColor: tokens.colors.darkAlt, 
        borderRadius: '32px 32px 0 0',
        zIndex: activeSection === 4 ? 10 : 1,
        opacity: activeSection === 4 ? 1 : 0,
        pointerEvents: activeSection === 4 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr',
      }}>
        {/* Left - Infinite Scroll Blog List with Drag */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          padding: '80px 40px 80px 120px',
          borderRight: `1px dashed ${tokens.colors.border}`,
          height: '100%',
          overflow: 'hidden',
          position: 'relative',
        }}>
          {/* Fixed Header */}
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.accent, fontFamily: tokens.fontMono, margin: '0 0 32px 0', textTransform: 'uppercase', flexShrink: 0, zIndex: 10 }}>04 — Blog</p>
          
          <BlogScrollList 
            posts={CONTENT.blog.posts}
            selectedPost={selectedBlogPost}
            onSelectPost={setSelectedBlogPost}
            hoveredId={hoveredBlogId}
            onHover={setHoveredBlogId}
            onLeave={() => setHoveredBlogId(null)}
            isActive={activeSection === 4}
          />
        </div>

        {/* Right - Scrollable Preview */}
        <div style={{ overflowY: 'auto', padding: '80px' }} className="blog-scroll">
          <style>{`
            .blog-scroll::-webkit-scrollbar { display: none; }
            .blog-scroll { -ms-overflow-style: none; scrollbar-width: none; }
          `}</style>
          
          {/* Sticky Header */}
          <div style={{ position: 'sticky', top: 0, backgroundColor: tokens.colors.darkAlt, paddingBottom: '20px', marginBottom: '8px', zIndex: 10 }}>
            <span style={{ fontSize: '11px', color: tokens.colors.accent, fontFamily: tokens.fontMono, letterSpacing: '0.2em' }}>{selectedBlogPost.readTime.toUpperCase()} LESEZEIT</span>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 40px)', fontWeight: 400, color: tokens.colors.white, margin: '16px 0 0 0', lineHeight: 1.2, letterSpacing: '-0.02em' }}>{selectedBlogPost.title}</h2>
          </div>
          
          {/* Preview Text */}
          <div style={{ fontSize: '16px', color: tokens.colors.mutedLight, lineHeight: 1.8, whiteSpace: 'pre-line' }}>{selectedBlogPost.preview}</div>
          
          {/* Footer */}
          <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: `1px dashed ${tokens.colors.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontSize: '11px', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0, letterSpacing: '0.1em' }}>{selectedBlogPost.date}</p>
            <div className="cursor-target" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
              <span style={{ fontSize: '13px', color: tokens.colors.accent, fontFamily: tokens.fontMono, letterSpacing: '0.1em' }}>WEITERLESEN</span>
              <span style={{ fontSize: '18px', color: tokens.colors.accent }}>→</span>
            </div>
          </div>
        </div>
      </section>
      {/* PODCAST - Section 5 */}
      <section style={{ 
        ...cardBase, 
        backgroundColor: tokens.colors.sand, 
        borderRadius: '32px 32px 0 0',
        zIndex: activeSection === 5 ? 10 : 1,
        opacity: activeSection === 5 ? 1 : 0,
        pointerEvents: activeSection === 5 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', 
        ...sectionPadding,
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.accent, fontFamily: tokens.fontMono, margin: '0 0 32px 0', textTransform: 'uppercase' }}>05 — Podcast</p>
        <h2 style={{ fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.03em', margin: '0 0 64px 0', lineHeight: 1, marginLeft: '-4px' }}>
          <DecryptedText text={CONTENT.podcast.headline} speed={50} useJobTitles={true} isActive={activeSection === 5} />
        </h2>
        <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
          {CONTENT.podcast.topics.map((topic) => (
            <LineDrawLink key={topic} href="#" className="cursor-target" style={{ fontSize: '14px', color: "rgba(10, 10, 10, 0.6)", fontFamily: tokens.fontMono, padding: '12px 0' }}>{topic}</LineDrawLink>
          ))}
        </div>
        <div className="cursor-target" style={{ marginTop: '80px', width: '100%', maxWidth: '400px', aspectRatio: '16/9', backgroundColor: "rgba(10, 10, 10, 0.08)", borderRadius: '12px', border: `1px dashed ${tokens.colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: "rgba(10, 10, 10, 0.4)", fontFamily: tokens.fontMono, letterSpacing: '0.1em' }}>VIDEO LOOP</div>
      </section>

      {/* CONTACT - Section 6 */}
      <section style={{ 
        ...cardBase, 
        backgroundColor: tokens.colors.dark, 
        borderRadius: '32px 32px 0 0',
        zIndex: activeSection === 6 ? 10 : 1,
        opacity: activeSection === 6 ? 1 : 0,
        pointerEvents: activeSection === 6 ? 'auto' : 'none',
        transition: 'opacity 0.5s ease',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between', 
        ...sectionPadding,
      }}>
        <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0, textTransform: 'uppercase' }}>06</p>
        <h2 className="cursor-target" style={{ fontSize: 'clamp(64px, 12vw, 180px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.04em', margin: 0, lineHeight: 0.9, marginLeft: '-8px' }}>
          <DecryptedText text={CONTENT.contact.headline} speed={80} useJobTitles={true} isActive={activeSection === 6} />
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '48px' }}>
            <LineDrawLink href={`https://${CONTENT.contact.linkedin}`} className="cursor-target" style={{ fontSize: '12px', color: tokens.colors.mutedLight, fontFamily: tokens.fontMono }}>LinkedIn</LineDrawLink>
            <LineDrawLink href={`mailto:${CONTENT.contact.email}`} className="cursor-target" style={{ fontSize: '12px', color: tokens.colors.mutedLight, fontFamily: tokens.fontMono }}>Email</LineDrawLink>
          </div>
          <ElectricBorder color={tokens.colors.burgundy} speed={1} chaos={0.5} thickness={2} style={{ borderRadius: '100px' }}><button className="cursor-target" onClick={() => window.location.href = `mailto:${CONTENT.contact.email}`} style={{ padding: '20px 48px', backgroundColor: 'transparent', color: tokens.colors.burgundy, border: 'none', borderRadius: '100px', fontSize: '13px', fontWeight: 500, fontFamily: tokens.fontMono, letterSpacing: '0.1em', cursor: 'none', textTransform: 'uppercase', transition: `transform ${tokens.timing.fast} ${tokens.easing.hover}` }}>Kontakt</button></ElectricBorder>
        </div>
      </section>
    </div>
  );
}
