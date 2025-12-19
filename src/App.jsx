import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { gsap } from 'gsap';

// ============================================
// DESIGN TOKENS
// ============================================
const tokens = {
  colors: {
    white: '#ffffff',
    black: '#0a0a0a',
    dark: '#111111',
    darkAlt: '#1a1a1a',
    accent: '#0052FF',
    muted: 'rgba(255, 255, 255, 0.6)',
    mutedLight: 'rgba(255, 255, 255, 0.6)',
    border: 'rgba(255, 255, 255, 0.08)',
  },
  font: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
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
  quote: {
    text: '3 Wochen. 1 Engineering Lead. Perfekt.',
    author: 'CTO, Aerospace Startup',
  },
  podcast: {
    headline: 'Lade mich ein.',
    topics: ['Recruiting', 'Karriere', 'Automatisierung', 'Markt'],
  },
  contact: {
    headline: 'Sprechen?',
    email: 'deniz@tekom.de',
    linkedin: 'linkedin.com/in/deniz',
  },
};

// ============================================
// TARGET CURSOR (GSAP Version)
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
// SCROLL PROGRESS BAR
// ============================================
const ScrollProgress = ({ progress }) => (
  <div style={{
    position: 'fixed', top: 0, left: 0, width: '100%', height: '2px',
    zIndex: 10000, backgroundColor: 'rgba(255,255,255,0.1)',
  }}>
    <div style={{
      height: '100%', width: `${progress}%`, backgroundColor: tokens.colors.accent,
      transition: `width 100ms ${tokens.easing.hover}`,
    }} />
  </div>
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
    borderTop: `1px solid ${tokens.colors.border}`,
    borderBottom: `1px solid ${tokens.colors.border}`, padding: '24px 0',
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
// DECRYPTED TEXT
// ============================================
const DecryptedText = ({ text, speed = 50, maxIterations = 10, sequential = true, characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', animateOn = 'view', delay = 0 }) => {
  const [displayText, setDisplayText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);
  const revealedRef = useRef(new Set());
  const hasAnimatedRef = useRef(false);
  const containerRef = useRef(null);
  const chars = useMemo(() => characters.split(''), [characters]);

  useEffect(() => {
    if (!isAnimating) return;
    let iteration = 0;
    const interval = setInterval(() => {
      if (sequential) {
        if (revealedRef.current.size < text.length) {
          revealedRef.current.add(revealedRef.current.size);
          setDisplayText(text.split('').map((char, i) => {
            if (char === ' ') return ' ';
            if (revealedRef.current.has(i)) return text[i];
            return chars[Math.floor(Math.random() * chars.length)];
          }).join(''));
        } else { clearInterval(interval); setIsAnimating(false); }
      } else {
        setDisplayText(text.split('').map((char) => char === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)]).join(''));
        iteration++;
        if (iteration >= maxIterations) { clearInterval(interval); setIsAnimating(false); setDisplayText(text); }
      }
    }, speed);
    return () => clearInterval(interval);
  }, [isAnimating, text, speed, maxIterations, sequential, chars]);

  useEffect(() => {
    if (animateOn !== 'view') return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimatedRef.current) {
        setTimeout(() => { revealedRef.current = new Set(); setIsAnimating(true); hasAnimatedRef.current = true; }, delay);
      }
    }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animateOn, delay]);

  return <span ref={containerRef} aria-label={text}><span aria-hidden="true">{displayText}</span></span>;
};

// ============================================
// PARALLAX TEXT
// ============================================
const ParallaxText = ({ children, speed = 0.5, style }) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const elementCenter = rect.top + rect.height / 2;
      setOffset((viewportCenter - elementCenter) * speed * 0.1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return <div ref={ref} style={{ ...style, transform: `translateY(${offset}px)`, transition: 'transform 100ms linear' }}>{children}</div>;
};

