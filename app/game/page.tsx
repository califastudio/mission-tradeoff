'use client';
import { useMissionStore } from '../../store/missionStore';
import { useRouter } from 'next/navigation';
import { ALL_COMPONENTS } from '../../data/components';
import { SpacecraftComponent, ComponentCategory } from '../../types/mission';
import { getScenario } from '../../data/scenarios';

const CATEGORY_LABELS: Record<ComponentCategory, string> = {
  bus: '🛰️ Spacecraft Bus',
  propulsion: '🚀 Propulsion',
  power: '⚡ Power Systems',
  comms: '📡 Communications',
  instrument: '🔬 Instruments',
  health: '💚 Crew Health',
};

const CATEGORIES: ComponentCategory[] = ['bus', 'propulsion', 'power', 'comms', 'instrument', 'health'];

function barColor(value: number, invert = false): string {
  const v = invert ? 100 - value : value;
  if (v < 40) return 'bg-emerald-400';
  if (v < 70) return 'bg-amber-400';
  return 'bg-red-400';
}

function ResourceBar({ label, value, max, unit = '', invert = false }: {
  label: string; value: number; max: number; unit?: string; invert?: boolean;
}) {
  const pct = Math.min(100, Math.max(0, (Math.abs(value) / Math.abs(max)) * 100));
  const color = invert ? barColor(pct, true) : barColor(pct);
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className="text-white font-mono">{value.toFixed(0)}{unit} / {max}{unit}</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function ImpactBar({ label, value }: { label: string; value: number }) {
  const pct = Math.min(100, Math.max(0, value));
  const color = pct < 40 ? 'bg-emerald-400' : pct < 70 ? 'bg-amber-400' : 'bg-red-400';
  const textColor = pct < 40 ? 'text-emerald-400' : pct < 70 ? 'text-amber-400' : 'text-red-400';
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono font-bold ${textColor}`}>{pct.toFixed(0)}/100</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default function GamePage() {
  const { selectedComponents, resources, scoreBreakdown, addComponent, removeComponent, scenario } = useMissionStore();
  const router = useRouter();
  const sc = getScenario(scenario);

  const isSelected = (id: string) => selectedComponents.some((c: SpacecraftComponent) => c.id === id);

  const handleAdd = (comp: SpacecraftComponent) => {
    addComponent(comp);
  };

  const powerDisplay = resources.power; // negative = generating more than consuming (good)
  const powerConsumption = Math.max(0, resources.power); // positive means over-consuming

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-3 flex items-center justify-between bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/mission')} className="text-slate-400 hover:text-white transition-colors text-sm">
            ← Missions
          </button>
          <div>
            <span className="text-cyan-400 font-bold text-sm">MISSION TRADE-OFF</span>
            <span className={`text-xs ml-2 ${sc.color}`}>{sc.icon} {sc.name} · {sc.difficultyLabel}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-slate-400 text-xs">Mission Score:</span>
          <span className="text-2xl font-black text-cyan-400">{scoreBreakdown.total}</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Component Catalog */}
        <aside className="w-80 border-r border-slate-800 overflow-y-auto bg-slate-900/40 flex-shrink-0">
          <div className="p-4">
            <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">Component Catalog</h2>
            {CATEGORIES.map((cat) => {
              const comps = ALL_COMPONENTS.filter((c: SpacecraftComponent) => c.category === cat);
              return (
                <div key={cat} className="mb-5">
                  <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase">{CATEGORY_LABELS[cat]}</h3>
                  <div className="space-y-2">
                    {comps.map((comp) => {
                      const selected = isSelected(comp.id);
                      return (
                        <button
                          key={comp.id}
                          onClick={() => handleAdd(comp)}
                          disabled={selected}
                          className={`w-full text-left rounded-lg p-3 border transition-all ${
                            selected
                              ? 'border-cyan-500/50 bg-cyan-500/10 opacity-60 cursor-default'
                              : 'border-slate-700 bg-slate-800/60 hover:border-slate-500 hover:bg-slate-800'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-xl flex-shrink-0">{comp.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-1">
                                <span className="text-sm font-bold text-white leading-tight">{comp.name}</span>
                                {selected && <span className="text-xs text-cyan-400 flex-shrink-0">✓ Added</span>}
                              </div>
                              <p className="text-xs text-slate-400 mt-0.5 leading-tight">{comp.description}</p>
                              <div className="flex gap-2 mt-1.5 flex-wrap">
                                <span className="text-xs text-slate-500">⚖️ {comp.mass}kg</span>
                                <span className="text-xs text-slate-500">⚡ {comp.power}W</span>
                                <span className="text-xs text-slate-500">💰 ${comp.budget}M</span>
                              </div>
                              {comp.envNote && (
                                <p className="text-xs text-emerald-400/80 mt-1 leading-tight">🌱 {comp.envNote}</p>
                              )}
                              {comp.healthNote && (
                                <p className="text-xs text-pink-400/80 mt-1 leading-tight">💊 {comp.healthNote}</p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </aside>

        {/* CENTER: Spacecraft Builder */}
        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-lg mx-auto">
            <h2 className="text-lg font-bold mb-1">Your Spacecraft</h2>
            <p className="text-slate-400 text-sm mb-6">Select components from the catalog to build your mission.</p>

            {selectedComponents.length === 0 ? (
              <div className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center">
                <div className="text-4xl mb-3">🛸</div>
                <p className="text-slate-500 text-sm">No components selected yet.</p>
                <p className="text-slate-600 text-xs mt-1">Start by picking a spacecraft bus.</p>
              </div>
            ) : (
              <div className="space-y-3 mb-6">
                {selectedComponents.map((comp: SpacecraftComponent) => (
                  <div key={comp.id} className="flex items-center gap-3 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-3">
                    <span className="text-2xl">{comp.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-white">{comp.name}</div>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-xs text-slate-500">⚖️ {comp.mass}kg</span>
                        <span className="text-xs text-slate-500">⚡ {comp.power}W</span>
                        <span className="text-xs text-slate-500">💰 ${comp.budget}M</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeComponent(comp.id)}
                      className="text-slate-500 hover:text-red-400 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            {selectedComponents.length > 0 && (
              <button
                onClick={() => router.push('/simulation')}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg py-4 rounded-2xl transition-all transform hover:scale-[1.02] shadow-lg shadow-cyan-500/30"
              >
                🚀 SIMULATE MISSION →
              </button>
            )}

            {/* Mission Objectives */}
            <div className="mt-8 bg-slate-800/40 border border-slate-700 rounded-xl p-4">
              <h3 className="text-xs uppercase tracking-widest text-slate-500 mb-3 font-semibold">Mission Objectives</h3>
              <div className="space-y-2">
                {[
                  { label: 'High-resolution Mars surface mapping', met: selectedComponents.some((c: SpacecraftComponent) => c.id === 'inst-hires-cam'), required: true },
                  { label: 'Science instrument onboard', met: selectedComponents.some((c: SpacecraftComponent) => c.category === 'instrument'), required: false },
                  { label: 'Communication system', met: selectedComponents.some((c: SpacecraftComponent) => c.category === 'comms'), required: false },
                  { label: 'Power system', met: selectedComponents.some((c: SpacecraftComponent) => c.category === 'power'), required: false },
                ].map((obj) => (
                  <div key={obj.label} className="flex items-center gap-2 text-xs">
                    <span className={obj.met ? 'text-emerald-400' : 'text-slate-600'}>{obj.met ? '✓' : '○'}</span>
                    <span className={obj.met ? 'text-slate-300' : 'text-slate-500'}>{obj.label}</span>
                    {obj.required && !obj.met && <span className="text-amber-400 ml-auto">Required</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: Resource Dashboard */}
        <aside className="w-72 border-l border-slate-800 overflow-y-auto bg-slate-900/40 flex-shrink-0 p-4">
          <h2 className="text-xs uppercase tracking-widest text-slate-500 mb-4 font-semibold">Mission Dashboard</h2>

          {/* Score */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 mb-4 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wider mb-1">Estimated Score</div>
            <div className="text-5xl font-black text-cyan-400">{scoreBreakdown.total}</div>
            <div className="text-xs text-slate-500 mt-1">/ 100</div>
          </div>

          {/* Engineering */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">⚙️ Engineering</h3>
            <ResourceBar label="Mass" value={resources.mass} max={sc.massLimit} unit="kg" />
            <ResourceBar label="Budget" value={resources.budget} max={sc.budgetLimit} unit="M$" />
            <ResourceBar label="Power Consumption" value={powerConsumption} max={sc.powerLimit} unit="W" />
            {resources.dataRate > 0 && (
              <div className="mt-2 text-xs text-slate-400">
                📡 Data Rate: <span className="text-white font-mono">{resources.dataRate} Mbps</span>
              </div>
            )}
            {powerDisplay < 0 && (
              <div className="mt-1 text-xs text-emerald-400">
                ✓ Power surplus: {Math.abs(powerDisplay)}W
              </div>
            )}
            {powerDisplay > 0 && (
              <div className="mt-1 text-xs text-red-400">
                ⚠ Power deficit: {powerDisplay}W — add power source!
              </div>
            )}
          </div>

          {/* Environment */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">🌱 Environment</h3>
            <ImpactBar label="Environmental Impact" value={resources.envImpact} />
            <div className="text-xs text-slate-500 mt-1">Lower is better. Aim for &lt;40.</div>
          </div>

          {/* Crew Health */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4 mb-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">💚 Crew Health</h3>
            <ImpactBar label="Crew Risk" value={resources.crewRisk} />
            <div className="text-xs text-slate-500 mt-1">Lower is better. Baseline: 50.</div>
          </div>

          {/* Science */}
          <div className="bg-slate-800/40 border border-slate-700 rounded-xl p-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase mb-3">🔬 Science Value</h3>
            <div className="text-3xl font-black text-white text-center">{resources.scienceValue}</div>
            <div className="text-xs text-slate-500 text-center mt-1">/ 100 points</div>
            <div className="mt-2 text-center">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`text-lg ${i < Math.round(resources.scienceValue / 20) ? 'text-amber-400' : 'text-slate-700'}`}>★</span>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
