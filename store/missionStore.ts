import { create } from 'zustand';
import {
  MissionState,
  SpacecraftComponent,
  Resource,
  ScoreBreakdown,
  SimulationResultData,
  Player,
} from '../types/mission';
import { MARS_MISSION_LIMITS } from '../data/components';
import { getScenario } from '../data/scenarios';
import { getLauncher, getOrbit } from '../data/launchers';

interface EffectiveLimits {
  massLimit: number;
  budgetLimit: number;
  powerLimit: number;
  baseEnvImpact: number;
}

function getEffectiveLimits(scenarioId: string, launcherId: string, orbitId: string): EffectiveLimits {
  const sc = getScenario(scenarioId);
  const launcher = getLauncher(launcherId);
  const orbit = getOrbit(orbitId);
  return {
    massLimit: Math.round(launcher.payloadKg * orbit.massMultiplier),
    budgetLimit: Math.max(50, sc.budgetLimit - launcher.budgetCostM),
    powerLimit: sc.powerLimit,
    baseEnvImpact: launcher.envImpact + orbit.envImpact,
  };
}

const DEFAULT_LAUNCHER = 'falcon9';
const DEFAULT_ORBIT = 'interplanetary';
const DEFAULT_SCENARIO = 'mars-mapping';

const DEFAULT_LIMITS = getEffectiveLimits(DEFAULT_SCENARIO, DEFAULT_LAUNCHER, DEFAULT_ORBIT);

const BASE_RESOURCES: Resource = {
  mass: 0,
  massLimit: DEFAULT_LIMITS.massLimit,
  power: 0,
  powerLimit: DEFAULT_LIMITS.powerLimit,
  budget: 0,
  budgetLimit: DEFAULT_LIMITS.budgetLimit,
  dataRate: 0,
  envImpact: DEFAULT_LIMITS.baseEnvImpact,
  crewRisk: 50,
  scienceValue: 0,
};

function calculateResources(components: SpacecraftComponent[], limits: EffectiveLimits): Resource {
  let mass = 0, power = 0, budget = 0, dataRate = 0;
  let envImpact = limits.baseEnvImpact, crewRisk = 50, scienceValue = 0;

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
    massLimit: limits.massLimit,
    power,
    powerLimit: limits.powerLimit,
    budget,
    budgetLimit: limits.budgetLimit,
    dataRate,
    envImpact,
    crewRisk,
    scienceValue,
  };
}

function calculateScore(
  resources: Resource,
  components: SpacecraftComponent[],
  scenarioId: string
): ScoreBreakdown {
  const sc = getScenario(scenarioId);
  const hasPrimary = components.some((c) => c.id === sc.primaryObjectiveId);
  const objectives = hasPrimary ? 100 : 40;

  const massRatio = resources.mass / resources.massLimit;
  const powerRatio = Math.max(0, resources.power) / resources.powerLimit;
  const budgetRatio = resources.budget / resources.budgetLimit;
  const efficiency = Math.max(0, 100 - ((massRatio + powerRatio + budgetRatio) / 3) * 60);

  const science = Math.min(100, resources.scienceValue * sc.scienceMultiplier);
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

function buildPlayerList(count: number): Player[] {
  const names = ['Commander', 'Engineer', 'Scientist', 'Navigator'];
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    name: names[i],
    score: 0,
    ready: false,
  }));
}

interface MissionStore extends MissionState {
  addComponent: (component: SpacecraftComponent) => void;
  removeComponent: (id: string) => void;
  setPhase: (phase: number) => void;
  setPlayers: (players: number) => void;
  setPlayerName: (id: number, name: string) => void;
  setPlayerReady: (id: number, ready: boolean) => void;
  addPlayerScore: (id: number, points: number) => void;
  setScenario: (scenarioId: string) => void;
  setLauncher: (launcherId: string) => void;
  setOrbit: (orbitId: string) => void;
  setSimulationResults: (results: SimulationResultData) => void;
  reset: () => void;
}

const INITIAL_STATE: MissionState = {
  phase: 0,
  players: 1,
  playerList: buildPlayerList(1),
  scenario: DEFAULT_SCENARIO,
  launcher: DEFAULT_LAUNCHER,
  orbit: DEFAULT_ORBIT,
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
      const limits = getEffectiveLimits(state.scenario, state.launcher, state.orbit);
      const resources = calculateResources(updated, limits);
      const scoreBreakdown = calculateScore(resources, updated, state.scenario);
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
      const limits = getEffectiveLimits(state.scenario, state.launcher, state.orbit);
      const resources = calculateResources(updated, limits);
      const scoreBreakdown = calculateScore(resources, updated, state.scenario);
      return {
        selectedComponents: updated,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  setPhase: (phase: number) => set(() => ({ phase })),

  setScenario: (scenarioId: string) =>
    set((state) => {
      const limits = getEffectiveLimits(scenarioId, state.launcher, state.orbit);
      const resources = calculateResources(state.selectedComponents, limits);
      const scoreBreakdown = calculateScore(resources, state.selectedComponents, scenarioId);
      return {
        scenario: scenarioId,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  setLauncher: (launcherId: string) =>
    set((state) => {
      const limits = getEffectiveLimits(state.scenario, launcherId, state.orbit);
      const resources = calculateResources(state.selectedComponents, limits);
      const scoreBreakdown = calculateScore(resources, state.selectedComponents, state.scenario);
      return {
        launcher: launcherId,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  setOrbit: (orbitId: string) =>
    set((state) => {
      const limits = getEffectiveLimits(state.scenario, state.launcher, orbitId);
      const resources = calculateResources(state.selectedComponents, limits);
      const scoreBreakdown = calculateScore(resources, state.selectedComponents, state.scenario);
      return {
        orbit: orbitId,
        resources,
        scoreBreakdown,
        missionScore: scoreBreakdown.total,
      };
    }),

  setPlayers: (players: number) =>
    set(() => ({ players, playerList: buildPlayerList(players) })),

  setPlayerName: (id: number, name: string) =>
    set((state) => ({
      playerList: state.playerList.map((p) =>
        p.id === id ? { ...p, name } : p
      ),
    })),

  setPlayerReady: (id: number, ready: boolean) =>
    set((state) => ({
      playerList: state.playerList.map((p) =>
        p.id === id ? { ...p, ready } : p
      ),
    })),

  addPlayerScore: (id: number, points: number) =>
    set((state) => ({
      playerList: state.playerList.map((p) =>
        p.id === id ? { ...p, score: p.score + points } : p
      ),
    })),

  setSimulationResults: (results: SimulationResultData) =>
    set(() => ({ simulationResults: results })),

  reset: () => set(() => ({ ...INITIAL_STATE })),
}));

// Keep MARS_MISSION_LIMITS export for backwards compatibility
export { MARS_MISSION_LIMITS };
