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

export interface MissionState {
  phase: number;
  players: number;
  scenario: string;
  selectedComponents: SpacecraftComponent[];
  resources: Resource;
  missionScore: number;
  scoreBreakdown: ScoreBreakdown;
}

export interface ScoreBreakdown {
  science: number;
  efficiency: number;
  objectives: number;
  environment: number;
  health: number;
  total: number;
}
