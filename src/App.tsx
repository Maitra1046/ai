import * as React from 'react';
import { createContext, useContext, useMemo, useRef, useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Banknote,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  CircleAlert,
  CircleHelp,
  Filter,
  Home,
  Lightbulb,
  List,
  MessageCircle,
  Mic,
  MicOff,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  TriangleAlert,
  UserRound,
  X,
} from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch, useLocation } from 'wouter';
import { ErrorBoundary } from './components/error-boundary';
import { Toaster } from './components/ui/toaster';
import { TooltipProvider } from './components/ui/tooltip';
import { toast } from './hooks/use-toast';
import NotFound from './pages/not-found';

const queryClient = new QueryClient();
const money = (value: number) => `₹${new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(Math.abs(value))}`;

type Entry = {
  id: number;
  label: string;
  note: string;
  date: string;
  amount: number;
  kind: 'in' | 'out';
  flagged?: boolean;
  category?: string;
  paymentMethod?: string;
};

const initialEntries: Entry[] = [
  { id: 1, label: 'UPI sale', note: 'Counter · 8:42 am', date: 'Today', amount: 4280, kind: 'in', category: 'Counter', paymentMethod: 'UPI' },
  { id: 2, label: 'Rent payment', note: 'GPay · shop rent', date: '28 Aug', amount: 18000, kind: 'out', category: 'Rent', paymentMethod: 'GPay' },
  { id: 3, label: 'Supplier payment', note: 'Mahavir Wholesale', date: '27 Aug', amount: 7640, kind: 'out', category: 'Supplies', paymentMethod: 'Bank Transfer' },
  { id: 4, label: 'Tea counter sale', note: 'Cash · evening', date: '26 Aug', amount: 1850, kind: 'in', category: 'Tea & snacks', paymentMethod: 'Cash' },
  { id: 5, label: 'Supplier payment', note: 'Mahavir Wholesale · higher than usual', date: '24 Aug', amount: 12400, kind: 'out', flagged: true, category: 'Supplies', paymentMethod: 'UPI' },
  { id: 6, label: 'UPI sale', note: 'Counter · QR payment', date: '23 Aug', amount: 6320, kind: 'in', category: 'Counter', paymentMethod: 'UPI' },
  { id: 7, label: 'Grocery stock', note: 'Shakti Distributors', date: '21 Aug', amount: 9180, kind: 'out', category: 'Groceries', paymentMethod: 'Bank Transfer' },
];

const categories = [
  { name: 'Groceries', amount: 82400, share: 55, color: '#573a46' },
  { name: 'Tea & snacks', amount: 32600, share: 22, color: '#c8753d' },
  { name: 'Rent', amount: 18000, share: 12, color: '#3e6e59' },
  { name: 'Supplies', amount: 16400, share: 11, color: '#b8d1bf' },
];

const monthData = {
  aug: { label: 'Aug 2026', income: 142800, expenses: 149400, shortfall: 6600, note: 'Sales were good.', follow: 'Costs ran ahead.' },
  jul: { label: 'Jul 2026', income: 136200, expenses: 131800, shortfall: 4400, note: 'July left you with room.', follow: 'Sales covered costs.' },
};

interface KhataContextType {
  entries: Entry[];
  addEntry: (entry: Omit<Entry, 'id'>) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
}

const KhataContext = createContext<KhataContextType | null>(null);

function useKhataState() {
  const ctx = useContext(KhataContext);
  if (!ctx) throw new Error('useKhataState must be used within KhataProvider');
  return ctx;
}

function KhataProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>(initialEntries);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const { totalIncome, totalExpenses } = useMemo(() => {
    const addedIn = entries.filter((e) => !initialEntries.some((ie) => ie.id === e.id) && e.kind === 'in').reduce((sum, e) => sum + e.amount, 0);
    const addedOut = entries.filter((e) => !initialEntries.some((ie) => ie.id === e.id) && e.kind === 'out').reduce((sum, e) => sum + e.amount, 0);
    return {
      totalIncome: 142800 + addedIn,
      totalExpenses: 149400 + addedOut,
    };
  }, [entries]);

  const netBalance = totalIncome - totalExpenses;

  const addEntry = (newEntryData: Omit<Entry, 'id'>) => {
    const newEntry: Entry = {
      id: Date.now(),
      ...newEntryData,
    };
    setEntries((prev) => [newEntry, ...prev]);
    setIsAddModalOpen(false);
    toast({
      title: 'Transaction added to Khata',
      description: `${newEntry.kind === 'in' ? 'Income (+)' : 'Expense (-)'} ₹${newEntry.amount.toLocaleString('en-IN')} for "${newEntry.label}".`,
    });
  };

  return (
    <KhataContext.Provider
      value={{
        entries,
        addEntry,
        isAddModalOpen,
        setIsAddModalOpen,
        totalIncome,
        totalExpenses,
        netBalance,
      }}
    >
      {children}
      <AddTransactionModal />
    </KhataContext.Provider>
  );
}

