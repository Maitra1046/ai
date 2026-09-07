import React, { useState } from 'react';
import { useKhata } from '../context/KhataContext';
import { Search, ChevronDown, ArrowDownLeft, ArrowUpRight, Filter, AlertTriangle } from 'lucide-react';

export const KhataTab = () => {
  const { entries, setSelectedEntry, selectedMonth } = useKhata();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'in', 'out'

  const filteredEntries = entries.filter((entry) => {
    const matchesSearch =
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterType === 'all') return matchesSearch;
    return matchesSearch && entry.type === filterType;
  });

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Header Row */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.subHeader}>KHATA · 47 ENTRIES</div>
          <h1 style={styles.title}>Every rupee, accounted for</h1>
        </div>
        <div style={styles.monthSelector} className="hover-btn">
          <span>{selectedMonth}</span>
          <ChevronDown size={16} color="#4A3541" />
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={styles.filterRow}>
        <div style={styles.searchBox}>
          <Search size={18} color="#8C7A70" />
          <input
            type="text"
            placeholder="Search Khata entries"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
        </div>

        <div style={styles.filterPillsGroup}>
          <button
            onClick={() => setFilterType('all')}
            className="hover-btn"
            style={{
              ...styles.filterPill,
              ...(filterType === 'all' ? styles.filterPillActive : styles.filterPillInactive)
            }}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('in')}
            className="hover-btn"
            style={{
              ...styles.filterPill,
              ...(filterType === 'in' ? styles.filterPillActive : styles.filterPillInactive)
            }}
          >
            Money in
          </button>
          <button
            onClick={() => setFilterType('out')}
            className="hover-btn"
            style={{
              ...styles.filterPill,
              ...(filterType === 'out' ? styles.filterPillActive : styles.filterPillInactive)
            }}
          >
            <Filter size={14} style={{ marginRight: '4px' }} /> Money out
          </button>
        </div>
      </div>

      {/* Main Content Layout (Table + Right Summary) */}
      <div style={styles.mainGrid}>
        {/* Ledger Card */}
        <div style={styles.ledgerCard} className="hover-card">
          <div style={styles.ledgerHeaderRow}>
            <div style={styles.ledgerTitleWrapper}>
              <span style={{ fontSize: '14px' }}>⚡</span>
              <span style={styles.ledgerTitle}>AUG 2026 LEDGER</span>
            </div>
            <span style={styles.shownCount}>{filteredEntries.length} shown</span>
          </div>

          <div style={styles.entriesList}>
            {filteredEntries.map((item) => {
              const isMoneyIn = item.type === 'in';
              return (
                <div
                  key={item.id}
                  className="entry-row-hover"
                  style={styles.entryRow}
                  onClick={() => setSelectedEntry(item)}
                >
                  <div style={styles.entryLeft}>
                    <div
                      style={{
                        ...styles.directionIcon,
                        backgroundColor: isMoneyIn ? '#A4C8B3' : '#F6DEC3'
                      }}
                    >
                      {isMoneyIn ? (
                        <ArrowDownLeft size={18} color="#27563D" />
                      ) : (
                        <ArrowUpRight size={18} color="#C85C35" />
                      )}
                    </div>
                    <div style={styles.entryTitleCol}>
                      <div style={styles.titleLine}>
                        <span style={styles.itemTitle}>{item.title}</span>
                        {item.badge && (
                          <span style={styles.lookCloserBadge}>
                            <AlertTriangle size={11} color="#C85C35" />
                            <span>{item.badge}</span>
                          </span>
                        )}
                      </div>
                      <div style={styles.itemSubtitle}>{item.subtitle}</div>
                    </div>
                  </div>

                  <div style={styles.entryRight}>
                    <div
                      style={{
                        ...styles.amountText,
                        color: isMoneyIn ? '#27563D' : '#4A3541'
                      }}
                    >
                      {isMoneyIn ? '+' : '-'}
                      <span className="rupee">₹</span>
                      {item.amount.toLocaleString('en-IN')}
                    </div>
                    <div style={styles.dateText}>{item.date}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Summary Column */}
        <div style={styles.summaryCol}>
          {/* Summary Box (Dark Plum) */}
          <div style={styles.darkSummaryCard} className="hover-card">
            <div style={styles.darkSummaryHeader}>THIS MONTH</div>
            
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Money in</span>
              <span style={styles.summaryValue}>
                <span className="rupee">₹</span>1,42,800
              </span>
            </div>

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Money out</span>
              <span style={styles.summaryValue}>
                <span className="rupee">₹</span>1,49,400
              </span>
            </div>

            <div style={styles.summaryDivider} />

            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Balance movement</span>
              <span style={{ ...styles.summaryValue, color: '#F7DFC5' }}>
                -<span className="rupee">₹</span>6,600
              </span>
            </div>
          </div>

          {/* Dashed Note Box */}
          <div style={styles.dashedNoteCard}>
            <p style={styles.noteText}>
              Tap any entry to see its note. The one marked{' '}
              <strong style={{ color: '#C85C35' }}>look closer</strong> is not a mistake — just worth checking.
            </p>
          </div>
        </div>
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
  filterRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px'
  },
  searchBox: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#FAF5EC',
    border: '1px solid #E3D9C9',
    borderRadius: '24px',
    padding: '10px 20px',
    boxShadow: 'var(--shadow-sm)'
  },
  searchInput: {
    border: 'none',
    outline: 'none',
    backgroundColor: 'transparent',
    width: '100%',
    fontSize: '14px',
    color: 'var(--plum-dark)',
    fontFamily: 'var(--font-main)'
  },
  filterPillsGroup: {
    display: 'flex',
    gap: '8px'
  },
  filterPill: {
    padding: '9px 18px',
    borderRadius: '20px',
    fontSize: '13px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center'
  },
  filterPillActive: {
    backgroundColor: 'var(--plum-dark)',
    color: '#FAF3EC',
    boxShadow: 'var(--shadow-sm)'
  },
  filterPillInactive: {
    backgroundColor: '#FAF5EC',
    color: 'var(--plum-dark)',
    border: '1px solid #E3D9C9'
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 300px',
    gap: '24px',
    alignItems: 'start'
  },
  ledgerCard: {
    backgroundColor: 'var(--card-cream)',
    borderRadius: '20px',
    border: '1px solid var(--card-cream-border)',
    overflow: 'hidden',
    boxShadow: 'var(--shadow-sm)'
  },
  ledgerHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #E3D9C9'
  },
  ledgerTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  ledgerTitle: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: 'var(--plum-dark)'
  },
  shownCount: {
    fontSize: '12px',
    color: '#7C6E6E',
    fontWeight: '600'
  },
  entriesList: {
    display: 'flex',
    flexDirection: 'column'
  },
  entryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: '1px solid #EAE0D1',
    cursor: 'pointer'
  },
  entryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  directionIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  entryTitleCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px'
  },
  titleLine: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  itemTitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: 'var(--plum-dark)'
  },
  lookCloserBadge: {
    backgroundColor: '#F6DEC3',
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    fontWeight: '700',
    color: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    gap: '4px'
  },
  itemSubtitle: {
    fontSize: '13px',
    color: '#7C6E6E'
  },
  entryRight: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '2px'
  },
  amountText: {
    fontSize: '16px',
    fontWeight: '800'
  },
  dateText: {
    fontSize: '12px',
    color: '#988A8A'
  },
  summaryCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  darkSummaryCard: {
    backgroundColor: 'var(--plum-dark)',
    borderRadius: '20px',
    padding: '24px 28px',
    color: 'var(--plum-text-light)',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: 'var(--shadow-md)'
  },
  darkSummaryHeader: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#C3B4BF'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  summaryLabel: {
    fontSize: '13px',
    color: '#D4C8D0'
  },
  summaryValue: {
    fontSize: '16px',
    fontWeight: '800',
    color: '#FAF3EC'
  },
  summaryDivider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    margin: '4px 0'
  },
  dashedNoteCard: {
    backgroundColor: '#FAF5EC',
    border: '1.5px dashed #DCD1C0',
    borderRadius: '16px',
    padding: '20px'
  },
  noteText: {
    fontSize: '13px',
    color: '#63525A',
    lineHeight: '1.4'
  }
};
