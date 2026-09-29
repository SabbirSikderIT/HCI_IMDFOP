import { useState } from 'react';

type Screen = 'home' | 'prayer' | 'qibla' | 'tasbih' | 'duas';

interface Props {
  screen: Screen;
  setScreen: (s: Screen) => void;
}

const PRAYER_TIMES = [
  { name: 'Fajr', time: '5:12 AM', icon: '🌙', passed: true },
  { name: 'Dhuhr', time: '12:34 PM', icon: '☀️', passed: true },
  { name: 'Asr', time: '3:45 PM', icon: '🌤', passed: false, next: true },
  { name: 'Maghrib', time: '6:22 PM', icon: '🌅', passed: false },
  { name: 'Isha', time: '7:50 PM', icon: '🌃', passed: false },
];

const DUAS = [
  { name: 'Morning Dhikr', arabic: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ', trans: 'We have entered the morning and the kingdom belongs to Allah.' },
  { name: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', trans: 'In the name of Allah.' },
  { name: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ', trans: 'All praise is for Allah.' },
];

const NAV = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'prayer', icon: '🕌', label: 'Prayers' },
  { id: 'qibla', icon: '🧭', label: 'Qibla' },
  { id: 'tasbih', icon: '📿', label: 'Tasbih' },
  { id: 'duas', icon: '📖', label: 'Duas' },
];

export default function AssistedPhone({ screen, setScreen }: Props) {
  const [count, setCount] = useState(0);
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <PhoneShell>
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs font-medium" style={{ color: '#0d3535' }}>
        <span>9:41</span>
        <span>●●●○ WiFi</span>
      </div>

      {/* Content */}
      <div className="flex-1 scroll-hidden overflow-y-auto relative">
        {screen === 'home' && <HomeScreen setScreen={setScreen} />}
        {screen === 'prayer' && <PrayerScreen />}
        {screen === 'qibla' && <QiblaScreen />}
        {screen === 'tasbih' && <TasbihScreen count={count} setCount={setCount} />}
        {screen === 'duas' && <DuasScreen />}

        {/* Help Beacon (FAB) */}
        {!helpOpen && (
          <button
            onClick={() => setHelpOpen(true)}
            className="absolute bottom-3 right-3 rounded-full shadow-lg flex items-center justify-center transition-transform active:scale-90 z-20"
            style={{
              width: 44,
              height: 44,
              background: '#d4a017',
              color: '#fff',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 18,
              fontWeight: 700,
              boxShadow: '0 4px 16px rgba(180,135,10,0.45)',
            }}
            aria-label="Help"
          >
            ?
          </button>
        )}

        {/* Help Overlay */}
        {helpOpen && (
          <div
            className="absolute inset-0 z-30 flex flex-col justify-end"
            style={{ background: 'rgba(10,42,42,0.65)' }}
          >
            <div
              className="rounded-t-3xl p-5"
              style={{ background: '#faf8f3' }}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 style={{ fontFamily: 'Lora, serif', fontSize: 16, fontWeight: 600, color: '#0d3535' }}>
                  How to use this screen
                </h3>
                <button
                  onClick={() => setHelpOpen(false)}
                  style={{ fontSize: 18, color: '#2d8080', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
              <ul style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, color: '#1a5454', lineHeight: 1.7 }}>
                <li>① Tap a prayer row to set a reminder</li>
                <li>② The highlighted row is your next prayer</li>
                <li>③ Tap the nav icons below to switch screens</li>
                <li>④ Tap <strong>?</strong> anytime for context help</li>
              </ul>
              <button
                onClick={() => setHelpOpen(false)}
                className="mt-4 w-full rounded-xl"
                style={{
                  height: 44,
                  background: '#134040',
                  color: '#d0ecec',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Got it
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom nav — 44px targets */}
      <nav className="flex border-t" style={{ borderColor: '#d0ecec', background: '#faf8f3' }}>
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors"
            style={{
              height: 52,
              background: screen === item.id ? '#eaf5f5' : 'transparent',
              color: screen === item.id ? '#1a5454' : '#3d9999',
              fontFamily: 'Poppins, sans-serif',
            }}
          >
            <span style={{ fontSize: 16 }}>{item.icon}</span>
            <span style={{ fontSize: 9, fontWeight: 600 }}>{item.label}</span>
          </button>
        ))}
      </nav>
    </PhoneShell>
  );
}

