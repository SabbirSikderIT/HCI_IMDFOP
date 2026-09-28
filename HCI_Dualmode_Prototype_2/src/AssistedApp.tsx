import { useState, useEffect } from 'react';
import { txList, BALANCE, ACCOUNT_NUM, ACCOUNT_NAME, savedContacts } from './data';
import { QRCode, TxBadge } from './shared';

type Screen =
  | 'home' | 'balance' | 'send1' | 'send2' | 'confirm' | 'receive'
  | 'history' | 'bill' | 'recharge' | 'loading' | 'success';

type Tab = 'home' | 'send' | 'receive' | 'history';

// Context-aware help content
const HELP: Record<string, { title: string; steps: string[] }> = {
  home: {
    title: 'How to use this app',
    steps: [
      'Tap any item in the list to use that service.',
      'Your balance is shown at the top of the screen.',
      'Use the bottom bar to switch between sections.',
      'Tap the orange ❓ button anytime for help.',
    ],
  },
  send1: {
    title: 'Sending Money — Step 1',
    steps: [
      'Type the recipient\'s mobile number (11 digits).',
      'Numbers usually start with 017, 018, or 019.',
      'Tap a saved contact below the keypad to fill quickly.',
      'Tap Next when all 11 digits are entered.',
    ],
  },
  send2: {
    title: 'Sending Money — Step 2',
    steps: [
      'Enter the amount you want to send.',
      'Use the number pad to type the amount.',
      'The minimum amount is ৳1.',
      'Tap Next to review before sending.',
    ],
  },
  confirm: {
    title: 'Confirm Your Transfer',
    steps: [
      'Check the recipient number and amount carefully.',
      'Tap YES (green) to send the money.',
      'Tap NO (red) to cancel and go back home.',
      'Once confirmed, the transfer cannot be undone.',
    ],
  },
  receive: {
    title: 'Receiving Money',
    steps: [
      'Show your QR code to the sender.',
      'Or share your account number verbally.',
      'Tap Copy to copy your number to the clipboard.',
      'Money will appear in your account instantly.',
    ],
  },
  history: {
    title: 'Transaction History',
    steps: [
      'Green amounts (↓) are money received.',
      'Red amounts (↑) are money sent or paid.',
      'Transactions are sorted newest first.',
      'Tap any entry to see full details.',
    ],
  },
  bill: {
    title: 'Paying a Bill',
    steps: [
      'First select the type of bill from the list.',
      'Enter your meter or account number.',
      'Check the amount shown and tap Pay.',
      'You will get a confirmation receipt.',
    ],
  },
  recharge: {
    title: 'Mobile Recharge',
    steps: [
      'Enter the mobile number to recharge.',
      'Select a preset amount or type a custom one.',
      'Tap Recharge Now to complete.',
      'Recharge is instant on all networks.',
    ],
  },
};

// ── Status Bar ────────────────────────────────────────────────────────────────
const StatusBar = ({ light = false }: { light?: boolean }) => (
  <div className={`h-[54px] flex items-end pb-2 px-5 flex-shrink-0 ${light ? 'text-white' : 'text-gray-900'}`}>
    <span className="text-[13px] font-bold ml-8">9:41</span>
    <div className="ml-auto flex items-center gap-2 mr-1">
      <div className="flex items-end gap-[2px]">
        {[4, 6, 8, 10].map((h, i) => (
          <div key={i} className={`w-[3px] rounded-sm ${light ? 'bg-white' : 'bg-gray-800'}`} style={{ height: h }} />
        ))}
      </div>
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none">
        <path d="M7 9a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" fill={light ? 'white' : '#1e293b'} />
        <path d="M4 6a4.5 4.5 0 016 0" stroke={light ? 'white' : '#1e293b'} strokeWidth="1.4" strokeLinecap="round" fill="none" />
        <path d="M1.5 3.5A8.5 8.5 0 0112.5 3.5" stroke={light ? 'white' : '#1e293b'} strokeWidth="1.4" strokeLinecap="round" fill="none" />
      </svg>
      <div className="flex items-center">
        <div className={`w-[22px] h-[11px] rounded-[2.5px] border ${light ? 'border-white' : 'border-gray-700'} flex items-center p-[1.5px]`}>
          <div className="h-full w-[85%] bg-green-500 rounded-[1px]" />
        </div>
        <div className={`w-[2px] h-[5px] ${light ? 'bg-white' : 'bg-gray-600'} rounded-r-sm ml-[1px]`} />
      </div>
    </div>
  </div>
);

