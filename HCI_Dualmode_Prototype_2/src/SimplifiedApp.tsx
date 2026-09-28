import { useState, useEffect } from 'react';
import { txList, BALANCE, ACCOUNT_NUM, ACCOUNT_NAME } from './data';
import { QRCode, TxBadge } from './shared';

type Screen =
  | 'home' | 'balance' | 'send1' | 'send2' | 'confirm' | 'receive'
  | 'history' | 'bill' | 'recharge' | 'loading' | 'success';

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

// ── Back Header ───────────────────────────────────────────────────────────────
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
    <div className={`flex items-center px-4 h-[56px] relative ${fg}`}>
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 h-[56px] pr-4 font-semibold text-[17px] active:opacity-60"
      >
        <svg width="10" height="17" viewBox="0 0 10 17" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8.5 1L1.5 8.5l7 7.5" />
        </svg>
        Back
      </button>
      <span className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold">{title}</span>
    </div>
  </div>
);

// ── Number Pad ────────────────────────────────────────────────────────────────
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
    <div className="grid grid-cols-3 gap-2.5 px-4">
      {keys.map((k, i) => (
        <button
          key={i}
          onClick={() => tap(k)}
          className={`h-[72px] rounded-2xl text-[22px] font-bold transition-transform active:scale-95 select-none
            ${k === '' ? 'pointer-events-none opacity-0' :
              k === '⌫' ? 'bg-red-50 text-red-600 border-2 border-red-200 active:bg-red-100' :
              'bg-gray-100 text-gray-900 border border-gray-200 active:bg-gray-200'}`}
        >
          {k}
        </button>
      ))}
    </div>
  );
};

