export interface LauncherVehicle {
  id: string;
  name: string;
  icon: string;
  description: string;
  payloadKg: number;
  budgetCostM: number;
  envImpact: number;
  nasaRef: string;
  color: string;
  borderColor: string;
}

export interface OrbitType {
  id: string;
  name: string;
  icon: string;
  description: string;
  massMultiplier: number;
  envImpact: number;
  nasaRef: string;
  color: string;
  borderColor: string;
  compatible: string[]; // scenario ids
}

export const LAUNCHERS: LauncherVehicle[] = [
  {
    id: 'falcon9',
    name: 'Falcon 9',
    icon: '🚀',
    description: 'SpaceX reusable rocket. Most cost-effective for most missions. 22,800 kg to LEO.',
    payloadKg: 1600,
    budgetCostM: 30,
    envImpact: 15,
    nasaRef: 'SpaceX Falcon 9 — most launched orbital rocket in history. First stage lands back on a drone ship.',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
  },
  {
    id: 'falcon-heavy',
    name: 'Falcon Heavy',
    icon: '🔥',
    description: 'Triple-core SpaceX rocket. 63,800 kg to LEO. Best for heavy science payloads.',
    payloadKg: 2500,
    budgetCostM: 50,
    envImpact: 22,
    nasaRef: 'SpaceX Falcon Heavy — currently the most powerful operational rocket, used by NOAA and USSF.',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
  },
  {
    id: 'sls',
    name: 'NASA SLS Block 1',
    icon: '🛸',
    description: 'NASA Space Launch System. Designed for deep space. 95,000 kg to LEO. Very high cost.',
    payloadKg: 3200,
    budgetCostM: 100,
    envImpact: 30,
    nasaRef: 'NASA SLS — first launched 2022 (Artemis I). Designed for crewed Moon/Mars missions.',
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500/40',
  },
  {
    id: 'ariane6',
    name: 'Ariane 6',
    icon: '🇪🇺',
    description: 'ESA next-generation rocket. Reliable, competitive pricing. 21,600 kg to LEO.',
    payloadKg: 1400,
    budgetCostM: 35,
    envImpact: 18,
    nasaRef: 'ESA Ariane 6 — first launched July 2024. Europe primary launch vehicle for science missions.',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
  },
];

export const ORBITS: OrbitType[] = [
  {
    id: 'leo',
    name: 'Low Earth Orbit',
    icon: '🌍',
    description: 'LEO (200-2,000 km). Easy to reach, low fuel cost. High debris risk.',
    massMultiplier: 0.90,
    envImpact: 20,
    nasaRef: 'LEO hosts ISS, Hubble, and over 60% of all active satellites. Highest debris density zone.',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    compatible: ['moon-mapping'],
  },
  {
    id: 'polar',
    name: 'Sun-Synchronous Orbit',
    icon: '🔄',
    description: 'Polar SSO (~700 km). Full-planet mapping. Consistent solar illumination for cameras.',
    massMultiplier: 0.82,
    envImpact: 12,
    nasaRef: 'SSO used by Landsat, Sentinel, and most Earth-observation missions. Passes over poles every orbit.',
    color: 'text-emerald-400',
    borderColor: 'border-emerald-500/40',
    compatible: ['moon-mapping', 'mars-mapping'],
  },
  {
    id: 'gto',
    name: 'Geostationary Transfer',
    icon: '🛰️',
    description: 'GTO to GEO (35,786 km). High altitude. Less orbital debris. High fuel cost.',
    massMultiplier: 0.75,
    envImpact: 8,
    nasaRef: 'GEO hosts 400+ operational communication and weather satellites. Very stable orbit.',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    compatible: ['moon-mapping'],
  },
  {
    id: 'interplanetary',
    name: 'Interplanetary Trajectory',
    icon: '🌌',
    description: 'Direct interplanetary transfer. Minimum-energy launch window. Required for Mars/Beyond.',
    massMultiplier: 0.65,
    envImpact: 5,
    nasaRef: 'Hohmann transfer orbit — the energy-efficient path used by every Mars mission. Launch window every 26 months.',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    compatible: ['mars-mapping', 'asteroid-defense', 'jupiter-system', 'interstellar', 'legendary'],
  },
];

export function getLauncher(id: string): LauncherVehicle {
  return LAUNCHERS.find(l => l.id === id) ?? LAUNCHERS[0];
}

export function getOrbit(id: string): OrbitType {
  return ORBITS.find(o => o.id === id) ?? ORBITS[0];
}
