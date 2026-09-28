import { useState, useEffect } from 'react'

// ================================================================
// TYPES
// ================================================================

type AppView = 'compare' | 'simplified' | 'assisted'
type SScreen = 'home' | 'medicine' | 'appointment' | 'emergency' | 'confirm' | 'loading' | 'success'
type AScreen = 'home' | 'medicine' | 'appointment' | 'emergency' | 'loading' | 'success'

interface ConfirmCtx { title: string; message: string; back: SScreen; next: SScreen }

// ================================================================
// DATA
// ================================================================

const MEDICINES = [
  { id: 1, name: 'Metformin 500mg', time: '8:00 AM', purpose: 'Blood sugar', taken: true },
  { id: 2, name: 'Lisinopril 10mg', time: '8:00 AM', purpose: 'Blood pressure', taken: false },
  { id: 3, name: 'Aspirin 81mg', time: '12:00 PM', purpose: 'Heart health', taken: false },
  { id: 4, name: 'Vitamin D 1000IU', time: '8:00 PM', purpose: 'Bone health', taken: false },
]

const APPOINTMENTS = [
  { id: 1, doctor: 'Dr. Sarah Chen', specialty: 'Cardiologist', date: 'Mon, Sep 30', time: '10:00 AM', location: 'Heart Care Clinic' },
  { id: 2, doctor: 'Dr. James Patel', specialty: 'General Practice', date: 'Wed, Oct 2', time: '2:30 PM', location: 'Wellness Center' },
]

const EMERGENCY_CONTACTS = [
  { id: 1, name: 'Emergency Services', role: '911', phone: '911', color: '#991b1b', bg: '#fee2e2' },
  { id: 2, name: 'Dr. Sarah Chen', role: 'Cardiologist', phone: '(555) 234-5678', color: '#1e40af', bg: '#dbeafe' },
  { id: 3, name: 'Maria Rodriguez', role: 'Daughter', phone: '(555) 987-6543', color: '#065f46', bg: '#d1fae5' },
  { id: 4, name: 'Robert Johnson', role: 'Son', phone: '(555) 456-7890', color: '#5b21b6', bg: '#ede9fe' },
]

// ================================================================
// PHONE FRAME
// ================================================================

function PhoneFrame({ children, compact }: { children: React.ReactNode; compact?: boolean }) {
  return (
    <div
      style={{
        width: compact ? 220 : 390,
        height: compact ? 476 : 844,
        background: '#ffffff',
        borderRadius: compact ? 24 : 40,
        overflow: 'hidden',
        boxShadow: compact
          ? '0 8px 30px rgba(0,0,0,0.25), inset 0 0 0 1.5px #374151'
          : '0 30px 80px rgba(0,0,0,0.35), inset 0 0 0 2px #1f2937',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
      }}
    >
      {/* Status bar */}
      <div
        style={{
          height: compact ? 24 : 44,
          background: '#1e3a5f',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: compact ? '0 12px' : '0 20px',
          flexShrink: 0,
        }}
      >
        <span style={{ color: 'white', fontSize: compact ? 9 : 14, fontWeight: 700 }}>9:41</span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <span style={{ color: 'white', fontSize: compact ? 8 : 13 }}>●●●</span>
          <span style={{ color: 'white', fontSize: compact ? 8 : 12 }}>WiFi</span>
          <span style={{ color: 'white', fontSize: compact ? 8 : 12 }}>🔋</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>
  )
}

// ================================================================
// SIMPLIFIED MODE — Bottom Nav
// ================================================================

const S_NAV = [
  { label: 'Home', key: 'home' as SScreen },
  { label: 'Medicine', key: 'medicine' as SScreen },
  { label: 'Appts', key: 'appointment' as SScreen },
  { label: 'Help', key: 'home' as SScreen },
]

