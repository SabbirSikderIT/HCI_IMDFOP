import { useState } from 'react';
import SimplifiedPhone from './components/SimplifiedPhone';
import AssistedPhone from './components/AssistedPhone';

export default function App() {
  const [simplifiedScreen, setSimplifiedScreen] = useState<'home' | 'prayer' | 'qibla' | 'tasbih' | 'duas'>('home');
  const [assistedScreen, setAssistedScreen] = useState<'home' | 'prayer' | 'qibla' | 'tasbih' | 'duas'>('home');

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-8 gap-8"
      style={{ background: 'linear-gradient(145deg, #e8e2d8 0%, #f0ece4 50%, #e4ddd2 100%)' }}
    >
      {/* Header */}
      <div className="text-center">
        <h1
          className="text-3xl font-semibold tracking-tight"
          style={{ fontFamily: 'Lora, Georgia, serif', color: '#0d3535' }}
        >
          Prayer App — Dual Mode
        </h1>
        <p className="mt-1 text-sm" style={{ fontFamily: 'Poppins, sans-serif', color: '#2d8080' }}>
          HCI Prototype · Group 6 · Accessibility Study
        </p>
      </div>

      {/* Mode labels + phones */}
      <div className="flex flex-col sm:flex-row gap-10 items-start justify-center w-full max-w-3xl">
        {/* Simplified Mode */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{ background: '#134040', color: '#d0ecec', fontFamily: 'Poppins, sans-serif' }}
            >
              Simplified Mode
            </span>
            <span className="text-xs" style={{ color: '#2d8080' }}>60px targets</span>
          </div>
          <SimplifiedPhone screen={simplifiedScreen} setScreen={setSimplifiedScreen} />
        </div>

        {/* Divider */}
        <div className="hidden sm:flex flex-col items-center justify-center self-stretch gap-3 px-2">
          <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#2d8080]/30 to-transparent" />
          <span className="text-xs font-medium" style={{ color: '#2d8080' }}>vs</span>
          <div className="w-px flex-1 bg-gradient-to-b from-transparent via-[#2d8080]/30 to-transparent" />
        </div>

        {/* Assisted Mode */}
        <div className="flex flex-col items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span
              className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase"
              style={{ background: '#b5860a', color: '#fdf3d4', fontFamily: 'Poppins, sans-serif' }}
            >
              Assisted Mode
            </span>
            <span className="text-xs" style={{ color: '#2d8080' }}>44px targets</span>
          </div>
          <AssistedPhone screen={assistedScreen} setScreen={setAssistedScreen} />
        </div>
      </div>

      {/* Footer note */}
      <p className="text-xs text-center" style={{ color: '#3d9999', fontFamily: 'Poppins, sans-serif' }}>
        Tap nav items to explore screens in each mode
      </p>
    </div>
  );
}
