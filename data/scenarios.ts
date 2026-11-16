export type Difficulty = 'easy' | 'intermediate' | 'hard' | 'extreme' | 'impossible' | 'legendary';

export interface MissionScenario {
  id: string;
  name: string;
  destination: string;
  difficulty: Difficulty;
  difficultyLabel: string;
  icon: string;
  description: string;
  briefing: string;
  color: string;
  borderColor: string;
  // Resource limits
  massLimit: number;
  powerLimit: number;
  budgetLimit: number;
  // Scoring modifiers
  primaryObjectiveId: string;   // component id required for full objective score
  scienceMultiplier: number;    // harder = more science value needed
  // NASA facts
  distanceKm: string;
  travelTime: string;
  nasaRef: string;
}

export const SCENARIOS: MissionScenario[] = [
  {
    id: 'moon-mapping',
    name: 'Lunar Mapper',
    destination: 'The Moon',
    difficulty: 'easy',
    difficultyLabel: '⭐ EASY',
    icon: '🌙',
    description: 'Map the lunar south pole to find water ice deposits for future crewed missions.',
    briefing: 'NASA Artemis needs detailed maps of the lunar south pole. Your mission: deploy a small orbiter to identify water ice, terrain, and safe landing zones. Budget is generous — this is a priority mission.',
    color: 'text-sky-400',
    borderColor: 'border-sky-500/40',
    massLimit: 2000,
    powerLimit: 1500,
    budgetLimit: 500,
    primaryObjectiveId: 'inst-hires-cam',
    scienceMultiplier: 0.8,
    distanceKm: '384,400 km',
    travelTime: '3 days',
    nasaRef: 'Inspired by NASA LRO and upcoming Artemis lunar surface missions',
  },
  {
    id: 'mars-mapping',
    name: 'Mars Explorer',
    destination: 'Mars',
    difficulty: 'intermediate',
    difficultyLabel: '⭐⭐ INTERMEDIATE',
    icon: '🔴',
    description: 'Map the Martian surface for signs of ancient water and future landing sites.',
    briefing: 'Design a Mars orbiter capable of high-resolution surface mapping, mineral analysis, and subsurface radar. Mass and budget are constrained — every kilogram counts at interplanetary distances.',
    color: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    massLimit: 1500,
    powerLimit: 1000,
    budgetLimit: 350,
    primaryObjectiveId: 'inst-hires-cam',
    scienceMultiplier: 1.0,
    distanceKm: '54.6M – 401M km',
    travelTime: '7–9 months',
    nasaRef: 'Inspired by Mars Reconnaissance Orbiter (MRO) and MAVEN missions',
  },
  {
    id: 'asteroid-defense',
    name: 'Asteroid Defense',
    destination: 'Near-Earth Asteroid',
    difficulty: 'hard',
    difficultyLabel: '⭐⭐⭐ HARD',
    icon: '☄️',
    description: 'A 500m asteroid has been flagged as potentially hazardous. Characterize it fast.',
    briefing: 'PHA-2026-BX1 has a 1/450 impact probability — above the red threshold. You have 18 months to design, launch, and reach it for full characterization before the deflection window closes. Launch window: 12 days. Budget is emergency-level but mass is critical.',
    color: 'text-amber-400',
    borderColor: 'border-amber-500/40',
    massLimit: 1200,
    powerLimit: 800,
    budgetLimit: 280,
    primaryObjectiveId: 'inst-spec',
    scienceMultiplier: 1.3,
    distanceKm: '2.1M – 8.4M km',
    travelTime: '14–18 months',
    nasaRef: 'Inspired by NASA DART and ESA Hera planetary defense missions',
  },
  {
    id: 'jupiter-system',
    name: 'Jupiter System',
    destination: 'Europa / Ganymede',
    difficulty: 'extreme',
    difficultyLabel: '⭐⭐⭐⭐ EXTREME',
    icon: '🪐',
    description: 'Survive Jupiter\'s radiation belts and search for life signs in Europa\'s ocean.',
    briefing: 'Jupiter\'s radiation environment destroys unshielded electronics in hours. Your spacecraft must survive 10+ years of travel, intense radiation, and operate autonomously for months at a time. Every subsystem must be rad-hardened. Budget and mass are brutally constrained.',
    color: 'text-purple-400',
    borderColor: 'border-purple-500/40',
    massLimit: 1000,
    powerLimit: 600,
    budgetLimit: 220,
    primaryObjectiveId: 'inst-radar',
    scienceMultiplier: 1.6,
    distanceKm: '588M – 968M km',
    travelTime: '5–6 years',
    nasaRef: 'Inspired by NASA Europa Clipper and ESA JUICE missions',
  },
  {
    id: 'interstellar',
    name: 'Interstellar Probe',
    destination: 'Beyond the Heliosphere',
    difficulty: 'impossible',
    difficultyLabel: '⭐⭐⭐⭐⭐ IMPOSSIBLE',
    icon: '🌌',
    description: 'Design humanity\'s fastest deep space probe — destination: interstellar space.',
    briefing: 'Beyond 100 AU, solar power is useless. Communications take 14+ hours one way. No ground support in real time. No second chances. Your craft must operate fully autonomously for 50+ years on RTG power alone. Budget is civilian. This has never been done on purpose.',
    color: 'text-red-400',
    borderColor: 'border-red-500/40',
    massLimit: 800,
    powerLimit: 400,
    budgetLimit: 180,
    primaryObjectiveId: 'inst-mag',
    scienceMultiplier: 2.0,
    distanceKm: '100 AU+ (14.9B km)',
    travelTime: '15–50 years',
    nasaRef: 'Inspired by Voyager 1 & 2, and the proposed Interstellar Probe concept study (2021)',
  },
  {
    id: 'legendary',
    name: '🌟 LEGENDARY',
    destination: 'Alpha Centauri',
    difficulty: 'legendary',
    difficultyLabel: '👑 LEGENDARY',
    icon: '✨',
    description: 'Send a probe to the nearest star system. 4.37 light-years away. No one has done this. Ever.',
    briefing: 'Alpha Centauri is 4.37 light-years away. At Voyager\'s speed it would take 73,000 years. You have $150M, 700kg, and physics. Breakthrough Starshot theorizes laser-propelled lightsails reaching 20% speed of light. This is not a drill — design the most ambitious mission in human history.',
    color: 'text-yellow-400',
    borderColor: 'border-yellow-500/40',
    massLimit: 700,
    powerLimit: 300,
    budgetLimit: 150,
    primaryObjectiveId: 'prop-solar-sail',
    scienceMultiplier: 3.0,
    distanceKm: '4.13 × 10¹³ km',
    travelTime: '20 years at 20% light speed',
    nasaRef: 'Inspired by Breakthrough Starshot initiative and NASA JPL deep space propulsion research',
  },
];

export function getScenario(id: string): MissionScenario {
  return SCENARIOS.find(s => s.id === id) ?? SCENARIOS[1];
}

export const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'intermediate', 'hard', 'extreme', 'impossible', 'legendary'];
