'use client';
import { useState } from 'react';

export interface TutorialStep {
  id: string;
  title: string;
  emoji: string;
  description: string;
  hint?: string;
  position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'bottom-center' | 'top-center';
}

export default function TutorialOverlay({
  steps,
  onComplete,
  onSkip,
}: {
  steps: TutorialStep[];
  onComplete: () => void;
  onSkip: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const step = steps[current];
  const isLast = current === steps.length - 1;

  const positionClasses: Record<TutorialStep['position'], string> = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    'top-left': 'top-16 left-6',
    'top-right': 'top-16 right-6',
    'top-center': 'top-16 left-1/2 -translate-x-1/2',
    'bottom-left': 'bottom-24 left-6',
    'bottom-right': 'bottom-24 right-6',
    'bottom-center': 'bottom-24 left-1/2 -translate-x-1/2',
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex">
      {/* Step progress numbers */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
        {steps.map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrent(i)}
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                i === current
                  ? 'bg-cyan-400 text-black scale-110 shadow-lg shadow-cyan-400/40'
                  : i < current
                  ? 'bg-cyan-800 text-cyan-300'
                  : 'bg-slate-700 text-slate-500'
              }`}
            >
              {i + 1}
            </button>
            {i < steps.length - 1 && (
              <div className={`w-4 h-0.5 rounded-full transition-all ${i < current ? 'bg-cyan-700' : 'bg-slate-700'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Skip button */}
      <button
        onClick={onSkip}
        className="absolute top-4 right-6 text-slate-400 hover:text-white text-sm transition-colors"
      >
        Saltar ×
      </button>

      {/* Step card */}
      <div className={`absolute ${positionClasses[step.position]} max-w-sm w-[90vw]`}>
        <div className="bg-slate-900 border border-cyan-500/50 rounded-2xl p-6 shadow-2xl shadow-cyan-500/20">
          {/* Step counter */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-cyan-400 text-black text-xs font-black flex items-center justify-center flex-shrink-0">
              {current + 1}
            </div>
            <div className="text-xs text-cyan-400/60 uppercase tracking-widest font-semibold">
              de {steps.length} pasos
            </div>
          </div>

          {/* Title */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{step.emoji}</span>
            <h3 className="text-lg font-black text-white">{step.title}</h3>
          </div>

          {/* Description */}
          <p className="text-slate-300 text-sm leading-relaxed mb-3">{step.description}</p>

          {/* Hint */}
          {step.hint && (
            <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl px-3 py-2 mb-4">
              <p className="text-cyan-300 text-xs leading-relaxed">💡 {step.hint}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => {
                if (isLast) onComplete();
                else setCurrent((c) => c + 1);
              }}
              className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2.5 rounded-xl transition-all hover:scale-[1.02] text-sm"
            >
              {isLast ? '🚀 ¡Empezar a jugar!' : 'Siguiente →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
