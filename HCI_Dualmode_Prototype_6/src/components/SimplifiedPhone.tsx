import { useState } from 'react';

type Screen = 'home' | 'prayer' | 'qibla' | 'tasbih' | 'duas';

interface Props {
  screen: Screen;
  setScreen: (s: Screen) => void;
}

const PRAYER_TIMES = [
  { name: 'Fajr', time: '5:12 AM', passed: true },
  { name: 'Dhuhr', time: '12:34 PM', passed: true },
  { name: 'Asr', time: '3:45 PM', passed: false, next: true },
  { name: 'Maghrib', time: '6:22 PM', passed: false },
  { name: 'Isha', time: '7:50 PM', passed: false },
];

const DUAS = [
  { name: 'Morning Dhikr', arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', trans: 'We have entered the morning and the kingdom belongs to Allah.' },
  { name: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', trans: 'In the name of Allah.' },
  { name: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ', trans: 'All praise is for Allah.' },
];

export default function SimplifiedPhone({ screen, setScreen }: Props) {
  const [count, setCount] = useState(0);

  return (
    <PhoneShell>
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs font-medium" style={{ color: '#0d3535' }}>
        <span>9:41</span>
        <span>●●●○ WiFi</span>
      </div>

      {/* Content */}
      <div className="flex-1 scroll-hidden overflow-y-auto">
        {screen === 'home' && <HomeScreen setScreen={setScreen} />}
        {screen === 'prayer' && <PrayerScreen />}
        {screen === 'qibla' && <QiblaScreen simplified />}
        {screen === 'tasbih' && <TasbihScreen count={count} setCount={setCount} simplified />}
        {screen === 'duas' && <DuasScreen />}
      </div>

      {/* Bottom nav — 60px targets */}
      <nav className="flex border-t" style={{ borderColor: '#d0ecec', background: '#faf8f3' }}>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{
              height: 64,
              background: screen === item.id ? '#eaf5f5' : 'transparent',
              color: screen === item.id ? '#1a5454' : '#3d9999',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-[10px] font-semibold leading-none">{item.label}</span>
          </button>
        ))}
      </nav>
    </PhoneShell>
  );
}

function HomeScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  const items: { label: string; icon: string; id: Screen; color: string }[] = [
    { label: 'Prayer Times', icon: '🕌', id: 'prayer', color: '#134040' },
    { label: 'Qibla', icon: '🧭', id: 'qibla', color: '#1a5454' },
    { label: 'Tasbih', icon: '📿', id: 'tasbih', color: '#226868' },
    { label: 'Duas', icon: '📖', id: 'duas', color: '#b5860a' },
    { label: 'Settings', icon: '⚙️', id: 'home', color: '#6b6b6b' },
    { label: 'Help', icon: '❓', id: 'home', color: '#2d8080' },
  ];

  return (
    <div className="px-4 pt-3 pb-2">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 20, fontWeight: 600, marginBottom: 4 }}>
        As-salamu alaykum
      </h2>
      <p style={{ fontFamily: 'Poppins, sans-serif', color: '#2d8080', fontSize: 12, marginBottom: 16 }}>
        Tuesday, 29 Sept 2026
      </p>
      {/* Next prayer card */}
      <div
        className="rounded-2xl p-4 mb-4"
        style={{ background: '#134040', color: '#d0ecec' }}
      >
        <p style={{ fontSize: 11, fontFamily: 'Poppins, sans-serif', opacity: 0.7 }}>Next Prayer</p>
        <p style={{ fontSize: 22, fontFamily: 'Lora, serif', fontWeight: 600 }}>Asr</p>
        <p style={{ fontSize: 13, fontFamily: 'Poppins, sans-serif' }}>3:45 PM · in 1 hr 20 min</p>
      </div>
      {/* 2×3 grid of 60px buttons */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => setScreen(item.id)}
            className="flex flex-col items-center justify-center rounded-2xl transition-all active:scale-95"
            style={{
              height: 80,
              background: '#eaf5f5',
              border: '1.5px solid #d0ecec',
              fontFamily: 'Poppins, sans-serif',
              gap: 4,
            }}
          >
            <span style={{ fontSize: 24 }}>{item.icon}</span>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#0d3535' }}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function PrayerScreen() {
  return (
    <div className="px-4 pt-3">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 19, fontWeight: 600, marginBottom: 12 }}>
        Prayer Times
      </h2>
      <div className="flex flex-col gap-2">
        {PRAYER_TIMES.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-xl px-4"
            style={{
              height: 64,
              background: p.next ? '#134040' : p.passed ? '#f0f0ee' : '#faf8f3',
              border: p.next ? 'none' : '1.5px solid #d0ecec',
            }}
          >
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 15,
                fontWeight: p.next ? 600 : 500,
                color: p.next ? '#d0ecec' : p.passed ? '#888' : '#0d3535',
              }}
            >
              {p.name}
            </span>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 14,
                color: p.next ? '#e8b830' : p.passed ? '#aaa' : '#2d8080',
                fontWeight: p.next ? 600 : 400,
              }}
            >
              {p.time}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QiblaScreen({ simplified }: { simplified?: boolean }) {
  return (
    <div className="px-4 pt-3 flex flex-col items-center">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: simplified ? 19 : 16, fontWeight: 600, marginBottom: 12 }}>
        Qibla Direction
      </h2>
      <div
        className="rounded-full flex items-center justify-center relative mb-4"
        style={{
          width: simplified ? 180 : 160,
          height: simplified ? 180 : 160,
          background: '#eaf5f5',
          border: '3px solid #d0ecec',
        }}
      >
        {/* Compass ring */}
        {['N', 'E', 'S', 'W'].map((d, i) => (
          <span
            key={d}
            style={{
              position: 'absolute',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 11,
              fontWeight: 600,
              color: '#2d8080',
              top: i === 0 ? 8 : i === 2 ? 'auto' : '50%',
              bottom: i === 2 ? 8 : 'auto',
              left: i === 3 ? 8 : i === 1 ? 'auto' : '50%',
              right: i === 1 ? 8 : 'auto',
              transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
            }}
          >
            {d}
          </span>
        ))}
        {/* Arrow pointing NNW (~330°) toward Mecca */}
        <div style={{ transform: 'rotate(-30deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 4, height: simplified ? 60 : 50, background: '#e8b830', borderRadius: 2 }} />
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '7px solid transparent',
              borderRight: '7px solid transparent',
              borderBottom: `14px solid #e8b830`,
              position: 'absolute',
              top: 0,
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: '#134040',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div
        className="rounded-2xl px-5 py-3 text-center"
        style={{ background: '#134040', color: '#d0ecec', fontFamily: 'Poppins, sans-serif' }}
      >
        <p style={{ fontSize: simplified ? 14 : 12, fontWeight: 600 }}>You are facing Qibla</p>
        <p style={{ fontSize: 11, opacity: 0.7 }}>330° · NNW from your location</p>
      </div>
    </div>
  );
}

