'use client';
import { useMissionStore } from '../store/missionStore';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// Pre-computed star positions (avoids Math.random during prerender)
const STARS = Array.from({ length: 80 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  return {
    width: ((seed % 20) / 10 + 1).toFixed(1),
    height: (((seed >> 4) % 20) / 10 + 1).toFixed(1),
    top: ((seed >> 8) % 100).toFixed(1),
    left: ((seed >> 16) % 100).toFixed(1),
  };
});

export default function Home() {
  const { players, setPlayers, setPhase, playerList, setPlayerName } = useMissionStore();
  const router = useRouter();
  const [step, setStep] = useState<'config' | 'names'>('config');

  const allNamed = playerList.every(p => p.name.trim().length > 0);

  const handleStart = () => {
    setPhase(1);
    router.push('/game');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
      {/* Stars background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {STARS.map((star, i) => (
          <div key={i} className="absolute rounded-full bg-white opacity-70"
            style={{
              width: star.width + 'px',
              height: star.height + 'px',
              top: star.top + '%',
              left: star.left + '%',
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-slate-800/60 border border-cyan-500/30 rounded-2xl p-5 text-left">
            <div className="text-3xl mb-2">⚙️</div>
            <div className="text-sm font-black text-white mb-1 uppercase tracking-wide">Engineering</div>
            <div className="text-xs text-slate-400 mb-3 leading-relaxed">
              Every component you add costs <span className="text-white">mass</span>, <span className="text-white">power</span>, and <span className="text-white">budget</span>. Add too much and your rocket can't lift off. Add too little and your mission fails scientifically.
            </div>
            <div className="space-y-1">
              <div className="text-xs text-cyan-400">⚖️ Mass limit: 1,200 kg</div>
              <div className="text-xs text-cyan-400">⚡ Power limit: 1,000 W</div>
              <div className="text-xs text-cyan-400">💰 Budget: $350M USD</div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-emerald-500/30 rounded-2xl p-5 text-left">
            <div className="text-3xl mb-2">🌱</div>
            <div className="text-sm font-black text-white mb-1 uppercase tracking-wide">Environment</div>
            <div className="text-xs text-slate-400 mb-3 leading-relaxed">
              Space isn't empty — it's shared. Each launch creates <span className="text-white">debris</span>. Each propulsion choice has an <span className="text-white">emissions footprint</span>. Responsible design means planning the mission's end, not just its beginning.
            </div>
            <div className="space-y-1">
              <div className="text-xs text-emerald-400">🛰️ 27,000+ debris objects tracked today</div>
              <div className="text-xs text-emerald-400">♻️ Deorbit planning = lower impact score</div>
              <div className="text-xs text-emerald-400">☀️ Solar/ion propulsion = cleaner missions</div>
            </div>
          </div>

          <div className="bg-slate-800/60 border border-pink-500/30 rounded-2xl p-5 text-left">
            <div className="text-3xl mb-2">💚</div>
            <div className="text-sm font-black text-white mb-1 uppercase tracking-wide">Crew Health</div>
            <div className="text-xs text-slate-400 mb-3 leading-relaxed">
              Deep space is hostile to the human body. <span className="text-white">Radiation</span> accumulates silently. <span className="text-white">Microgravity</span> degrades bones. <span className="text-white">Isolation</span> affects the mind. Your design choices protect — or endanger — the people aboard.
            </div>
            <div className="space-y-1">
              <div className="text-xs text-pink-400">☢️ NASA limit: 500 mSv/year deep space</div>
              <div className="text-xs text-pink-400">🏋️ Exercise countermeasures: mandatory &gt;6 months</div>
              <div className="text-xs text-pink-400">🧠 Behavioral health: #1 risk for Mars missions</div>
            </div>
          </div>
        </div>

        {/* Space Hazards teaser */}
        <div className="bg-red-950/30 border border-red-500/25 rounded-2xl p-4 mb-10 text-left flex gap-4 items-start">
          <div className="text-2xl flex-shrink-0">🛸</div>
          <div>
            <div className="text-xs font-black text-red-400 uppercase tracking-widest mb-1">Also: Space is not safe</div>
            <div className="text-xs text-slate-400 leading-relaxed">
              During your mission, real hazards will strike — <span className="text-red-300">debris conjunctions</span>, <span className="text-red-300">asteroid close approaches</span>, solar flares, and equipment failures. How you respond will determine your final score. Every hazard you avoid with the right decision earns bonus points.
            </div>
          </div>
        </div>

        {/* Players setup */}
        {step === 'config' && (
          <div className="mb-6">
            <p className="text-slate-400 text-sm mb-3 font-semibold">👥 How many players?</p>
            <div className="flex justify-center gap-3 mb-6">
              {[1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  onClick={() => setPlayers(n)}
                  className={`w-14 h-14 rounded-2xl font-black text-xl transition-all ${
                    players === n
                      ? 'bg-cyan-500 text-black scale-110 shadow-lg shadow-cyan-500/30'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep('names')}
              className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
            >
              → Enter Player Names
            </button>
          </div>
        )}

        {step === 'names' && (
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={() => setStep('config')} className="text-slate-400 hover:text-white text-sm">← Back</button>
              <p className="text-slate-300 text-sm font-semibold">👤 Enter crew names</p>
            </div>
            <div className="space-y-3 mb-6">
              {playerList.map((player, i) => (
                <div key={player.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0 ${
                    ['bg-cyan-500','bg-purple-500','bg-emerald-500','bg-amber-500'][i]
                  } text-black`}>
                    {i + 1}
                  </div>
                  <input
                    type="text"
                    placeholder={`Player ${i + 1} name...`}
                    value={player.name === ['Commander','Engineer','Scientist','Navigator'][i] ? '' : player.name}
                    onChange={(e) => setPlayerName(player.id, e.target.value || ['Commander','Engineer','Scientist','Navigator'][i])}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={handleStart}
              disabled={!allNamed}
              className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-slate-700 disabled:text-slate-500 text-black font-black text-xl py-4 rounded-2xl transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/30 disabled:scale-100 disabled:shadow-none"
            >
              🚀 LAUNCH MISSION
            </button>
          </div>
        )}

        <p className="mt-8 text-slate-600 text-xs">
          Built by Califa Studio 🇦🇷 · NASA Space Apps 2026 · Space is humanity&apos;s common heritage
        </p>
      </div>
    </main>
  );
}
