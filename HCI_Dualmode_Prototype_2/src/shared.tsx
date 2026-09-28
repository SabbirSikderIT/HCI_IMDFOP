// Shared visual components used by both modes

function qrCell(r: number, c: number): boolean {
  const N = 21;
  const finder = (r0: number, c0: number) => {
    const dr = r - r0, dc = c - c0;
    if (dr < 0 || dr > 6 || dc < 0 || dc > 6) return null;
    return dr === 0 || dr === 6 || dc === 0 || dc === 6 || (dr >= 2 && dr <= 4 && dc >= 2 && dc <= 4);
  };
  const tl = finder(0, 0);       if (tl !== null) return tl;
  const tr = finder(0, N - 7);   if (tr !== null) return tr;
  const bl = finder(N - 7, 0);   if (bl !== null) return bl;
  if ((r === 6 && c > 7 && c < N - 7) || (c === 6 && r > 7 && r < N - 7)) return (r + c) % 2 === 0;
  if (r >= 16 && r <= 20 && c >= 16 && c <= 20) {
    const dr = r - 18, dc = c - 18;
    return Math.abs(dr) === 2 || Math.abs(dc) === 2 || (dr === 0 && dc === 0);
  }
  return ((r * 11 + c * 7 + (r ^ c) * 3) % 13) > 5;
}

export const QRCode = ({ size = 180 }: { size?: number }) => {
  const N = 21, cs = size / N;
  return (
    <div className="p-3 bg-white border-4 border-gray-900 rounded-xl">
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${N}, ${cs}px)`, width: size, height: size }}>
        {Array.from({ length: N * N }, (_, i) => (
          <div
            key={i}
            style={{ width: cs, height: cs }}
            className={qrCell(Math.floor(i / N), i % N) ? 'bg-gray-900' : 'bg-white'}
          />
        ))}
      </div>
    </div>
  );
};

const TX_CONFIG: Record<string, { bg: string; text: string; icon: string }> = {
  received: { bg: 'bg-green-100', text: 'text-green-700', icon: '↓' },
  sent:     { bg: 'bg-red-100',   text: 'text-red-700',   icon: '↑' },
  bill:     { bg: 'bg-purple-100',text: 'text-purple-700', icon: '⚡' },
  recharge: { bg: 'bg-orange-100',text: 'text-orange-700', icon: '📱' },
};

export const TxBadge = ({ type, large = true }: { type: string; large?: boolean }) => {
  const { bg, text, icon } = TX_CONFIG[type] ?? TX_CONFIG.sent;
  const sz = large ? 'w-12 h-12 text-xl' : 'w-10 h-10 text-lg';
  return (
    <div className={`${sz} ${bg} ${text} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {icon}
    </div>
  );
};
