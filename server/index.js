import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

let entries = [
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
  }
];

// GET /api/entries
app.get('/api/entries', (req, res) => {
  res.json({ success: true, entries });
});

// POST /api/entries
app.post('/api/entries', (req, res) => {
  const newEntry = {
    id: `entry-${Date.now()}`,
    ...req.body,
    amount: Number(req.body.amount)
  };
  entries.unshift(newEntry);
  res.status(201).json({ success: true, entry: newEntry });
});

// GET /api/summary
app.get('/api/summary', (req, res) => {
  res.json({
    success: true,
    summary: {
      income: 142800,
      expenses: 149400,
      shortfall: 6600,
      totalEntries: 47,
      month: 'Aug 2026',
      momSalesDiff: 18200,
      momExpensesDiff: 24100
    }
  });
});

// POST /api/ask-ai
app.post('/api/ask-ai', (req, res) => {
  const { query } = req.body;
  const lower = (query || '').toLowerCase();
  let text = '';

  if (lower.includes('tight') || lower.includes('august')) {
    text = 'August was tight primarily because your costs (₹1,49,400) exceeded income (₹1,42,800) by ₹6,600. The main drivers were grocery stock purchases (₹82,400) and an elevated supplier payment to Mahavir Wholesale (₹12,400).';
  } else if (lower.includes('stock') || lower.includes('afford')) {
    text = 'Before purchasing new stock, it is recommended to keep ₹18,000 aside for rent due at the start of September. High margin items like tea counter sales (which brought ₹32,600) can cover daily fast-moving stock.';
  } else if (lower.includes('pay first') || lower.includes('pay')) {
    text = '1. Set aside rent (₹18,000).\n2. Review the ₹12,400 Mahavir Wholesale invoice to verify if it covers September inventory before settling pending credit.';
  } else if (lower.includes('tea') || lower.includes('counter')) {
    text = 'Tea counter sales brought in ₹32,600 across August (about 22% of total store revenue), keeping consistent daily cash flows!';
  } else {
    text = `Based on your August khata (47 entries, ₹1,42,800 income), your shop maintains a steady income stream. Let me know if you want detailed supplier breakdowns or expense category summaries.`;
  }

  res.json({
    success: true,
    response: {
      text,
      subtext: 'Based on 47 entries · Aug 2026'
    }
  });
});

app.listen(PORT, () => {
  console.log(`VyaparAI Node API Server running on port ${PORT}`);
});