function SBottomNav({ active, navigate }: { active: SScreen; navigate: (s: SScreen) => void }) {
  return (
    <div
      style={{
        display: 'flex',
        borderTop: '2px solid #e5e7eb',
        background: 'white',
        flexShrink: 0,
      }}
    >
      {S_NAV.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.key)}
          style={{
            flex: 1,
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: 'Nunito',
            color: active === item.key ? '#1e3a5f' : '#9ca3af',
            background: active === item.key ? '#eff6ff' : 'white',
            border: 'none',
            cursor: 'pointer',
            borderTop: active === item.key ? '3px solid #1e3a5f' : '3px solid transparent',
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}

// ================================================================
// SIMPLIFIED SCREENS
// ================================================================

function SHome({ navigate }: { navigate: (s: SScreen) => void }) {
  const buttons = [
    { label: 'Medicine', screen: 'medicine' as SScreen, color: '#1e40af', bg: '#dbeafe', emoji: '💊' },
    { label: 'Appointments', screen: 'appointment' as SScreen, color: '#065f46', bg: '#d1fae5', emoji: '📅' },
    { label: 'Emergency', screen: 'emergency' as SScreen, color: '#991b1b', bg: '#fee2e2', emoji: '🆘' },
    { label: 'Family', screen: 'emergency' as SScreen, color: '#5b21b6', bg: '#ede9fe', emoji: '👪' },
    { label: 'Settings', screen: 'home' as SScreen, color: '#374151', bg: '#f3f4f6', emoji: '⚙️' },
    { label: 'Help', screen: 'home' as SScreen, color: '#92400e', bg: '#fef3c7', emoji: '❓' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div style={{ background: '#1e3a5f', padding: '16px 20px 20px' }}>
        <p style={{ color: '#93c5fd', fontSize: 15, fontWeight: 600, margin: 0 }}>Monday, September 30</p>
        <h1 style={{ color: 'white', fontSize: 24, fontWeight: 800, margin: '4px 0 0' }}>Good Morning, Margaret</h1>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <span style={{ background: '#fef3c7', color: '#92400e', fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            💊 3 medicines due
          </span>
          <span style={{ background: '#d1fae5', color: '#065f46', fontSize: 13, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>
            📅 1 appointment today
          </span>
        </div>
      </div>
      {/* 2×3 grid */}
      <div style={{ flex: 1, padding: 16, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, overflowY: 'auto' }}>
        {buttons.map((btn) => (
          <button
            key={btn.label}
            onClick={() => navigate(btn.screen)}
            style={{
              height: 120,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              borderRadius: 20,
              background: btn.bg,
              color: btn.color,
              border: `2px solid ${btn.color}33`,
              fontSize: 18,
              fontWeight: 800,
              fontFamily: 'Nunito',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: 34 }}>{btn.emoji}</span>
            <span>{btn.label}</span>
          </button>
        ))}
      </div>
      <SBottomNav active="home" navigate={navigate} />
    </div>
  )
}

function SMedicine({
  navigate,
  setConfirm,
}: {
  navigate: (s: SScreen) => void
  setConfirm: (c: ConfirmCtx) => void
}) {
  const [medicines, setMedicines] = useState(MEDICINES)
  const next = medicines.find((m) => !m.taken)

  const handleTake = () => {
    if (!next) return
    setConfirm({
      title: 'Take Medicine?',
      message: `Mark ${next.name} as taken?`,
      back: 'medicine',
      next: 'loading',
    })
    navigate('confirm')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: '#1e3a5f', padding: '14px 20px 18px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#93c5fd', fontSize: 15, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>Today's Medicines</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Progress */}
        <div style={{ background: '#f0fdf4', border: '2px solid #bbf7d0', borderRadius: 16, padding: '14px 16px', marginBottom: 16 }}>
          <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: '#065f46' }}>
            Progress: {medicines.filter((m) => m.taken).length} of {medicines.length} taken
          </p>
          <div style={{ height: 12, background: '#d1fae5', borderRadius: 8, marginTop: 8, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${(medicines.filter((m) => m.taken).length / medicines.length) * 100}%`,
                background: '#059669',
                borderRadius: 8,
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
        {/* Medicine list */}
        {medicines.map((med) => (
          <div
            key={med.id}
            style={{
              borderRadius: 16,
              border: `2px solid ${med.taken ? '#bbf7d0' : '#e5e7eb'}`,
              background: med.taken ? '#f0fdf4' : 'white',
              padding: '14px 16px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: med.taken ? '#d1fae5' : '#dbeafe',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                flexShrink: 0,
              }}
            >
              💊
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' }}>{med.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>
                {med.time} · {med.purpose}
              </p>
            </div>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: 20,
                background: med.taken ? '#d1fae5' : '#fef3c7',
                color: med.taken ? '#065f46' : '#92400e',
              }}
            >
              {med.taken ? '✓ Taken' : 'Due'}
            </span>
          </div>
        ))}
      </div>
      {/* Big action button */}
      {next && (
        <div style={{ padding: '12px 16px 16px', background: 'white', borderTop: '2px solid #f3f4f6' }}>
          <button
            onClick={handleTake}
            style={{
              width: '100%',
              height: 60,
              background: '#1e40af',
              color: 'white',
              fontSize: 19,
              fontWeight: 800,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
            }}
          >
            💊  Take Next Medicine
          </button>
        </div>
      )}
      <SBottomNav active="medicine" navigate={navigate} />
    </div>
  )
}

function SAppointment({
  navigate,
  setConfirm,
}: {
  navigate: (s: SScreen) => void
  setConfirm: (c: ConfirmCtx) => void
}) {
  const handleBook = () => {
    setConfirm({
      title: 'Book Appointment?',
      message: 'Book with Dr. Emily Brooks on Friday, Oct 4 at 11:00 AM?',
      back: 'appointment',
      next: 'loading',
    })
    navigate('confirm')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: '#1e3a5f', padding: '14px 20px 18px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#93c5fd', fontSize: 15, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>Appointments</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>Upcoming</p>
        {APPOINTMENTS.map((apt) => (
          <div
            key={apt.id}
            style={{
              borderRadius: 16,
              border: '2px solid #e5e7eb',
              background: 'white',
              padding: '14px 16px',
              marginBottom: 12,
            }}
          >
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>
                🩺
              </div>
              <div>
                <p style={{ margin: 0, fontSize: 16, fontWeight: 800, color: '#111827' }}>{apt.doctor}</p>
                <p style={{ margin: '2px 0', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>{apt.specialty}</p>
                <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 700, color: '#1e40af' }}>
                  📅 {apt.date} at {apt.time}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 600, color: '#6b7280' }}>📍 {apt.location}</p>
              </div>
            </div>
          </div>
        ))}

        <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '16px 0 12px' }}>Book New Appointment</p>
        <div style={{ borderRadius: 16, border: '2px solid #e5e7eb', background: 'white', padding: 16, marginBottom: 16 }}>
          {/* Simple form */}
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 15, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Doctor</label>
            <div style={{ height: 52, background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 12, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600, color: '#374151' }}>
              Dr. Emily Brooks — General Practice
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 15, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Date</label>
            <div style={{ height: 52, background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 12, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600, color: '#374151' }}>
              📅  Friday, October 4
            </div>
          </div>
          <div>
            <label style={{ fontSize: 15, fontWeight: 700, color: '#374151', display: 'block', marginBottom: 6 }}>Time</label>
            <div style={{ height: 52, background: '#f9fafb', border: '2px solid #e5e7eb', borderRadius: 12, padding: '0 14px', display: 'flex', alignItems: 'center', fontSize: 16, fontWeight: 600, color: '#374151' }}>
              🕙  11:00 AM
            </div>
          </div>
        </div>
      </div>
      <div style={{ padding: '12px 16px 16px', background: 'white', borderTop: '2px solid #f3f4f6' }}>
        <button
          onClick={handleBook}
          style={{
            width: '100%',
            height: 60,
            background: '#065f46',
            color: 'white',
            fontSize: 19,
            fontWeight: 800,
            fontFamily: 'Nunito',
            border: 'none',
            borderRadius: 16,
            cursor: 'pointer',
          }}
        >
          📅  Book Appointment
        </button>
      </div>
      <SBottomNav active="appointment" navigate={navigate} />
    </div>
  )
}

function SEmergency({ navigate }: { navigate: (s: SScreen) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ background: '#7f1d1d', padding: '14px 20px 18px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#fca5a5', fontSize: 15, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 22, fontWeight: 800, margin: 0 }}>Emergency & Contacts</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
        {/* Big emergency button */}
        <button
          className="animate-pulse-ring"
          style={{
            width: '100%',
            height: 100,
            background: '#dc2626',
            color: 'white',
            fontSize: 22,
            fontWeight: 900,
            fontFamily: 'Nunito',
            border: 'none',
            borderRadius: 20,
            cursor: 'pointer',
            marginBottom: 20,
            letterSpacing: '0.02em',
          }}
        >
          🆘  CALL 911 — EMERGENCY
        </button>
        <p style={{ fontSize: 17, fontWeight: 800, color: '#111827', margin: '0 0 12px' }}>My Contacts</p>
        {EMERGENCY_CONTACTS.slice(1).map((c) => (
          <div
            key={c.id}
            style={{
              borderRadius: 16,
              border: `2px solid ${c.color}22`,
              background: c.bg,
              padding: '14px 16px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 14,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 800, color: '#111827' }}>{c.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 14, fontWeight: 600, color: '#6b7280' }}>{c.role}</p>
            </div>
            <button
              style={{
                height: 60,
                padding: '0 20px',
                background: c.color,
                color: 'white',
                fontSize: 16,
                fontWeight: 800,
                fontFamily: 'Nunito',
                border: 'none',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              📞 Call
            </button>
          </div>
        ))}
        {/* Vibration indicator */}
        <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 14, background: '#fffbeb', border: '2px solid #fde68a' }}>
          <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#92400e' }}>
            📳 Phone will vibrate 3 times when your call connects
          </p>
        </div>
      </div>
      <SBottomNav active="home" navigate={navigate} />
    </div>
  )
}

function SConfirm({
  ctx,
  navigate,
}: {
  ctx: ConfirmCtx
  navigate: (s: SScreen) => void
}) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        zIndex: 50,
      }}
      className="animate-fade-in"
    >
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 28,
          width: '100%',
          maxWidth: 320,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 12 }}>❓</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>{ctx.title}</h2>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#374151', margin: '0 0 24px', lineHeight: 1.5 }}>{ctx.message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate(ctx.back)}
            style={{
              flex: 1,
              height: 60,
              background: '#fee2e2',
              color: '#991b1b',
              fontSize: 20,
              fontWeight: 800,
              fontFamily: 'Nunito',
              border: '2px solid #fca5a5',
              borderRadius: 16,
              cursor: 'pointer',
            }}
          >
            NO
          </button>
          <button
            onClick={() => navigate(ctx.next)}
            style={{
              flex: 1,
              height: 60,
              background: '#059669',
              color: 'white',
              fontSize: 20,
              fontWeight: 800,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 16,
              cursor: 'pointer',
            }}
          >
            YES
          </button>
        </div>
      </div>
    </div>
  )
}

function SLoading({ navigate }: { navigate: (s: SScreen) => void }) {
  useEffect(() => {
    const t = setTimeout(() => navigate('success'), 2400)
    return () => clearTimeout(t)
  }, [navigate])

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'white',
      }}
    >
      <div style={{ fontSize: 56, marginBottom: 24 }}>⏳</div>
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', margin: '0 0 8px', textAlign: 'center' }}>Loading...</h2>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#6b7280', margin: '0 0 32px', textAlign: 'center' }}>Please wait</p>
      {/* Progress bar — 60px height as spec */}
      <div style={{ width: '100%', height: 60, background: '#e5e7eb', borderRadius: 16, overflow: 'hidden', marginBottom: 20 }}>
        <div
          className="animate-progress"
          style={{ height: '100%', background: 'linear-gradient(90deg, #1e40af, #3b82f6)', borderRadius: 16 }}
        />
      </div>
      {/* Haptic indicator */}
      <div style={{ padding: '12px 20px', borderRadius: 14, background: '#fef3c7', border: '2px solid #fde68a', display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: 22 }}>📳</span>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#92400e', lineHeight: 1.4 }}>
          Phone will vibrate when complete
        </p>
      </div>
      <div style={{ marginTop: 12, display: 'flex', gap: 6 }}>
        {['〰️', '〰️', '〰️'].map((w, i) => (
          <span key={i} style={{ fontSize: 20, opacity: 0.5 + i * 0.15 }}>{w}</span>
        ))}
      </div>
    </div>
  )
}

function SSuccess({ navigate }: { navigate: (s: SScreen) => void }) {
  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 32,
        background: 'white',
      }}
      className="animate-slide-up"
    >
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontSize: 26, fontWeight: 900, color: '#065f46', margin: '0 0 10px', textAlign: 'center' }}>Done!</h2>
      <p style={{ fontSize: 18, fontWeight: 600, color: '#374151', margin: '0 0 40px', textAlign: 'center', lineHeight: 1.5 }}>
        Your action was completed successfully.
      </p>
      <button
        onClick={() => navigate('home')}
        style={{
          width: '100%',
          height: 60,
          background: '#1e40af',
          color: 'white',
          fontSize: 19,
          fontWeight: 800,
          fontFamily: 'Nunito',
          border: 'none',
          borderRadius: 16,
          cursor: 'pointer',
        }}
      >
        🏠  Back to Home
      </button>
    </div>
  )
}

function SimplifiedApp() {
  const [screen, setScreen] = useState<SScreen>('home')
  const [prevScreen, setPrevScreen] = useState<SScreen>('home')
  const [confirm, setConfirm] = useState<ConfirmCtx | null>(null)

  const navigate = (s: SScreen) => {
    if (s === 'confirm') {
      setPrevScreen(screen)
    } else {
      setConfirm(null)
    }
    setScreen(s)
  }

  const showConfirm = screen === 'confirm' && confirm

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {(screen === 'home' || (showConfirm && prevScreen === 'home')) && <SHome navigate={navigate} />}
      {(screen === 'medicine' || (showConfirm && prevScreen === 'medicine')) && <SMedicine navigate={navigate} setConfirm={setConfirm} />}
      {(screen === 'appointment' || (showConfirm && prevScreen === 'appointment')) && <SAppointment navigate={navigate} setConfirm={setConfirm} />}
      {screen === 'emergency' && <SEmergency navigate={navigate} />}
      {screen === 'loading' && <SLoading navigate={navigate} />}
      {screen === 'success' && <SSuccess navigate={navigate} />}
      {showConfirm && (
        <SConfirm ctx={confirm} navigate={navigate} />
      )}
    </div>
  )
}

// ================================================================
// ASSISTED MODE — Bottom Nav
// ================================================================

const A_NAV = [
  { label: 'Home', icon: '🏠', key: 'home' as AScreen },
  { label: 'Medicine', icon: '💊', key: 'medicine' as AScreen },
  { label: 'Appts', icon: '📅', key: 'appointment' as AScreen },
  { label: 'Emergency', icon: '🆘', key: 'emergency' as AScreen },
]

function ABottomNav({ active, navigate }: { active: AScreen; navigate: (s: AScreen) => void }) {
  return (
    <div style={{ display: 'flex', borderTop: '1px solid #e5e7eb', background: 'white', flexShrink: 0 }}>
      {A_NAV.map((item) => (
        <button
          key={item.label}
          onClick={() => navigate(item.key)}
          style={{
            flex: 1,
            height: 44,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            fontSize: 9,
            fontWeight: 700,
            fontFamily: 'Nunito',
            color: active === item.key ? '#1d4ed8' : '#9ca3af',
            background: 'white',
            border: 'none',
            cursor: 'pointer',
            borderTop: active === item.key ? '2px solid #1d4ed8' : '2px solid transparent',
          }}
        >
          <span style={{ fontSize: 16 }}>{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  )
}

// ================================================================
// ASSISTED SCREENS
// ================================================================

function AHome({
  navigate,
  onHelp,
}: {
  navigate: (s: AScreen) => void
  onHelp: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ background: '#1e3a5f', padding: '12px 16px 16px' }}>
        <p style={{ color: '#93c5fd', fontSize: 13, fontWeight: 600, margin: 0 }}>Monday, September 30</p>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: '2px 0 0' }}>Good Morning, Margaret</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {/* Stats row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <div style={{ background: '#dbeafe', borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#1e40af' }}>TODAY'S MEDICINES</p>
            <p style={{ margin: '4px 0 0', fontSize: 22, fontWeight: 900, color: '#1e3a5f' }}>1/4 done</p>
          </div>
          <div style={{ background: '#d1fae5', borderRadius: 14, padding: '10px 12px' }}>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#065f46' }}>NEXT APPOINTMENT</p>
            <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 800, color: '#065f46' }}>Today 10 AM</p>
          </div>
        </div>
        {/* Medicine reminders */}
        <p style={{ fontSize: 13, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>
          Medicines Due
        </p>
        {MEDICINES.filter((m) => !m.taken).slice(0, 2).map((med) => (
          <div
            key={med.id}
            style={{
              borderRadius: 14,
              border: '1px solid #e5e7eb',
              background: 'white',
              padding: '10px 12px',
              marginBottom: 8,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 22 }}>💊</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{med.name}</p>
              <p style={{ margin: '1px 0 0', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{med.time}</p>
            </div>
            <button
              onClick={() => navigate('medicine')}
              style={{
                height: 44,
                padding: '0 14px',
                background: '#1d4ed8',
                color: 'white',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Nunito',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              Take
            </button>
          </div>
        ))}
        {/* Upcoming appointment */}
        <p style={{ fontSize: 13, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '14px 0 8px' }}>
          Upcoming
        </p>
        <div
          style={{
            borderRadius: 14,
            border: '1px solid #e5e7eb',
            background: 'white',
            padding: '10px 12px',
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>🩺</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>Dr. Sarah Chen</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 600, color: '#1d4ed8' }}>Today · 10:00 AM</p>
            </div>
            <button
              onClick={() => navigate('appointment')}
              style={{
                height: 44,
                padding: '0 12px',
                background: '#f3f4f6',
                color: '#374151',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'Nunito',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                cursor: 'pointer',
              }}
            >
              View
            </button>
          </div>
        </div>
      </div>
      {/* Floating Help Beacon */}
      <button
        onClick={onHelp}
        className="animate-beacon"
        style={{
          position: 'absolute',
          bottom: 60,
          right: 14,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1d4ed8',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ?
      </button>
      <ABottomNav active="home" navigate={navigate} />
    </div>
  )
}

function AMedicine({
  navigate,
  onHelp,
}: {
  navigate: (s: AScreen) => void
  onHelp: () => void
}) {
  const [medicines, setMedicines] = useState(MEDICINES)

  const markTaken = (id: number) => {
    setMedicines((prev) => prev.map((m) => (m.id === id ? { ...m, taken: true } : m)))
    navigate('loading')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ background: '#1e3a5f', padding: '12px 16px 16px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: 0 }}>Today's Medicines</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', margin: '0 0 10px' }}>
          Swipe right on a card to mark as taken
        </p>
        {medicines.map((med) => (
          <div
            key={med.id}
            style={{
              borderRadius: 14,
              border: `1px solid ${med.taken ? '#bbf7d0' : '#e5e7eb'}`,
              background: med.taken ? '#f0fdf4' : 'white',
              padding: '12px 14px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}
          >
            <span style={{ fontSize: 24 }}>💊</span>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>{med.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{med.time} · {med.purpose}</p>
            </div>
            {med.taken ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: '#065f46', background: '#d1fae5', padding: '4px 10px', borderRadius: 20 }}>✓ Taken</span>
            ) : (
              <button
                onClick={() => markTaken(med.id)}
                style={{
                  height: 44,
                  padding: '0 14px',
                  background: '#1d4ed8',
                  color: 'white',
                  fontSize: 13,
                  fontWeight: 700,
                  fontFamily: 'Nunito',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer',
                }}
              >
                Mark Taken
              </button>
            )}
          </div>
        ))}
        {/* Sound icon indicator */}
        <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 18 }}>🔊</span>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#1e40af' }}>Sound confirmation plays when medicine is marked taken</p>
        </div>
      </div>
      <button
        onClick={onHelp}
        className="animate-beacon"
        style={{
          position: 'absolute',
          bottom: 54,
          right: 14,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1d4ed8',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ?
      </button>
      <ABottomNav active="medicine" navigate={navigate} />
    </div>
  )
}

function AAppointment({ navigate, onHelp }: { navigate: (s: AScreen) => void; onHelp: () => void }) {
  const [booked, setBooked] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ background: '#1e3a5f', padding: '12px 16px 16px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#93c5fd', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: 0 }}>Appointments</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {/* Mini calendar */}
        <div style={{ borderRadius: 14, border: '1px solid #e5e7eb', background: 'white', padding: 14, marginBottom: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
          <p style={{ margin: '0 0 10px', fontSize: 14, fontWeight: 800, color: '#111827' }}>October 2024</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, textAlign: 'center' }}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
              <div key={d} style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', padding: '2px 0' }}>{d}</div>
            ))}
            {[...Array(2)].map((_, i) => <div key={`e${i}`} />)}
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <div
                key={d}
                style={{
                  fontSize: 12,
                  fontWeight: d === 2 || d === 4 ? 800 : 600,
                  color: d === 2 || d === 4 ? 'white' : d === 30 ? '#1d4ed8' : '#374151',
                  background: d === 2 || d === 4 ? '#1d4ed8' : d === 30 ? '#dbeafe' : 'transparent',
                  borderRadius: 6,
                  padding: '3px 0',
                  cursor: 'pointer',
                }}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
        {/* Upcoming */}
        <p style={{ fontSize: 13, fontWeight: 800, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 8px' }}>Upcoming</p>
        {APPOINTMENTS.map((apt) => (
          <div key={apt.id} style={{ borderRadius: 14, border: '1px solid #e5e7eb', background: 'white', padding: '12px 14px', marginBottom: 10, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 22 }}>🩺</span>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#111827' }}>{apt.doctor}</p>
                <p style={{ margin: '1px 0', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{apt.specialty}</p>
                <p style={{ margin: '3px 0 0', fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>{apt.date} · {apt.time}</p>
              </div>
            </div>
          </div>
        ))}
        {!booked ? (
          <button
            onClick={() => { setBooked(true); navigate('loading') }}
            style={{
              width: '100%',
              height: 44,
              background: '#1d4ed8',
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
              marginTop: 8,
            }}
          >
            + Book New Appointment
          </button>
        ) : (
          <div style={{ padding: '10px 14px', borderRadius: 12, background: '#d1fae5', border: '1px solid #6ee7b7', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#065f46' }}>✓ Appointment booked!</p>
          </div>
        )}
      </div>
      <button
        onClick={onHelp}
        className="animate-beacon"
        style={{
          position: 'absolute',
          bottom: 54,
          right: 14,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1d4ed8',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ?
      </button>
      <ABottomNav active="appointment" navigate={navigate} />
    </div>
  )
}

function AEmergency({ navigate, onHelp }: { navigate: (s: AScreen) => void; onHelp: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      <div style={{ background: '#7f1d1d', padding: '12px 16px 16px' }}>
        <button onClick={() => navigate('home')} style={{ color: '#fca5a5', fontSize: 13, fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 4 }}>
          ← Back
        </button>
        <h1 style={{ color: 'white', fontSize: 20, fontWeight: 800, margin: 0 }}>Emergency Contacts</h1>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 14px' }}>
        {EMERGENCY_CONTACTS.map((c) => (
          <div
            key={c.id}
            style={{
              borderRadius: 14,
              border: `1px solid ${c.color}22`,
              background: c.bg,
              padding: '12px 14px',
              marginBottom: 10,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#111827' }}>{c.name}</p>
              <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 600, color: '#6b7280' }}>{c.role} · {c.phone}</p>
            </div>
            <button
              style={{
                height: 44,
                padding: '0 14px',
                background: c.color,
                color: 'white',
                fontSize: 14,
                fontWeight: 700,
                fontFamily: 'Nunito',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: 5,
              }}
            >
              📞 Call
            </button>
          </div>
        ))}
        <div style={{ marginTop: 8, padding: '10px 14px', borderRadius: 12, background: '#fffbeb', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🔊</span>
          <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: '#92400e' }}>Sound + vibration confirms your call connected</p>
        </div>
      </div>
      <button
        onClick={onHelp}
        className="animate-beacon"
        style={{
          position: 'absolute',
          bottom: 54,
          right: 14,
          width: 48,
          height: 48,
          borderRadius: '50%',
          background: '#1d4ed8',
          color: 'white',
          fontSize: 20,
          fontWeight: 900,
          border: 'none',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        ?
      </button>
      <ABottomNav active="emergency" navigate={navigate} />
    </div>
  )
}

const HELP_STEPS = [
  { title: 'Step 1: Find Your Medicine', body: 'Tap the 💊 Medicine tab at the bottom of the screen.', highlight: 'bottom-nav' },
  { title: 'Step 2: Mark as Taken', body: 'Tap the blue "Mark Taken" button next to each medicine.', highlight: 'medicine-btn' },
  { title: 'Step 3: Confirmation', body: 'A green checkmark and sound will confirm the action.', highlight: 'success' },
  { title: 'Need more help?', body: 'Tap the ❓ button anytime to see this guide again.', highlight: 'beacon' },
]

function AHelpOverlay({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const current = HELP_STEPS[step]
  const isLast = step === HELP_STEPS.length - 1

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        zIndex: 60,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 14px 24px',
      }}
      className="animate-fade-in"
    >
      {/* Step indicator */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {HELP_STEPS.map((_, i) => (
          <div
            key={i}
            style={{
              width: i === step ? 20 : 7,
              height: 7,
              borderRadius: 4,
              background: i === step ? 'white' : 'rgba(255,255,255,0.4)',
              transition: 'all 0.25s ease',
            }}
          />
        ))}
      </div>
      {/* Card */}
      <div
        style={{
          background: 'white',
          borderRadius: 24,
          padding: 24,
          width: '100%',
        }}
        className="animate-slide-up"
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Step {step + 1} of {HELP_STEPS.length}
          </span>
          <button onClick={onClose} style={{ fontSize: 18, background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', lineHeight: 1 }}>✕</button>
        </div>
        <h3 style={{ fontSize: 22, fontWeight: 900, color: '#111827', margin: '0 0 10px' }}>{current.title}</h3>
        <p style={{ fontSize: 17, fontWeight: 600, color: '#374151', margin: '0 0 24px', lineHeight: 1.6 }}>{current.body}</p>
        <div style={{ display: 'flex', gap: 10 }}>
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              style={{
                flex: 1,
                height: 44,
                background: '#f3f4f6',
                color: '#374151',
                fontSize: 15,
                fontWeight: 700,
                fontFamily: 'Nunito',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                cursor: 'pointer',
              }}
            >
              ← Back
            </button>
          )}
          <button
            onClick={isLast ? onClose : () => setStep((s) => s + 1)}
            style={{
              flex: 1,
              height: 44,
              background: '#1d4ed8',
              color: 'white',
              fontSize: 15,
              fontWeight: 700,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 12,
              cursor: 'pointer',
            }}
          >
            {isLast ? 'Got it ✓' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ALoading({ navigate }: { navigate: (s: AScreen) => void }) {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => navigate('success'), 2400)
    return () => clearTimeout(t)
  }, [navigate])

  useEffect(() => {
    const i = setInterval(() => setDots((d) => (d + 1) % 4), 500)
    return () => clearInterval(i)
  }, [])

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, background: 'white' }}>
      {/* Spinner */}
      <div
        className="animate-spin"
        style={{
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: '5px solid #e5e7eb',
          borderTopColor: '#1d4ed8',
          marginBottom: 24,
        }}
      />
      <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 6px' }}>Loading{'.'.repeat(dots)}</h2>
      <p style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', margin: '0 0 32px', textAlign: 'center' }}>Just a moment</p>
      {/* Sound indicator */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div style={{ padding: '8px 16px', borderRadius: 24, background: '#eff6ff', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>🔊</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>Sound on</span>
        </div>
        <div style={{ padding: '8px 16px', borderRadius: 24, background: '#fef3c7', border: '1px solid #fde68a', display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 18 }}>📳</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#92400e' }}>Vibrate</span>
        </div>
      </div>
      <p style={{ fontSize: 12, fontWeight: 600, color: '#9ca3af', textAlign: 'center' }}>You'll hear a chime and feel a vibration when done</p>
    </div>
  )
}

function ASuccess({ navigate }: { navigate: (s: AScreen) => void }) {
  return (
    <div
      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 28, background: 'white' }}
      className="animate-slide-up"
    >
      <div style={{ fontSize: 64, marginBottom: 14 }}>✅</div>
      <h2 style={{ fontSize: 24, fontWeight: 900, color: '#065f46', margin: '0 0 8px', textAlign: 'center' }}>Done!</h2>
      <p style={{ fontSize: 16, fontWeight: 600, color: '#374151', margin: '0 0 12px', textAlign: 'center' }}>Action completed successfully.</p>
      <div style={{ display: 'flex', gap: 10, marginBottom: 28, padding: '8px 16px', borderRadius: 12, background: '#eff6ff', border: '1px solid #bfdbfe' }}>
        <span style={{ fontSize: 16 }}>🔊</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#1d4ed8' }}>Confirmation chime played</span>
        <span style={{ fontSize: 16 }}>📳</span>
      </div>
      <button
        onClick={() => navigate('home')}
        style={{
          width: '100%',
          height: 44,
          background: '#1d4ed8',
          color: 'white',
          fontSize: 16,
          fontWeight: 700,
          fontFamily: 'Nunito',
          border: 'none',
          borderRadius: 12,
          cursor: 'pointer',
        }}
      >
        🏠 Back to Home
      </button>
    </div>
  )
}

function AssistedApp() {
  const [screen, setScreen] = useState<AScreen>('home')
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', position: 'relative' }}>
      {screen === 'home' && <AHome navigate={setScreen} onHelp={() => setHelpOpen(true)} />}
      {screen === 'medicine' && <AMedicine navigate={setScreen} onHelp={() => setHelpOpen(true)} />}
      {screen === 'appointment' && <AAppointment navigate={setScreen} onHelp={() => setHelpOpen(true)} />}
      {screen === 'emergency' && <AEmergency navigate={setScreen} onHelp={() => setHelpOpen(true)} />}
      {screen === 'loading' && <ALoading navigate={setScreen} />}
      {screen === 'success' && <ASuccess navigate={setScreen} />}
      {helpOpen && <AHelpOverlay onClose={() => setHelpOpen(false)} />}
    </div>
  )
}

// ================================================================
// COMPARE VIEW
// ================================================================

function CompareView({ onEnter }: { onEnter: (v: 'simplified' | 'assisted') => void }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', padding: '40px 24px', fontFamily: 'Nunito' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          HCI Research Project · Group 6
        </span>
        <h1 style={{ fontSize: 34, fontWeight: 900, color: 'white', margin: '8px 0 6px', lineHeight: 1.15 }}>
          Dual-Mode<br />Mobile Prototype
        </h1>
        <p style={{ fontSize: 16, fontWeight: 600, color: '#94a3b8', margin: 0 }}>
          Medication Reminder + Health Appointment App for Older Adults
        </p>
      </div>

      {/* Side by side */}
      <div
        style={{
          display: 'flex',
          gap: 40,
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          marginBottom: 48,
        }}
      >
        {/* Simplified */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div
            style={{
              background: '#1e293b',
              borderRadius: '20px 20px 0 0',
              padding: '14px 20px 10px',
              width: 260,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Simplified Mode
            </span>
            <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
              RQ1 · RQ2
            </p>
          </div>
          <PhoneFrame compact>
            <SimplifiedApp />
          </PhoneFrame>
          {/* Annotations */}
          <div style={{ width: 260, background: '#1e293b', borderRadius: '0 0 20px 20px', padding: '12px 16px' }}>
            {['60px touch targets', 'Text labels only (no icons)', 'Bottom nav text labels', 'Instant transitions', 'High-contrast colors'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onEnter('simplified')}
            style={{
              marginTop: 14,
              width: 260,
              height: 46,
              background: '#2563eb',
              color: 'white',
              fontSize: 15,
              fontWeight: 800,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            ▶ Enter Simplified Mode
          </button>
        </div>

        {/* VS divider */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 0 0', color: '#475569', fontWeight: 900, fontSize: 18, gap: 6 }}>
          <div style={{ width: 1, height: 60, background: '#334155' }} />
          <span>VS</span>
          <div style={{ width: 1, height: 60, background: '#334155' }} />
        </div>

        {/* Assisted */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <div
            style={{
              background: '#1e293b',
              borderRadius: '20px 20px 0 0',
              padding: '14px 20px 10px',
              width: 260,
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 800, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Assisted Mode
            </span>
            <p style={{ margin: '4px 0 0', fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>
              RQ3 · RQ4
            </p>
          </div>
          <PhoneFrame compact>
            <AssistedApp />
          </PhoneFrame>
          <div style={{ width: 260, background: '#1e293b', borderRadius: '0 0 20px 20px', padding: '12px 16px' }}>
            {['44px touch targets', 'Icons + text labels', 'Floating Help Beacon (FAB)', 'Multi-modal feedback', 'Smart transitions'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '4px 0' }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', flexShrink: 0 }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: '#cbd5e1' }}>{item}</span>
              </div>
            ))}
          </div>
          <button
            onClick={() => onEnter('assisted')}
            style={{
              marginTop: 14,
              width: 260,
              height: 46,
              background: '#059669',
              color: 'white',
              fontSize: 15,
              fontWeight: 800,
              fontFamily: 'Nunito',
              border: 'none',
              borderRadius: 14,
              cursor: 'pointer',
            }}
          >
            ▶ Enter Assisted Mode
          </button>
        </div>
      </div>

      {/* Research questions table */}
      <div style={{ maxWidth: 700, margin: '0 auto', background: '#1e293b', borderRadius: 20, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: 'white' }}>Research Questions</h2>
        </div>
        {[
          { rq: 'RQ1', question: 'Does 60px vs 44px reduce task errors?', mode: 'Simplified', color: '#60a5fa' },
          { rq: 'RQ2', question: 'Do text labels improve first-time completion?', mode: 'Simplified', color: '#60a5fa' },
          { rq: 'RQ3', question: 'Does multi-modal feedback reduce waiting confusion?', mode: 'Assisted', color: '#34d399' },
          { rq: 'RQ4', question: 'Does the Help Beacon reduce support dependency?', mode: 'Assisted', color: '#34d399' },
        ].map((row, i) => (
          <div
            key={row.rq}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 14,
              padding: '12px 20px',
              borderBottom: i < 3 ? '1px solid #334155' : 'none',
              background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
            }}
          >
            <span style={{ fontSize: 13, fontWeight: 800, color: row.color, width: 32 }}>{row.rq}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: '#cbd5e1', flex: 1 }}>{row.question}</span>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '3px 10px',
                borderRadius: 20,
                background: row.color + '22',
                color: row.color,
              }}
            >
              {row.mode}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ================================================================
// FULL-SCREEN MODE WRAPPER
// ================================================================

function FullModeView({
  mode,
  onBack,
}: {
  mode: 'simplified' | 'assisted'
  onBack: () => void
}) {
  const isSimplified = mode === 'simplified'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isSimplified ? '#f8fafc' : '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '24px 16px 40px',
        fontFamily: 'Nunito',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: isSimplified ? '#1e293b' : '#1e293b',
            color: 'white',
            fontSize: 14,
            fontWeight: 700,
            fontFamily: 'Nunito',
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            cursor: 'pointer',
          }}
        >
          ← Compare
        </button>
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: isSimplified ? '#dbeafe' : '#d1fae5',
            fontSize: 13,
            fontWeight: 800,
            color: isSimplified ? '#1e40af' : '#065f46',
          }}
        >
          {isSimplified ? '🔵 Simplified Mode' : '🟢 Assisted Mode'}
        </div>
        {/* Spec badge */}
        <div
          style={{
            padding: '6px 14px',
            borderRadius: 20,
            background: '#1e293b',
            fontSize: 12,
            fontWeight: 700,
            color: '#94a3b8',
          }}
        >
          {isSimplified ? '60px targets' : '44px targets'}
        </div>
      </div>

      {/* Phone */}
      <PhoneFrame>
        {isSimplified ? <SimplifiedApp /> : <AssistedApp />}
      </PhoneFrame>

      {/* Spec callouts */}
      <div
        style={{
          marginTop: 24,
          width: '100%',
          maxWidth: 480,
          background: '#1e293b',
          borderRadius: 16,
          padding: '16px 20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
        }}
      >
        {(isSimplified
          ? [
              { label: 'Touch Target', value: '60 × 60 px', icon: '👆' },
              { label: 'Label Style', value: 'Text only', icon: '🔤' },
              { label: 'Navigation', value: 'Text labels', icon: '📋' },
              { label: 'Transition', value: 'Instant', icon: '⚡' },
              { label: 'Contrast', value: '7:1 (WCAG AAA)', icon: '🎨' },
              { label: 'Font Size', value: '18–24px body', icon: '🔠' },
            ]
          : [
              { label: 'Touch Target', value: '44 × 44 px', icon: '👆' },
              { label: 'Label Style', value: 'Icon + text', icon: '🔤' },
              { label: 'Help Beacon', value: 'FAB floating', icon: '❓' },
              { label: 'Feedback', value: 'Visual+Sound+Haptic', icon: '🔊' },
              { label: 'Transition', value: 'Smart animate', icon: '✨' },
              { label: 'Guidance', value: 'Step-by-step overlay', icon: '📖' },
            ]
        ).map((spec) => (
          <div key={spec.label} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '8px 0' }}>
            <span style={{ fontSize: 18, flexShrink: 0 }}>{spec.icon}</span>
            <div>
              <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{spec.label}</p>
              <p style={{ margin: '2px 0 0', fontSize: 13, fontWeight: 700, color: '#e2e8f0' }}>{spec.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ================================================================
// APP
// ================================================================

export default function App() {
  const [view, setView] = useState<AppView>('compare')

  return (
    <div style={{ fontFamily: 'Nunito', minHeight: '100vh' }}>
      {view === 'compare' && (
        <CompareView onEnter={(m) => setView(m)} />
      )}
      {(view === 'simplified' || view === 'assisted') && (
        <FullModeView mode={view} onBack={() => setView('compare')} />
      )}
    </div>
  )
}
