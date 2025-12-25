import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import T from './designTokens';

// ============================================
// HEADER - Navigation with Dynamic Colors
// Uses IntersectionObserver on [data-theme] sections
// ============================================

const Header = ({ currentPage = 'home' }) => {
  const isHome = currentPage === 'home';
  const isCOV = currentPage === 'cost-of-vacancy';
  const isAS = currentPage === 'active-sourcing';
  const isKontakt = currentPage === 'kontakt';

  // Track if current section has light background
  const [onLightBg, setOnLightBg] = useState(false);

  useEffect(() => {
    // Find all sections with data-theme attribute
    const sections = document.querySelectorAll('[data-theme]');

    if (sections.length === 0) {
      // No themed sections, stay with default
      return;
    }

    // Create observer that triggers when section enters top of viewport
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the entry that is most visible at the top
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const theme = entry.target.getAttribute('data-theme');
            setOnLightBg(theme === 'light');
          }
        }
      },
      {
        // Trigger when section crosses the top 10% of viewport
        rootMargin: '-5% 0px -90% 0px',
        threshold: 0
      }
    );

    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, [currentPage]); // Re-run when page changes

  // Dynamic colors based on background
  const textColor = onLightBg ? T.colors.black : T.colors.cream;
  const mutedColor = onLightBg ? T.colors.mutedDark : T.colors.muted;
  const activeColor = T.colors.burgundy; // Burgundy works on both
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
          background: T.colors.burgundy,
          boxShadow: dotGlow,
          transition: 'box-shadow 0.3s ease',
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
