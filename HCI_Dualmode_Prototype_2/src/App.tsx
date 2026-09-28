import SimplifiedApp from './SimplifiedApp';
import AssistedApp from './AssistedApp';

const PhoneFrame = ({ children }: { children: React.ReactNode }) => (
  <div
    className="relative flex-shrink-0"
    style={{ width: 390, height: 868 }}
  >
    {/* Phone body */}
    <div className="absolute inset-0 bg-zinc-900 rounded-[48px] shadow-2xl shadow-black/70">
      {/* Screen glass */}
      <div className="absolute inset-[10px] bg-white rounded-[40px] overflow-hidden">
        {/* Dynamic Island */}
        <div
          className="absolute top-[14px] left-1/2 -translate-x-1/2 bg-black rounded-full z-50"
          style={{ width: 126, height: 37 }}
        />
        <div className="h-full overflow-hidden">{children}</div>
      </div>
      {/* Volume buttons */}
      <div className="absolute -left-[3px] top-[120px] w-[3px] h-8 bg-zinc-700 rounded-l-full" />
      <div className="absolute -left-[3px] top-[168px] w-[3px] h-16 bg-zinc-700 rounded-l-full" />
      <div className="absolute -left-[3px] top-[250px] w-[3px] h-16 bg-zinc-700 rounded-l-full" />
      {/* Power button */}
      <div className="absolute -right-[3px] top-[190px] w-[3px] h-20 bg-zinc-700 rounded-r-full" />
      {/* Home indicator */}
      <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-32 h-[5px] bg-zinc-600 rounded-full" />
    </div>
  </div>
);

const Badge = ({ label, color }: { label: string; color: string }) => (
  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${color}`}>{label}</span>
);

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col" style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 flex-shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">MB</div>
              <h1 className="text-white font-bold text-base">HCI Banking App Prototype</h1>
            </div>
            <p className="text-slate-400 text-xs mt-0.5">Dual-Mode Usability Research — Group 6</p>
          </div>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              Live Prototype
            </div>
            <div className="hidden sm:block text-slate-600">|</div>
            <span className="hidden sm:block text-slate-500">390 × 844 px • iPhone 14</span>
          </div>
        </div>
      </header>

      {/* Mode comparison labels */}
      <div className="flex-shrink-0 py-4 px-4">
        <div
          className="mx-auto flex gap-6 justify-center"
          style={{ maxWidth: 860 }}
        >
          {/* Simplified label */}
          <div className="flex-1 max-w-sm">
            <div className="bg-blue-950/60 border border-blue-800/40 rounded-2xl p-3.5 text-center">
              <p className="text-blue-300 font-bold text-sm tracking-wide">SIMPLIFIED MODE</p>
              <p className="text-blue-400/80 text-xs mt-1">60 px touch targets · text labels only · no gestures</p>
              <div className="flex gap-1.5 justify-center mt-2.5 flex-wrap">
                <Badge label="RQ1: Target Size" color="bg-blue-900/70 text-blue-300" />
                <Badge label="RQ2: Text Labels" color="bg-blue-900/70 text-blue-300" />
              </div>
            </div>
          </div>
          {/* Assisted label */}
          <div className="flex-1 max-w-sm">
            <div className="bg-orange-950/40 border border-orange-800/30 rounded-2xl p-3.5 text-center">
              <p className="text-orange-300 font-bold text-sm tracking-wide">ASSISTED MODE</p>
              <p className="text-orange-400/80 text-xs mt-1">44 px touch targets · Help Beacon · multi-modal feedback</p>
              <div className="flex gap-1.5 justify-center mt-2.5 flex-wrap">
                <Badge label="RQ3: Feedback" color="bg-orange-900/60 text-orange-300" />
                <Badge label="RQ4: Guidance" color="bg-orange-900/60 text-orange-300" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Phones side-by-side */}
      <div className="flex-1 flex items-start justify-center gap-8 px-4 pb-10 overflow-x-auto">
        <div className="flex flex-col items-center gap-3">
          <PhoneFrame>
            <SimplifiedApp />
          </PhoneFrame>
          <p className="text-slate-500 text-xs font-medium tracking-wider uppercase">Simplified Mode</p>
        </div>
        <div className="flex flex-col items-center gap-3">
          <PhoneFrame>
            <AssistedApp />
          </PhoneFrame>
          <p className="text-slate-500 text-xs font-medium tracking-wider uppercase">Assisted Mode</p>
        </div>
      </div>
    </div>
  );
}
