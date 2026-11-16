'use client';
import { useRouter } from 'next/navigation';
import { useMissionStore } from '../../store/missionStore';
import { SCENARIOS } from '../../data/scenarios';

const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  return {
    width: ((seed % 15) / 10 + 1).toFixed(1),
    height: (((seed >> 4) % 15) / 10 + 1).toFixed(1),
    top: ((seed >> 8) % 100).toFixed(1),
    left: ((seed >> 16) % 100).toFixed(1),
  };
});

export default function MissionSelectPage() {
  const router = useRouter();
  const { scenario, setScenario, setPhase } = useMissionStore();

  const handleSelect = (id: string) => {
    setScenario(id);
    setPhase(1);
    router.push('/game');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-50"
            style={{ width: s.width + 'px', height: s.height + 'px', top: s.top + '%', left: s.left + '%' }} />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button onClick={() => router.push('/')} className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Back
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">Select Your Mission</h1>
            <p className="text-slate-400 text-sm mt-1">6 destinations · From the Moon to the stars</p>
          </div>
        </div>

        {/* Mission cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCENARIOS.map((sc, idx) => {
            const isSelected = scenario === sc.id;
            const isLocked = false; // all unlocked for hackathon

            return (
              <button
                key={sc.id}
                onClick={() => handleSelect(sc.id)}
                className={`text-left rounded-2xl border p-5 transition-all hover:scale-[1.02] active:scale-[0.98] ${
                  isSelected
                    ? `${sc.borderColor} bg-slate-800/80 shadow-lg`
                    : 'border-slate-700 bg-slate-900/60 hover:border-slate-500'
                }`}
              >
                {/* Difficulty badge */}
                <div className={`text-xs font-black mb-3 ${sc.color}`}>
                  {sc.difficultyLabel}
                </div>

                {/* Icon + name */}
                <div className="flex items-start gap-3 mb-3">
                  <span className="text-4xl">{sc.icon}</span>
                  <div>
                    <div className="text-lg font-black text-white leading-tight">{sc.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5">📍 {sc.destination}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 mb-4 leading-relaxed">{sc.description}</p>

                {/* Stats */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">⚖️ Mass limit</span>
                    <span className={`font-mono font-bold ${sc.color}`}>{sc.massLimit.toLocaleString()} kg</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">💰 Budget</span>
                    <span className={`font-mono font-bold ${sc.color}`}>${sc.budgetLimit}M</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">🚀 Distance</span>
                    <span className="font-mono text-slate-300 text-right">{sc.distanceKm}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-500">⏱️ Travel time</span>
                    <span className="font-mono text-slate-300">{sc.travelTime}</span>
                  </div>
                </div>

                {/* Difficulty bar */}
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      idx === 0 ? 'bg-sky-400' :
                      idx === 1 ? 'bg-orange-400' :
                      idx === 2 ? 'bg-amber-400' :
                      idx === 3 ? 'bg-purple-400' :
                      idx === 4 ? 'bg-red-400' :
                      'bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400'
                    }`}
                    style={{ width: `${[16, 33, 50, 67, 83, 100][idx]}%` }}
                  />
                </div>
                <div className="text-xs text-slate-600 mt-1 text-right">
                  Difficulty {idx + 1}/6
                </div>

                {isSelected && (
                  <div className={`mt-3 text-xs font-bold text-center ${sc.color}`}>
                    ✓ SELECTED
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-600 text-xs mt-8">
          All missions based on real NASA and ESA mission data
        </p>
      </div>
    </div>
  );
}
