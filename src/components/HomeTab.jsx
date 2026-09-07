import React from 'react';
import { useKhata } from '../context/KhataContext';
import { Banknote, ChevronDown, AlertCircle, ArrowUpRight, ArrowRight, Store, Plus, TrendingUp, TrendingDown } from 'lucide-react';

export const HomeTab = () => {
  const { setActiveTab, setIsAddModalOpen, selectedMonth, sendChatMessage } = useKhata();

  const handleAskAIQuery = (query) => {
    sendChatMessage(query);
    setActiveTab('ask-ai');
  };

  return (
    <div className="animate-fade-in" style={styles.container}>
      {/* Top Header */}
      <div style={styles.headerRow}>
        <div>
          <div style={styles.subHeader}>GOOD MORNING, RAMESH</div>
          <h1 style={styles.title}>Your shop, at a glance</h1>
        </div>
        <div style={styles.monthSelector} className="hover-btn">
          <span>{selectedMonth}</span>
          <ChevronDown size={16} color="#4A3541" />
        </div>
      </div>

      {/* Top Hero Grid: Short Answer + Money Moving */}
      <div style={styles.heroGrid}>
        {/* Short Answer Card (Dark Plum) */}
        <div style={styles.darkCard} className="hover-card">
          <div style={styles.darkCardTop}>
            <span style={styles.darkSub}>THE SHORT ANSWER</span>
            <div style={styles.cashIconBadge}>
              <Banknote size={18} color="#FAF3EC" />
            </div>
          </div>
          <div style={styles.darkTitle}>
            Sales were good.<br />
            Costs ran ahead.
          </div>
          <div style={styles.darkCardBottom}>
            <div style={styles.shortfallCol}>
              <div style={styles.shortfallAmount}>
                <span className="rupee">₹</span>6,600
              </div>
              <div style={styles.shortfallSub}>more out than in this month</div>
            </div>
            <div style={styles.broughtInText}>
              You brought in <strong><span className="rupee">₹</span>1,42,800</strong> and spent <strong><span className="rupee">₹</span>1,49,400</strong>.
            </div>
          </div>
        </div>

        {/* Money Moving Card (Light Cream) */}
        <div style={styles.moneyMovingCard} className="hover-card">
          <div style={styles.chartHeaderRow}>
            <div style={styles.chartTitleWrapper}>
              <span style={styles.chartIcon}>📊</span>
              <span style={styles.chartTitle}>MONEY MOVING</span>
            </div>
            <span style={styles.augPill}>Aug</span>
          </div>

          <div style={styles.incomeExpensesRow}>
            <div style={styles.statLabel}>
              income <span style={styles.incomeValue}><span className="rupee">₹</span>1,42,800</span>
            </div>
            <div style={styles.statLabel}>
              expenses <span style={styles.expenseValue}><span className="rupee">₹</span>1,49,400</span>
            </div>
          </div>

          {/* MoM comparison badge */}
          <div style={styles.momBadgeRow}>
            <span style={styles.momTag}><TrendingUp size={12} color="#27563D" /> +₹18.2k sales vs July</span>
            <span style={styles.momTagWarn}><TrendingDown size={12} color="#C85C35" /> +₹24.1k costs vs July</span>
          </div>

          {/* SVG Dual Wave Chart from Reference Prototype */}
          <div style={styles.svgWrapper}>
            <svg viewBox="0 0 360 90" style={{ width: '100%', height: '80px' }} role="img" aria-label="Income and expense trend">
              <path d="M3 66 C32 62,40 40,68 52 S95 72,121 45 S153 35,180 48 S210 20,242 35 S275 15,319 30 S344 16,357 18" fill="none" stroke="#573a46" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M3 49 C36 54,47 42,70 57 S105 46,129 60 S166 44,188 57 S218 44,244 64 S286 38,316 52 S342 46,357 59" fill="none" stroke="#c8753d" strokeWidth="3.5" strokeLinecap="round" />
              <path d="M3 66 C32 62,40 40,68 52 S95 72,121 45 S153 35,180 48 S210 20,242 35 S275 15,319 30 S344 16,357 18 L357 88 L3 88Z" fill="#573a46" opacity="0.06" />
            </svg>
            <div style={styles.chartDatesRow}>
              <span>1 Aug</span>
              <span>31 Aug</span>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Section: Where it went + A gentle heads-up */}
      <div style={styles.middleGrid}>
        {/* Where it went Card */}
        <div style={styles.creamCard} className="hover-card">
          <div style={styles.cardHeaderRow}>
            <h2 style={styles.sectionHeading}>Where it went</h2>
            <span style={styles.totalSub}><span className="rupee">₹</span>1,49,400 total</span>
          </div>

          {/* Multi-segmented Progress Bar */}
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressSegment, width: '55%', backgroundColor: '#4A3541', borderRadius: '8px 0 0 8px' }} />
            <div style={{ ...styles.progressSegment, width: '22%', backgroundColor: '#C85C35' }} />
            <div style={{ ...styles.progressSegment, width: '12%', backgroundColor: '#2E7D56' }} />
            <div style={{ ...styles.progressSegment, width: '11%', backgroundColor: '#A4C8B3', borderRadius: '0 8px 8px 0' }} />
          </div>

          {/* Category List */}
          <div style={styles.categoryList}>
            <div style={styles.categoryRow}>
              <div style={styles.categoryLeft}>
                <span style={{ ...styles.dot, backgroundColor: '#4A3541' }} />
                <span style={styles.categoryName}>Groceries</span>
              </div>
              <div style={styles.categoryRight}>
                <span style={styles.categoryAmount}><span className="rupee">₹</span>82,400</span>
                <span style={styles.categoryPct}>55%</span>
              </div>
            </div>

            <div style={styles.categoryRow}>
              <div style={styles.categoryLeft}>
                <span style={{ ...styles.dot, backgroundColor: '#C85C35' }} />
                <span style={styles.categoryName}>Tea & snacks</span>
              </div>
              <div style={styles.categoryRight}>
                <span style={styles.categoryAmount}><span className="rupee">₹</span>32,600</span>
                <span style={styles.categoryPct}>22%</span>
              </div>
            </div>

            <div style={styles.categoryRow}>
              <div style={styles.categoryLeft}>
                <span style={{ ...styles.dot, backgroundColor: '#2E7D56' }} />
                <span style={styles.categoryName}>Rent</span>
              </div>
              <div style={styles.categoryRight}>
                <span style={styles.categoryAmount}><span className="rupee">₹</span>18,000</span>
                <span style={styles.categoryPct}>12%</span>
              </div>
            </div>

            <div style={styles.categoryRow}>
              <div style={styles.categoryLeft}>
                <span style={{ ...styles.dot, backgroundColor: '#A4C8B3' }} />
                <span style={styles.categoryName}>Supplies</span>
              </div>
              <div style={styles.categoryRight}>
                <span style={styles.categoryAmount}><span className="rupee">₹</span>16,400</span>
                <span style={styles.categoryPct}>11%</span>
              </div>
            </div>
          </div>

          <button style={styles.linkBtn} className="hover-btn" onClick={() => setActiveTab('khata')}>
            See all categories &rarr;
          </button>
        </div>

        {/* A gentle heads-up Cards */}
        <div style={styles.headsUpCol}>
          <div style={styles.cardHeaderRow}>
            <h2 style={styles.sectionHeading}>A gentle heads-up</h2>
            <span style={styles.totalSub}>one thing to see</span>
          </div>

          {/* Alert Box 1 (Peach) */}
          <div style={styles.peachAlertCard} className="hover-card">
            <div style={styles.alertIconCol}>
              <div style={styles.alertIconBadge}>
                <AlertCircle size={18} color="#FFFFFF" />
              </div>
            </div>
            <div style={styles.alertContentCol}>
              <div style={styles.alertTitle}>One supplier payment stood out</div>
              <div style={styles.alertBody}>
                <strong><span className="rupee">₹</span>12,400</strong> to Mahavir Wholesale was higher than your usual payment. It may be stock-up week.
              </div>
            </div>
            <button style={styles.lookCloserBtn} className="hover-btn" onClick={() => setActiveTab('khata')}>
              Look closer <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Alert Box 2 (Dark Plum AI shortcut) */}
          <div
            style={styles.darkAiCard}
            className="hover-card"
            onClick={() => handleAskAIQuery('Where did my money go this month?')}
          >
            <div style={styles.robotBadge}>
              🤖
            </div>
            <div style={styles.darkAiContent}>
              <div style={styles.darkAiSub}>ASK VYAPARAI</div>
              <div style={styles.darkAiText}>"Where did my money go this month?"</div>
            </div>
            <ArrowRight size={18} color="#FAF3EC" style={{ marginLeft: 'auto' }} />
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div style={styles.bottomBar}>
        <div style={styles.shopStatus}>
          <Store size={16} color="#7C6E6E" />
          <span>Shree Ganesh Kirana</span>
        </div>
        <button style={styles.addEntryBtn} className="hover-btn" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add entry</span>
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
    color: '#A89280',
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
  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.45fr 1fr',
    gap: '20px'
  },
  darkCard: {
    backgroundColor: 'var(--plum-dark)',
    borderRadius: '20px',
    padding: '28px 32px',
    color: 'var(--plum-text-light)',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    boxShadow: 'var(--shadow-md)',
    minHeight: '230px'
  },
  darkCardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  darkSub: {
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#C3B4BF'
  },
  cashIconBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    padding: '6px',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center'
  },
  darkTitle: {
    fontFamily: 'var(--font-display)',
    fontSize: '34px',
    fontWeight: '800',
    lineHeight: '1.15',
    color: '#FAF3EC',
    margin: '16px 0'
  },
  darkCardBottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    paddingTop: '16px'
  },
  shortfallCol: {
    display: 'flex',
    flexDirection: 'column'
  },
  shortfallAmount: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#FAF3EC',
    lineHeight: '1'
  },
  shortfallSub: {
    fontSize: '12px',
    color: '#B8A9B4',
    marginTop: '4px'
  },
  broughtInText: {
    fontSize: '12px',
    color: '#D4C8D0',
    textAlign: 'right',
    maxWidth: '220px',
    lineHeight: '1.4'
  },
  moneyMovingCard: {
    backgroundColor: 'var(--card-cream)',
    borderRadius: '20px',
    padding: '24px 28px',
    border: '1px solid var(--card-cream-border)',
    display: 'flex',
    flexDirection: 'column',
    justify: 'space-between',
    boxShadow: 'var(--shadow-sm)'
  },
  chartHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  chartTitleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  chartTitle: {
    fontSize: '12px',
    fontWeight: '800',
    letterSpacing: '0.08em',
    color: 'var(--plum-dark)'
  },
  chartIcon: {
    fontSize: '14px'
  },
  augPill: {
    backgroundColor: '#A4C8B3',
    color: '#27563D',
    fontSize: '11px',
    fontWeight: '700',
    padding: '2px 10px',
    borderRadius: '12px'
  },
  incomeExpensesRow: {
    display: 'flex',
    gap: '24px',
    margin: '10px 0 4px 0'
  },
  statLabel: {
    fontSize: '12px',
    color: 'var(--text-muted)',
    display: 'flex',
    flexDirection: 'column'
  },
  incomeValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  expenseValue: {
    fontSize: '20px',
    fontWeight: '800',
    color: '#C85C35'
  },
  momBadgeRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '6px'
  },
  momTag: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#27563D',
    backgroundColor: '#E4F1EA',
    padding: '2px 6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px'
  },
  momTagWarn: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#C85C35',
    backgroundColor: '#F6DEC3',
    padding: '2px 6px',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    gap: '3px'
  },
  svgWrapper: {
    marginTop: 'auto'
  },
  chartDatesRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#988A8A',
    fontWeight: '600',
    marginTop: '4px'
  },
  middleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px'
  },
  creamCard: {
    backgroundColor: 'var(--card-cream)',
    borderRadius: '20px',
    padding: '24px 28px',
    border: '1px solid var(--card-cream-border)',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  cardHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionHeading: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  totalSub: {
    fontSize: '12px',
    color: '#7C6E6E',
    fontWeight: '600'
  },
  progressBar: {
    height: '14px',
    width: '100%',
    backgroundColor: '#E2D6C5',
    borderRadius: '8px',
    display: 'flex',
    overflow: 'hidden'
  },
  progressSegment: {
    height: '100%'
  },
  categoryList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },
  categoryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  categoryLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%'
  },
  categoryName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#52434A'
  },
  categoryRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  categoryAmount: {
    fontSize: '14px',
    fontWeight: '700',
    color: 'var(--plum-dark)'
  },
  categoryPct: {
    fontSize: '12px',
    fontWeight: '600',
    color: '#8C7A70',
    width: '32px',
    textAlign: 'right'
  },
  linkBtn: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#C85C35',
    alignSelf: 'flex-start',
    marginTop: '4px',
    padding: 0
  },
  headsUpCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  peachAlertCard: {
    backgroundColor: 'var(--card-peach)',
    borderRadius: '20px',
    padding: '24px 28px',
    border: '1px solid var(--card-peach-border)',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    gap: '16px',
    alignItems: 'center'
  },
  alertIconCol: {
    alignSelf: 'flex-start'
  },
  alertIconBadge: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  alertContentCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  alertTitle: {
    fontSize: '16px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  alertBody: {
    fontSize: '13px',
    color: '#5C4A42',
    lineHeight: '1.4'
  },
  lookCloserBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--plum-dark)',
    backgroundColor: 'transparent',
    whiteSpace: 'nowrap',
    padding: '6px 10px',
    borderRadius: '8px'
  },
  darkAiCard: {
    backgroundColor: 'var(--plum-dark)',
    borderRadius: '16px',
    padding: '18px 24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    cursor: 'pointer'
  },
  robotBadge: {
    width: '38px',
    height: '38px',
    borderRadius: '50%',
    backgroundColor: '#C85C35',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px'
  },
  darkAiContent: {
    display: 'flex',
    flexDirection: 'column'
  },
  darkAiSub: {
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.1em',
    color: '#C3B4BF'
  },
  darkAiText: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#FAF3EC'
  },
  bottomBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '16px',
    borderTop: '1px solid #E0D6C7',
    marginTop: '12px'
  },
  shopStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '13px',
    fontWeight: '600',
    color: '#7C6E6E'
  },
  addEntryBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'transparent',
    fontSize: '13px',
    fontWeight: '700',
    color: 'var(--plum-dark)',
    padding: '6px 12px',
    borderRadius: '8px'
  }
};
