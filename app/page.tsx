'use client';
import { useMissionStore } from '../store/missionStore';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { players, setPlayers, setPhase } = useMissionStore();
  const router = useRouter();

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(80)].map((_, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-70"
            style={{
              width: Math.random() * 2 + 1 + 'px',
              height: Math.random() * 2 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 text-center max-w-3xl px-6">
        {/* Badge */}
        <div className="inline-block mb-6 px-4 py-1 rounded-full border border-cyan-500/40 bg-cyan-500/10 text-cyan-400 text-sm font-medium">
          NASA Space Apps Challenge 2026
        </div>

        {/* Title */}
        <h1 className="text-6xl font-black tracking-tight mb-4">
          <span className="text-white">MISSION</span>{' '}
          <span className="text-cyan-400">TRADE-OFF</span>
        </h1>

        {/* Tagline */}
        <p className="text-xl text-slate-300 mb-3">
          Every decision shapes the mission.{' '}
          <span className="text-cyan-400 font-semibold">Build smart. Launch far.</span>
        </p>
        <p className="text-slate-400 mb-10 text-base">
          Design, build, and simulate a complete space mission — balancing engineering, environmental impact, and crew health.
        </p>

        {/* 3 Axes */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: '⚙️', label: 'Engineering', desc: 'Mass · Power · Budget · Data' },
            { icon: '🌱', label: 'Environment', desc: 'Emissions · Debris · Resources' },
            { icon: '💚', label: 'Crew Health', desc: 'Radiation · Microgravity · Isolation' },
          ].map((axis) => (
            <div key={axis.label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <div className="text-2xl mb-1">{axis.icon}</div>
              <div className="text-sm font-bold text-white mb-1">{axis.label}</div>
              <div className="text-xs text-slate-400">{axis.desc}</div>
            </div>
          ))}
        </div>

        {/* Players */}
        <div className="mb-6">
          <p className="text-slate-400 text-sm mb-3">Select number of players:</p>
          <div className="flex justify-center gap-3">
            {[1, 2, 3, 4].map((n) => (
              <button
                key={n}
                onClick={() => setPlayers(n)}
                className={`w-12 h-12 rounded-xl font-bold text-lg transition-all ${
                  players === n
                    ? 'bg-cyan-500 text-black'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* CTA */}
        <button
          onClick={() => { setPhase(1); router.push('/game'); }}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xl px-12 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
        >
          🚀 START MISSION
        </button>

        <p className="mt-8 text-slate-600 text-xs">
          Built by Califa Studio 🇦🇷 · NASA Space Apps 2026 · Space is humanity&apos;s common heritage
        </p>
      </div>
    </main>
  );
}
