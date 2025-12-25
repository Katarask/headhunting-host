import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import T from './designTokens';

// ============================================
// HEADER - Navigation with Dynamic Colors
// Adapts colors based on current section background
// ============================================

// Light backgrounds that need dark text
// Sand: #DBD6CC = rgb(219, 214, 204)
// Cream: #EFEDE5 = rgb(239, 237, 229)
const isLightBackground = (color) => {
  if (!color) return false;

  // Parse RGB values from computed style (format: "rgb(r, g, b)" or "rgba(r, g, b, a)")
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch.map(Number);
    // Calculate relative luminance (simplified)
    // Light backgrounds have high luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.7; // Threshold for "light" background
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
    // Check element at header position (center of header, ~40px from top)
    const headerY = 40;
    const headerX = window.innerWidth / 2;

    // Get all elements at this point
    const elements = document.elementsFromPoint(headerX, headerY);

    // Find the first section/container with a background
    for (const el of elements) {
      // Skip the header itself
      if (el.closest('header')) continue;

      const style = window.getComputedStyle(el);
      const bgColor = style.backgroundColor;

      // Skip transparent backgrounds
      if (bgColor === 'transparent' || bgColor === 'rgba(0, 0, 0, 0)') continue;

      // Check if it's a light background
      if (isLightBackground(bgColor)) {
        setOnLightBg(true);
        return;
      } else if (bgColor && bgColor !== 'transparent') {
        // Found a non-light, non-transparent background
        setOnLightBg(false);
        return;
      }
    }

    // Default to dark background (light text)
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
