'use client';
import { useMissionStore } from '../../store/missionStore';
import { useRouter } from 'next/navigation';
import { SpacecraftComponent } from '../../types/mission';
import { getLauncher, getOrbit } from '../../data/launchers';
import { getScenario } from '../../data/scenarios';
import { ALL_COMPONENTS } from '../../data/components';

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
  const { scoreBreakdown, resources, selectedComponents, simulationResults, playerList, reset, launcher, orbit, scenario } = useMissionStore();
  const router = useRouter();

  const launcherData = getLauncher(launcher);
  const orbitData = getOrbit(orbit);
  const sc = getScenario(scenario);

  const simMod = simulationResults?.scoreModifier ?? 0;
  const hazardBonuses = simulationResults?.hazardBonuses ?? [];
  const totalHazardBonus = hazardBonuses.reduce((sum, h) => sum + h.bonus, 0);
  const finalScore = Math.max(0, Math.min(100, scoreBreakdown.total + simMod));
  const effectiveSimMod = finalScore - scoreBreakdown.total;
  const { grade, color, desc } = getGrade(finalScore);

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

  // Decision analysis helpers
  const primaryObj = ALL_COMPONENTS.find(c => c.id === sc.primaryObjectiveId);
  const hasPrimary = selectedComponents.some((c: SpacecraftComponent) => c.id === sc.primaryObjectiveId);
  const usedMass = resources.mass;
  const massRatio = resources.massLimit > 0 ? Math.round((usedMass / resources.massLimit) * 100) : 0;
  const baseEnvImpact = launcherData.envImpact + orbitData.envImpact;
  const extraEnvImpact = Math.max(0, resources.envImpact - baseEnvImpact);
  const scienceComps = selectedComponents.filter((c: SpacecraftComponent) => c.category === 'instrument');
  const healthComps = selectedComponents.filter((c: SpacecraftComponent) => c.category === 'health');

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

        {/* Leaderboard */}
        {playerList.length > 1 && (
          <div className="bg-slate-800/60 border border-cyan-500/30 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-5">
              🏆 Crew Leaderboard
            </h2>
            <div className="space-y-3">
              {[...playerList]
                .sort((a, b) => b.score - a.score)
                .map((player, i) => {
                  const colors = ['text-amber-400','text-slate-300','text-amber-600','text-slate-400'];
                  const medals = ['🥇','🥈','🥉','4️⃣'];
                  const barColors = ['bg-amber-400','bg-slate-400','bg-amber-600','bg-slate-500'];
                  const maxScore = Math.max(...playerList.map(p => p.score), 1);
                  return (
                    <div key={player.id} className="flex items-center gap-4">
                      <span className="text-xl w-8 text-center">{medals[i]}</span>
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span className={`font-bold ${colors[i]}`}>{player.name}</span>
                          <span className={`font-mono font-bold ${colors[i]}`}>{player.score} pts</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${barColors[i]}`}
                            style={{ width: `${(player.score / maxScore) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
            <p className="text-xs text-slate-500 mt-4 text-center">
              Points earned by making optimal decisions during the mission simulation
            </p>
          </div>
        )}

        {/* Score Hero */}
        <div className="text-center mb-10">
          <div className={`text-8xl font-black mb-2 ${color}`}>{grade}</div>
          <div className="text-3xl font-black text-white mb-1">{finalScore} / 100</div>
          {effectiveSimMod !== 0 && (
            <div className={`text-xs mt-1 ${effectiveSimMod > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              Design: {scoreBreakdown.total} · Simulation: {effectiveSimMod > 0 ? '+' : ''}{effectiveSimMod}
            </div>
          )}
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
            {effectiveSimMod !== 0 && (
              <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm">
                <span className="text-slate-300">🌌 Simulation Performance</span>
                <span className={`font-bold ${effectiveSimMod > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {effectiveSimMod > 0 ? '+' : ''}{effectiveSimMod} pts
                </span>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between text-sm font-bold">
              <span className="text-white">Total</span>
              <span className="text-cyan-400">{finalScore} / 100</span>
            </div>
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

        {/* Decision Analysis */}
        <div className="bg-slate-800/40 border border-cyan-500/20 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-cyan-400 mb-5">
            🔍 What Caused Each Result?
          </h2>
          <div className="space-y-4">

            {/* Engineering */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-cyan-400">⚙️ Engineering Efficiency</span>
                <span className="text-cyan-400 font-mono font-bold">{scoreBreakdown.efficiency} pts</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your <span className="text-white font-semibold">{launcherData.name}</span> + <span className="text-white font-semibold">{orbitData.name}</span> combination gave you{' '}
                <span className="text-cyan-300 font-mono">{resources.massLimit.toLocaleString()} kg</span> payload capacity and{' '}
                <span className="text-cyan-300 font-mono">${resources.budgetLimit}M</span> for spacecraft.
                You used <span className="text-white font-mono">{usedMass} kg ({massRatio}%)</span>.{' '}
                {massRatio < 50
                  ? '✅ Excellent mass efficiency — plenty of margin for safety.'
                  : massRatio < 85
                  ? '⚠️ Mass usage is moderate. Consider if all components are necessary.'
                  : '🚨 Near or over mass limit — this significantly hurts efficiency score.'}
              </p>
            </div>

            {/* Science */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-purple-400">🔬 Science Value</span>
                <span className="text-purple-400 font-mono font-bold">{scoreBreakdown.science} pts</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {scienceComps.length === 0
                  ? '❌ No science instruments were added. Science value is 0.'
                  : `Science instruments added: ${scienceComps.map(c => c.name).join(', ')}.`}{' '}
                {hasPrimary
                  ? `✅ Primary objective instrument (${primaryObj?.name ?? sc.primaryObjectiveId}) is onboard.`
                  : `❌ Primary objective instrument (${primaryObj?.name ?? sc.primaryObjectiveId}) is missing — this is required for full score.`}
                {sc.scienceMultiplier > 1 && ` This scenario applies a ×${sc.scienceMultiplier} science multiplier for its difficulty.`}
              </p>
            </div>

            {/* Environment */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-emerald-400">🌱 Environmental Score</span>
                <span className="text-emerald-400 font-mono font-bold">{scoreBreakdown.environment} pts</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Launch baseline: <span className="text-white font-mono">{baseEnvImpact}/100</span> (
                {launcherData.name}: {launcherData.envImpact} + {orbitData.name}: {orbitData.envImpact}).
                Component contributions: <span className="text-white font-mono">+{extraEnvImpact}</span>.
                Final impact: <span className={`font-mono font-bold ${resources.envImpact < 40 ? 'text-emerald-400' : resources.envImpact < 70 ? 'text-amber-400' : 'text-red-400'}`}>{resources.envImpact}/100</span>.{' '}
                {resources.envImpact < 40
                  ? '✅ Great environmental score — clean mission design!'
                  : resources.envImpact < 60
                  ? '⚠️ Moderate impact. Consider ion propulsion for future missions.'
                  : '🚨 High environmental impact. Chemical propulsion and large buses significantly increase footprint.'}
              </p>
            </div>

            {/* Crew Health */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-pink-400">💚 Crew Health</span>
                <span className="text-pink-400 font-mono font-bold">{scoreBreakdown.health} pts</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Baseline crew risk starts at 50/100.{' '}
                {healthComps.length === 0
                  ? '❌ No health/safety components added — crew risk remains at baseline or higher.'
                  : `Health components added: ${healthComps.map(c => c.name).join(', ')}.`}{' '}
                Final crew risk: <span className={`font-mono font-bold ${resources.crewRisk < 40 ? 'text-emerald-400' : resources.crewRisk < 65 ? 'text-amber-400' : 'text-red-400'}`}>{resources.crewRisk}/100</span>.{' '}
                {resources.crewRisk < 30
                  ? '✅ Excellent crew protection! Well-prepared for the mission.'
                  : resources.crewRisk < 60
                  ? '⚠️ Moderate risk. Advanced bio-shielding could improve this.'
                  : '🚨 High crew risk — shielding and countermeasures are strongly recommended for long missions.'}
              </p>
            </div>

            {/* Objectives */}
            <div className="bg-slate-900/60 rounded-xl p-4 border border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-blue-400">🎯 Mission Objectives</span>
                <span className="text-blue-400 font-mono font-bold">{scoreBreakdown.objectives} pts</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Primary objective — <span className="text-white font-semibold">{primaryObj?.name ?? sc.primaryObjectiveId}</span>:{' '}
                {hasPrimary
                  ? '✅ Met! This component is onboard and active.'
                  : `❌ Not met. You needed to add "${primaryObj?.name ?? sc.primaryObjectiveId}" from the catalog to unlock full objective score (100 pts vs 40 pts).`}
              </p>
            </div>
          </div>
        </div>

        {/* Mission Stats — 6 stats */}
        <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">Mission Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Total Mass', value: `${resources.mass} kg`, limit: `/ ${resources.massLimit} kg`, over: resources.mass > resources.massLimit },
              { label: 'Budget', value: `$${resources.budget}M`, limit: `/ $${resources.budgetLimit}M`, over: resources.budget > resources.budgetLimit },
              { label: 'Power Net', value: `${resources.power} W`, limit: resources.power > 0 ? '⚠ Deficit' : '✓ OK', over: resources.power > 0 },
              { label: 'Data Rate', value: `${resources.dataRate} Mbps`, limit: 'downlink', over: false },
              { label: 'Launch Vehicle', value: launcherData.icon + ' ' + launcherData.name, limit: `$${launcherData.budgetCostM}M cost`, over: false },
              { label: 'Orbital Design', value: orbitData.icon + ' ' + orbitData.name, limit: `×${orbitData.massMultiplier} mass factor`, over: false },
            ].map((stat) => (
              <div key={stat.label} className="bg-slate-900/60 rounded-xl p-3 text-center">
                <div className="text-xs text-slate-500 mb-1">{stat.label}</div>
                <div className={`text-sm font-bold ${stat.over ? 'text-red-400' : 'text-white'} leading-tight`}>{stat.value}</div>
                <div className={`text-xs ${stat.over ? 'text-red-400' : 'text-slate-500'}`}>{stat.limit}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Hazard Bonuses */}
        {hazardBonuses.length > 0 && (
          <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4">
              🛡️ Hazards Avoided — Bonus Points
            </h2>
            <div className="space-y-2 mb-4">
              {hazardBonuses.map((h, i) => (
                <div key={i} className="flex items-center justify-between bg-emerald-900/30 border border-emerald-500/20 rounded-xl px-4 py-3">
                  <span className="text-sm text-emerald-100">{h.icon} {h.eventTitle}</span>
                  <span className="text-emerald-400 font-black text-sm">+{h.bonus} pts</span>
                </div>
              ))}
            </div>
            <div className="pt-3 border-t border-emerald-500/20 flex justify-between items-center">
              <span className="text-xs text-emerald-400/70">Mission survived {hazardBonuses.length} space hazard{hazardBonuses.length > 1 ? 's' : ''} with optimal response</span>
              <span className="text-emerald-400 font-black">Total: +{totalHazardBonus} pts</span>
            </div>
          </div>
        )}

        {/* Simulation Events */}
        {simulationResults && simulationResults.eventResults.length > 0 && (
          <div className="bg-slate-800/40 border border-slate-700 rounded-2xl p-6 mb-8">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-400 mb-5">
              🚀 Simulation Events ({simulationResults.eventResults.length})
            </h2>
            <div className="space-y-3">
              {simulationResults.eventResults.map((result, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-4 border ${
                    result.eventType === 'hazard'
                      ? 'border-red-500/30 bg-red-950/20'
                      : result.eventType === 'health'
                      ? 'border-pink-500/30 bg-pink-950/10'
                      : 'border-slate-600 bg-slate-900/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      {result.eventType === 'hazard' && result.hazardAvoided && (
                        <span className="text-xs text-emerald-400 font-bold">🛡️ HAZARD AVOIDED</span>
                      )}
                      {result.eventType === 'hazard' && !result.hazardAvoided && (
                        <span className="text-xs text-red-400 font-bold">🚨 HAZARD</span>
                      )}
                      {result.eventType === 'health' && (
                        <span className="text-xs text-pink-400 font-bold">💚 HEALTH</span>
                      )}
                      {result.eventType === 'engineering' && (
                        <span className="text-xs text-cyan-400 font-bold">⚙️ ENGINEERING</span>
                      )}
                      <span className="text-sm font-bold text-white">{result.eventTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {result.isOptimal && (
                        <span className="text-xs text-emerald-400">⭐ Optimal</span>
                      )}
                      <span
                        className={`text-xs font-mono font-bold ${
                          result.scoreEffect >= 0 ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {result.scoreEffect >= 0 ? '+' : ''}{result.scoreEffect}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">Choice: {result.choiceLabel}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs text-slate-400">
                🧠 Final crew stress:{' '}
                <span
                  className={`font-bold ${
                    simulationResults.crewStressFinal < 40
                      ? 'text-emerald-400'
                      : simulationResults.crewStressFinal < 70
                      ? 'text-amber-400'
                      : 'text-red-400'
                  }`}
                >
                  {simulationResults.crewStressFinal}%
                </span>
              </span>
              <span
                className={`text-sm font-bold ${
                  effectiveSimMod >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                Score adjustment: {effectiveSimMod >= 0 ? '+' : ''}{effectiveSimMod} pts
                {effectiveSimMod !== simMod && (
                  <span className="text-slate-500 font-normal text-xs ml-1">(capped at 100)</span>
                )}
              </span>
            </div>
          </div>
        )}

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
