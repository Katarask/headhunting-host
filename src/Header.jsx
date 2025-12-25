import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import T from './designTokens';

// ============================================
// HEADER - Navigation with Dynamic Colors
// Adapts colors based on current section background
// ============================================

// Calculate luminance from RGB
const getLuminance = (r, g, b) => (0.299 * r + 0.587 * g + 0.114 * b) / 255;

// Check if color is light (needs dark text)
const isLightColor = (color) => {
  if (!color) return false;
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    return getLuminance(r, g, b) > 0.6;
  }
  return false;
};

const Header = ({ currentPage = 'home' }) => {
  const isHome = currentPage === 'home';
  const isCOV = currentPage === 'cost-of-vacancy';
  const isAS = currentPage === 'active-sourcing';
  const isKontakt = currentPage === 'kontakt';

  // Track if current section has light background
  const [onLightBg, setOnLightBg] = useState(false);

  const checkBackground = useCallback(() => {
    // Sample multiple points across the header area
    const headerY = 50;
    const points = [
      window.innerWidth * 0.1,  // Left
      window.innerWidth * 0.5,  // Center
      window.innerWidth * 0.9   // Right
    ];

    for (const headerX of points) {
      const elements = document.elementsFromPoint(headerX, headerY);

      for (const el of elements) {
        // Skip header and its children
        if (el.tagName === 'HEADER' || el.closest('header')) continue;
        // Skip overlays and fixed elements
        if (el.style.position === 'fixed' && el.style.pointerEvents === 'none') continue;

        const style = window.getComputedStyle(el);
        const bgColor = style.backgroundColor;

        // Skip fully transparent
        if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') continue;

        // Check alpha channel for semi-transparent backgrounds
        const alphaMatch = bgColor.match(/rgba\(\d+,\s*\d+,\s*\d+,\s*([\d.]+)\)/);
        if (alphaMatch && parseFloat(alphaMatch[1]) < 0.3) continue;

        // Found a solid enough background - check if light
        if (isLightColor(bgColor)) {
          setOnLightBg(true);
          return;
        } else {
          setOnLightBg(false);
          return;
        }
      }
    }

    // Default based on page - most pages start dark
    setOnLightBg(false);
  }, []);

  useEffect(() => {
    // Initial check
    checkBackground();

    // Check on scroll
    const handleScroll = () => {
      requestAnimationFrame(checkBackground);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Also check on resize
    window.addEventListener('resize', checkBackground);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', checkBackground);
    };
  }, [checkBackground]);

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
