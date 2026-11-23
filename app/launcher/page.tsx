'use client';
import { useRouter } from 'next/navigation';
import { useMissionStore } from '../../store/missionStore';
import { LAUNCHERS, ORBITS, getLauncher, getOrbit } from '../../data/launchers';
import { getScenario } from '../../data/scenarios';

const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  return {
    width: ((seed % 15) / 10 + 1).toFixed(1),
    height: (((seed >> 4) % 15) / 10 + 1).toFixed(1),
    top: ((seed >> 8) % 100).toFixed(1),
    left: ((seed >> 16) % 100).toFixed(1),
  };
});

export default function LauncherPage() {
  const router = useRouter();
  const { scenario, launcher, orbit, setLauncher, setOrbit, resources } = useMissionStore();
  const sc = getScenario(scenario);
  const selectedLauncher = getLauncher(launcher);
  const selectedOrbit = getOrbit(orbit);

  // Compute effective limits from current selection
  const effectiveMassLimit = Math.round(selectedLauncher.payloadKg * selectedOrbit.massMultiplier);
  const effectiveBudgetLimit = Math.max(50, sc.budgetLimit - selectedLauncher.budgetCostM);
  const baseEnvImpact = selectedLauncher.envImpact + selectedOrbit.envImpact;

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-50"
            style={{
              width: s.width + 'px',
              height: s.height + 'px',
              top: s.top + '%',
              left: s.left + '%',
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.push('/mission')}
            className="text-slate-400 hover:text-white transition-colors text-sm"
          >
            ← Back to Mission Select
          </button>
          <div>
            <h1 className="text-3xl font-black text-white">Launch Configuration</h1>
            <p className={`text-sm mt-1 ${sc.color}`}>
              {sc.icon} {sc.name} · {sc.difficultyLabel}
            </p>
          </div>
        </div>

        {/* Contextual tip */}
        <div className="mb-6 bg-cyan-950/40 border border-cyan-500/20 rounded-xl px-4 py-2 text-xs text-cyan-300/80">
          💡 Your launcher choice sets the mass limit for your spacecraft. Your orbit choice applies a multiplier on top of that.
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: Launcher + Orbit selection */}
          <div className="lg:col-span-2 space-y-8">

            {/* Launch Vehicle */}
            <section>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">
                🚀 Choose Launch Vehicle
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {LAUNCHERS.map((l) => {
                  const isSelected = launcher === l.id;
                  return (
                    <button
                      key={l.id}
                      onClick={() => setLauncher(l.id)}
                      className={`text-left rounded-2xl border p-4 transition-all hover:scale-[1.01] active:scale-[0.98] ${
                        isSelected
                          ? `${l.borderColor} bg-slate-800/80 shadow-lg`
                          : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-3xl">{l.icon}</span>
                        <div>
                          <div className={`font-black text-sm ${l.color}`}>{l.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{l.description}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs mt-3">
                        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                          <div className="text-slate-500">Payload</div>
                          <div className={`font-bold ${l.color}`}>{l.payloadKg.toLocaleString()} kg</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                          <div className="text-slate-500">Cost</div>
                          <div className={`font-bold ${l.color}`}>${l.budgetCostM}M</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                          <div className="text-slate-500">Env.</div>
                          <div className={`font-bold ${l.envImpact < 20 ? 'text-emerald-400' : l.envImpact < 25 ? 'text-amber-400' : 'text-red-400'}`}>
                            {l.envImpact}/100
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-2 leading-relaxed">
                        {l.nasaRef}
                      </p>
                      {isSelected && (
                        <div className={`mt-2 text-xs font-bold text-center ${l.color}`}>✓ SELECTED</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Orbital Design */}
            <section>
              <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">
                🛰️ Choose Orbital Design
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ORBITS.map((o) => {
                  const isSelected = orbit === o.id;
                  const isRecommended = o.compatible.includes(scenario);
                  return (
                    <button
                      key={o.id}
                      onClick={() => setOrbit(o.id)}
                      className={`text-left rounded-2xl border p-4 transition-all hover:scale-[1.01] active:scale-[0.98] ${
                        isSelected
                          ? `${o.borderColor} bg-slate-800/80 shadow-lg`
                          : 'border-slate-700 bg-slate-900/60 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-start gap-3">
                          <span className="text-3xl">{o.icon}</span>
                          <div>
                            <div className={`font-black text-sm ${o.color}`}>{o.name}</div>
                            <div className="text-xs text-slate-400 mt-0.5">{o.description}</div>
                          </div>
                        </div>
                        {isRecommended && (
                          <span className="bg-cyan-500/20 text-cyan-400 text-xs font-bold px-2 py-0.5 rounded-full border border-cyan-500/40 flex-shrink-0">
                            ★ Recommended
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs mt-3">
                        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                          <div className="text-slate-500">Mass factor</div>
                          <div className={`font-bold ${o.color}`}>{(o.massMultiplier * 100).toFixed(0)}%</div>
                        </div>
                        <div className="bg-slate-800/60 rounded-lg p-2 text-center">
                          <div className="text-slate-500">Env. Impact</div>
                          <div className={`font-bold ${o.envImpact < 10 ? 'text-emerald-400' : o.envImpact < 15 ? 'text-amber-400' : 'text-red-400'}`}>
                            {o.envImpact}/100
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 italic mt-2 leading-relaxed">
                        {o.nasaRef}
                      </p>
                      {isSelected && (
                        <div className={`mt-2 text-xs font-bold text-center ${o.color}`}>✓ SELECTED</div>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* RIGHT: Preview Panel */}
          <div className="space-y-4">
            <div className="sticky top-6">
              <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">
                📊 Configuration Preview
              </h2>

              {/* Selected combo */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-4">
                <div className="text-xs text-slate-400 mb-3">Current Selection</div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedLauncher.icon}</span>
                  <div>
                    <div className={`text-sm font-bold ${selectedLauncher.color}`}>{selectedLauncher.name}</div>
                    <div className="text-xs text-slate-500">Launch vehicle</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedOrbit.icon}</span>
                  <div>
                    <div className={`text-sm font-bold ${selectedOrbit.color}`}>{selectedOrbit.name}</div>
                    <div className="text-xs text-slate-500">Orbital design</div>
                  </div>
                </div>
              </div>

              {/* Effective limits */}
              <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-4 mb-4 space-y-3">
                <div className="text-xs text-slate-400 mb-1">Effective Mission Limits</div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">⚖️ Payload Capacity</span>
                    <span className="text-white font-mono font-bold">{effectiveMassLimit.toLocaleString()} kg</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-cyan-400 rounded-full"
                      style={{ width: `${Math.min(100, (effectiveMassLimit / 3200) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">💰 Spacecraft Budget</span>
                    <span className="text-white font-mono font-bold">${effectiveBudgetLimit}M</span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, (effectiveBudgetLimit / sc.budgetLimit) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">🌱 Env. Baseline</span>
                    <span className={`font-mono font-bold ${baseEnvImpact < 30 ? 'text-emerald-400' : baseEnvImpact < 50 ? 'text-amber-400' : 'text-red-400'}`}>
                      {baseEnvImpact}/100
                    </span>
                  </div>
                  <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${baseEnvImpact < 30 ? 'bg-emerald-400' : baseEnvImpact < 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                      style={{ width: `${baseEnvImpact}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-700 text-xs text-slate-500">
                  ⚡ Power limit: {sc.powerLimit}W (from scenario)
                </div>
              </div>

              {/* Tip */}
              <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-3 mb-4 text-xs text-slate-400 leading-relaxed">
                💡 <span className="text-slate-300 font-semibold">Tip:</span> Heavier launchers cost more budget but allow more payload. Interplanetary trajectories reduce effective mass by 35%. Choose wisely!
              </div>

              {/* CTA */}
              <button
                onClick={() => router.push('/game')}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-base py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
              >
                → Build Spacecraft
              </button>
              <p className="text-xs text-slate-600 text-center mt-2">
                You can change launcher/orbit on the report screen
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