function AddTransactionModal() {
  const { isAddModalOpen, setIsAddModalOpen, addEntry } = useKhataState();
  const [kind, setKind] = useState<'in' | 'out'>('in');
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Counter');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [note, setNote] = useState('');

  if (!isAddModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!label.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const formattedNote = note.trim()
      ? note.trim()
      : `${paymentMethod} · ${category.toLowerCase()}`;

    addEntry({
      label: label.trim(),
      note: formattedNote,
      date: 'Today',
      amount: numAmount,
      kind,
      category,
      paymentMethod,
    });

    setLabel('');
    setAmount('');
    setNote('');
    setKind('in');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#573a46]/50 p-4 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={() => setIsAddModalOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-2xl border-2 border-[#573a46]/20 bg-[#f7f2e8] p-5 shadow-[6px_6px_0_#573a46] sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[#573a46]/15 pb-3">
          <h2 className="va-display text-xl font-bold text-[#573a46]">Add Khata Transaction</h2>
          <button
            type="button"
            onClick={() => setIsAddModalOpen(false)}
            className="rounded-lg p-1.5 text-[#6d6260] hover:bg-[#eee6d7]"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setKind('in')}
              className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                kind === 'in'
                  ? 'border-[#3e6e59] bg-[#b8d1bf] text-[#3e6e59] shadow-[2px_2px_0_#3e6e59]'
                  : 'border-[#573a46]/20 bg-[#eee6d7] text-[#6d6260]'
              }`}
            >
              <ArrowDownLeft size={16} /> Money in (+ Income)
            </button>
            <button
              type="button"
              onClick={() => setKind('out')}
              className={`flex items-center justify-center gap-1.5 rounded-xl border-2 py-2.5 text-xs font-bold transition-all ${
                kind === 'out'
                  ? 'border-[#c8753d] bg-[#f2d6b7] text-[#573a46] shadow-[2px_2px_0_#c8753d]'
                  : 'border-[#573a46]/20 bg-[#eee6d7] text-[#6d6260]'
              }`}
            >
              <ArrowUpRight size={16} /> Money out (- Expense)
            </button>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6d6260]">
              Transaction Name / Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. UPI Counter Sale, Milk Stock, Rent"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="w-full rounded-xl border border-[#573a46]/20 bg-white px-3 py-2 text-xs font-medium text-[#573a46] outline-none focus:border-[#573a46] focus:ring-1 focus:ring-[#573a46] sm:text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6d6260]">
              Amount (₹) *
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-xs font-bold text-[#573a46]">₹</span>
              <input
                type="number"
                required
                min="1"
                step="any"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full rounded-xl border border-[#573a46]/20 bg-white py-2 pl-7 pr-3 text-xs font-bold text-[#573a46] outline-none focus:border-[#573a46] focus:ring-1 focus:ring-[#573a46] sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6d6260]">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-[#573a46]/20 bg-white px-2.5 py-2 text-xs font-medium text-[#573a46] outline-none focus:border-[#573a46]"
              >
                <option value="Counter">Counter</option>
                <option value="Groceries">Groceries</option>
                <option value="Tea & snacks">Tea & snacks</option>
                <option value="Rent">Rent</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6d6260]">
                Payment Method
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full rounded-xl border border-[#573a46]/20 bg-white px-2.5 py-2 text-xs font-medium text-[#573a46] outline-none focus:border-[#573a46]"
              >
                <option value="UPI">UPI</option>
                <option value="Cash">Cash</option>
                <option value="GPay">GPay</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-[#6d6260]">
              Details / Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Evening cash count, Invoice #402"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-[#573a46]/20 bg-white px-3 py-2 text-xs font-medium text-[#573a46] outline-none focus:border-[#573a46] sm:text-sm"
            />
          </div>

          <div className="mt-5 flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="rounded-xl border border-[#573a46]/20 px-4 py-2 text-xs font-bold text-[#6d6260] hover:bg-[#eee6d7]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl border-2 border-[#573a46] bg-[#573a46] px-5 py-2 text-xs font-bold text-[#f7f2e8] shadow-[2px_2px_0_#c8753d] hover:bg-[#432c36]"
            >
              <Plus size={15} /> Save Transaction
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex h-9 w-9 items-center justify-center rounded-[11px] border-2 border-[#573a46] bg-[#c8753d] text-[#f7f2e8] shadow-[2px_2px_0_#573a46]">
        <span className="va-display text-lg font-bold">F</span>
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-[#f7f2e8] bg-[#b8d1bf]" />
      </div>
      {!compact && (
        <div className="leading-none">
          <div className="va-display text-[17px] font-bold tracking-[-0.04em] text-[#573a46]">
            Finora<span className="text-[#c8753d]">AI</span>
          </div>
          <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-[#6d6260]">
            your khata, made clear
          </div>
        </div>
      )}
    </div>
  );
}

type NavItem = { id: 'home' | 'bahi' | 'ask' | 'ideas'; label: string; href: string; icon: typeof Home };
const navItems: NavItem[] = [
  { id: 'home', label: 'Home', href: '/', icon: Home },
  { id: 'bahi', label: 'Khata', href: '/bahi', icon: List },
  { id: 'ask', label: 'Ask AI', href: '/ask', icon: MessageCircle },
  { id: 'ideas', label: 'Ideas', href: '/ideas', icon: Lightbulb },
];

function Shell({ children, active }: { children: ReactNode; active: NavItem['id'] }) {
  return (
    <div className="vyaparai-root va-paper min-h-[100dvh] pb-24 sm:pb-0">
      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-[#573a46]/15 bg-[#f7f2e8]/95 px-2 pb-[max(10px,env(safe-area-inset-bottom))] pt-1.5 backdrop-blur-md sm:bottom-auto sm:left-0 sm:top-0 sm:flex sm:h-full sm:w-[184px] sm:flex-col sm:border-r sm:border-t-0 sm:bg-[#eee6d7]/85 sm:px-4 sm:py-7">
        <div className="mb-11 hidden px-2 sm:block"><BrandMark /></div>
        <div className="flex justify-around sm:block">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === active;
            return (
              <Link
                key={item.id}
                href={item.href}
                data-testid={`link-nav-${item.id}`}
                className={`va-tap flex min-w-[56px] flex-1 flex-col items-center gap-0.5 rounded-xl px-1.5 py-1.5 text-[10px] font-bold sm:mb-2 sm:w-full sm:flex-row sm:gap-3 sm:px-3 sm:py-3 sm:text-[12px] ${
                  isActive
                    ? 'bg-[#573a46] text-[#f7f2e8] shadow-[2px_2px_0_#c8753d]'
                    : 'text-[#6d6260] hover:bg-[#f7f2e8] hover:text-[#573a46]'
                }`}
              >
                <Icon size={18} strokeWidth={isActive ? 2.6 : 2} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <div className="mt-auto hidden border-t border-[#573a46]/15 pt-5 sm:block">
          <Link href="/ask" data-testid="link-help" className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-semibold text-[#6d6260] hover:bg-[#f7f2e8]">
            <CircleHelp size={15} /> Need a hand?
          </Link>
        </div>
      </nav>
      <main className="va-shell min-h-[100dvh] px-4 py-4 sm:px-8 sm:py-8">
        <div className="mb-6 flex items-center justify-between border-b border-[#573a46]/10 pb-3 sm:hidden">
          <BrandMark compact />
          <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#573a46]/20 bg-[#eee6d7] text-xs font-bold text-[#573a46]">R</div>
        </div>
        {children}
      </main>
    </div>
  );
}

function PageTop({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-start justify-between gap-3 sm:mb-6 sm:flex-nowrap sm:items-end">
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.17em] text-[#c8753d] sm:text-[11px]">{eyebrow}</p>
        <h1 className="va-display text-2xl font-bold leading-[1.05] text-[#573a46] sm:text-[35px] lg:text-[39px]">{title}</h1>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </header>
  );
}

function MonthPicker({ month, setMonth }: { month: keyof typeof monthData; setMonth: (month: keyof typeof monthData) => void }) {
  return (
    <label className="relative flex items-center gap-1 rounded-full border border-[#573a46]/20 bg-[#f7f2e8] px-3 py-1.5 text-[11px] font-bold text-[#573a46] sm:py-2">
      <select
        value={month}
        onChange={(event) => setMonth(event.target.value as keyof typeof monthData)}
        data-testid="select-month"
        className="appearance-none bg-transparent pr-4 outline-none"
      >
        <option value="aug">Aug 2026</option>
        <option value="jul">Jul 2026</option>
      </select>
      <ChevronDown size={14} className="pointer-events-none absolute right-2" />
    </label>
  );
}

function Rupee({ value, className = '' }: { value: number; className?: string }) {
  return <span className={`va-mono ${className}`}>{value < 0 ? '−' : ''}{money(value)}</span>;
}

function Sparkline({ month }: { month: keyof typeof monthData }) {
  return (
    <svg viewBox="0 0 360 90" className="h-16 w-full sm:h-20" role="img" aria-label={`${monthData[month].label} income and expense trend`}>
      <path d="M3 66 C32 62,40 40,68 52 S95 72,121 45 S153 35,180 48 S210 20,242 35 S275 15,319 30 S344 16,357 18" fill="none" stroke="#573a46" strokeWidth="3" strokeLinecap="round" />
      <path d="M3 49 C36 54,47 42,70 57 S105 46,129 60 S166 44,188 57 S218 44,244 64 S286 38,316 52 S342 46,357 59" fill="none" stroke="#c8753d" strokeWidth="3" strokeLinecap="round" />
      <path d="M3 66 C32 62,40 40,68 52 S95 72,121 45 S153 35,180 48 S210 20,242 35 S275 15,319 30 S344 16,357 18 L357 88 L3 88Z" fill="#573a46" opacity=".06" />
    </svg>
  );
}

function AskStrip() {
  return (
    <Link href="/ask" data-testid="link-ask-dashboard" className="va-card va-tap group flex w-full items-center gap-3 rounded-2xl bg-[#573a46] px-4 py-3.5 text-left text-[#f7f2e8] shadow-[4px_4px_0_#c8753d] sm:py-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f7f2e8]/30 bg-[#c8753d] sm:h-10 sm:w-10">
        <Bot size={19} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#b8d1bf] sm:text-[11px]">Ask FinoraAI</div>
        <div className="mt-0.5 truncate text-xs font-semibold sm:text-sm">“Where did my money go this month?”</div>
      </div>
      <ArrowRight size={18} className="shrink-0 transition-transform group-hover:translate-x-1" />
    </Link>
  );
}

function Dashboard() {
  const [month, setMonth] = useState<keyof typeof monthData>('aug');
  const [showDetails, setShowDetails] = useState(false);
  const { setIsAddModalOpen, totalIncome, totalExpenses } = useKhataState();
  const data = monthData[month];
  const displayIncome = month === 'aug' ? totalIncome : data.income;
  const displayExpenses = month === 'aug' ? totalExpenses : data.expenses;
  const displayShortfall = displayExpenses - displayIncome;

  return (
    <Shell active="home">
      <PageTop eyebrow="Good morning, Ramesh" title="Your shop, at a glance" action={<MonthPicker month={month} setMonth={setMonth} />} />
      <div className="mb-5 grid gap-4 sm:mb-6 sm:gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <section className="va-rise rounded-2xl bg-[#573a46] p-4 text-[#f7f2e8] shadow-[4px_4px_0_#c8753d] sm:p-7 sm:shadow-[5px_5px_0_#c8753d]">
          <div className="mb-6 flex items-start justify-between gap-3 sm:mb-8">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b8d1bf] sm:text-[11px]">the short answer</p>
              <h2 className="va-display mt-2 max-w-md text-xl font-bold leading-tight sm:text-[32px] lg:text-[38px]">
                {data.note}<br /><span className="text-[#f2d6b7]">{data.follow}</span>
              </h2>
            </div>
            <Banknote size={22} className="shrink-0 text-[#c8753d] sm:size-[25px]" />
          </div>
          <div className="flex flex-col gap-4 border-t border-[#f7f2e8]/20 pt-4 sm:flex-row sm:items-end sm:justify-between sm:pt-5">
            <div>
              <div className="va-mono text-2xl font-bold text-[#f2d6b7] sm:text-3xl"><Rupee value={displayShortfall} /></div>
              <p className="mt-1 text-xs text-[#f7f2e8]/70">{month === 'aug' ? 'more out than in this month' : 'left after costs this month'}</p>
            </div>
            <div className="text-left text-xs leading-relaxed text-[#f7f2e8]/75 sm:max-w-[185px] sm:text-right">
              You brought in <Rupee value={displayIncome} className="font-bold text-[#f7f2e8]" /> and spent <Rupee value={displayExpenses} className="font-bold text-[#f7f2e8]" />.
            </div>
          </div>
        </section>
        <section className="va-card va-rise va-delay-1 rounded-2xl bg-[#eee6d7] p-4 sm:p-5">
          <div className="mb-3 flex items-center justify-between sm:mb-4">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#6d6260] sm:text-[11px]">
              <BarChart3 size={15} className="text-[#c8753d]" /> money moving
            </div>
            <span className="rounded-full bg-[#b8d1bf] px-2 py-0.5 text-[10px] font-bold text-[#3e6e59]">{month === 'aug' ? 'Aug' : 'Jul'}</span>
          </div>
          <div className="mb-1 flex items-end justify-between">
            <div>
              <div className="text-[10px] text-[#6d6260] sm:text-[11px]">income</div>
              <div className="va-mono text-xl font-bold text-[#573a46] sm:text-2xl"><Rupee value={displayIncome} /></div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-[#6d6260] sm:text-[11px]">expenses</div>
              <div className="va-mono text-xl font-bold text-[#c8753d] sm:text-2xl"><Rupee value={displayExpenses} /></div>
            </div>
          </div>
          <Sparkline month={month} />
          <div className="mt-1 flex justify-between text-[10px] text-[#6d6260]">
            <span>1 {month === 'aug' ? 'Aug' : 'Jul'}</span>
            <span>31 {month === 'aug' ? 'Aug' : 'Jul'}</span>
          </div>
        </section>
      </div>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[.92fr_1.08fr]">
        <section className="va-rise va-delay-2">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="va-display text-lg font-bold text-[#573a46] sm:text-[19px]">Where it went</h2>
            <span className="text-[10px] font-medium text-[#6d6260] sm:text-[11px]"><Rupee value={displayExpenses} /> total</span>
          </div>
          <div className="va-card rounded-2xl bg-[#f7f2e8] p-4">
            <div className="mb-4 flex h-3.5 overflow-hidden rounded-full bg-[#eee6d7] sm:mb-5 sm:h-4">
              {categories.map((item) => (
                <div key={item.name} style={{ width: `${item.share}%`, backgroundColor: item.color }} />
              ))}
            </div>
            <div className="space-y-2.5 sm:space-y-3">
              {categories.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5 text-xs sm:gap-3 sm:text-sm">
                  <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="flex-1 truncate text-[#6d6260]">{item.name}</span>
                  <span className="va-mono font-bold text-[#573a46]"><Rupee value={item.amount} /></span>
                  <span className="w-7 text-right text-[10px] text-[#6d6260] sm:w-8">{item.share}%</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setShowDetails((value) => !value)}
              data-testid="button-category-details"
              className="va-tap mt-4 flex items-center gap-1 text-xs font-bold text-[#c8753d] sm:mt-5"
            >
              {showDetails ? 'Hide details' : 'See all categories'} <ArrowRight size={14} />
            </button>
            {showDetails && (
              <div className="mt-3 rounded-xl bg-[#b8d1bf] px-3.5 py-2.5 text-xs leading-relaxed text-[#30282b] sm:mt-4 sm:px-4 sm:py-3 sm:text-sm">
                <b>Groceries are your biggest line.</b> That is normal for a kirana; we will watch for sudden jumps, not judge the spend.
              </div>
            )}
          </div>
        </section>
        <section className="va-rise va-delay-3">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="va-display text-lg font-bold text-[#573a46] sm:text-[19px]">A gentle heads-up</h2>
            <span className="text-[10px] text-[#6d6260] sm:text-[11px]">one thing to see</span>
          </div>
          <div className="va-card flex flex-col justify-between gap-4 rounded-2xl border-[#c8753d]/30 bg-[#f2d6b7] p-4 sm:flex-row sm:items-center sm:p-5">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c8753d] text-[#f7f2e8] sm:h-10 sm:w-10">
                <CircleAlert size={18} />
              </div>
              <div>
                <div className="text-sm font-bold text-[#573a46] sm:text-base">One supplier payment stood out</div>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-[#573a46]/80 sm:text-sm">
                  <Rupee value={12400} className="font-bold" /> to Mahavir Wholesale was higher than your usual payment. It may be stock-up week.
                </p>
              </div>
            </div>
            <Link href="/bahi" data-testid="link-look-closer" className="va-tap flex shrink-0 items-center gap-1 text-xs font-bold text-[#573a46]">
              Look closer <ArrowUpRight size={15} />
            </Link>
          </div>
          <div className="mt-4 sm:mt-5">
            <AskStrip />
          </div>
        </section>
      </div>
      <div className="mt-6 flex items-center justify-between border-t border-[#573a46]/15 pt-3.5 text-[11px] text-[#6d6260] sm:mt-7 sm:pt-4">
        <span className="flex items-center gap-1"><Store size={14} /> Shree Ganesh Kirana</span>
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          data-testid="button-add-entry"
          className="va-tap flex items-center gap-1.5 font-bold text-[#573a46] hover:text-[#c8753d]"
        >
          <Plus size={14} /> Add entry
        </button>
      </div>
    </Shell>
  );
}

function Transactions() {
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'in' | 'out'>('all');
  const [selected, setSelected] = useState<number | null>(null);
  const { entries, setIsAddModalOpen, totalIncome, totalExpenses, netBalance } = useKhataState();

  const filtered = useMemo(
    () =>
      entries.filter(
        (entry) =>
          (filter === 'all' || entry.kind === filter) &&
          `${entry.label} ${entry.note} ${entry.category || ''}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [entries, filter, query],
  );

  const selectedEntry = entries.find((entry) => entry.id === selected);

  return (
    <Shell active="bahi">
      <PageTop
        eyebrow={`Khata · ${entries.length} entries`}
        title="Every rupee, accounted for"
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              data-testid="button-bahi-add-entry"
              className="va-tap flex items-center gap-1.5 rounded-full border-2 border-[#573a46] bg-[#573a46] px-3.5 py-1.5 text-xs font-bold text-[#f7f2e8] shadow-[2px_2px_0_#c8753d] hover:bg-[#432c36]"
            >
              <Plus size={14} /> Add transaction
            </button>
            <div className="hidden rounded-full border border-[#573a46]/20 bg-[#f7f2e8] px-3 py-1.5 text-[11px] font-bold text-[#573a46] sm:block">
              Aug 2026
            </div>
          </div>
        }
      />
      <div className="mb-4 flex flex-col gap-2.5 sm:mb-5 sm:flex-row sm:gap-3">
        <label className="flex flex-1 items-center gap-2 rounded-xl border border-[#573a46]/20 bg-[#f7f2e8] px-3 py-2 text-[#6d6260] sm:py-2.5">
          <Search size={16} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            data-testid="input-search-bahi"
            placeholder="Search Khata entries..."
            className="w-full bg-transparent text-xs outline-none placeholder:text-[#6d6260]/70 sm:text-sm"
          />
        </label>
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-0.5 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilter('all')}
            data-testid="button-filter-all"
            className={`va-tap shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold sm:py-2 ${
              filter === 'all' ? 'border-[#573a46] bg-[#573a46] text-[#f7f2e8]' : 'border-[#573a46]/20 bg-[#f7f2e8] text-[#6d6260]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilter('in')}
            data-testid="button-filter-in"
            className={`va-tap shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold sm:py-2 ${
              filter === 'in' ? 'border-[#3e6e59] bg-[#b8d1bf] text-[#3e6e59]' : 'border-[#573a46]/20 bg-[#f7f2e8] text-[#6d6260]'
            }`}
          >
            Money in
          </button>
          <button
            type="button"
            onClick={() => setFilter('out')}
            data-testid="button-filter-out"
            className={`va-tap shrink-0 rounded-xl border px-3 py-1.5 text-xs font-bold sm:py-2 ${
              filter === 'out' ? 'border-[#c8753d] bg-[#f2d6b7] text-[#573a46]' : 'border-[#573a46]/20 bg-[#f7f2e8] text-[#6d6260]'
            }`}
          >
            <Filter size={12} className="mr-1 inline" />
            Money out
          </button>
        </div>
      </div>
      <div className="grid gap-4 sm:gap-5 lg:grid-cols-[1fr_300px]">
        <section className="va-card overflow-hidden rounded-2xl bg-[#f7f2e8]">
          <div className="flex items-center justify-between border-b border-[#573a46]/15 bg-[#eee6d7] px-3.5 py-2.5 sm:px-4 sm:py-3">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#573a46] sm:text-[11px]">
              <SlidersHorizontal size={13} /> Aug 2026 ledger
            </div>
            <span className="text-[10px] text-[#6d6260] sm:text-[11px]">{filtered.length} shown</span>
          </div>
          <div>
            {filtered.map((entry) => (
              <button
                type="button"
                key={entry.id}
                onClick={() => setSelected(selected === entry.id ? null : entry.id)}
                data-testid={`button-entry-${entry.id}`}
                className="va-ledger-row va-tap flex w-full items-center gap-2.5 px-3 py-3 text-left hover:bg-[#eee6d7]/70 sm:gap-3 sm:px-4 sm:py-4"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9 ${
                    entry.kind === 'in' ? 'bg-[#b8d1bf] text-[#3e6e59]' : 'bg-[#f2d6b7] text-[#c8753d]'
                  }`}
                >
                  {entry.kind === 'in' ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5 text-xs font-bold text-[#573a46] sm:text-sm">
                    {entry.label}
                    {entry.flagged && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#f2d6b7] px-1.5 py-0.5 text-[9px] font-bold text-[#9c4f45]">
                        <TriangleAlert size={10} /> look closer
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 truncate text-[10px] text-[#6d6260] sm:text-[11px]">{entry.note}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={`va-mono text-xs font-bold sm:text-sm ${entry.kind === 'in' ? 'text-[#3e6e59]' : 'text-[#573a46]'}`}>
                    {entry.kind === 'in' ? '+' : '−'}
                    <Rupee value={entry.amount} />
                  </div>
                  <div className="mt-0.5 text-[9px] text-[#6d6260] sm:text-[10px]">{entry.date}</div>
                </div>
              </button>
            ))}
          </div>
          {filtered.length === 0 && <div className="p-8 text-center text-xs text-[#6d6260] sm:p-10 sm:text-sm">No entries match that search.</div>}
        </section>
        <aside className="space-y-4">
          <div className="va-card rounded-2xl bg-[#573a46] p-4 text-[#f7f2e8] sm:p-5">
            <div className="mb-4 text-[10px] font-bold uppercase tracking-[.14em] text-[#b8d1bf] sm:mb-5 sm:text-[11px]">this month</div>
            <div className="mb-2.5 flex items-center justify-between text-xs sm:mb-3 sm:text-sm">
              <span className="text-[#f7f2e8]/70">Money in</span>
              <Rupee value={totalIncome} className="font-bold text-[#b8d1bf]" />
            </div>
            <div className="mb-3.5 flex items-center justify-between text-xs sm:mb-4 sm:text-sm">
              <span className="text-[#f7f2e8]/70">Money out</span>
              <Rupee value={totalExpenses} className="font-bold text-[#f2d6b7]" />
            </div>
            <div className="border-t border-[#f7f2e8]/20 pt-3 text-xs text-[#f7f2e8]/70">
              Balance movement <Rupee value={netBalance} className="float-right font-bold text-[#f2d6b7]" />
            </div>
          </div>
          {selectedEntry ? (
            <div className="va-card rounded-2xl border-[#c8753d]/25 bg-[#f2d6b7] p-4 sm:p-5">
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[.14em] text-[#9c4f45] sm:mb-2 sm:text-[11px]">entry note</div>
              <h3 className="text-sm font-bold text-[#573a46] sm:text-base">
                {selectedEntry.label} · {selectedEntry.date}
              </h3>
              <p className="mt-1.5 text-xs leading-relaxed text-[#573a46] sm:mt-2 sm:text-sm">
                {selectedEntry.flagged
                  ? 'This payment is about ₹4,760 above your usual supplier payments. Check if a larger stock order came in.'
                  : `${selectedEntry.note}. This entry is recorded in your khata; tap another row to compare.`}
              </p>
              <button
                type="button"
                onClick={() => setSelected(null)}
                data-testid="button-close-entry-note"
                className="va-tap mt-3 flex items-center gap-1 text-xs font-bold text-[#573a46] sm:mt-4"
              >
                <Check size={14} /> Got it
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#573a46]/25 p-4 text-xs leading-relaxed text-[#6d6260] sm:p-5 sm:text-sm">
              Tap any entry to see its note. The one marked <span className="font-bold text-[#9c4f45]">look closer</span> is not a mistake — just worth checking.
            </div>
          )}
        </aside>
      </div>
    </Shell>
  );
}

