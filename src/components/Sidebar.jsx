import React from 'react';
import { useKhata } from '../context/KhataContext';
import { Home, ListFilter, MessageSquare, Lightbulb, HelpCircle } from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, setActiveTab } = useKhata();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'khata', label: 'Khata', icon: ListFilter },
    { id: 'ask-ai', label: 'Ask AI', icon: MessageSquare },
    { id: 'ideas', label: 'Ideas', icon: Lightbulb },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="desktop-sidebar" style={styles.sidebar}>
        {/* Brand Header */}
        <div style={styles.brandContainer}>
          <div style={styles.logoBadge}>
            <span style={styles.logoV}>V</span>
          </div>
          <div style={styles.brandTextWrapper}>
            <div style={styles.brandTitle}>VyaparAI</div>
            <div style={styles.brandSubtitle}>
              YOUR KHATA,<br />MADE CLEAR
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <nav style={styles.nav}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className="hover-btn"
                style={{
                  ...styles.navBtn,
                  ...(isActive ? styles.navBtnActive : styles.navBtnInactive)
                }}
              >
                <Icon size={18} style={{ strokeWidth: 2.2 }} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Footer */}
        <div style={styles.footer}>
          <div style={styles.divider} />
          <button style={styles.helpBtn} className="hover-btn" onClick={() => setActiveTab('ask-ai')}>
            <HelpCircle size={17} color="#7C6E6E" />
            <span>Need a hand?</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
            >
              <Icon size={20} color={isActive ? '#4A3541' : '#7C6E6E'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};

const styles = {
  sidebar: {
    width: '240px',
    minWidth: '240px',
    backgroundColor: 'var(--bg-sidebar)',
    borderRight: '1px solid var(--sidebar-border)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '28px 20px',
    userSelect: 'none'
  },
  brandContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '36px'
  },
  logoBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 2px 8px rgba(200, 92, 53, 0.35)',
    flexShrink: 0
  },
  logoV: {
    color: '#FFFFFF',
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '24px',
    lineHeight: 1
  },
  brandTextWrapper: {
    display: 'flex',
    flexDirection: 'column'
  },
  brandTitle: {
    fontFamily: 'var(--font-display)',
    fontWeight: '800',
    fontSize: '21px',
    color: 'var(--plum-dark)',
    lineHeight: '1.1'
  },
  brandSubtitle: {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#8C7A70',
    lineHeight: '1.2',
    marginTop: '2px'
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    flex: 1
  },
  navBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '12px 18px',
    borderRadius: '24px',
    fontSize: '15px',
    fontWeight: '600',
    width: '100%',
    textAlign: 'left'
  },
  navBtnActive: {
    backgroundColor: 'var(--plum-dark)',
    color: '#FAF3EC',
    border: '1.5px solid #C85C35',
    boxShadow: '0 4px 12px rgba(74, 53, 65, 0.25)'
  },
  navBtnInactive: {
    backgroundColor: 'transparent',
    color: '#63525A',
    border: '1.5px solid transparent'
  },
  footer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  divider: {
    height: '1px',
    backgroundColor: '#DCD1C0',
    width: '100%'
  },
  helpBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#7C6E6E',
    padding: '4px 0'
  }
};