function HomeScreen({ setScreen }: { setScreen: (s: Screen) => void }) {
  return (
    <div className="px-3 pt-2 pb-2">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 17, fontWeight: 600, marginBottom: 2 }}>
        As-salamu alaykum
      </h2>
      <p style={{ fontFamily: 'Poppins, sans-serif', color: '#2d8080', fontSize: 11, marginBottom: 10 }}>
        Tuesday, 29 Sept 2026
      </p>
      {/* Next prayer strip */}
      <div
        className="rounded-xl flex items-center justify-between px-4 mb-3"
        style={{ height: 56, background: '#134040', color: '#d0ecec' }}
      >
        <div>
          <p style={{ fontSize: 10, fontFamily: 'Poppins, sans-serif', opacity: 0.7 }}>Next Prayer</p>
          <p style={{ fontSize: 17, fontFamily: 'Lora, serif', fontWeight: 600 }}>🌤 Asr · 3:45 PM</p>
        </div>
        <span style={{ fontSize: 11, color: '#e8b830', fontFamily: 'Poppins, sans-serif' }}>in 1h 20m →</span>
      </div>
      {/* List layout with icons */}
      {[
        { label: 'Prayer Times', icon: '🕌', id: 'prayer', sub: '5 daily prayers' },
        { label: 'Qibla Direction', icon: '🧭', id: 'qibla', sub: '330° NNW' },
        { label: 'Tasbih Counter', icon: '📿', id: 'tasbih', sub: 'Tap to count' },
        { label: 'Daily Duas', icon: '📖', id: 'duas', sub: '3 supplications' },
      ].map((item) => (
        <button
          key={item.label}
          onClick={() => setScreen(item.id as Screen)}
          className="w-full flex items-center gap-3 rounded-xl px-3 mb-2 transition-all active:bg-teal-50"
          style={{
            height: 52,
            background: '#faf8f3',
            border: '1.5px solid #d0ecec',
            textAlign: 'left',
          }}
        >
          <span style={{ fontSize: 20 }}>{item.icon}</span>
          <div>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 13, fontWeight: 600, color: '#0d3535' }}>{item.label}</p>
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10, color: '#3d9999' }}>{item.sub}</p>
          </div>
          <span style={{ marginLeft: 'auto', color: '#3d9999', fontSize: 14 }}>›</span>
        </button>
      ))}
    </div>
  );
}