type Message = { from: 'ai' | 'user'; text: string; detail?: string };
function replyFor(text: string) {
  const lower = text.toLowerCase();
  if (lower.includes('stock')) return 'You can add a little stock, but keep about ₹18,000 aside for rent and regular supplier payments first.';
  if (lower.includes('pay') || lower.includes('priority')) return 'Pay rent first, then the smaller supplier balance. The ₹12,400 Mahavir Wholesale payment can wait until you check the stock list.';
  if (lower.includes('tea')) return 'Tea counter sales brought in ₹32,600 this month. The regular smaller sales are doing useful work alongside groceries.';
  return 'August felt tight because costs were ₹6,600 ahead of sales. Groceries made up ₹82,400, so that is the first place I would look gently.';
}

function AskAI() {
  const [messages, setMessages] = useState<Message[]>([
    { from: 'ai', text: 'Namaste Ramesh. I have your August khata open. What would you like to understand?', detail: 'Based on 47 entries · Aug 2026' },
  ]);
  const [draft, setDraft] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const isRecordingRef = useRef(false);
  const recognitionRef = useRef<any>(null);

  const starters = ['Why was August tight?', 'Can I afford more stock?', 'What should I pay first?'];

  const toggleRecording = () => {
    if (isRecordingRef.current) {
      isRecordingRef.current = false;
      setIsRecording(false);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      toast({
        title: 'Voice Recording Stopped',
        description: 'Mic turned off.',
      });
    } else {
      isRecordingRef.current = true;
      setIsRecording(true);
      toast({
        title: 'Voice Recording Active 🎙️',
        description: 'Listening... Click mic again when finished to stop.',
      });

      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        try {
          const rec = new SpeechRecognition();
          rec.continuous = true;
          rec.interimResults = true;
          rec.lang = 'en-IN';
          rec.onresult = (event: any) => {
            const transcript = Array.from(event.results)
              .map((r: any) => r[0].transcript)
              .join('');
            setDraft(transcript);
          };
          rec.onend = () => {
            if (isRecordingRef.current) {
              try {
                rec.start();
              } catch (_) {}
            }
          };
          rec.start();
          recognitionRef.current = rec;
        } catch (err) {
          console.warn('Speech recognition error:', err);
        }
      }
    }
  };

  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((current) => [...current, { from: 'user', text: clean }, { from: 'ai', text: replyFor(clean), detail: 'FinoraAI · just now' }]);
    setDraft('');
  };

  return (
    <Shell active="ask">
      <div className="mx-auto max-w-3xl">
        <header className="mb-4 flex items-center justify-between border-b border-[#573a46]/15 pb-4 sm:mb-5 sm:pb-5">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#573a46] text-[#f7f2e8] shadow-[2px_2px_0_#c8753d] sm:h-11 sm:w-11">
              <Bot size={21} />
            </div>
            <div>
              <div className="va-display text-lg font-bold text-[#573a46] sm:text-xl">Ask FinoraAI</div>
              <div className="flex items-center gap-1 text-[10px] font-semibold text-[#3e6e59] sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#3e6e59]" /> reads your khata, not your bank
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMessages([])}
            data-testid="button-clear-chat"
            className="va-tap rounded-lg p-2 text-[#6d6260] hover:bg-[#eee6d7]"
            aria-label="Clear conversation"
          >
            <MoreHorizontal size={19} />
          </button>
        </header>
        <div className="mb-5 rounded-xl border border-[#573a46]/10 bg-[#eee6d7]/70 px-3.5 py-2.5 text-xs leading-relaxed text-[#6d6260] sm:mb-6 sm:px-4 sm:py-3">
          I explain what your entries say. I do not move money or make decisions for you.
        </div>
        {messages.length === 1 && (
          <div className="mb-5 grid grid-cols-1 gap-2 sm:mb-6 sm:grid-cols-3">
            {starters.map((starter) => (
              <button
                type="button"
                key={starter}
                onClick={() => send(starter)}
                data-testid={`button-suggest-${starter.slice(0, 4).toLowerCase()}`}
                className="va-tap rounded-xl border border-[#573a46]/20 bg-[#f7f2e8] px-3 py-2.5 text-left text-xs font-bold text-[#573a46] hover:bg-[#b8d1bf] sm:py-3"
              >
                {starter}
                <ArrowUp size={13} className="float-right rotate-45 text-[#c8753d]" />
              </button>
            ))}
          </div>
        )}
        <div className="space-y-3.5 pb-20 sm:space-y-4 sm:pb-8">
          {messages.length === 0 && (
            <div className="rounded-2xl border border-dashed border-[#573a46]/25 p-6 text-center text-xs text-[#6d6260] sm:p-8 sm:text-sm">
              Your next question can be about sales, stock, rent, or any entry in the khata.
            </div>
          )}
          {messages.map((message, index) =>
            message.from === 'ai' ? (
              <div className="flex items-end gap-2" key={`${message.text}-${index}`}>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#c8753d] text-[#f7f2e8]">
                  <Bot size={15} />
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm border border-[#573a46]/15 bg-[#f7f2e8] px-3.5 py-2.5 text-xs leading-relaxed text-[#30282b] shadow-[2px_2px_0_rgba(87,58,70,.08)] sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-sm">
                  <p>{message.text}</p>
                  {message.detail && <div className="mt-1.5 border-t border-[#573a46]/10 pt-1.5 text-[9px] font-medium text-[#6d6260] sm:mt-2 sm:pt-2 sm:text-[10px]">{message.detail}</div>}
                </div>
              </div>
            ) : (
              <div className="flex items-end justify-end gap-2" key={`${message.text}-${index}`}>
                <div className="max-w-[90%] rounded-2xl rounded-br-sm bg-[#573a46] px-3.5 py-2.5 text-xs leading-relaxed text-[#f7f2e8] sm:max-w-[80%] sm:px-4 sm:py-3 sm:text-sm">
                  {message.text}
                </div>
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#b8d1bf] text-[#3e6e59]">
                  <UserRound size={15} />
                </div>
              </div>
            ),
          )}
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            send(draft);
          }}
          className="sticky bottom-[72px] border-t border-[#573a46]/15 bg-[#f7f2e8]/95 pt-3 backdrop-blur-md sm:bottom-4 sm:pt-4"
        >
          {isRecording && (
            <div className="mb-2 flex items-center justify-center gap-2.5 rounded-xl border border-[#e53e3e]/30 bg-[#e53e3e]/10 px-3 py-1.5 text-xs font-bold text-[#e53e3e]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#e53e3e] opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#e53e3e]" />
              </span>
              <span className="flex items-center gap-0.5 h-4.5">
                <span className="w-0.5 rounded bg-[#e53e3e] va-wave-bar-1" />
                <span className="w-0.5 rounded bg-[#e53e3e] va-wave-bar-2" />
                <span className="w-0.5 rounded bg-[#e53e3e] va-wave-bar-3" />
                <span className="w-0.5 rounded bg-[#e53e3e] va-wave-bar-4" />
                <span className="w-0.5 rounded bg-[#e53e3e] va-wave-bar-5" />
              </span>
              Recording... Click mic button to stop
            </div>
          )}
          <div className="flex items-center gap-2 rounded-2xl border-2 border-[#573a46]/25 bg-[#f7f2e8] p-1.5 shadow-[2px_2px_0_rgba(87,58,70,.1)] sm:p-2">
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              data-testid="input-ask-question"
              aria-label="Ask FinoraAI a question"
              placeholder={isRecording ? "Listening... Speak your question..." : "Ask in your own words..."}
              className="min-w-0 flex-1 bg-transparent px-2 text-xs text-[#30282b] outline-none placeholder:text-[#6d6260] sm:text-sm"
            />
            <button
              type="button"
              onClick={toggleRecording}
              data-testid="button-mic-question"
              className={`va-tap flex h-8 w-8 items-center justify-center rounded-xl transition-all sm:h-9 sm:w-9 ${
                isRecording
                  ? 'va-recording-pulse'
                  : 'border border-[#573a46]/20 bg-[#eee6d7] text-[#573a46] hover:bg-[#b8d1bf]'
              }`}
              aria-label={isRecording ? 'Stop voice recording' : 'Start voice recording'}
              title={isRecording ? 'Click to stop recording' : 'Click to start recording'}
            >
              {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
            </button>
            <button
              type="submit"
              data-testid="button-send-question"
              className="va-tap flex h-8 w-8 items-center justify-center rounded-xl bg-[#c8753d] text-[#f7f2e8] hover:bg-[#573a46] sm:h-9 sm:w-9"
              aria-label="Send message"
            >
              <ArrowUp size={16} />
            </button>
          </div>
          <div className="mt-1.5 text-center text-[9px] text-[#6d6260] sm:mt-2 sm:text-[10px]">Try: “How much did tea counter sales make?”</div>
        </form>
      </div>
    </Shell>
  );
}

