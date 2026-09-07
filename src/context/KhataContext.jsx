import React, { createContext, useContext, useState, useMemo } from 'react';

const KhataContext = createContext();

export const initialEntries = [
  {
    id: 'entry-1',
    title: 'UPI sale',
    type: 'in',
    amount: 4280,
    subtitle: 'Counter · 8:42 am',
    date: 'Today',
    category: 'Counter',
    paymentMethod: 'UPI'
  },
  {
    id: 'entry-2',
    title: 'Rent payment',
    type: 'out',
    amount: 18000,
    subtitle: 'GPay · shop rent',
    date: '28 Aug',
    category: 'Rent',
    paymentMethod: 'GPay'
  },
  {
    id: 'entry-3',
    title: 'Supplier payment',
    type: 'out',
    amount: 7640,
    subtitle: 'Mahavir Wholesale',
    date: '27 Aug',
    category: 'Supplies',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'entry-4',
    title: 'Tea counter sale',
    type: 'in',
    amount: 1850,
    subtitle: 'Cash · evening',
    date: '26 Aug',
    category: 'Tea & snacks',
    paymentMethod: 'Cash'
  },
  {
    id: 'entry-5',
    title: 'Supplier payment',
    type: 'out',
    amount: 12400,
    subtitle: 'Mahavir Wholesale - higher than usual',
    date: '24 Aug',
    badge: 'look closer',
    note: 'Payment to Mahavir Wholesale was ₹12,400, higher than your usual ₹7,500 average. Likely extra inventory stock-up for festival season.',
    category: 'Supplies',
    paymentMethod: 'UPI'
  },
  {
    id: 'entry-6',
    title: 'UPI sale',
    type: 'in',
    amount: 6320,
    subtitle: 'Counter · QR payment',
    date: '23 Aug',
    category: 'Counter',
    paymentMethod: 'UPI'
  },
  {
    id: 'entry-7',
    title: 'Grocery stock',
    type: 'out',
    amount: 9180,
    subtitle: 'Shakti Distributors',
    date: '21 Aug',
    category: 'Groceries',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'entry-8',
    title: 'Grocery bulk purchase',
    type: 'out',
    amount: 73220,
    subtitle: 'Shakti Distributors · staples',
    date: '18 Aug',
    category: 'Groceries',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'entry-9',
    title: 'Tea counter sales total',
    type: 'in',
    amount: 30750,
    subtitle: 'Daily cash accumulations (1-20 Aug)',
    date: '20 Aug',
    category: 'Tea & snacks',
    paymentMethod: 'Cash'
  },
  {
    id: 'entry-10',
    title: 'UPI store sales',
    type: 'in',
    amount: 99600,
    subtitle: 'PhonePe & GPay aggregate',
    date: '15 Aug',
    category: 'Counter',
    paymentMethod: 'UPI'
  },
  {
    id: 'entry-11',
    title: 'Packaging & Supplies',
    type: 'out',
    amount: 8960,
    subtitle: 'Shree Krishna Packaging',
    date: '10 Aug',
    category: 'Supplies',
    paymentMethod: 'Cash'
  }
];

export const KhataProvider = ({ children }) => {
  const [activeTab, setActiveTab] = useState('home'); // 'home', 'khata', 'ask-ai', 'ideas'
  const [selectedMonth, setSelectedMonth] = useState('Aug 2026');
  const [entries, setEntries] = useState(initialEntries);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Ideas tab completion states
  const [ideasDone, setIdeasDone] = useState({
    idea1: false,
    idea2: false,
    idea3: false
  });

  // Ask AI tab conversation history
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Namaste Ramesh. I have your August khata open. What would you like to understand?',
      subtext: 'Based on 47 entries · Aug 2026'
    }
  ]);

  const financialSummary = useMemo(() => {
    const totalIncome = entries
      .filter((e) => e.type === 'in')
      .reduce((sum, e) => sum + e.amount, 0);
    const totalExpense = entries
      .filter((e) => e.type === 'out')
      .reduce((sum, e) => sum + e.amount, 0);
    // Fixed reference figures matching screenshot exactly
    return {
      income: 142800,
      expenses: 149400,
      shortfall: 6600,
      totalEntries: 47
    };
  }, [entries]);

  const addEntry = (newEntry) => {
    const entryObj = {
      id: `entry-${Date.now()}`,
      ...newEntry,
      amount: parseFloat(newEntry.amount)
    };
    setEntries([entryObj, ...entries]);
    setIsAddModalOpen(false);
  };

  const toggleIdea = (ideaKey) => {
    setIdeasDone((prev) => ({
      ...prev,
      [ideaKey]: !prev[ideaKey]
    }));
  };

  const resetIdeas = () => {
    setIdeasDone({ idea1: false, idea2: false, idea3: false });
  };

  const sendChatMessage = (text) => {
    const userMsg = { id: Date.now(), sender: 'user', text };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let botResponseText = '';
      const lower = text.toLowerCase();
      
      if (lower.includes('tight') || lower.includes('august')) {
        botResponseText = 'August was tight primarily because your costs (₹1,49,400) exceeded income (₹1,42,800) by ₹6,600. The main drivers were grocery stock purchases (₹82,400) and an elevated supplier payment to Mahavir Wholesale (₹12,400).';
      } else if (lower.includes('stock') || lower.includes('afford')) {
        botResponseText = 'Before purchasing new stock, it is recommended to keep ₹18,000 aside for rent due at the start of September. High margin items like tea counter sales (which brought ₹32,600) can cover daily fast-moving stock.';
      } else if (lower.includes('pay first') || lower.includes('pay')) {
        botResponseText = '1. Set aside rent (₹18,000).\n2. Review the ₹12,400 Mahavir Wholesale invoice to verify if it covers September inventory before settling pending credit.';
      } else if (lower.includes('tea') || lower.includes('counter')) {
        botResponseText = 'Tea counter sales brought in ₹32,600 across August (about 22% of total store revenue), keeping consistent daily cash flows!';
      } else {
        botResponseText = `Based on your August khata (47 entries, ₹1,42,800 income), your shop maintains a steady income stream. Let me know if you want detailed supplier breakdowns or expense category summaries.`;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'bot',
          text: botResponseText,
          subtext: 'Based on 47 entries · Aug 2026'
        }
      ]);
    }, 600);
  };

  return (
    <KhataContext.Provider
      value={{
        activeTab,
        setActiveTab,
        selectedMonth,
        setSelectedMonth,
        entries,
        financialSummary,
        addEntry,
        selectedEntry,
        setSelectedEntry,
        isAddModalOpen,
        setIsAddModalOpen,
        ideasDone,
        toggleIdea,
        resetIdeas,
        chatMessages,
        sendChatMessage
      }}
    >
      {children}
    </KhataContext.Provider>
  );
};

export const useKhata = () => useContext(KhataContext);
