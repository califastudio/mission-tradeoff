export interface Resource {
  mass: number;
  massLimit: number;
  power: number;
  powerLimit: number;
  budget: number;
  budgetLimit: number;
  dataRate: number;
  envImpact: number; // 0-100, lower is better
  crewRisk: number;  // 0-100, lower is better
  scienceValue: number; // 0-100
}

export type ComponentCategory = 'bus' | 'propulsion' | 'power' | 'comms' | 'instrument' | 'health';

export interface SpacecraftComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  description: string;
  mass: number;
  power: number;
  budget: number;
  dataRate?: number;
  envImpact?: number;
  crewRisk?: number;
  scienceValue?: number;
  envNote?: string;
  healthNote?: string;
  icon: string;
}

export interface ScoreBreakdown {
  science: number;
  efficiency: number;
  objectives: number;
  environment: number;
  health: number;
  total: number;
}

export type EventType = 'engineering' | 'hazard' | 'health';

export interface EventOption {
  id: string;
  label: string;
  outcome: string;
  nasaAction?: string;
  scoreEffect: number;
  stressEffect: number;
  isOptimal?: boolean;
}

export interface SimulationEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  icon: string;
  context?: string;
  options: EventOption[];
  nasaFact?: string;
}

export interface EventResult {
  eventTitle: string;
  eventType: EventType;
  choiceLabel: string;
  outcome: string;
  scoreEffect: number;
  isOptimal: boolean;
  hazardAvoided?: boolean; // true si era hazard Y fue la decisión óptima
}

export interface HazardBonus {
  eventTitle: string;
  bonus: number;
  icon: string;
}

export interface SimulationResultData {
  scoreModifier: number;      // suma de scoreEffects (puede ser grande, se clampea al aplicar)
  hazardBonuses: HazardBonus[]; // lista de hazards esquivados correctamente
  crewStressFinal: number;
  eventResults: EventResult[];
}

export interface MissionState {
  phase: number;
  players: number;
  scenario: string;
  selectedComponents: SpacecraftComponent[];
  resources: Resource;
  missionScore: number;
  scoreBreakdown: ScoreBreakdown;
  simulationResults: SimulationResultData | null;
}