function TasbihScreen({ count, setCount, simplified }: { count: number; setCount: (n: number) => void; simplified?: boolean }) {
  return (
    <div className="px-4 pt-3 flex flex-col items-center gap-4">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: simplified ? 19 : 16, fontWeight: 600 }}>
        Tasbih Counter
      </h2>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: simplified ? 140 : 120,
          height: simplified ? 140 : 120,
          background: '#134040',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(13,53,53,0.35)',
        }}
        onClick={() => setCount(count + 1)}
      >
        <span style={{ fontFamily: 'Lora, serif', fontSize: simplified ? 36 : 30, fontWeight: 700, color: '#e8b830' }}>
          {count}
        </span>
      </div>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#2d8080' }}>
        Tap the circle to count
      </p>
      <div className="flex gap-3 w-full">
        {[33, 99].map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className="flex-1 rounded-xl transition-all active:scale-95"
            style={{
              height: simplified ? 52 : 44,
              background: '#eaf5f5',
              border: '1.5px solid #d0ecec',
              color: '#134040',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Set {n}
          </button>
        ))}
        <button
          onClick={() => setCount(0)}
          className="flex-1 rounded-xl transition-all active:scale-95"
          style={{
            height: simplified ? 52 : 44,
            background: '#fdf3d4',
            border: '1.5px solid #e8b830',
            color: '#b5860a',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function DuasScreen() {
  return (
    <div className="px-4 pt-3">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 19, fontWeight: 600, marginBottom: 12 }}>
        Daily Supplications
      </h2>
      <div className="flex flex-col gap-3">
        {DUAS.map((d) => (
          <div
            key={d.name}
            className="rounded-2xl p-4"
            style={{ background: '#faf8f3', border: '1.5px solid #d0ecec' }}
          >
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600, color: '#1a5454', marginBottom: 6 }}>
              {d.name}
            </p>
            <p style={{ fontFamily: 'Lora, serif', fontSize: 16, color: '#0d3535', textAlign: 'right', marginBottom: 4, direction: 'rtl' }}>
              {d.arabic}
            </p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#2d8080', lineHeight: 1.5 }}>
              {d.trans}
            </p>
            <button
              className="mt-3 rounded-xl px-4 transition-all active:scale-95"
              style={{
                height: 60,
                width: '100%',
                background: '#134040',
                color: '#d0ecec',
                fontFamily: 'Poppins, sans-serif',
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Read Aloud
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="relative rounded-[40px] overflow-hidden flex flex-col shadow-2xl"
      style={{
        width: 320,
        height: 620,
        background: '#faf8f3',
        border: '8px solid #0a2a2a',
        boxShadow: '0 24px 64px rgba(10,42,42,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)',
      }}
    >
      {/* Notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 rounded-b-2xl"
        style={{ width: 100, height: 28, background: '#0a2a2a' }}
      />
      <div style={{ height: 28 }} />
      {children}
    </div>
  );
}

const NAV = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'prayer', icon: '🕌', label: 'Prayers' },
  { id: 'qibla', icon: '🧭', label: 'Qibla' },
  { id: 'tasbih', icon: '📿', label: 'Tasbih' },
  { id: 'duas', icon: '📖', label: 'Duas' },
];

