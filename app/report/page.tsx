'use client';
import { useMissionStore } from '../../store/missionStore';
import { useRouter } from 'next/navigation';
import { SpacecraftComponent } from '../../types/mission';

function getGrade(score: number): { grade: string; color: string; desc: string } {
  if (score >= 90) return { grade: 'A+', color: 'text-emerald-400', desc: 'Outstanding Mission Design' };
  if (score >= 80) return { grade: 'A', color: 'text-emerald-400', desc: 'Excellent Mission Design' };
  if (score >= 65) return { grade: 'B', color: 'text-cyan-400', desc: 'Good Mission Design' };
  if (score >= 50) return { grade: 'C', color: 'text-amber-400', desc: 'Adequate Mission Design' };
  return { grade: 'F', color: 'text-red-400', desc: 'Mission Needs Improvement' };
}

function ScoreBar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm mb-1">
        <span className="text-slate-300">{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color.replace('text-', 'bg-')}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

export default function ReportPage() {
  const { scoreBreakdown, resources, selectedComponents, reset } = useMissionStore();
  const router = useRouter();

  const { grade, color, desc } = getGrade(scoreBreakdown.total);

  const recommendations: string[] = [];
  if (resources.envImpact > 60) recommendations.push('🌱 Consider ion propulsion or solar sail to significantly reduce emissions and debris generation.');
  if (resources.crewRisk > 60) recommendations.push('💊 Add shielding or exercise countermeasures — crew health risk is elevated for a deep space mission.');
  if (resources.scienceValue < 50) recommendations.push('🔬 Add more scientific instruments to increase mission science return value.');
  if (!selectedComponents.some((c: SpacecraftComponent) => c.category === 'power')) recommendations.push('⚡ No power source detected — your mission needs solar panels or an RTG!');
  if (!selectedComponents.some((c: SpacecraftComponent) => c.category === 'comms')) recommendations.push('📡 No communications system — data cannot be downlinked without an antenna.');
  if (resources.mass > resources.massLimit) recommendations.push('⚖️ Mission is overweight — reduce components or switch to a lighter bus.');
  if (resources.budget > resources.budgetLimit) recommendations.push('💰 Budget exceeded — look for cost-effective alternatives.');
  if (recommendations.length === 0) recommendations.push('✅ Excellent balance across all mission parameters! Ready for launch.');

  const handlePlayAgain = () => {
    reset();
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between bg-slate-900/80">
        <div>
          <span className="text-cyan-400 font-bold">MISSION TRADE-OFF</span>
          <span className="text-slate-500 text-sm ml-2">— Mission Report</span>
        </div>
        <button
          onClick={handlePlayAgain}
          className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold px-6 py-2 rounded-xl transition-all"
        >
          🔄 PLAY AGAIN
        </button>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Score Hero */}
        <div className="text-center mb-10">
          <div className={`text-8xl font-black mb-2 ${color}`}>{grade}</div>
          <div className="text-3xl font-black text-white mb-1">{scoreBreakdown.total} / 100</div>
          <div className="text-slate-400">{desc}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Score Breakdown */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Score Breakdown</h2>
            <ScoreBar label="🔬 Science Value (35%)" value={scoreBreakdown.science} color="text-purple-400" />
            <ScoreBar label="⚙️ Engineering Efficiency (20%)" value={scoreBreakdown.efficiency} color="text-cyan-400" />
            <ScoreBar label="🎯 Mission Objectives (15%)" value={scoreBreakdown.objectives} color="text-blue-400" />
            <ScoreBar label="🌱 Environmental Score (15%)" value={scoreBreakdown.environment} color="text-emerald-400" />
            <ScoreBar label="💚 Crew Health Score (15%)" value={scoreBreakdown.health} color="text-pink-400" />
          </div>

          {/* Recommendations */}
          <div className="bg-slate-800/60 border border-slate-700 rounded-2xl p-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Recommendations</h2>
            <div className="space-y-3">
              {recommendations.map((rec, i) => (
                <div key={i} className="bg-slate-900/60 rounded-xl p-3 text-sm text-slate-300 leading-relaxed">
                  {rec}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mission Stats */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Mission Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Total Mass', value: `${resources.mass} kg`, limit: `/ ${resources.massLimit} kg`, over: resources.mass > resources.massLimit },
              { label: 'Budget', value: `$${resources.budget}M`, limit: `/ $${resources.budgetLimit}M`, over: resources.budget > resources.budgetLimit },
              { label: 'Power Net', value: `${resources.power} W`, limit: resources.power > 0 ? '⚠ Deficit' : '✓ OK', over: resources.power > 0 },
              { label: 'Data Rate', value: `${resources.dataRate} Mbps`, limit: 'downlink', over: false },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/60 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                <div className={`text-lg font-bold ${stat.over ? 'text-red-400' : 'text-white'}`}>{stat.value}</div>
                <div className={`text-xs ${stat.over ? 'text-red-400' : 'text-slate-500'}`}>{stat.limit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Components Used */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-10">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
            Components Used ({selectedComponents.length})
          </h2>
          {selectedComponents.length === 0 ? (
            <p className="text-slate-500 text-sm">No components selected.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {selectedComponents.map((comp: SpacecraftComponent) => (
                <div key={comp.id} className="flex items-center gap-3 bg-slate-900/60 rounded-xl px-4 py-3">
                  <span className="text-2xl">{comp.icon}</span>
                  <div>
                    <div className="text-sm font-bold text-white">{comp.name}</div>
                    <div className="flex gap-2 mt-0.5">
                      <span className="text-xs text-slate-500">⚖️ {comp.mass}kg</span>
                      <span className="text-xs text-slate-500">⚡ {comp.power}W</span>
                      <span className="text-xs text-slate-500">💰 ${comp.budget}M</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Play Again */}
        <div className="text-center">
          <button
            onClick={handlePlayAgain}
            className="bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xl px-14 py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg shadow-cyan-500/30"
          >
            🚀 PLAY AGAIN
          </button>
          <p className="mt-6 text-slate-600 text-xs">
            Built by Califa Studio 🇦🇷 · NASA Space Apps 2026 · Space is humanity&apos;s common heritage
          </p>
        </div>
      </div>
    </div>
  );
}