// ── Back Header (44px touch target) ──────────────────────────────────────────
const BackHeader = ({
  title,
  onBack,
  bg = 'bg-blue-900',
  fg = 'text-white',
}: {
  title: string;
  onBack: () => void;
  bg?: string;
  fg?: string;
}) => (
  <div className={`${bg} flex-shrink-0`}>
    <StatusBar light={fg === 'text-white'} />
    <div className={`flex items-center px-4 h-[44px] relative ${fg}`}>
      <button
        onClick={onBack}
        className="flex items-center gap-1 h-[44px] pr-3 font-semibold text-[15px] active:opacity-60"
      >
        <svg width="9" height="15" viewBox="0 0 9 15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7.5 1L1.5 7.5l6 6.5" />
        </svg>
        Back
      </button>
      <span className="absolute left-1/2 -translate-x-1/2 text-[16px] font-bold">{title}</span>
    </div>
  </div>
);

// ── Compact Number Pad (44px+ buttons) ───────────────────────────────────────
const NumPad = ({
  value,
  onChange,
  maxLen = 11,
  allowDot = false,
}: {
  value: string;
  onChange: (v: string) => void;
  maxLen?: number;
  allowDot?: boolean;
}) => {
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', allowDot ? '.' : '', '0', '⌫'];
  const tap = (k: string) => {
    if (k === '⌫') { onChange(value.slice(0, -1)); return; }
    if (k === '') return;
    if (k === '.' && value.includes('.')) return;
    if (value.length >= maxLen) return;
    onChange(value + k);
  };
  return (
    <div className="grid grid-cols-3 gap-2 px-3">
      {keys.map((k, i) => (
        <button
          key={i}
          onClick={() => tap(k)}
          className={`h-[56px] rounded-xl text-[19px] font-bold transition-transform active:scale-95 select-none
            ${k === '' ? 'pointer-events-none opacity-0' :
              k === '⌫' ? 'bg-red-50 text-red-500 border border-red-200 active:bg-red-100' :
              'bg-gray-100 text-gray-900 border border-gray-200 active:bg-gray-200'}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
};

// ── Bottom Tab Bar ────────────────────────────────────────────────────────────
const BottomTabs = ({
  active,
  onTab,
  onHelp,
}: {
  active: Tab;
  onTab: (t: Tab) => void;
  onHelp: () => void;
}) => {
  const tabs: { id: Tab; icon: string; label: string }[] = [
    { id: 'home',    icon: '🏠', label: 'Home'    },
    { id: 'send',    icon: '↗️',  label: 'Send'    },
    { id: 'receive', icon: '↙️',  label: 'Receive' },
    { id: 'history', icon: '📋', label: 'History' },
  ];
  return (
    <div className="flex-shrink-0 bg-white border-t border-gray-200" style={{ height: 60 }}>
      <div className="flex h-full">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => onTab(t.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors active:opacity-60
              ${active === t.id ? 'text-blue-900' : 'text-gray-400'}`}
          >
            <span className="text-[18px] leading-none">{t.icon}</span>
            <span className={`text-[10px] font-semibold ${active === t.id ? 'text-blue-900' : 'text-gray-400'}`}>
              {t.label}
            </span>
          </button>
        ))}
        <button
          onClick={onHelp}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-orange-500 active:opacity-60"
        >
          <span className="text-[18px] leading-none">❓</span>
          <span className="text-[10px] font-semibold text-orange-500">Help</span>
        </button>
      </div>
    </div>
  );
};

