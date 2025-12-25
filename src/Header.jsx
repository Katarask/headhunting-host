import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import T from './designTokens';

// ============================================
// HEADER - Navigation with Dynamic Colors
// Uses scroll position to detect section themes
// ============================================

const Header = ({ currentPage = 'home' }) => {
  const isHome = currentPage === 'home';
  const isCOV = currentPage === 'cost-of-vacancy';
  const isAS = currentPage === 'active-sourcing';
  const isKontakt = currentPage === 'kontakt';

  // Track if current section has light background
  const [onLightBg, setOnLightBg] = useState(false);

  useEffect(() => {
    const checkSection = () => {
      const sections = document.querySelectorAll('[data-theme]');
      if (sections.length === 0) return;

      const headerOffset = 60; // Header height
      const scrollY = window.scrollY + headerOffset;

      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        const sectionBottom = sectionTop + rect.height;

        if (scrollY >= sectionTop && scrollY < sectionBottom) {
          setOnLightBg(section.dataset.theme === 'light');
          return;
        }
      }
    };

    // Initial check after DOM is ready
    setTimeout(checkSection, 100);

    window.addEventListener('scroll', checkSection, { passive: true });
    window.addEventListener('resize', checkSection);

    return () => {
      window.removeEventListener('scroll', checkSection);
      window.removeEventListener('resize', checkSection);
    };
  }, [currentPage]);

  // Dynamic colors based on background
  const textColor = onLightBg ? T.colors.black : T.colors.cream;
  const mutedColor = onLightBg ? T.colors.mutedDark : T.colors.muted;
  const activeColor = onLightBg ? T.colors.burgundy : T.colors.cream; // Cream on dark, burgundy on light
  const dotColor = T.colors.burgundy;
  const dotGlow = onLightBg ? 'none' : `0 0 8px ${T.colors.burgundy}`;

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10000,
      padding: '20px 8vw',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'transparent',
      pointerEvents: 'auto',
      transition: 'color 0.3s ease',
    }}>
      {/* Logo / Name */}
      <Link to="/" className="cursor-target" style={{
        fontFamily: T.font,
        fontSize: '11px',
        fontWeight: 500,
        color: textColor,
        letterSpacing: '0.15em',
        textDecoration: 'none',
        transition: 'color 0.3s ease',
      }}>
        DENIZ TULAY
      </Link>

      {/* Terminal Breadcrumb - Center */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontFamily: T.font,
        fontSize: '11px',
        letterSpacing: '0.05em',
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          background: dotColor,
          boxShadow: dotGlow,
          transition: 'all 0.3s ease',
        }} />
        <Link to="/" className="cursor-target" style={{
          color: isHome ? activeColor : mutedColor,
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontWeight: isHome ? 500 : 400,
        }}>~home</Link>
        <span style={{ color: mutedColor, transition: 'color 0.3s ease' }}>/</span>
        <Link to="/cost-of-vacancy" className="cursor-target" style={{
          color: isCOV ? activeColor : mutedColor,
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontWeight: isCOV ? 500 : 400,
        }}>cost-of-vacancy</Link>
        <span style={{ color: mutedColor, transition: 'color 0.3s ease' }}>/</span>
        <Link to="/active-sourcing" className="cursor-target" style={{
          color: isAS ? activeColor : mutedColor,
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          fontWeight: isAS ? 500 : 400,
        }}>active-sourcing</Link>
      </div>

      {/* Right Nav Links */}
      <nav style={{ display: 'flex', gap: '32px' }}>
        <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" className="cursor-target" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: mutedColor,
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
        }}>LinkedIn</a>
        <Link to="/kontakt" className="cursor-target" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: isKontakt ? activeColor : mutedColor,
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'color 0.3s ease',
          fontWeight: isKontakt ? 500 : 400,
        }}>Kontakt</Link>
      </nav>
    </header>
  );
};

export default Header;