function PrayerScreen() {
  return (
    <div className="px-3 pt-2">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Prayer Times
      </h2>
      <div className="flex flex-col gap-2">
        {PRAYER_TIMES.map((p) => (
          <div
            key={p.name}
            className="flex items-center justify-between rounded-xl px-3"
            style={{
              height: 52,
              background: p.next ? '#134040' : p.passed ? '#f0f0ee' : '#faf8f3',
              border: p.next ? 'none' : '1.5px solid #d0ecec',
            }}
          >
            <div className="flex items-center gap-2">
              <span style={{ fontSize: 16 }}>{p.icon}</span>
              <span
                style={{
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: 13,
                  fontWeight: p.next ? 600 : 500,
                  color: p.next ? '#d0ecec' : p.passed ? '#888' : '#0d3535',
                }}
              >
                {p.name}
              </span>
              {p.next && (
                <span
                  className="rounded-full px-2 py-0.5"
                  style={{ background: '#e8b830', color: '#0a2a2a', fontSize: 9, fontFamily: 'Poppins, sans-serif', fontWeight: 700 }}
                >
                  NEXT
                </span>
              )}
            </div>
            <span
              style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: 12,
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

function QiblaScreen() {
  return (
    <div className="px-3 pt-2 flex flex-col items-center">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>
        Qibla Direction
      </h2>
      <div
        className="rounded-full flex items-center justify-center relative mb-3"
        style={{ width: 160, height: 160, background: '#eaf5f5', border: '3px solid #d0ecec' }}
      >
        {['N', 'E', 'S', 'W'].map((d, i) => (
          <span
            key={d}
            style={{
              position: 'absolute',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 10,
              fontWeight: 600,
              color: '#2d8080',
              top: i === 0 ? 6 : i === 2 ? 'auto' : '50%',
              bottom: i === 2 ? 6 : 'auto',
              left: i === 3 ? 6 : i === 1 ? 'auto' : '50%',
              right: i === 1 ? 6 : 'auto',
              transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
            }}
          >
            {d}
          </span>
        ))}
        <div style={{ transform: 'rotate(-30deg)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <div style={{ width: 3, height: 50, background: '#e8b830', borderRadius: 2 }} />
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              borderBottom: '12px solid #e8b830',
              position: 'absolute',
              top: 0,
            }}
          />
        </div>
        <div
          className="absolute"
          style={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            background: '#134040',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div
        className="rounded-xl px-4 py-2 text-center mb-3"
        style={{ background: '#134040', color: '#d0ecec', fontFamily: 'Poppins, sans-serif' }}
      >
        <p style={{ fontSize: 12, fontWeight: 600 }}>✓ You are facing Qibla</p>
        <p style={{ fontSize: 10, opacity: 0.7 }}>330° · NNW from your location</p>
      </div>
      <button
        className="rounded-xl w-full"
        style={{
          height: 44,
          background: '#eaf5f5',
          border: '1.5px solid #d0ecec',
          color: '#1a5454',
          fontFamily: 'Poppins, sans-serif',
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        🔄 Calibrate Compass
      </button>
    </div>
  );
}

function TasbihScreen({ count, setCount }: { count: number; setCount: (n: number) => void }) {
  return (
    <div className="px-3 pt-2 flex flex-col items-center gap-3">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 16, fontWeight: 600 }}>
        Tasbih Counter
      </h2>
      <div
        className="rounded-full flex items-center justify-center"
        style={{
          width: 120,
          height: 120,
          background: '#134040',
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(13,53,53,0.35)',
        }}
        onClick={() => setCount(count + 1)}
      >
        <span style={{ fontFamily: 'Lora, serif', fontSize: 30, fontWeight: 700, color: '#e8b830' }}>
          {count}
        </span>
      </div>
      <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 11, color: '#2d8080' }}>Tap to count • Vibration feedback</p>
      {/* Progress indicator */}
      <div className="w-full">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10, color: '#2d8080' }}>Progress to 33</span>
          <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10, color: '#2d8080' }}>{Math.min(count, 33)}/33</span>
        </div>
        <div className="w-full rounded-full overflow-hidden" style={{ height: 6, background: '#d0ecec' }}>
          <div
            style={{
              height: '100%',
              width: `${Math.min((count / 33) * 100, 100)}%`,
              background: '#e8b830',
              borderRadius: 99,
              transition: 'width 0.2s',
            }}
          />
        </div>
      </div>
      <div className="flex gap-2 w-full">
        {[33, 99].map((n) => (
          <button
            key={n}
            onClick={() => setCount(n)}
            className="flex-1 rounded-xl"
            style={{
              height: 44,
              background: '#eaf5f5',
              border: '1.5px solid #d0ecec',
              color: '#134040',
              fontFamily: 'Poppins, sans-serif',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Set {n}
          </button>
        ))}
        <button
          onClick={() => setCount(0)}
          className="flex-1 rounded-xl"
          style={{
            height: 44,
            background: '#fdf3d4',
            border: '1.5px solid #e8b830',
            color: '#b5860a',
            fontFamily: 'Poppins, sans-serif',
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function DuasScreen() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div className="px-3 pt-2">
      <h2 style={{ fontFamily: 'Lora, serif', color: '#0d3535', fontSize: 16, fontWeight: 600, marginBottom: 10 }}>
        Daily Supplications
      </h2>
      <div className="flex flex-col gap-2">
        {DUAS.map((d, i) => (
          <div
            key={d.name}
            className="rounded-xl overflow-hidden"
            style={{ background: '#faf8f3', border: '1.5px solid #d0ecec' }}
          >
            <button
              className="w-full flex items-center justify-between px-3"
              style={{ height: 44, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: 12, fontWeight: 600, color: '#1a5454' }}>
                {d.name}
              </span>
              <span style={{ color: '#3d9999', fontSize: 14 }}>{expanded === i ? '▲' : '▼'}</span>
            </button>
            {expanded === i && (
              <div className="px-3 pb-3">
                <p style={{ fontFamily: 'Lora, serif', fontSize: 15, color: '#0d3535', textAlign: 'right', marginBottom: 4, direction: 'rtl' }}>
                  {d.arabic}
                </p>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: 10, color: '#2d8080', lineHeight: 1.5 }}>
                  {d.trans}
                </p>
                <div className="flex gap-2 mt-2">
                  <button style={{ flex: 1, height: 36, background: '#134040', color: '#d0ecec', fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600, borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                    🔊 Read
                  </button>
                  <button style={{ flex: 1, height: 36, background: '#eaf5f5', color: '#1a5454', fontFamily: 'Poppins, sans-serif', fontSize: 11, fontWeight: 600, borderRadius: 8, border: '1.5px solid #d0ecec', cursor: 'pointer' }}>
                    ⭐ Bookmark
                  </button>
                </div>
              </div>
            )}
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
        width: 300,
        height: 580,
        background: '#faf8f3',
        border: '7px solid #0a2a2a',
        boxShadow: '0 24px 64px rgba(10,42,42,0.35), inset 0 0 0 1px rgba(255,255,255,0.15)',
      }}
    >
      {/* Notch */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 z-10 rounded-b-2xl"
        style={{ width: 90, height: 26, background: '#0a2a2a' }}
      />
      <div style={{ height: 26 }} />
      {children}
    </div>
  );
}
