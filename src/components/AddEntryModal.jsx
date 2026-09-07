import React, { useState } from 'react';
import { useKhata } from '../context/KhataContext';
import { X, ArrowDownLeft, ArrowUpRight } from 'lucide-react';

export const AddEntryModal = () => {
  const { isAddModalOpen, setIsAddModalOpen, addEntry } = useKhata();
  const [type, setType] = useState('in'); // 'in' or 'out'
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Counter');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !amount) return;

    addEntry({
      title,
      type,
      amount,
      subtitle: `${paymentMethod} · ${category}`,
      date: 'Today',
      category,
      paymentMethod,
      note
    });

    // Reset form
    setTitle('');
    setAmount('');
    setNote('');
  };

  return (
    <div style={styles.overlay} onClick={() => setIsAddModalOpen(false)}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.modalTitle}>Add Khata Entry</h2>
          <button style={styles.closeBtn} onClick={() => setIsAddModalOpen(false)}>
            <X size={20} color="#4A3541" />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Type Selector (Money in / Money out) */}
          <div style={styles.typeRow}>
            <button
              type="button"
              onClick={() => setType('in')}
              style={{
                ...styles.typeBtn,
                backgroundColor: type === 'in' ? '#A4C8B3' : '#EFE7DB',
                color: type === 'in' ? '#27563D' : '#63525A',
                border: type === 'in' ? '1.5px solid #27563D' : '1px solid #E3D9C9'
              }}
            >
              <ArrowDownLeft size={16} /> Money in
            </button>
            <button
              type="button"
              onClick={() => setType('out')}
              style={{
                ...styles.typeBtn,
                backgroundColor: type === 'out' ? '#F6DEC3' : '#EFE7DB',
                color: type === 'out' ? '#C85C35' : '#63525A',
                border: type === 'out' ? '1.5px solid #C85C35' : '1px solid #E3D9C9'
              }}
            >
              <ArrowUpRight size={16} /> Money out
            </button>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Entry Title</label>
            <input
              type="text"
              placeholder="e.g. UPI Sale, Rent, Supplier bill"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Amount (₹)</label>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.rowTwoCols}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={styles.select}
              >
                <option value="Counter">Counter</option>
                <option value="Groceries">Groceries</option>
                <option value="Tea & snacks">Tea & snacks</option>
                <option value="Rent">Rent</option>
                <option value="Supplies">Supplies</option>
              </select>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Payment Method</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                style={styles.select}
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div style={styles.fieldGroup}>
            <label style={styles.label}>Note (Optional)</label>
            <textarea
              placeholder="Add details..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              style={styles.textarea}
            />
          </div>

          <button type="submit" style={styles.submitBtn}>
            Save Entry
          </button>
        </form>
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
    maxWidth: '460px',
    boxShadow: '0 12px 32px rgba(74, 53, 65, 0.2)',
    border: '1px solid #E3D9C9'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  },
  modalTitle: {
    fontSize: '20px',
    fontWeight: '800',
    color: 'var(--plum-dark)'
  },
  closeBtn: {
    padding: '6px',
    borderRadius: '50%'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  },
  typeRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  typeBtn: {
    padding: '10px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px'
  },
  fieldGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  rowTwoCols: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '12px'
  },
  label: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#7C6E6E'
  },
  input: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #E3D9C9',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'var(--font-main)',
    color: 'var(--plum-dark)',
    outline: 'none'
  },
  select: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #E3D9C9',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'var(--font-main)',
    color: 'var(--plum-dark)',
    outline: 'none'
  },
  textarea: {
    padding: '10px 14px',
    borderRadius: '12px',
    border: '1px solid #E3D9C9',
    backgroundColor: '#FFFFFF',
    fontSize: '14px',
    fontFamily: 'var(--font-main)',
    color: 'var(--plum-dark)',
    outline: 'none',
    resize: 'none'
  },
  submitBtn: {
    backgroundColor: 'var(--plum-dark)',
    color: '#FAF3EC',
    padding: '12px',
    borderRadius: '14px',
    fontSize: '15px',
    fontWeight: '800',
    marginTop: '8px',
    boxShadow: 'var(--shadow-md)'
  }
};