// ============================================
// EXPANDING PILL NAVBAR
// ============================================
const ExpandingNavbar = ({ activeSection, onNavigate }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <nav className="cursor-target" onMouseEnter={() => setIsExpanded(true)} onMouseLeave={() => setIsExpanded(false)}
      style={{
        position: 'fixed', left: '32px', bottom: '32px', zIndex: 10000,
        display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px', borderRadius: '24px',
        backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.08)', transition: `all ${tokens.timing.medium} ${tokens.easing.page}`,
      }}>
      {[1, 2, 3, 4, 5, 6].map((num) => (
        <button key={num} onClick={() => onNavigate(num)} className="cursor-target" style={{
          width: isExpanded ? '48px' : '36px', height: '36px', borderRadius: '18px', border: 'none', cursor: 'none',
          backgroundColor: activeSection === num ? tokens.colors.white : 'transparent',
          color: activeSection === num ? tokens.colors.black : tokens.colors.muted,
          fontSize: '11px', fontWeight: 500, fontFamily: tokens.fontMono,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: `all ${tokens.timing.fast} ${tokens.easing.hover}`,
        }}>{num}</button>
      ))}
    </nav>
  );
};

// ============================================
// FADE IN
// ============================================
const FadeIn = ({ children, delay = 0, style }) => {
  const [visible, setVisible] = useState(false);
  useEffect(() => { const timer = setTimeout(() => setVisible(true), delay); return () => clearTimeout(timer); }, [delay]);
  return (
    <div style={{
      ...style, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: `opacity ${tokens.timing.slow} ${tokens.easing.page}, transform ${tokens.timing.slow} ${tokens.easing.page}`,
    }}>{children}</div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================
export default function App() {
  const [activeSection, setActiveSection] = useState(1);
  const [scrollY, setScrollY] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const sections = [1, 2, 3, 4, 5, 6];
  const tickingRef = useRef(false);
  const sectionRefs = useRef({});

  useEffect(() => { sections.forEach(id => { sectionRefs.current[id] = document.getElementById(`section-${id}`); }); }, []);

  const updateScroll = useCallback(() => {
    setScrollY(window.scrollY);
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    setScrollProgress((window.scrollY / docHeight) * 100);
    const pos = window.scrollY + window.innerHeight / 2;
    for (let i = sections.length - 1; i >= 0; i--) {
      const el = sectionRefs.current[sections[i]];
      if (el && el.offsetTop <= pos) { setActiveSection(sections[i]); break; }
    }
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!tickingRef.current) {
        requestAnimationFrame(() => { updateScroll(); tickingRef.current = false; });
        tickingRef.current = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [updateScroll]);

  const navTo = (id) => { document.getElementById(`section-${id}`)?.scrollIntoView({ behavior: 'smooth' }); };

  const getCardStyle = (index) => {
    const h = typeof window !== 'undefined' ? window.innerHeight : 800;
    const progress = (scrollY - index * h) / h;
    return progress > 0.1 ? { transform: `scale(${Math.max(0.96, 1 - progress * 0.04)})` } : { transform: 'scale(1)' };
  };

  const cardBase = {
    position: 'sticky', top: 0, height: '100vh', width: '100vw',
    transformOrigin: 'center top', transition: `transform ${tokens.timing.medium} ${tokens.easing.page}`, overflow: 'hidden',
  };

  return (
    <div style={{ backgroundColor: tokens.colors.black, scrollBehavior: 'smooth', minHeight: '100vh' }}>
      <GrainOverlay />
      <ScrollProgress progress={scrollProgress} />
      <TargetCursor targetSelector=".cursor-target, a, button" />
      <ExpandingNavbar activeSection={activeSection} onNavigate={navTo} />

      <main style={{ position: 'relative' }}>
        {/* HERO */}
        <section id="section-1" style={{ ...cardBase, backgroundColor: tokens.colors.black, zIndex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '60px 80px', ...getCardStyle(0) }}>
          <FadeIn delay={200}>
            <div style={{ alignSelf: 'flex-end', textAlign: 'right' }}>
              <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0, textTransform: 'uppercase' }}>{CONTENT.hero.role}</p>
              <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: '8px 0 0 0' }}>{CONTENT.hero.location}</p>
            </div>
          </FadeIn>
          <FadeIn delay={500}>
            <ParallaxText speed={0.3}>
              <h1 className="cursor-target" style={{ fontSize: 'clamp(120px, 20vw, 280px)', fontWeight: 400, letterSpacing: '-0.05em', color: tokens.colors.white, margin: 0, lineHeight: 0.85, fontFamily: tokens.font }}>
                <DecryptedText text={CONTENT.hero.name} speed={100} sequential={false} maxIterations={8} animateOn="view" />
              </h1>
            </ParallaxText>
          </FadeIn>
          <FadeIn delay={800}><p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0 }}>© 2024</p></FadeIn>
        </section>

        {/* ABOUT */}
        <section id="section-2" style={{ ...cardBase, backgroundColor: tokens.colors.dark, borderRadius: '32px 32px 0 0', zIndex: 2, display: 'grid', gridTemplateColumns: '1fr 1fr', ...getCardStyle(1) }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', borderRight: `1px solid ${tokens.colors.border}` }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.accent, fontFamily: tokens.fontMono, margin: '0 0 40px 0', textTransform: 'uppercase' }}>02</p>
            <ParallaxText speed={0.2}>
              <h2 style={{ fontSize: 'clamp(32px, 4vw, 56px)', fontWeight: 400, color: tokens.colors.white, margin: 0, lineHeight: 1.15, fontFamily: tokens.font, letterSpacing: '-0.02em' }}>
                <DecryptedText text={CONTENT.about.statement} speed={35} animateOn="view" delay={100} /><br />
                <span style={{ color: tokens.colors.mutedLight }}><DecryptedText text={CONTENT.about.statementLine2} speed={35} animateOn="view" delay={400} /></span>
              </h2>
            </ParallaxText>
            <div className="cursor-target" style={{ marginTop: '48px', width: '120px', height: '120px', borderRadius: '50%', backgroundColor: tokens.colors.darkAlt, border: `1px solid ${tokens.colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: tokens.colors.muted, fontFamily: tokens.fontMono, letterSpacing: '0.1em' }}>FOTO</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', gap: '48px' }}>
            {CONTENT.about.stats.map((stat, i) => (
              <div key={i} className="cursor-target" style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
                <span style={{ fontSize: 'clamp(64px, 8vw, 100px)', fontWeight: 300, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.03em', lineHeight: 1 }}>
                  <DecryptedText text={stat.value} speed={80} sequential={false} maxIterations={12} characters="0123456789" animateOn="view" delay={200 + i * 150} />
                </span>
                <span style={{ fontSize: '24px', color: tokens.colors.muted, fontFamily: tokens.font }}>{stat.unit}</span>
                <span style={{ fontSize: '12px', color: tokens.colors.muted, fontFamily: tokens.fontMono, letterSpacing: '0.1em', marginLeft: '8px' }}>{stat.detail}</span>
              </div>
            ))}
          </div>
        </section>

        {/* EXPERTISE */}
        <section id="section-3" style={{ ...cardBase, backgroundColor: tokens.colors.accent, borderRadius: '32px 32px 0 0', zIndex: 3, display: 'flex', flexDirection: 'column', justifyContent: 'center', ...getCardStyle(2) }}>
          <Marquee items={CONTENT.marquee.items} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', padding: '80px', flex: 1, justifyContent: 'center' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: 'rgba(255,255,255,0.5)', fontFamily: tokens.fontMono, margin: '0 0 48px 4px', textTransform: 'uppercase' }}>03 — Was ich mache</p>
            {CONTENT.expertise.words.map((word, i) => (
              <ParallaxText key={word} speed={0.1 * (i + 1)}>
                <span className="cursor-target" style={{ fontSize: 'clamp(48px, 10vw, 120px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.03em', lineHeight: 1.0, display: 'block' }}>
                  <DecryptedText text={word} speed={60} animateOn="view" delay={i * 150} />
                </span>
              </ParallaxText>
            ))}
          </div>
          <Marquee items={[...CONTENT.marquee.items].reverse()} />
        </section>

        {/* QUOTE */}
        <section id="section-4" style={{ ...cardBase, backgroundColor: tokens.colors.darkAlt, borderRadius: '32px 32px 0 0', zIndex: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px', ...getCardStyle(3) }}>
          <div style={{ maxWidth: '900px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: '0 0 64px 0', textTransform: 'uppercase' }}>04 — Track Record</p>
            <ParallaxText speed={0.2}>
              <blockquote className="cursor-target" style={{ fontSize: 'clamp(28px, 5vw, 56px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.02em', lineHeight: 1.2, margin: 0 }}>
                <DecryptedText text={`"${CONTENT.quote.text}"`} speed={40} animateOn="view" />
              </blockquote>
            </ParallaxText>
            <p style={{ fontSize: '12px', color: tokens.colors.muted, fontFamily: tokens.fontMono, marginTop: '48px', letterSpacing: '0.2em' }}>— {CONTENT.quote.author}</p>
          </div>
        </section>

        {/* PODCAST */}
        <section id="section-5" style={{ ...cardBase, backgroundColor: tokens.colors.black, borderRadius: '32px 32px 0 0', zIndex: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '80px', ...getCardStyle(4) }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.accent, fontFamily: tokens.fontMono, margin: '0 0 32px 0', textTransform: 'uppercase' }}>05 — Podcast</p>
          <ParallaxText speed={0.3}>
            <h2 style={{ fontSize: 'clamp(48px, 8vw, 100px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.03em', margin: '0 0 64px 0', lineHeight: 1 }}>
              <DecryptedText text={CONTENT.podcast.headline} speed={50} animateOn="view" />
            </h2>
          </ParallaxText>
          <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
            {CONTENT.podcast.topics.map((topic) => (
              <LineDrawLink key={topic} href="#" className="cursor-target" style={{ fontSize: '14px', color: tokens.colors.mutedLight, fontFamily: tokens.fontMono, padding: '12px 0' }}>{topic}</LineDrawLink>
            ))}
          </div>
          <div className="cursor-target" style={{ marginTop: '80px', width: '100%', maxWidth: '400px', aspectRatio: '16/9', backgroundColor: tokens.colors.dark, borderRadius: '12px', border: `1px solid ${tokens.colors.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: tokens.colors.muted, fontFamily: tokens.fontMono, letterSpacing: '0.1em' }}>VIDEO LOOP</div>
        </section>

        {/* CONTACT */}
        <section id="section-6" style={{ ...cardBase, backgroundColor: tokens.colors.dark, borderRadius: '32px 32px 0 0', zIndex: 6, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '80px' }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.3em', color: tokens.colors.muted, fontFamily: tokens.fontMono, margin: 0, textTransform: 'uppercase' }}>06</p>
          <ParallaxText speed={0.3}>
            <h2 className="cursor-target" style={{ fontSize: 'clamp(64px, 12vw, 180px)', fontWeight: 400, color: tokens.colors.white, fontFamily: tokens.font, letterSpacing: '-0.04em', margin: 0, lineHeight: 0.9 }}>
              <DecryptedText text={CONTENT.contact.headline} speed={80} animateOn="view" />
            </h2>
          </ParallaxText>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ display: 'flex', gap: '48px' }}>
              <LineDrawLink href={`https://${CONTENT.contact.linkedin}`} className="cursor-target" style={{ fontSize: '12px', color: tokens.colors.mutedLight, fontFamily: tokens.fontMono }}>LinkedIn</LineDrawLink>
              <LineDrawLink href={`mailto:${CONTENT.contact.email}`} className="cursor-target" style={{ fontSize: '12px', color: tokens.colors.mutedLight, fontFamily: tokens.fontMono }}>Email</LineDrawLink>
            </div>
            <button className="cursor-target" onClick={() => window.location.href = `mailto:${CONTENT.contact.email}`} style={{ padding: '20px 48px', backgroundColor: tokens.colors.white, color: tokens.colors.black, border: 'none', borderRadius: '100px', fontSize: '13px', fontWeight: 500, fontFamily: tokens.fontMono, letterSpacing: '0.1em', cursor: 'none', textTransform: 'uppercase', transition: `transform ${tokens.timing.fast} ${tokens.easing.hover}` }}>Kontakt</button>
          </div>
        </section>
      </main>

      <div style={{ height: '50vh', backgroundColor: tokens.colors.dark }} />
    </div>
  );
}
