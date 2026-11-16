'use client';
import { useState, useEffect } from 'react';
import { useMissionStore } from '../../store/missionStore';
import { useRouter } from 'next/navigation';
import { pickSimulationEvents } from '../../data/simulationEvents';
import { SimulationEvent, EventOption, EventResult, HazardBonus } from '../../types/mission';

// Deterministic starfield (SSR-safe)
const STARS = Array.from({ length: 60 }, (_, i) => {
  const seed = (i * 2654435761) >>> 0;
  return {
    width: ((seed % 15) / 10 + 1).toFixed(1),
    height: (((seed >> 4) % 15) / 10 + 1).toFixed(1),
    top: ((seed >> 8) % 100).toFixed(1),
    left: ((seed >> 16) % 100).toFixed(1),
    opacity: (((seed >> 20) % 50) / 100 + 0.3).toFixed(2),
  };
});

type SimPhase = 'launching' | 'in-flight' | 'event' | 'resolved' | 'complete';

const HAZARD_BONUS = 5; // bonus pts por esquivar hazard con decisión óptima

export default function SimulationPage() {
  const { selectedComponents, setSimulationResults, playerList, addPlayerScore } = useMissionStore();
  const router = useRouter();

  const [simPhase, setSimPhase] = useState<SimPhase>('launching');
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState<EventOption | null>(null);
  const [crewStress, setCrewStress] = useState(30);
  const [totalScoreEffect, setTotalScoreEffect] = useState(0);
  const [missionDay, setMissionDay] = useState(0);
  const [eventResults, setEventResults] = useState<EventResult[]>([]);
  const [hazardBonuses, setHazardBonuses] = useState<HazardBonus[]>([]);
  const [showHazardBonus, setShowHazardBonus] = useState(false);
  // Turno: qué jugador decide este evento
  const currentPlayer = playerList[currentIdx % playerList.length];

  useEffect(() => {
    if (selectedComponents.length === 0) {
      router.push('/');
      return;
    }
    const picked = pickSimulationEvents(3);
    setEvents(picked);
    setMissionDay(Math.floor(45 + Math.random() * 60));

    const t1 = setTimeout(() => setSimPhase('in-flight'), 2800);
    const t2 = setTimeout(() => setSimPhase('event'), 4400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChoice = (option: EventOption) => {
    setSelectedChoice(option);
    setSimPhase('resolved');
    setCrewStress((prev) => Math.max(0, Math.min(100, prev + option.stressEffect)));

    const isHazardAvoid = events[currentIdx]?.type === 'hazard' && option.isOptimal;
    const bonusPoints = isHazardAvoid ? HAZARD_BONUS : 0;
    const totalPoints = option.scoreEffect + bonusPoints;

    setTotalScoreEffect((prev) => prev + totalPoints);

    // Sumo puntos al jugador de este turno (mínimo 0)
    if (currentPlayer) {
      addPlayerScore(currentPlayer.id, Math.max(0, totalPoints));
    }

    if (isHazardAvoid) {
      setShowHazardBonus(true);
      setTimeout(() => setShowHazardBonus(false), 2500);
      setHazardBonuses((prev) => [
        ...prev,
        {
          eventTitle: events[currentIdx].title,
          bonus: bonusPoints,
          icon: events[currentIdx].icon,
        },
      ]);
    }
  };

  const handleNext = () => {
    if (!selectedChoice) return;
    const currentEvent = events[currentIdx];

    const isHazardAvoid = currentEvent.type === 'hazard' && (selectedChoice.isOptimal ?? false);
    const result: EventResult = {
      eventTitle: currentEvent.title,
      eventType: currentEvent.type,
      choiceLabel: selectedChoice.label,
      outcome: selectedChoice.outcome,
      scoreEffect: selectedChoice.scoreEffect,
      isOptimal: selectedChoice.isOptimal ?? false,
      hazardAvoided: isHazardAvoid,
    };
    const newResults = [...eventResults, result];
    setEventResults(newResults);

    if (currentIdx + 1 >= events.length) {
      const finalMod = totalScoreEffect;
      const finalStress = crewStress;
      // Build final bonuses synchronously (don't rely on async setState)
      const finalBonuses = isHazardAvoid
        ? [...hazardBonuses, { eventTitle: currentEvent.title, bonus: HAZARD_BONUS, icon: currentEvent.icon }]
        : [...hazardBonuses];
      setSimulationResults({
        scoreModifier: finalMod,
        hazardBonuses: finalBonuses,
        crewStressFinal: finalStress,
        eventResults: newResults,
      });
      setSimPhase('complete');
      setTimeout(() => router.push('/report'), 1800);
    } else {
      setCurrentIdx((prev) => prev + 1);
      setSelectedChoice(null);
      setMissionDay((prev) => prev + Math.floor(60 + Math.random() * 90));
      setSimPhase('event');
    }
  };

  const currentEvent = events[currentIdx];
  const isHazard = currentEvent?.type === 'hazard';
  const isHealth = currentEvent?.type === 'health';

  const stressColor =
    crewStress < 40 ? 'bg-emerald-400' : crewStress < 70 ? 'bg-amber-400' : 'bg-red-400';
  const stressText =
    crewStress < 40 ? 'text-emerald-400' : crewStress < 70 ? 'text-amber-400' : 'text-red-400';

  // ── LAUNCHING ──────────────────────────────────────────────────────────────
  if (simPhase === 'launching') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: s.width + 'px',
                height: s.height + 'px',
                top: s.top + '%',
                left: s.left + '%',
                opacity: s.opacity,
              }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <div className="text-8xl mb-6 animate-bounce">🚀</div>
          <h2 className="text-4xl font-black text-white mb-3">LAUNCHING</h2>
          <p className="text-cyan-400 text-lg">Mission is underway. Telemetry online.</p>
          <div className="mt-6 flex gap-2 justify-center">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                style={{ animationDelay: `${i * 0.3}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── IN FLIGHT ──────────────────────────────────────────────────────────────
  if (simPhase === 'in-flight') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🛸</div>
          <p className="text-xl font-bold text-white mb-1">En route to Mars</p>
          <p className="text-slate-400 text-sm">Preparing mission simulation…</p>
        </div>
      </div>
    );
  }

  // ── COMPLETE ───────────────────────────────────────────────────────────────
  if (simPhase === 'complete') {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🏆</div>
        <h2 className="text-3xl font-black text-white mb-2">MISSION COMPLETE</h2>
        <p className="text-cyan-400">Generating mission report…</p>
      </div>
    );
  }

  if (!currentEvent) return null;

  // ── EVENT / RESOLVED ───────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* HUD Header */}
      <header
        className={`border-b px-6 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur transition-colors ${
          isHazard
            ? 'border-red-500/50 bg-red-950/80'
            : 'border-slate-800 bg-slate-900/80'
        }`}
      >
        <div className="flex items-center gap-6">
          <span
            className={`font-bold text-sm ${
              isHazard ? 'text-red-400' : 'text-cyan-400'
            }`}
          >
            MISSION TRADE-OFF
          </span>
          <span className="text-slate-500 text-xs hidden sm:block">
            — Mars Mapping Mission
          </span>
          <div className="text-xs text-slate-400">
            📅 Day{' '}
            <span className="text-white font-mono font-bold">{missionDay}</span>
          </div>
        </div>

        {/* Crew Stress */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 hidden sm:block">🧠 Crew Stress</span>
          <div className="w-24 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${stressColor}`}
              style={{ width: `${crewStress}%` }}
            />
          </div>
          <span className={`text-xs font-mono font-bold ${stressText}`}>
            {crewStress}%
          </span>
        </div>

        {/* Player turn + progress */}
        <div className="flex items-center gap-3">
          {playerList.length > 1 && currentPlayer && simPhase === 'event' && (
            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
              ['bg-cyan-500/20 text-cyan-300','bg-purple-500/20 text-purple-300','bg-emerald-500/20 text-emerald-300','bg-amber-500/20 text-amber-300'][currentPlayer.id % 4]
            }`}>
              <span>👤</span>
              <span>{currentPlayer.name}&apos;s turn</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {events.map((_, i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full transition-colors ${
                  i < currentIdx
                    ? 'bg-emerald-400'
                    : i === currentIdx
                    ? 'bg-cyan-400 animate-pulse'
                    : 'bg-slate-600'
                }`}
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">
              {currentIdx + 1}/{events.length}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      {/* Hazard Avoided Toast */}
      {showHazardBonus && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-emerald-500 text-black font-black text-sm px-5 py-2 rounded-full shadow-xl shadow-emerald-500/40 flex items-center gap-2">
            🛡️ HAZARD AVOIDED — +{HAZARD_BONUS} BONUS PTS
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Starfield */}
        <div className="absolute inset-0 pointer-events-none">
          {STARS.map((s, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: s.width + 'px',
                height: s.height + 'px',
                top: s.top + '%',
                left: s.left + '%',
                opacity: parseFloat(s.opacity) * 0.4,
              }}
            />
          ))}
        </div>

        <div
          className={`relative z-10 max-w-2xl w-full border rounded-2xl p-6 sm:p-8 transition-all ${
            isHazard
              ? 'border-red-500/60 bg-red-950/40 shadow-xl shadow-red-500/10'
              : isHealth
              ? 'border-pink-500/40 bg-pink-950/20'
              : 'border-slate-700 bg-slate-800/60'
          }`}
        >
          {/* Badge */}
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-5 border ${
              isHazard
                ? 'bg-red-500/20 text-red-400 border-red-500/40'
                : isHealth
                ? 'bg-pink-500/20 text-pink-400 border-pink-500/40'
                : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40'
            }`}
          >
            {isHazard ? '🚨 SPACE HAZARD' : isHealth ? '💚 CREW HEALTH' : '⚙️ ENGINEERING'}
          </div>

          {/* Title */}
          <h2
            className={`text-2xl font-black mb-3 ${
              isHazard ? 'text-red-200' : 'text-white'
            }`}
          >
            {currentEvent.icon} {currentEvent.title}
          </h2>

          {/* Description */}
          <p className="text-slate-300 mb-4 leading-relaxed text-sm sm:text-base">
            {currentEvent.description}
          </p>

          {/* Context telemetry */}
          {currentEvent.context && (
            <div className="bg-slate-900/80 border border-slate-700 rounded-xl p-3 mb-5 font-mono text-xs text-slate-400 leading-relaxed">
              {currentEvent.context}
            </div>
          )}

          {/* OPTIONS */}
          {simPhase === 'event' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-3 font-semibold">
                {playerList.length > 1 && currentPlayer
                  ? `🎮 ${currentPlayer.name} — make your decision:`
                  : 'Mission Control — awaiting your decision:'}
              </p>
              {currentEvent.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleChoice(option)}
                  className={`w-full text-left rounded-xl p-4 border transition-all hover:scale-[1.01] active:scale-[0.99] ${
                    isHazard
                      ? 'border-red-500/30 bg-red-900/20 hover:bg-red-900/40 hover:border-red-400/50 text-red-100'
                      : 'border-slate-600 bg-slate-700/40 hover:bg-slate-700 hover:border-slate-500 text-white'
                  }`}
                >
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* RESOLVED */}
          {simPhase === 'resolved' && selectedChoice && (
            <div>
              {/* Choice result badge */}
              <div
                className={`rounded-xl p-3 mb-4 border ${
                  selectedChoice.isOptimal
                    ? 'border-emerald-500/50 bg-emerald-500/10'
                    : selectedChoice.scoreEffect < -5
                    ? 'border-red-500/40 bg-red-500/10'
                    : 'border-amber-500/40 bg-amber-500/10'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-xs text-slate-400">Your choice:</span>
                  {selectedChoice.isOptimal && (
                    <span className="text-xs text-emerald-400 font-bold">
                      ⭐ Optimal Decision
                    </span>
                  )}
                </div>
                <p className="text-sm text-white font-medium mb-2">
                  {selectedChoice.label}
                </p>
                <div className="flex gap-4 text-xs flex-wrap">
                  <span
                    className={
                      selectedChoice.scoreEffect >= 0
                        ? 'text-emerald-400'
                        : 'text-red-400'
                    }
                  >
                    Score{' '}
                    {selectedChoice.scoreEffect >= 0 ? '+' : ''}
                    {selectedChoice.scoreEffect}
                  </span>
                  {events[currentIdx]?.type === 'hazard' && selectedChoice.isOptimal && (
                    <span className="text-emerald-300 font-bold">
                      🛡️ Hazard avoided +{HAZARD_BONUS}
                    </span>
                  )}
                  <span
                    className={
                      selectedChoice.stressEffect <= 0
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                    }
                  >
                    Stress{' '}
                    {selectedChoice.stressEffect >= 0 ? '+' : ''}
                    {selectedChoice.stressEffect}%
                  </span>
                </div>
              </div>

              {/* Outcome */}
              <div className="bg-slate-900/70 border border-slate-700 rounded-xl p-4 mb-4">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2 font-semibold">
                  Outcome
                </p>
                <p className="text-slate-200 text-sm leading-relaxed">
                  {selectedChoice.outcome}
                </p>
                {selectedChoice.nasaAction && (
                  <p className="text-cyan-400/80 text-xs mt-3 italic leading-relaxed">
                    🏛️ {selectedChoice.nasaAction}
                  </p>
                )}
              </div>

              {/* NASA Fact */}
              {currentEvent.nasaFact && (
                <div className="bg-blue-950/50 border border-blue-500/30 rounded-xl p-4 mb-5">
                  <p className="text-xs text-blue-400 uppercase tracking-wider mb-2 font-bold">
                    NASA Context
                  </p>
                  <p className="text-blue-200/80 text-xs leading-relaxed">
                    {currentEvent.nasaFact}
                  </p>
                </div>
              )}

              <button
                onClick={handleNext}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black text-lg py-3 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                {currentIdx + 1 >= events.length
                  ? '📋 View Mission Report →'
                  : '→ Next Event'}
              </button>
            </div>
          )}
        </div>

        {/* Score tracker + player scores */}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          {totalScoreEffect !== 0 && (
            <div className={`text-xs font-mono ${totalScoreEffect > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              Simulation: {totalScoreEffect > 0 ? '+' : ''}{totalScoreEffect} pts
            </div>
          )}
          {playerList.length > 1 && playerList.map((p, i) => (
            <div key={p.id} className={`text-xs font-mono px-2 py-0.5 rounded-full ${
              ['text-cyan-300 bg-cyan-500/10','text-purple-300 bg-purple-500/10','text-emerald-300 bg-emerald-500/10','text-amber-300 bg-amber-500/10'][i]
            }`}>
              {p.name}: {p.score} pts
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
