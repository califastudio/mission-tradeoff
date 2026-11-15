import { create } from 'zustand';
import {
  MissionState,
  SpacecraftComponent,
  Resource,
  ScoreBreakdown,
  SimulationResultData,
} from '../types/mission';
import { MARS_MISSION_LIMITS } from '../data/components';

const BASE_RESOURCES: Resource = {
  mass: 0,
  massLimit: MARS_MISSION_LIMITS.massLimit,
  power: 0,
  powerLimit: MARS_MISSION_LIMITS.powerLimit,
  budget: 0,
  budgetLimit: MARS_MISSION_LIMITS.budgetLimit,
  dataRate: 0,
  envImpact: 0,
  crewRisk: 50,
  scienceValue: 0,
};

function calculateResources(components: SpacecraftComponent[]): Resource {
  let mass = 0, power = 0, budget = 0, dataRate = 0;
  let envImpact = 0, crewRisk = 50, scienceValue = 0;

  for (const c of components) {
    mass += c.mass || 0;
    power += c.power || 0;
    budget += c.budget || 0;
    dataRate += c.dataRate || 0;
    if (c.envImpact) envImpact = Math.min(100, envImpact + c.envImpact);
    if (c.crewRisk) crewRisk = Math.max(0, Math.min(100, crewRisk + c.crewRisk));
    if (c.scienceValue) scienceValue = Math.min(100, scienceValue + c.scienceValue);
  }

  return {
    mass,
    massLimit: MARS_MISSION_LIMITS.massLimit,
    power,
    powerLimit: MARS_MISSION_LIMITS.powerLimit,
    budget,
    budgetLimit: MARS_MISSION_LIMITS.budgetLimit,
    dataRate,
    envImpact,
    crewRisk,
    scienceValue,
  };
}

function calculateScore(
  resources: Resource,
  components: SpacecraftComponent[]
): ScoreBreakdown {
  const hasHiRes = components.some((c) => c.id === 'inst-hires-cam');
  const objectives = hasHiRes ? 100 : 40;

  const massRatio = resources.mass / resources.massLimit;
  const powerRatio = Math.max(0, resources.power) / resources.powerLimit;
  const budgetRatio = resources.budget / resources.budgetLimit;
  const efficiency = Math.max(0, 100 - ((massRatio + powerRatio + budgetRatio) / 3) * 60);

  const science = resources.scienceValue;
  const environment = Math.max(0, 100 - resources.envImpact);
  const health = Math.max(0, 100 - resources.crewRisk);

  const total = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        science * 0.35 +
          efficiency * 0.2 +
          objectives * 0.15 +
          environment * 0.15 +
          health * 0.15
      )
    )
  );

  return {
    science: Math.round(science),
    efficiency: Math.round(efficiency),
    objectives,
    environment: Math.round(environment),
    health: Math.round(health),
    total,
  };
}

interface MissionStore extends MissionState {
  addComponent: (component: SpacecraftComponent) => void;
  removeComponent: (id: string) => void;
  setPhase: (phase: number) => void;
  setPlayers: (players: number) => void;
  setSimulationResults: (results: SimulationResultData) => void;
  reset: () => void;
}

const INITIAL_STATE: MissionState = {
  phase: 0,
  players: 1,
  scenario: 'mars-mapping',
  selectedComponents: [],
  resources: { ...BASE_RESOURCES },
  missionScore: 0,
  scoreBreakdown: {
    science: 0,
    efficiency: 0,
    objectives: 0,
    environment: 0,
    health: 50,
    total: 0,
  },
  simulationResults: null as SimulationResultData | null,
};

export const useMissionStore = create<MissionStore>((set) => ({
  ...INITIAL_STATE,

  addComponent: (component: SpacecraftComponent) =>
    set((state) => {
      if (state.selectedComponents.find((c) => c.id === component.id)) return state;
      if (
        component.category === 'bus' &&
        state.selectedComponents.some((c) => c.category === 'bus')
      )
        return state;
      const updated = [...state.selectedComponents, component];
      const resources = calculateResources(updated);
      const scoreBreakdown = calculateScore(resources, updated);
      return {
        selectedComponents: updated,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  removeComponent: (id: string) =>
    set((state) => {
      const updated = state.selectedComponents.filter((c) => c.id !== id);
      const resources = calculateResources(updated);
      const scoreBreakdown = calculateScore(resources, updated);
      return {
        selectedComponents: updated,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  setPhase: (phase: number) => set(() => ({ phase })),
  setPlayers: (players: number) => set(() => ({ players })),
  setSimulationResults: (results: SimulationResultData) =>
    set(() => ({ simulationResults: results })),
  reset: () => set(() => ({ ...INITIAL_STATE })),
}));
