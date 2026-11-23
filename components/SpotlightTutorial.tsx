'use client';
import { useState, useEffect, useCallback } from 'react';

interface SpotlightStep {
  id: string;
  title: string;
  emoji: string;
  description: string;
  hint?: string;
  selector: string; // CSS selector to spotlight
  cardPosition: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const SPOTLIGHT_STEPS: SpotlightStep[] = [
  {
    id: 'catalog',
    title: 'Catálogo de Componentes',
    emoji: '🔧',
    description: 'Acá elegís los componentes para tu nave. Cada uno tiene un costo en masa, energía y presupuesto. Hacé click en uno para agregarlo.',
    hint: 'Empezá siempre con un bus de nave espacial — es la base de todo.',
    selector: 'aside:first-of-type',
    cardPosition: 'right',
  },
  {
    id: 'builder',
    title: 'Constructor de Nave',
    emoji: '🛸',
    description: 'Los componentes que agregás aparecen acá. Podés eliminarlos con el botón ×. Cuando tengas todo listo, aparece el botón para simular.',
    hint: 'Necesitás al menos: bus, fuente de energía, sistema de comunicación e instrumento principal.',
    selector: 'main',
    cardPosition: 'bottom',
  },
  {
    id: 'dashboard',
    title: 'Panel de Recursos',
    emoji: '📊',
    description: 'Acá ves en tiempo real la masa, presupuesto y energía usados. Las barras se ponen amarillas y rojas cuando te acercás al límite. ¡Mantenelas en verde!',
    hint: 'El puntaje estimado cambia con cada componente que agregás.',
    selector: 'aside:last-of-type',
    cardPosition: 'left',
  },
];

export default function SpotlightTutorial({ onComplete }: { onComplete: () => void }) {
  const [current, setCurrent] = useState(0);
  const [rect, setRect] = useState<DOMRect | null>(null);
  const step = SPOTLIGHT_STEPS[current];
  const isLast = current === SPOTLIGHT_STEPS.length - 1;

  const updateRect = useCallback(() => {
    const el = document.querySelector(step.selector);
    if (el) {
      setRect(el.getBoundingClientRect());
    }
  }, [step.selector]);

  useEffect(() => {
    updateRect();
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, [updateRect]);

  const PADDING = 8;

  // Card position relative to spotlight
  const cardStyle = (): React.CSSProperties => {
    if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    switch (step.cardPosition) {
      case 'right':
        return { top: rect.top + PADDING, left: rect.right + 20 };
      case 'left':
        return { top: rect.top + PADDING, right: window.innerWidth - rect.left + 20 };
      case 'bottom':
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
      case 'top':
        return { bottom: window.innerHeight - rect.top + 20, left: rect.left + PADDING };
      default:
        return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };
    }
  };

  return (
    <div className="fixed inset-0 z-[55] pointer-events-none">
      {/* Spotlight hole — this div has the giant box-shadow that darkens everything around it */}
      {rect && (
        <div
          className="absolute rounded-xl pointer-events-none transition-all duration-500"
          style={{
            top: rect.top - PADDING,
            left: rect.left - PADDING,
            width: rect.width + PADDING * 2,
            height: rect.height + PADDING * 2,
            boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.82)',
            border: '2px solid rgba(6, 182, 212, 0.7)',
            zIndex: 55,
          }}
        />
      )}

      {/* Card */}
      <div
        className="absolute pointer-events-auto max-w-xs w-72 z-[56]"
        style={cardStyle()}
      >
        <div className="bg-slate-900 border border-cyan-500/60 rounded-2xl p-5 shadow-2xl shadow-cyan-500/20">
          {/* Step counter */}
          <div className="flex items-center gap-2 mb-3">
            {SPOTLIGHT_STEPS.map((_, i) => (
              <div
                key={i}
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                  i === current ? 'bg-cyan-400 text-black scale-110' : i < current ? 'bg-cyan-800 text-cyan-400' : 'bg-slate-700 text-slate-500'
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{step.emoji}</span>
            <h3 className="text-sm font-black text-white">{step.title}</h3>
          </div>

          <p className="text-slate-300 text-xs leading-relaxed mb-2">{step.description}</p>

          {step.hint && (
            <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-lg px-2.5 py-1.5 mb-3">
              <p className="text-cyan-300 text-xs leading-relaxed">💡 {step.hint}</p>
            </div>
          )}

          <button
            onClick={() => {
              if (isLast) onComplete();
              else {
                setCurrent((c) => c + 1);
              }
            }}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-2 rounded-xl text-sm transition-all"
          >
            {isLast ? '¡Entendido, a construir! 🚀' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
