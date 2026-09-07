import React from 'react';
import { useKhata } from '../context/KhataContext';
import { X, ArrowDownLeft, ArrowUpRight, AlertTriangle, CheckCircle2 } from 'lucide-react';

export const EntryDetailModal = () => {
  const { selectedEntry, setSelectedEntry } = useKhata();

  if (!selectedEntry) return null;

  const isMoneyIn = selectedEntry.type === 'in';

  return (
    <div style={styles.overlay} onClick={() => setSelectedEntry(null)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <div style={styles.titleGroup}>
            <div
              style={{
                ...styles.iconBadge,
                backgroundColor: isMoneyIn ? '#A4C8B3' : '#F6DEC3'
              }}
            >
              {isMoneyIn ? (
                <ArrowDownLeft size={20} color="#27563D" />
              ) : (
                <ArrowUpRight size={20} color="#C85C35" />
              )}
            </div>
            <div>
              <h2 style={styles.title}>{selectedEntry.title}</h2>
              <div style={styles.sub}>{selectedEntry.subtitle}</div>
            </div>
          </div>

          <button style={styles.closeBtn} onClick={() => setSelectedEntry(null)}>
            <X size={20} color="#4A3541" />
          </button>
        </div>

        <div style={styles.amountDisplay}>
          <span style={{ fontSize: '14px', color: '#7C6E6E', fontWeight: '700' }}>
            Amount recorded
          </span>
          <div
            style={{
              ...styles.amount,
              color: isMoneyIn ? '#27563D' : '#4A3541'
            }}
          >
            {isMoneyIn ? '+' : '-'}
            <span className="rupee">₹</span>
            {selectedEntry.amount.toLocaleString('en-IN')}
          </div>
        </div>

        {selectedEntry.badge && (
          <div style={styles.warningBox}>
            <AlertTriangle size={18} color="#C85C35" />
            <div>
              <div style={styles.warnTitle}>Flagged: Look Closer</div>
              <div style={styles.warnBody}>
                This transaction was ₹12,400, which is higher than the typical ₹7,500 average for Mahavir Wholesale.
              </div>
            </div>
          </div>
        )}

        <div style={styles.detailsList}>
          <div style={styles.detailItem}>
            <span style={styles.detailKey}>Date</span>
            <span style={styles.detailVal}>{selectedEntry.date}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailKey}>Category</span>
            <span style={styles.detailVal}>{selectedEntry.category || 'General'}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailKey}>Payment Method</span>
            <span style={styles.detailVal}>{selectedEntry.paymentMethod || 'UPI'}</span>
          </div>
          <div style={styles.detailItem}>
            <span style={styles.detailKey}>Status</span>
            <span style={styles.statusVerified}>
              <CheckCircle2 size={14} /> Accounted in Khata
            </span>
          </div>
        </div>

        {selectedEntry.note && (
          <div style={styles.noteSection}>
            <span style={styles.noteTitle}>Note</span>
            <div style={styles.noteBody}>{selectedEntry.note}</div>
          </div>
        )}

        <button style={styles.doneBtn} onClick={() => setSelectedEntry(null)}>
          Close Entry
        </button>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(74, 53, 65, 0.45)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    animation: 'fadeIn 0.15s ease'
  },
  modal: {
    backgroundColor: '#FAF5EC',
    borderRadius: '24px',
    padding: '28px 32px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 12px 32px rgba(74, 53, 65, 0.2)',
    border: '1px solid #E3D9C9',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px'
  },
  iconBadge: {
    width: '44px',
    height: '44px',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0
  },
  title: {
    fontSize: '18px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  sub: {
    fontSize: '13px',
    color: '#7C6E6E'
  },
  closeBtn: {
    padding: '6px',
    borderRadius: '50%'
  },
  amountDisplay: {
    backgroundColor: '#EFE7DB',
    borderRadius: '16px',
    padding: '16px 20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    border: '1px solid #E3D9C9'
  },
  amount: {
    fontSize: '32px',
    fontWeight: '800'
  },
  warningBox: {
    backgroundColor: '#F6DEC3',
    border: '1px solid #EAD0B5',
    borderRadius: '14px',
    padding: '14px 16px',
    display: 'flex',
    gap: '12px',
    alignItems: 'flex-start'
  },
  warnTitle: {
    fontSize: '13px',
    fontWeight: '800',
    color: '#C85C35'
  },
  warnBody: {
    fontSize: '12px',
    color: '#5C4A42',
    lineHeight: '1.35',
    marginTop: '2px'
  },
  detailsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  detailItem: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px'
  },
  detailKey: {
    color: '#7C6E6E'
  },
  detailVal: {
    fontWeight: '700',
    color: 'var(--plum-dark)'
  },
  statusVerified: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    color: '#27563D',
    fontWeight: '700',
    fontSize: '13px'
  },
  noteSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    borderTop: '1px solid #E3D9C9',
    paddingTop: '12px'
  },
  noteTitle: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#7C6E6E'
  },
  noteBody: {
    fontSize: '13px',
    color: 'var(--plum-dark)',
    lineHeight: '1.4'
  },
  doneBtn: {
    backgroundColor: 'var(--plum-dark)',
    color: '#FAF3EC',
    padding: '12px',
    borderRadius: '14px',
    fontSize: '14px',
    fontWeight: '700',
    marginTop: '4px'
  }
};