// ── Main App ──────────────────────────────────────────────────────────────────
export default function SimplifiedApp() {
  const [stack, setStack] = useState<Screen[]>(['home']);
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
  const home = () => { setStack(['home']); setRcpt(''); setAmt(''); setBillType(''); setBillNum(''); setRchNum(''); setRchAmt(''); };

  const doLoad = (msg: string, det: string) => {
    setSucMsg(msg);
    setSucDet(det);
    go('loading');
  };

  useEffect(() => {
    if (scr === 'loading') {
      const t = setTimeout(() => setStack((p) => [...p.slice(0, -1), 'success']), 2200);
      return () => clearTimeout(t);
    }
  }, [scr]);

  // ── S1: Home ──────────────────────────────────────────────────────────────
  if (scr === 'home') return (
    <div className="flex flex-col h-full bg-blue-900">
      <StatusBar light />
      <div className="px-5 pt-1 pb-5 text-white flex-shrink-0">
        <p className="text-sm text-blue-300 font-medium">Welcome back</p>
        <h1 className="text-[22px] font-bold mt-0.5">{ACCOUNT_NAME}</h1>
        <p className="text-xs text-blue-400 mt-0.5">{ACCOUNT_NUM}</p>
      </div>
      <div className="flex-1 bg-slate-50 rounded-t-[32px] flex flex-col overflow-hidden">
        {/* Balance card */}
        <div className="mx-4 mt-5 mb-4 bg-white rounded-2xl p-5 shadow-sm border border-blue-100 flex-shrink-0">
          <p className="text-[13px] text-gray-500 font-medium">Available Balance</p>
          <p className="text-[38px] font-bold text-blue-900 mt-1 leading-none">
            ৳ {BALANCE.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-gray-400 mt-2">Last updated: 9:41 AM, 28 Sep 2026</p>
        </div>
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest px-5 mb-3 flex-shrink-0">Quick Actions</p>
        {/* 2×3 action grid — each button ≥ 90px (exceeds 60px requirement) */}
        <div className="grid grid-cols-2 gap-3 px-4 pb-4 overflow-y-auto">
          {[
            { label: 'Balance Check',      emoji: '💳', color: 'bg-blue-900',   s: 'balance'  },
            { label: 'Send Money',         emoji: '↗️',  color: 'bg-teal-600',   s: 'send1'    },
            { label: 'Receive Money',      emoji: '↙️',  color: 'bg-green-700',  s: 'receive'  },
            { label: 'Bill Payment',       emoji: '⚡',  color: 'bg-purple-700', s: 'bill'     },
            { label: 'Mobile Recharge',    emoji: '📱',  color: 'bg-orange-600', s: 'recharge' },
            { label: 'Transaction History',emoji: '📋',  color: 'bg-slate-700',  s: 'history'  },
          ].map((a) => (
            <button
              key={a.s}
              onClick={() => go(a.s as Screen)}
              style={{ minHeight: 92 }}
              className={`${a.color} text-white rounded-2xl p-4 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm`}
            >
              <span className="text-[32px] leading-none">{a.emoji}</span>
              <span className="text-[14px] font-semibold text-center leading-tight">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // ── S2: Balance ───────────────────────────────────────────────────────────
  if (scr === 'balance') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Balance" onBack={back} />
      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        <div className="bg-blue-900 text-white rounded-2xl p-6 text-center shadow-lg">
          <p className="text-sm text-blue-300">Available Balance</p>
          <p className="text-[48px] font-bold mt-2 leading-none">
            ৳ {refreshed ? '12,580.75' : BALANCE.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </p>
          <p className="text-[11px] text-blue-400 mt-3">{ACCOUNT_NUM} • {ACCOUNT_NAME}</p>
          {refreshed && <p className="text-xs text-green-400 mt-2 font-semibold">✓ Updated just now</p>}
        </div>
        {/* Refresh button — 70px height (exceeds 60px) */}
        <button
          onClick={() => {
            setRefreshing(true);
            setTimeout(() => { setRefreshing(false); setRefreshed(true); }, 1500);
          }}
          disabled={refreshing}
          style={{ height: 70 }}
          className="w-full bg-teal-600 text-white rounded-2xl text-[18px] font-bold flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-70"
        >
          <span className={refreshing ? 'anim-spin' : ''}>⟳</span>
          {refreshing ? 'Refreshing...' : 'Refresh Balance'}
        </button>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 space-y-3">
          <h3 className="font-bold text-gray-900 text-[17px]">Account Details</h3>
          {[
            ['Account Name', ACCOUNT_NAME],
            ['Account Number', ACCOUNT_NUM],
            ['Account Type', 'Mobile Banking'],
            ['Status', '✅ Active'],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-center text-[15px]">
              <span className="text-gray-500">{k}</span>
              <span className="font-semibold text-gray-900">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── S3 Step 1: Enter Recipient ────────────────────────────────────────────
  if (scr === 'send1') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Send Money" onBack={back} />
      <div className="flex-1 flex flex-col py-4 gap-4 overflow-hidden">
        {/* Step indicator */}
        <div className="flex items-center gap-2 px-5 flex-shrink-0">
          <div className="flex-1 h-2 bg-teal-600 rounded-full" />
          <div className="flex-1 h-2 bg-gray-200 rounded-full" />
          <span className="text-xs text-gray-500 font-semibold ml-1">Step 1 / 2</span>
        </div>
        <div className="px-5 flex-shrink-0">
          <h2 className="text-[20px] font-bold text-gray-900">Enter Mobile Number</h2>
          <p className="text-[14px] text-gray-500 mt-0.5">Recipient's 11-digit phone number</p>
        </div>
        {/* Number display */}
        <div className="mx-4 bg-white border-2 border-teal-300 rounded-2xl p-5 text-center flex-shrink-0">
          <p className="text-[38px] font-bold tracking-[0.12em] text-blue-900 min-h-[50px]">
            {rcpt || <span className="text-gray-300 text-3xl">017XXXXXXXX</span>}
          </p>
          <p className="text-xs text-gray-400 mt-2">{rcpt.length} / 11 digits entered</p>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col justify-end gap-4">
          <NumPad value={rcpt} onChange={setRcpt} maxLen={11} />
          <div className="px-4 pb-2">
            <button
              onClick={() => { if (rcpt.length >= 10) go('send2'); }}
              disabled={rcpt.length < 10}
              style={{ height: 68 }}
              className="w-full bg-teal-600 text-white rounded-2xl text-[18px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── S3 Step 2: Enter Amount ───────────────────────────────────────────────
  if (scr === 'send2') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Send Money" onBack={back} />
      <div className="flex-1 flex flex-col py-4 gap-4 overflow-hidden">
        {/* Step indicator */}
        <div className="flex items-center gap-2 px-5 flex-shrink-0">
          <div className="flex-1 h-2 bg-teal-600 rounded-full" />
          <div className="flex-1 h-2 bg-teal-600 rounded-full" />
          <span className="text-xs text-gray-500 font-semibold ml-1">Step 2 / 2</span>
        </div>
        {/* Recipient chip */}
        <div className="mx-4 bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0">👤</div>
          <div>
            <p className="text-[11px] text-gray-500">Sending to</p>
            <p className="font-bold text-blue-900 text-[16px] tracking-wide">{rcpt}</p>
          </div>
        </div>
        {/* Amount display */}
        <div className="mx-4 bg-white border-2 border-teal-300 rounded-2xl p-5 text-center flex-shrink-0">
          <p className="text-[13px] text-gray-500 mb-1">Enter Amount (Taka)</p>
          <p className="text-[44px] font-bold text-teal-700 min-h-[56px]">
            {amt ? `৳ ${amt}` : <span className="text-gray-300">৳ 0</span>}
          </p>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col justify-end gap-4">
          <NumPad value={amt} onChange={setAmt} maxLen={8} allowDot />
          <div className="px-4 pb-2">
            <button
              onClick={() => { if (amt && parseFloat(amt) > 0) go('confirm'); }}
              disabled={!amt || parseFloat(amt) <= 0}
              style={{ height: 68 }}
              className="w-full bg-teal-600 text-white rounded-2xl text-[18px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              Next →
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ── S4: Confirmation ──────────────────────────────────────────────────────
  if (scr === 'confirm') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Confirm Transfer" onBack={back} />
      <div className="flex-1 flex flex-col justify-center px-5 gap-5">
        <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-4">
          <div className="text-center">
            <p className="text-[13px] text-gray-500">You are sending</p>
            <p className="text-[52px] font-bold text-blue-900 mt-1 leading-none">৳ {amt}</p>
          </div>
          <div className="border-t border-gray-100 pt-4 space-y-2.5">
            {[
              ['To', rcpt],
              ['From', ACCOUNT_NUM],
              ['Fee', '৳ 0.00 (Free)'],
              ['Total', `৳ ${amt}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-[15px]">
                <span className="text-gray-500">{k}</span>
                <span className={`font-semibold ${k === 'Fee' ? 'text-green-600' : 'text-gray-900'}`}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[13px] text-gray-500 text-center">Please check all details before confirming.</p>
        {/* Large YES / NO buttons — 80px height (exceeds 60px requirement) */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={home}
            style={{ height: 80 }}
            className="rounded-2xl text-[20px] font-bold bg-red-100 text-red-700 border-2 border-red-200 active:scale-95 transition-all"
          >
            ✕  NO
          </button>
          <button
            onClick={() => doLoad('Money Sent!', `৳${amt} sent to ${rcpt}`)}
            style={{ height: 80 }}
            className="rounded-2xl text-[20px] font-bold bg-green-600 text-white active:scale-95 transition-all shadow-md"
          >
            ✓  YES
          </button>
        </div>
      </div>
    </div>
  );

  // ── S5: Receive Money ─────────────────────────────────────────────────────
  if (scr === 'receive') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Receive Money" onBack={back} bg="bg-green-700" />
      <div className="flex-1 flex flex-col items-center px-5 py-5 gap-5 overflow-y-auto">
        <p className="text-[14px] text-gray-600 text-center">
          Ask the sender to scan your QR code or type your account number
        </p>
        <QRCode size={196} />
        <div className="w-full bg-white rounded-2xl p-5 border border-gray-200 text-center">
          <p className="text-[11px] text-gray-400 uppercase tracking-widest mb-2">Your Account Number</p>
          <p className="text-[32px] font-bold text-blue-900 tracking-wider">{ACCOUNT_NUM}</p>
          <p className="text-[14px] text-gray-500 mt-1">{ACCOUNT_NAME}</p>
        </div>
        {/* Buttons ≥ 70px */}
        <button style={{ height: 70 }} className="w-full bg-green-700 text-white rounded-2xl text-[18px] font-bold active:scale-95 transition-all">
          📋  Copy Account Number
        </button>
        <button style={{ height: 70 }} className="w-full bg-white text-green-700 border-2 border-green-600 rounded-2xl text-[18px] font-bold active:scale-95 transition-all">
          🔍  Show Full-Screen QR
        </button>
      </div>
    </div>
  );

  // ── S6: Transaction History ───────────────────────────────────────────────
  if (scr === 'history') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="History" onBack={back} bg="bg-slate-700" />
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {txList.map((tx) => (
          <div key={tx.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm active:scale-[0.99]">
            <TxBadge type={tx.type} />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 text-[15px] leading-tight">{tx.label}</p>
              <p className="text-[12px] text-gray-500 mt-0.5 truncate">{tx.sub}</p>
              <p className="text-[11px] text-gray-400 mt-0.5">{tx.date} · {tx.time}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <p className={`font-bold text-[17px] ${tx.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {tx.amount > 0 ? '+' : ''}৳ {Math.abs(tx.amount).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // ── Bill Payment ──────────────────────────────────────────────────────────
  if (scr === 'bill') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Bill Payment" onBack={back} bg="bg-purple-700" />
      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        <p className="font-bold text-gray-900 text-[18px]">Select Bill Type</p>
        <div className="grid grid-cols-2 gap-3">
          {['⚡  Electricity', '🔥  Gas', '💧  Water', '🌐  Internet'].map((b) => (
            <button
              key={b}
              onClick={() => setBillType(b)}
              style={{ height: 84 }}
              className={`rounded-2xl font-semibold text-[15px] border-2 transition-all active:scale-95
                ${billType === b ? 'bg-purple-700 text-white border-purple-700' : 'bg-white text-gray-800 border-gray-200'}`}
            >
              {b}
            </button>
          ))}
        </div>
        {billType && (
          <>
            <p className="font-bold text-gray-900 text-[18px]">Meter / Account Number</p>
            <div className="bg-white border-2 border-purple-200 rounded-2xl p-4 text-center">
              <p className="text-[30px] font-bold text-purple-900 tracking-widest min-h-[40px]">
                {billNum || <span className="text-gray-300 text-2xl">Enter number</span>}
              </p>
            </div>
            <NumPad value={billNum} onChange={setBillNum} maxLen={12} />
            <button
              onClick={() => { if (billNum.length >= 6) doLoad('Bill Paid!', `${billType.replace(/^\S+\s+/, '')} bill paid successfully`); }}
              disabled={billNum.length < 6}
              style={{ height: 68 }}
              className="w-full bg-purple-700 text-white rounded-2xl text-[18px] font-bold disabled:opacity-40 active:scale-95 transition-all"
            >
              ⚡  Pay Now
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── Mobile Recharge ───────────────────────────────────────────────────────
  if (scr === 'recharge') return (
    <div className="flex flex-col h-full bg-slate-50">
      <BackHeader title="Mobile Recharge" onBack={back} bg="bg-orange-600" />
      <div className="flex-1 px-4 py-5 space-y-4 overflow-y-auto">
        <p className="font-bold text-gray-900 text-[18px]">Enter Mobile Number</p>
        <div className="bg-white border-2 border-orange-200 rounded-2xl p-4 text-center">
          <p className="text-[30px] font-bold text-orange-800 tracking-widest min-h-[40px]">
            {rchNum || <span className="text-gray-300 text-2xl">017XXXXXXXX</span>}
          </p>
          <p className="text-xs text-gray-400 mt-1">{rchNum.length} / 11 digits</p>
        </div>
        <NumPad value={rchNum} onChange={setRchNum} maxLen={11} />
        {rchNum.length >= 10 && (
          <>
            <p className="font-bold text-gray-900 text-[18px]">Select Amount</p>
            <div className="grid grid-cols-3 gap-2.5">
              {['20', '50', '100', '200', '300', '500'].map((a) => (
                <button
                  key={a}
                  onClick={() => setRchAmt(a)}
                  style={{ height: 72 }}
                  className={`rounded-2xl font-bold text-[20px] border-2 active:scale-95 transition-all
                    ${rchAmt === a ? 'bg-orange-600 text-white border-orange-600' : 'bg-white text-gray-800 border-gray-200'}`}
                >
                  ৳{a}
                </button>
              ))}
            </div>
            {rchAmt && (
              <button
                onClick={() => doLoad('Recharge Done!', `৳${rchAmt} added to ${rchNum}`)}
                style={{ height: 68 }}
                className="w-full bg-orange-600 text-white rounded-2xl text-[18px] font-bold active:scale-95 transition-all"
              >
                📱  Recharge Now
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );

  // ── S7: Loading ───────────────────────────────────────────────────────────
  if (scr === 'loading') return (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center px-8 gap-8">
      <div className="anim-vibrate">
        <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-[48px]">
          📤
        </div>
      </div>
      <div className="w-full space-y-3 text-center">
        <h2 className="text-[22px] font-bold text-gray-900">Processing...</h2>
        <p className="text-[14px] text-gray-500">Please wait. Do not close the app.</p>
        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full overflow-hidden" style={{ height: 20 }}>
          <div className="anim-progress bg-blue-900 h-full rounded-full" />
        </div>
        <p className="text-[12px] text-gray-400">Securing your transaction...</p>
      </div>
      {/* Multi-modal feedback indicators */}
      <div className="flex gap-8">
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-[28px]">📳</div>
          <p className="text-[11px] text-gray-500 font-medium">Vibrating</p>
        </div>
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center text-[28px]">🔊</div>
          <p className="text-[11px] text-gray-500 font-medium">Chime on done</p>
        </div>
      </div>
    </div>
  );

  // ── S8: Success ───────────────────────────────────────────────────────────
  if (scr === 'success') return (
    <div className="flex flex-col h-full bg-slate-50 items-center justify-center px-6 gap-6">
      <div className="anim-success">
        <div className="w-28 h-28 bg-green-100 rounded-full flex items-center justify-center text-[56px]">✅</div>
      </div>
      <div className="text-center space-y-2 anim-fade-up">
        <h2 className="text-[30px] font-bold text-green-700">{sucMsg}</h2>
        <p className="text-[15px] text-gray-600">{sucDet}</p>
        <p className="text-[11px] text-gray-400 mt-2">
          Ref: TXN{Date.now().toString().slice(-8)} · 28 Sep 2026 9:41 AM
        </p>
      </div>
      {/* Done button — 72px height (exceeds 60px requirement) */}
      <button
        onClick={home}
        style={{ height: 72 }}
        className="w-full bg-green-600 text-white rounded-2xl text-[20px] font-bold active:scale-95 transition-all shadow-md"
      >
        ✓  Done
      </button>
    </div>
  );

  return null;
}
