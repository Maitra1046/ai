import React from 'react';
import { useKhata } from '../context/KhataContext';
import { ChevronDown, ShieldCheck, Lightbulb, Check } from 'lucide-react';

export const IdeasTab = () => {
  const { ideasDone, toggleIdea, resetIdeas, selectedMonth } = useKhata();

  const completedCount = Object.values(ideasDone).filter(Boolean).length;

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Top Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.subHeader}>SMALL MOVES, BACKED BY YOUR KHATA</div>
          <h1 style={styles.title}>What I would do next</h1>
        </div>
        <div style={styles.monthSelector} className="hover-btn">
          <span>{selectedMonth}</span>
          <ChevronDown size={16} color="#4A3541" />
        </div>
      </div>

      {/* Top 3 Summary Cards */}
      <div style={styles.topCardsGrid}>
        {/* Card 1 (Dark Plum) */}
        <div style={styles.darkCard} className="hover-card">
          <div style={styles.darkCardSub}>SHORTFALL TO MIND</div>
          <div style={styles.darkCardStat}>
            <span className="rupee">₹</span>6,600
          </div>
          <div style={styles.darkCardSubtext}>before September starts</div>
        </div>

        {/* Card 2 (Mint Green) */}
        <div style={styles.mintCard} className="hover-card">
          <div style={styles.mintCardSub}>SAFE FIRST STEP</div>
          <div style={styles.mintCardStat}>
            <span className="rupee">₹</span>18,000
          </div>
          <div style={styles.mintCardSubtext}>keep aside for rent</div>
        </div>

        {/* Card 3 (Peach) */}
        <div style={styles.peachCard} className="hover-card">
          <div style={styles.peachCardSub}>ONE CHECK</div>
          <div style={styles.peachCardStat}>
            <span className="rupee">₹</span>12,400
          </div>
          <div style={styles.peachCardSubtext}>supplier payment to review</div>
        </div>
      </div>

      {/* Notice Banner */}
      <div style={styles.noticeBanner}>
        <ShieldCheck size={18} color="#27563D" />
        <span>
          These are suggestions, not orders. You know the shop; I only know the pattern in your entries.
          {completedCount > 0 && <strong> ({completedCount} marked done)</strong>}
        </span>
      </div>

      {/* Suggestion Cards Stack */}
      <div style={styles.suggestionsStack}>
        {/* Suggestion 1 (Light Cream) */}
        <div
          className="hover-card"
          style={{
            ...styles.suggestionCream,
            opacity: ideasDone.idea1 ? 0.65 : 1
          }}
        >
          <div style={styles.suggestionLeft}>
            <div style={styles.darkBulbBadge}>
              <Lightbulb size={18} color="#FAF3EC" />
            </div>
            <div style={styles.suggestionTextCol}>
              <div style={styles.suggestionNumSub}>SUGGESTION 1</div>
              <h3
                style={{
                  ...styles.suggestionTitle,
                  textDecoration: ideasDone.idea1 ? 'line-through' : 'none'
                }}
              >
                Keep rent aside first
              </h3>
              <p style={styles.suggestionBody}>
                Move this amount mentally before buying more stock. It keeps the last week of the month calm.
              </p>
            </div>
          </div>

          <div style={styles.suggestionRight}>
            <div style={styles.suggestionAmount}>
              <span className="rupee">₹</span>18,000
            </div>
            <button
              className="hover-btn"
              style={{
                ...styles.markBtn,
                color: ideasDone.idea1 ? '#27563D' : '#8C7A70'
              }}
              onClick={() => toggleIdea('idea1')}
            >
              Mark as done {ideasDone.idea1 ? <Check size={14} color="#27563D" /> : '✓'}
            </button>
          </div>
        </div>

        {/* Suggestion 2 (Peach) */}
        <div
          className="hover-card"
          style={{
            ...styles.suggestionPeach,
            opacity: ideasDone.idea2 ? 0.65 : 1
          }}
        >
          <div style={styles.suggestionLeft}>
            <div style={styles.darkBulbBadge}>
              <Lightbulb size={18} color="#FAF3EC" />
            </div>
            <div style={styles.suggestionTextCol}>
              <div style={styles.suggestionNumSub}>SUGGESTION 2</div>
              <h3
                style={{
                  ...styles.suggestionTitle,
                  textDecoration: ideasDone.idea2 ? 'line-through' : 'none'
                }}
              >
                Check the Mahavir bill
              </h3>
              <p style={styles.suggestionBody}>
                This payment was higher than usual. If it was a stock-up, note what came in so next month makes sense.
              </p>
            </div>
          </div>

          <div style={styles.suggestionRight}>
            <div style={styles.suggestionAmount}>
              <span className="rupee">₹</span>12,400
            </div>
            <button
              className="hover-btn"
              style={{
                ...styles.markBtn,
                color: ideasDone.idea2 ? '#27563D' : '#8C7A70'
              }}
              onClick={() => toggleIdea('idea2')}
            >
              Mark as done {ideasDone.idea2 ? <Check size={14} color="#27563D" /> : '✓'}
            </button>
          </div>
        </div>

        {/* Suggestion 3 (Dark Plum) */}
        <div
          className="hover-card"
          style={{
            ...styles.suggestionDark,
            opacity: ideasDone.idea3 ? 0.65 : 1
          }}
        >
          <div style={styles.suggestionLeft}>
            <div style={styles.orangeBulbBadge}>
              <Lightbulb size={18} color="#FAF3EC" />
            </div>
            <div style={styles.suggestionTextCol}>
              <div style={{ ...styles.suggestionNumSub, color: '#C3B4BF' }}>SUGGESTION 3</div>
              <h3
                style={{
                  ...styles.suggestionTitle,
                  color: '#FAF3EC',
                  textDecoration: ideasDone.idea3 ? 'line-through' : 'none'
                }}
              >
                Protect your tea margin
              </h3>
              <p style={{ ...styles.suggestionBody, color: '#D4C8D0' }}>
                Tea counter sales brought in ₹32,600. Keep the small, regular wins visible while grocery costs settle.
              </p>
            </div>
          </div>

          <div style={styles.suggestionRight}>
            <div style={{ ...styles.suggestionAmount, color: '#FAF3EC' }}>
              <span className="rupee">₹</span>32,600
            </div>
            <button
              className="hover-btn"
              style={{
                ...styles.markBtn,
                color: ideasDone.idea3 ? '#A4C8B3' : '#D4C8D0'
              }}
              onClick={() => toggleIdea('idea3')}
            >
              Mark as done {ideasDone.idea3 ? <Check size={14} color="#A4C8B3" /> : '✓'}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footerRow}>
        <span style={styles.footerDateText}>Based on entries through 31 Aug 2026</span>
        <button style={styles.resetBtn} className="hover-btn" onClick={resetIdeas}>
          &times; Reset view
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
    maxWidth: '1200px',
    width: '100%',
    margin: '0 auto'
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  subHeader: {
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.1em',
    color: '#C85C35',
    marginBottom: '2px'
  },
  title: {
    fontSize: '32px',
    color: 'var(--plum-dark)',
    fontWeight: '800'
  },
  monthSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#FAF5EC',
    border: '1px solid #DCD1C0',
    padding: '8px 16px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'var(--plum-dark)',
    boxShadow: 'var(--shadow-sm)',
    cursor: 'pointer'
  },
  topCardsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px'
  },
  darkCard: {
    backgroundColor: 'var(--plum-dark)',
    borderRadius: '20px',
    padding: '24px 28px',
    color: 'var(--plum-text-light)',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--shadow-md)'
  },
  darkCardSub: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#C3B4BF'
  },
  darkCardStat: {
    fontSize: '34px',
    fontWeight: '800',
    color: '#FAF3EC',
    lineHeight: '1'
  },
  darkCardSubtext: {
    fontSize: '13px',
    color: '#B8A9B4'
  },
  mintCard: {
    backgroundColor: '#BEDCCA',
    borderRadius: '20px',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--shadow-sm)'
  },
  mintCardSub: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#27563D'
  },
  mintCardStat: {
    fontSize: '34px',
    fontWeight: '800',
    color: '#27563D',
    lineHeight: '1'
  },
  mintCardSubtext: {
    fontSize: '13px',
    color: '#346B4E'
  },
  peachCard: {
    backgroundColor: '#F6DEC3',
    borderRadius: '20px',
    padding: '24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    boxShadow: 'var(--shadow-sm)'
  },
  peachCardSub: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#C85C35'
  },
  peachCardStat: {
    fontSize: '34px',
    fontWeight: '800',
    color: 'var(--plum-dark)',
    lineHeight: '1'
  },
  peachCardSubtext: {
    fontSize: '13px',
    color: '#63525A'
  },
  noticeBanner: {
    backgroundColor: '#E4F1EA',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#27563D'
  },
  suggestionsStack: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  suggestionCream: {
    backgroundColor: 'var(--card-cream)',
    borderRadius: '20px',
    padding: '24px 32px',
    border: '1px solid var(--card-cream-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: 'var(--shadow-sm)'
  },
  suggestionPeach: {
    backgroundColor: 'var(--card-peach)',
    borderRadius: '20px',
    padding: '24px 32px',
    border: '1px solid var(--card-peach-border)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: 'var(--shadow-sm)'
  },
  suggestionDark: {
    backgroundColor: 'var(--plum-dark)',
    borderRadius: '20px',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '24px',
    boxShadow: 'var(--shadow-md)'
  },
  suggestionLeft: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '18px',
    flex: 1
  },
  darkBulbBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: 'var(--plum-dark)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  orangeBulbBadge: {
    width: '42px',
    height: '42px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  suggestionTextCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  suggestionNumSub: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: '#C85C35'
  },
  suggestionTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  suggestionBody: {
    fontSize: '13.5px',
    color: '#5C4A42',
    lineHeight: '1.4'
  },
  suggestionRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '8px',
    flexShrink: 0
  },
  suggestionAmount: {
    fontSize: '28px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  markBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
    fontWeight: '700'
  },
  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '12px',
    paddingTop: '16px',
    borderTop: '1px solid #E0D6C7'
  },
  footerDateText: {
    fontSize: '12px',
    color: '#988A8A'
  },
  resetBtn: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#7C6E6E'
  }
};