// ── Help Overlay (A7) ─────────────────────────────────────────────────────────
const HelpOverlay = ({
  screen,
  onClose,
}: {
  screen: Screen;
  onClose: () => void;
}) => {
  const content = HELP[screen] ?? HELP.home;
  return (
    <div
      className="absolute inset-0 z-40 flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-[28px] px-5 pt-5 pb-6 anim-overlay"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-[20px]">❓</div>
          <h3 className="text-[17px] font-bold text-gray-900">{content.title}</h3>
        </div>
        <div className="space-y-3 mb-5">
          {content.steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 mt-0.5">
                {i + 1}
              </div>
              <p className="text-[14px] text-gray-700 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          style={{ height: 52 }}
          className="w-full bg-orange-500 text-white rounded-2xl text-[16px] font-bold active:scale-95 transition-all"
        >
          Got it  ✓
        </button>
      </div>
    </div>
  );
};

// ── Help Beacon FAB ───────────────────────────────────────────────────────────
const HelpBeacon = ({ onTap }: { onTap: () => void }) => (
  <button
    onClick={onTap}
    className="absolute bottom-[68px] right-4 z-30 w-14 h-14 bg-orange-500 text-white rounded-full flex items-center justify-center text-[24px] font-bold shadow-lg anim-beacon active:scale-90 transition-transform"
  >
    ❓
  </button>
);

// ── Main App ──────────────────────────────────────────────────────────────────
export default function AssistedApp() {
  const [stack, setStack] = useState<Screen[]>(['home']);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [showHelp, setShowHelp] = useState(false);
  const [rcpt, setRcpt] = useState('');
  const [amt, setAmt] = useState('');
  const [billType, setBillType] = useState('');
  const [billNum, setBillNum] = useState('');
  const [rchNum, setRchNum] = useState('');
  const [rchAmt, setRchAmt] = useState('');
  const [sucMsg, setSucMsg] = useState('');
  const [sucDet, setSucDet] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const scr = stack[stack.length - 1];
  const go = (s: Screen) => setStack((p) => [...p, s]);
  const back = () => { if (stack.length > 1) setStack((p) => p.slice(0, -1)); };
  const home = () => {
    setStack(['home']);
    setActiveTab('home');
    setRcpt(''); setAmt(''); setBillType(''); setBillNum(''); setRchNum(''); setRchAmt('');
  };

  const doLoad = (msg: string, det: string) => {
    setSucMsg(msg); setSucDet(det); go('loading');
  };

  const handleTab = (t: Tab) => {
    setActiveTab(t);
    setShowHelp(false);
    if (t === 'home')    { setStack(['home']); }
    if (t === 'send')    { setRcpt(''); setAmt(''); setStack(['home', 'send1']); }
    if (t === 'receive') { setStack(['home', 'receive']); }
    if (t === 'history') { setStack(['home', 'history']); }
  };

  useEffect(() => {
    if (scr === 'loading') {
      const t = setTimeout(() => setStack((p) => [...p.slice(0, -1), 'success']), 2200);
      return () => clearTimeout(t);
    }
  }, [scr]);

  const showBeacon = !['loading', 'success'].includes(scr);
  const helpContent = HELP[scr] ?? HELP.home;

  // ── A1: Home ────────────────────────────────────────────────────────────
  const renderHome = () => (
    <div className="flex flex-col h-full bg-slate-50 relative">
      {/* Header */}
      <div className="bg-blue-900 flex-shrink-0">
        <StatusBar light />
        <div className="px-4 pb-4 text-white">
          <p className="text-xs text-blue-300">Welcome back</p>
          <h1 className="text-[20px] font-bold">{ACCOUNT_NAME}</h1>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Balance card */}
        <div className="mx-3 -mt-2 bg-white rounded-2xl p-4 shadow-md border border-gray-100 mb-3">
          <p className="text-[11px] text-gray-500">Available Balance</p>
          <p className="text-[34px] font-bold text-blue-900 leading-tight">
            ৳ {refreshed ? '12,580.75' : BALANCE.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-gray-400">{ACCOUNT_NUM}</p>
            <button
              onClick={() => { setRefreshing(true); setTimeout(() => { setRefreshing(false); setRefreshed(true); }, 1200); }}
              style={{ height: 30 }}
              className="px-3 bg-blue-50 text-blue-800 rounded-lg text-[12px] font-semibold active:opacity-70"
            >
              {refreshing ? '...' : '⟳ Refresh'}
            </button>
          </div>
        </div>
        {/* Action list — 44px minimum touch targets */}
        <div className="px-3 space-y-2 pb-4">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-1 mb-2">Services</p>
          {[
            { label: 'Balance Check',      sub: 'View your full account details', emoji: '💳', color: 'text-blue-900', s: 'balance' },
            { label: 'Send Money',         sub: 'Transfer to any mobile number',  emoji: '↗️',  color: 'text-teal-700', s: 'send1'   },
            { label: 'Receive Money',      sub: 'Share QR code or account number',emoji: '↙️',  color: 'text-green-700',s: 'receive' },
            { label: 'Bill Payment',       sub: 'Electricity, gas, water, internet',emoji:'⚡',  color: 'text-purple-700',s:'bill'   },
            { label: 'Mobile Recharge',    sub: 'Top up any mobile number',       emoji: '📱',  color: 'text-orange-700',s:'recharge'},
            { label: 'Transaction History',sub: 'See all past transactions',      emoji: '📋',  color: 'text-slate-700', s:'history' },
          ].map((a) => (
            <button
              key={a.s}
              onClick={() => go(a.s as Screen)}
              style={{ minHeight: 56 }}
              className="w-full bg-white rounded-xl px-4 py-3 flex items-center gap-3 border border-gray-100 active:bg-gray-50 active:scale-[0.99] transition-all"
            >
              <div className={`w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-[18px] flex-shrink-0`}>
                {a.emoji}
              </div>
              <div className="flex-1 text-left">
                <p className={`font-semibold text-[14px] ${a.color}`}>{a.label}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{a.sub}</p>
              </div>
              <svg width="7" height="12" viewBox="0 0 7 12" fill="none" stroke="#9ca3af" strokeWidth="1.8" strokeLinecap="round">
                <path d="M1 1l5 5-5 5" />
              </svg>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── A2: Balance ──────────────────────────────────────────────────────────
  const renderBalance = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Balance" onBack={back} />
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        <div className="bg-blue-900 text-white rounded-2xl p-5 text-center shadow-md">
          <p className="text-xs text-blue-300">Available Balance</p>
          <p className="text-[44px] font-bold mt-1 leading-none">
            ৳ {refreshed ? '12,580.75' : BALANCE.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-blue-400 mt-2">{ACCOUNT_NUM} · {ACCOUNT_NAME}</p>
          {refreshed && <p className="text-xs text-green-400 mt-1 font-semibold">✓ Updated just now</p>}
        </div>
        {/* Refresh — 44px height (meets requirement) */}
        <button
          onClick={() => { setRefreshing(true); setTimeout(() => { setRefreshing(false); setRefreshed(true); }, 1200); }}
          style={{ height: 44 }}
          className="w-full bg-teal-600 text-white rounded-xl text-[14px] font-bold flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <span className={refreshing ? 'anim-spin' : ''}>⟳</span>
          {refreshing ? 'Refreshing...' : 'Refresh Balance'}
        </button>
        <div className="bg-white rounded-xl p-4 border border-gray-100 space-y-2.5">
          <h3 className="font-bold text-gray-900 text-[15px]">Account Details</h3>
          {[
            ['Name', ACCOUNT_NAME],
            ['Account No.', ACCOUNT_NUM],
            ['Type', 'Mobile Banking'],
            ['Status', '✅ Active'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[13px]">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-900">{v}</span>
            </div>
          ))}
        </div>
        {/* Recent transactions preview */}
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold text-gray-900 text-[15px] mb-3">Recent Activity</h3>
          {txList.slice(0, 3).map((tx) => (
            <div key={tx.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <TxBadge type={tx.type} large={false} />
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{tx.label}</p>
                <p className="text-[10px] text-gray-400">{tx.date}</p>
              </div>
              <p className={`text-[13px] font-bold flex-shrink-0 ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── A3: Send Step 1 ──────────────────────────────────────────────────────
  const renderSend1 = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Send Money" onBack={back} />
      <div className="flex-1 flex flex-col py-3 gap-3 overflow-hidden">
        {/* Step bar */}
        <div className="flex gap-2 px-4 flex-shrink-0">
          <div className="flex-1 h-1.5 bg-teal-500 rounded-full" />
          <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          <span className="text-[11px] text-gray-400 font-semibold">1 / 2</span>
        </div>
        <div className="px-4 flex-shrink-0">
          <h2 className="text-[17px] font-bold text-gray-900">Enter Mobile Number</h2>
          <p className="text-[12px] text-gray-500">Recipient's 11-digit number</p>
        </div>
        {/* Display */}
        <div className="mx-4 bg-white border-2 border-teal-200 rounded-xl p-4 text-center flex-shrink-0">
          <p className="text-[32px] font-bold tracking-wider text-blue-900 min-h-[42px]">
            {rcpt || <span className="text-gray-300 text-2xl">017XXXXXXXX</span>}
          </p>
          <p className="text-[10px] text-gray-400 mt-1">{rcpt.length} / 11</p>
        </div>
        {/* Saved contacts */}
        <div className="flex-shrink-0 px-4">
          <p className="text-[11px] text-gray-400 font-semibold mb-2 uppercase tracking-wider">Saved Contacts</p>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {savedContacts.map((c) => (
              <button
                key={c.number}
                onClick={() => setRcpt(c.number)}
                style={{ height: 44 }}
                className="flex-shrink-0 px-3 bg-white border border-gray-200 rounded-xl text-[12px] font-semibold text-blue-900 active:bg-blue-50 whitespace-nowrap"
              >
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col justify-end gap-3">
          <NumPad value={rcpt} onChange={setRcpt} maxLen={11} />
          <div className="px-4 pb-2">
            <button
              onClick={() => { if (rcpt.length >= 10) go('send2'); }}
              disabled={rcpt.length < 10}
              style={{ height: 48 }}
              className="w-full bg-teal-600 text-white rounded-xl text-[15px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── A3: Send Step 2 ──────────────────────────────────────────────────────
  const renderSend2 = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Send Money" onBack={back} />
      <div className="flex-1 flex flex-col py-3 gap-3 overflow-hidden">
        <div className="flex gap-2 px-4 flex-shrink-0">
          <div className="flex-1 h-1.5 bg-teal-500 rounded-full" />
          <div className="flex-1 h-1.5 bg-teal-500 rounded-full" />
          <span className="text-[11px] text-gray-400 font-semibold">2 / 2</span>
        </div>
        <div className="mx-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0">👤</div>
          <div>
            <p className="text-[10px] text-gray-500">Sending to</p>
            <p className="font-bold text-blue-900 text-[14px] tracking-wide">{rcpt}</p>
          </div>
        </div>
        <div className="mx-4 bg-white border-2 border-teal-200 rounded-xl p-4 text-center flex-shrink-0">
          <p className="text-[12px] text-gray-400 mb-1">Amount (Taka)</p>
          <p className="text-[40px] font-bold text-teal-700 min-h-[50px]">
            {amt ? `৳ ${amt}` : <span className="text-gray-300 text-3xl">৳ 0</span>}
          </p>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col justify-end gap-3">
          <NumPad value={amt} onChange={setAmt} maxLen={8} allowDot />
          <div className="px-4 pb-2">
            <button
              onClick={() => { if (amt && parseFloat(amt) > 0) go('confirm'); }}
              disabled={!amt || parseFloat(amt) <= 0}
              style={{ height: 48 }}
              className="w-full bg-teal-600 text-white rounded-xl text-[15px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── A4: Confirm ──────────────────────────────────────────────────────────
  const renderConfirm = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Confirm Transfer" onBack={back} />
      <div className="flex-1 flex flex-col justify-center px-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm space-y-3">
          <div className="text-center">
            <p className="text-[11px] text-gray-400">You are sending</p>
            <p className="text-[44px] font-bold text-blue-900 leading-tight">৳ {amt}</p>
          </div>
          <div className="border-t border-gray-100 pt-3 space-y-2">
            {[['To', rcpt], ['From', ACCOUNT_NUM], ['Fee', '৳ 0.00 (Free)'], ['Total', `৳ ${amt}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[13px]">
                <span className="text-gray-500">{k}</span>
                <span className={`font-semibold ${k === 'Fee' ? 'text-green-600' : 'text-gray-900'}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[12px] text-gray-500 text-center">Check details carefully. This cannot be undone.</p>
        {/* Confirm / Cancel — 52px (exceeds 44px requirement) */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={home}
            style={{ height: 52 }}
            className="rounded-xl text-[15px] font-bold bg-red-50 text-red-600 border-2 border-red-200 active:scale-95 transition-all"
          >
            ✕  Cancel
          </button>
          <button
            onClick={() => doLoad('Money Sent!', `৳${amt} sent to ${rcpt}`)}
            style={{ height: 52 }}
            className="rounded-xl text-[15px] font-bold bg-green-600 text-white active:scale-95 transition-all shadow-sm"
          >
            ✓  Confirm
          </button>
        </div>
      </div>
    </div>
  );

  // ── A5: Receive ──────────────────────────────────────────────────────────
  const renderReceive = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Receive Money" onBack={back} bg="bg-green-700" />
      <div className="flex-1 flex flex-col items-center px-4 py-4 gap-4 overflow-y-auto">
        <p className="text-[13px] text-gray-500 text-center">
          Show the sender your QR code or account number
        </p>
        <QRCode size={172} />
        <div className="w-full bg-white rounded-xl p-4 border border-gray-100 text-center">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Account Number</p>
          <p className="text-[28px] font-bold text-blue-900 tracking-wider">{ACCOUNT_NUM}</p>
          <p className="text-[12px] text-gray-500 mt-0.5">{ACCOUNT_NAME}</p>
        </div>
        {/* 48px buttons — exceed 44px requirement */}
        <button style={{ height: 48 }} className="w-full bg-green-700 text-white rounded-xl text-[14px] font-bold active:scale-95 transition-all">
          📋  Copy Account Number
        </button>
        <button style={{ height: 48 }} className="w-full bg-white text-green-700 border-2 border-green-600 rounded-xl text-[14px] font-bold active:scale-95 transition-all">
          🔍  Show Full-Screen QR
        </button>
        <button style={{ height: 48 }} className="w-full bg-white text-blue-700 border border-gray-200 rounded-xl text-[14px] font-semibold active:scale-95 transition-all">
          📤  Share via WhatsApp
        </button>
      </div>
    </div>
  );

  // ── A6: History ──────────────────────────────────────────────────────────
  const renderHistory = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="History" onBack={back} bg="bg-slate-700" />
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
        {txList.map((tx) => (
          <div key={tx.id} className="bg-white rounded-xl p-3.5 flex items-center gap-3 border border-gray-100 active:bg-gray-50 active:scale-[0.99]" style={{ minHeight: 64 }}>
            <TxBadge type={tx.type} large={false} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-[13px]">{tx.label}</p>
              <p className="text-[11px] text-gray-500 truncate">{tx.sub}</p>
              <p className="text-[10px] text-gray-400">{tx.date} · {tx.time}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-bold text-[15px] ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}৳{Math.abs(tx.amount).toLocaleString()}
              </p>
              <p className="text-[10px] text-blue-500 mt-0.5">Details →</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Bill ─────────────────────────────────────────────────────────────────
  const renderBill = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Bill Payment" onBack={back} bg="bg-purple-700" />
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        <p className="font-bold text-gray-900 text-[15px]">Select Bill Type</p>
        <div className="grid grid-cols-2 gap-2.5">
          {['⚡  Electricity', '🔥  Gas', '💧  Water', '🌐  Internet'].map((b) => (
            <button
              key={b}
              onClick={() => setBillType(b)}
              style={{ height: 56 }}
              className={`rounded-xl font-semibold text-[13px] border-2 active:scale-95 transition-all
                ${billType === b ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-800 border-gray-200'}`}
            >
              {b}
            </button>
          ))}
        </div>
        {billType && (
          <>
            <p className="font-bold text-gray-900 text-[15px]">Meter / Account Number</p>
            <div className="bg-white border-2 border-purple-200 rounded-xl p-3 text-center">
              <p className="text-[26px] font-bold text-purple-900 tracking-widest min-h-[36px]">
                {billNum || <span className="text-gray-300 text-xl">Enter number</span>}
              </p>
            </div>
            <NumPad value={billNum} onChange={setBillNum} maxLen={12} />
            <button
              onClick={() => { if (billNum.length >= 6) doLoad('Bill Paid!', `${billType.replace(/^\S+\s+/, '')} bill paid`); }}
              disabled={billNum.length < 6}
              style={{ height: 48 }}
              className="w-full bg-purple-700 text-white rounded-xl text-[15px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              ⚡  Pay Now
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── Recharge ─────────────────────────────────────────────────────────────
  const renderRecharge = () => (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Mobile Recharge" onBack={back} bg="bg-orange-600" />
      <div className="flex-1 px-4 py-4 space-y-3 overflow-y-auto">
        <p className="font-bold text-gray-900 text-[15px]">Enter Mobile Number</p>
        <div className="bg-white border-2 border-orange-200 rounded-xl p-3 text-center">
          <p className="text-[26px] font-bold text-orange-800 tracking-widest min-h-[36px]">
            {rchNum || <span className="text-gray-300 text-xl">017XXXXXXXX</span>}
          </p>
        </div>
        <NumPad value={rchNum} onChange={setRchNum} maxLen={11} />
        {rchNum.length >= 10 && (
          <>
            <p className="font-bold text-gray-900 text-[15px]">Select Amount</p>
            <div className="grid grid-cols-3 gap-2">
              {['20', '50', '100', '200', '300', '500'].map((a) => (
                <button
                  key={a}
                  onClick={() => setRchAmt(a)}
                  style={{ height: 52 }}
                  className={`rounded-xl font-bold text-[16px] border-2 active:scale-95 transition-all
                    ${rchAmt === a ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-800 border-gray-200'}`}
                >
                  ৳{a}
                </button>
              ))}
            </div>
            {rchAmt && (
              <button
                onClick={() => doLoad('Recharge Done!', `৳${rchAmt} added to ${rchNum}`)}
                style={{ height: 48 }}
                className="w-full bg-orange-600 text-white rounded-xl text-[15px] font-bold active:scale-95 transition-all"
              >
                📱  Recharge Now
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── A8: Loading ──────────────────────────────────────────────────────────
  const renderLoading = () => (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center px-6 gap-6">
      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center text-[40px] anim-vibrate">
        📤
      </div>
      <div className="w-full space-y-2.5 text-center">
        <h2 className="text-[20px] font-bold text-gray-900">Processing...</h2>
        <p className="text-[13px] text-gray-500">Securing your transaction. Please wait.</p>
        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: 8 }}>
          <div className="anim-progress bg-blue-800 h-full rounded-full" />
        </div>
      </div>
      {/* Multi-modal feedback indicators */}
      <div className="w-full bg-white rounded-xl p-4 border border-gray-100">
        <p className="text-[11px] text-gray-400 uppercase tracking-wider font-semibold mb-3">Feedback Notifications</p>
        <div className="flex justify-around">
          {[
            { icon: '📳', label: 'Vibration', desc: 'Active now' },
            { icon: '🔊', label: 'Sound', desc: 'Chime on done' },
            { icon: '✅', label: 'Visual', desc: 'Green on done' },
          ].map(({ icon, label, desc }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 text-center">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-[20px]">{icon}</div>
              <p className="text-[11px] font-semibold text-gray-700">{label}</p>
              <p className="text-[10px] text-gray-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── Success ──────────────────────────────────────────────────────────────
  const renderSuccess = () => (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center px-5 gap-5">
      <div className="anim-success">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center text-[48px]">✅</div>
      </div>
      <div className="text-center space-y-1.5 anim-fade-up w-full">
        <h2 className="text-[26px] font-bold text-green-700">{sucMsg}</h2>
        <p className="text-[14px] text-gray-600">{sucDet}</p>
        <p className="text-[10px] text-gray-400">Ref: TXN{Date.now().toString().slice(-8)} · 28 Sep 2026</p>
      </div>
      {/* Receipt card */}
      <div className="w-full bg-white rounded-xl p-4 border border-gray-100 space-y-2">
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">Status</span>
          <span className="font-semibold text-green-600">✓ Completed</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">Time</span>
          <span className="font-semibold">9:41 AM, 28 Sep 2026</span>
        </div>
        <div className="flex justify-between text-[13px]">
          <span className="text-gray-500">Balance after</span>
          <span className="font-semibold">৳ {(BALANCE - parseFloat(amt || '0')).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
      </div>
      {/* Done — 48px (exceeds 44px requirement) */}
      <button
        onClick={home}
        style={{ height: 48 }}
        className="w-full bg-green-600 text-white rounded-xl text-[15px] font-bold active:scale-95 transition-all shadow-sm"
      >
        ✓  Done
      </button>
    </div>
  );

  // ── Screen Router ────────────────────────────────────────────────────────
  const renderScreen = () => {
    switch (scr) {
      case 'home':    return renderHome();
      case 'balance': return renderBalance();
      case 'send1':   return renderSend1();
      case 'send2':   return renderSend2();
      case 'confirm': return renderConfirm();
      case 'receive': return renderReceive();
      case 'history': return renderHistory();
      case 'bill':    return renderBill();
      case 'recharge':return renderRecharge();
      case 'loading': return renderLoading();
      case 'success': return renderSuccess();
      default:        return renderHome();
    }
  };

  const hasBottomTabs = !['loading', 'success'].includes(scr);

  return (
    <div className="flex flex-col h-full relative">
      {/* Screen content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {renderScreen()}
      </div>

      {/* Bottom Tab Bar */}
      {hasBottomTabs && (
        <BottomTabs
          active={activeTab}
          onTab={handleTab}
          onHelp={() => setShowHelp(true)}
        />
      )}

      {/* Floating Help Beacon — above tab bar when on scrollable screens */}
      {showBeacon && !showHelp && (
        <HelpBeacon onTap={() => setShowHelp(true)} />
      )}

      {/* A7: Help Overlay */}
      {showHelp && (
        <HelpOverlay
          screen={scr}
          onClose={() => setShowHelp(false)}
        />
      )}
    </div>
  );
}
