import React from 'react';
import { Link } from 'react-router-dom';
import T from './designTokens';

// ============================================
// HEADER - Navigation with Terminal Breadcrumb
// ============================================
const Header = ({ currentPage = 'home' }) => {
  const isHome = currentPage === 'home';
  const isCOV = currentPage === 'cost-of-vacancy';
  const isAS = currentPage === 'active-sourcing';
  const isKontakt = currentPage === 'kontakt';

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
      background: 'transparent',
    }}>
      {/* Logo / Name */}
      <Link to="/" className="cursor-target" style={{
        fontFamily: T.font,
        fontSize: '11px',
        fontWeight: 500,
        color: T.colors.cream,
        letterSpacing: '0.15em',
        textDecoration: 'none',
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
          boxShadow: `0 0 8px ${T.colors.burgundy}`,
        }} />
        <Link to="/" className="cursor-target" style={{
          color: isHome ? T.colors.burgundy : T.colors.muted,
          textDecoration: 'none',
          transition: 'color 0.2s',
          fontWeight: isHome ? 500 : 400,
        }}>~home</Link>
        <span style={{ color: T.colors.muted }}>/</span>
        <Link to="/cost-of-vacancy" className="cursor-target" style={{
          color: isCOV ? T.colors.burgundy : T.colors.muted,
          textDecoration: 'none',
          transition: 'color 0.2s',
          fontWeight: isCOV ? 500 : 400,
        }}>cost-of-vacancy</Link>
        <span style={{ color: T.colors.muted }}>/</span>
        <Link to="/active-sourcing" className="cursor-target" style={{
          color: isAS ? T.colors.burgundy : T.colors.muted,
          textDecoration: 'none',
          transition: 'color 0.2s',
          fontWeight: isAS ? 500 : 400,
        }}>active-sourcing</Link>
      </div>

      {/* Right Nav Links */}
      <nav style={{ display: 'flex', gap: '32px' }}>
        <a href="https://www.linkedin.com/in/deniz-levent-tulay-tekom2025" target="_blank" rel="noopener noreferrer" className="cursor-target" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: T.colors.muted,
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
        }}>LinkedIn</a>
        <Link to="/kontakt" className="cursor-target" style={{
          fontFamily: T.font,
          fontSize: '10px',
          color: isKontakt ? T.colors.burgundy : T.colors.muted,
          textDecoration: 'none',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          transition: 'color 0.3s',
          fontWeight: isKontakt ? 500 : 400,
        }}>Kontakt</Link>
      </nav>
    </header>
  );
};

export default Header;