type Recommendation = { id: number; title: string; body: string; amount: number; tone: 'mint' | 'saffron' | 'plum' };
const initialRecommendations: Recommendation[] = [
  { id: 1, title: 'Keep rent aside first', body: 'Move this amount mentally before buying more stock. It keeps the last week of the month calm.', amount: 18000, tone: 'mint' },
  { id: 2, title: 'Check the Mahavir bill', body: 'This payment was higher than usual. If it was a stock-up, note what came in so next month makes sense.', amount: 12400, tone: 'saffron' },
  { id: 3, title: 'Protect your tea margin', body: 'Tea counter sales brought in ₹32,600. Keep the small, regular wins visible while grocery costs settle.', amount: 32600, tone: 'plum' },
];

function Recommendations() {
  const [items, setItems] = useState(initialRecommendations);
  const [done, setDone] = useState<number[]>([]);
  const complete = (id: number) => {
    setDone((current) => (current.includes(id) ? current : [...current, id]));
    setItems((current) => current.filter((item) => item.id !== id));
  };
  const reset = () => {
    setItems(initialRecommendations);
    setDone([]);
  };

  return (
    <Shell active="ideas">
      <PageTop
        eyebrow="Small moves, backed by your khata"
        title="What I would do next"
        action={<div className="hidden rounded-full border border-[#573a46]/20 bg-[#f7f2e8] px-3 py-1.5 text-[11px] font-bold text-[#573a46] sm:block">Aug 2026</div>}
      />
      <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-7 sm:grid-cols-3 sm:gap-4">
        <div className="va-card rounded-2xl bg-[#573a46] p-4 text-[#f7f2e8]">
          <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#b8d1bf]">shortfall to mind</div>
          <div className="va-display mt-2 text-2xl font-bold text-[#f2d6b7] sm:mt-3 sm:text-3xl"><Rupee value={6600} /></div>
          <div className="mt-1 text-xs text-[#f7f2e8]/65">before September starts</div>
        </div>
        <div className="va-card rounded-2xl bg-[#b8d1bf] p-4 text-[#30282b]">
          <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#3e6e59]">safe first step</div>
          <div className="va-display mt-2 text-2xl font-bold text-[#3e6e59] sm:mt-3 sm:text-3xl"><Rupee value={18000} /></div>
          <div className="mt-1 text-xs text-[#30282b]/65">keep aside for rent</div>
        </div>
        <div className="va-card rounded-2xl bg-[#f2d6b7] p-4 text-[#573a46]">
          <div className="text-[10px] font-bold uppercase tracking-[.15em] text-[#9c4f45]">one check</div>
          <div className="va-display mt-2 text-2xl font-bold sm:mt-3 sm:text-3xl"><Rupee value={12400} /></div>
          <div className="mt-1 text-xs text-[#573a46]/65">supplier payment to review</div>
        </div>
      </div>
      <div className="mb-4 flex items-center gap-2 rounded-xl border border-[#3e6e59]/20 bg-[#b8d1bf]/50 px-3.5 py-2.5 text-xs leading-relaxed text-[#3e6e59] sm:mb-5 sm:px-4 sm:py-3">
        <ShieldCheck size={16} className="shrink-0" /> These are suggestions, not orders. You know the shop; I only know the pattern in your entries.
      </div>
      <section className="space-y-3">
        {items.map((item) => (
          <article
            key={item.id}
            className={`va-card grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4 sm:p-5 ${
              item.tone === 'mint' ? 'bg-[#f7f2e8]' : item.tone === 'saffron' ? 'bg-[#f2d6b7]' : 'bg-[#573a46] text-[#f7f2e8]'
            }`}
          >
            <div className="flex gap-3 sm:gap-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full sm:h-10 sm:w-10 ${
                  item.tone === 'plum' ? 'bg-[#c8753d] text-[#f7f2e8]' : 'bg-[#573a46] text-[#f7f2e8]'
                }`}
              >
                <Lightbulb size={17} />
              </div>
              <div>
                <div className={`mb-0.5 text-[10px] font-bold uppercase tracking-[.15em] ${item.tone === 'plum' ? 'text-[#b8d1bf]' : 'text-[#9c4f45]'}`}>
                  suggestion {item.id}
                </div>
                <h2 className="va-display text-lg font-bold sm:text-xl">{item.title}</h2>
                <p className={`mt-1.5 max-w-xl text-xs leading-relaxed sm:mt-2 sm:text-sm ${item.tone === 'plum' ? 'text-[#f7f2e8]/75' : 'text-[#573a46]/75'}`}>
                  {item.body}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-3 border-t border-current/10 pt-3 sm:block sm:border-0 sm:pt-0 sm:text-right">
              <div className={`va-mono text-xl font-bold sm:text-2xl ${item.tone === 'plum' ? 'text-[#f2d6b7]' : 'text-[#573a46]'}`}>
                <Rupee value={item.amount} />
              </div>
              <button
                type="button"
                onClick={() => complete(item.id)}
                data-testid={`button-done-${item.id}`}
                className={`va-tap mt-1 flex items-center gap-1 text-xs font-bold sm:ml-auto sm:mt-2 ${
                  item.tone === 'plum' ? 'text-[#b8d1bf]' : 'text-[#c8753d]'
                }`}
              >
                Mark as done <Check size={14} />
              </button>
            </div>
          </article>
        ))}
      </section>
      {items.length === 0 && (
        <div className="va-card rounded-2xl bg-[#b8d1bf] p-6 text-center sm:p-8">
          <Check size={23} className="mx-auto mb-2 text-[#3e6e59]" />
          <div className="va-display text-lg font-bold text-[#3e6e59] sm:text-xl">That is a good day’s work.</div>
          <p className="mt-1 text-xs text-[#3e6e59]/75 sm:text-sm">You have looked at every suggestion for August.</p>
        </div>
      )}
      {done.length > 0 && (
        <div className="mt-4 flex items-center gap-2 text-xs text-[#6d6260]">
          <Check size={14} /> {done.length} suggestion{done.length > 1 ? 's' : ''} marked done · your khata stays unchanged
        </div>
      )}
      <footer className="mt-6 flex items-center justify-between border-t border-[#573a46]/15 pt-3.5 text-[11px] text-[#6d6260] sm:mt-8 sm:pt-4">
        <span>Based on entries through 31 Aug 2026</span>
        <button type="button" onClick={reset} data-testid="button-reset-ideas" className="va-tap flex items-center gap-1 font-bold text-[#573a46]">
          <X size={13} /> Reset view
        </button>
      </footer>
    </Shell>
  );
}

function Router() {
  const [location] = useLocation();
  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/bahi" component={Transactions} />
        <Route path="/ask" component={AskAI} />
        <Route path="/ideas" component={Recommendations} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <KhataProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <Toaster />
        </KhataProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;