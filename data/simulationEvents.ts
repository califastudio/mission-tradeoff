import { SimulationEvent } from '../types/mission';

export const SIMULATION_EVENTS: SimulationEvent[] = [
  // ── SPACE HAZARD EVENTS ───────────────────────────────────────────────────
  {
    id: 'conjunction-warning',
    type: 'hazard',
    title: 'CONJUNCTION WARNING — CRITICAL',
    description:
      'A 15 cm rocket body fragment from an old launch vehicle is crossing your orbit. Probability of Collision: 1/340 — well above the 1/10,000 NASA threshold for mandatory action. Time to closest approach: 4 h 23 min. Ground station contact: 2 h 15 min away.',
    icon: '☄️',
    context:
      'Pc: 1/340 (RED) | ΔV budget remaining: 12 m/s | Ground contact in: 2 h 15 min | Battery: 87%',
    options: [
      {
        id: 'maneuver',
        label: '🚀 Execute CAM — prograde burn +3 m/s',
        outcome:
          'Collision Avoidance Maneuver successful. Orbital period shifted 11 minutes. Fragment passed safely at 1.2 km. 3 m/s delta-V consumed from your budget.',
        nasaAction:
          'ISS executed a nearly identical CAM in October 2020, burning 1.5 m/s and losing 2 days of observation window.',
        scoreEffect: 8,
        stressEffect: -15,
        isOptimal: true,
      },
      {
        id: 'safe-mode',
        label: '🔒 Safe mode — wait for ground confirmation',
        outcome:
          'Ground controllers approved a minimal retrograde burn 40 min before closest approach. Fuel cost was suboptimal but collision was avoided. Fragment passed at 680 m.',
        scoreEffect: -3,
        stressEffect: -5,
      },
      {
        id: 'accept-risk',
        label: '📊 Accept risk — maintain orbit, save delta-V',
        outcome:
          'Fragment passed 320 m away at 7.8 km/s relative velocity. No impact — this time. Crew stress elevated. Near-miss entered in the Space Surveillance Network log.',
        scoreEffect: -15,
        stressEffect: 25,
      },
    ],
    nasaFact:
      'As of 2026, there are 35,000+ tracked objects in Earth orbit and millions of untracked fragments. The ISS performs 2–3 Collision Avoidance Maneuvers per year. The 1/10,000 Pc threshold is now international standard (NASA/DoD 2007).',
  },
  {
    id: 'micrometeorite',
    type: 'hazard',
    title: 'Micrometeorite Impact Detected',
    description:
      'Telemetry shows a 6 % drop in Solar Panel Array B efficiency over 4 hours. A sub-millimeter particle has pitted the panel surface. Cumulative micro-impacts are normal but require active management.',
    icon: '💥',
    options: [
      {
        id: 'redistribute',
        label: '🔄 Redistribute power load across remaining panels',
        outcome:
          'Power management reconfigured. Science ops reduced 8 % but mission continues nominally. Panel B at 94 %. Consistent with Hubble panel aging data.',
        scoreEffect: 5,
        stressEffect: -5,
        isOptimal: true,
      },
      {
        id: 'reduce-science',
        label: '🔬 Reduce instrument duty cycle to 70 %',
        outcome:
          'Instruments at 70 % duty cycle. Power balance restored. Mission timeline extended 6 weeks to compensate for lost observation time.',
        scoreEffect: -5,
        stressEffect: 0,
      },
      {
        id: 'ignore',
        label: '⏩ Continue all operations — remote monitoring only',
        outcome:
          'Panel degradation reached 18 % efficiency loss over 3 months. Emergency power reduction forced with 48 h notice. Long-term mission capacity compromised.',
        scoreEffect: -12,
        stressEffect: 10,
      },
    ],
    nasaFact:
      "Hubble's solar panels show thousands of micrometeorite craters after 34 years. The James Webb Space Telescope was hit by a larger-than-expected micrometeorite in June 2022, causing minor but permanent damage.",
  },
  {
    id: 'asteroid-proximity',
    type: 'hazard',
    title: '☄️ Unexpected Asteroid Proximity',
    description:
      'An uncharted Near-Earth Object (~40 m diameter) has been detected 48 hours from your trajectory. It was not in pre-launch catalogs — discovered now by your onboard radar. No collision risk, but orbital debris from its micro-fragment cloud is a concern.',
    icon: '🪨',
    options: [
      {
        id: 'scan-redirect',
        label: '🔭 Redirect instruments — unique science opportunity',
        outcome:
          'Your team performs opportunistic multi-spectral imaging of the uncharted asteroid. Data sent to MPC catalog. +12 bonus science value. Slight trajectory adjustment consumes 1.2 m/s delta-V.',
        scoreEffect: 12,
        stressEffect: 5,
        isOptimal: true,
      },
      {
        id: 'avoid',
        label: '🚀 Avoidance maneuver — increase safe distance',
        outcome:
          'Standard avoidance burn executed. Asteroid passes safely at 2,100 km. Conservative choice — 2 m/s delta-V consumed. No science gained from the encounter.',
        scoreEffect: 2,
        stressEffect: -5,
      },
      {
        id: 'ignore-asteroid',
        label: '📡 Continue current trajectory — monitor only',
        outcome:
          'Asteroid micro-fragment cloud caused minor sensor degradation on three non-critical instruments. Mission continues but spectrometer noise floor increased by 12 %.',
        scoreEffect: -8,
        stressEffect: 15,
      },
    ],
    nasaFact:
      "DART (Double Asteroid Redirection Test) successfully deflected Dimorphos in September 2022 — humanity's first planetary defense demonstration. ESA's Hera mission is now studying the aftermath. Near-Earth Object surveys find ~1,500 new asteroids per year.",
  },
  // ── ENGINEERING EVENTS ────────────────────────────────────────────────────
  {
    id: 'solar-flare',
    type: 'engineering',
    title: '☀️ Class X Solar Flare — Warning',
    description:
      'NOAA Space Weather Center reports a Class X2.3 solar flare with Earth-directed CME. Energetic particle storm reaches your spacecraft in 18 minutes. Projected crew radiation dose: 28–35 mSv in 4 hours without protection.',
    icon: '☀️',
    options: [
      {
        id: 'safe-mode',
        label: '🛡️ Safe mode — shelter crew, protect instruments',
        outcome:
          'Non-essential systems shut down. Crew sheltered in the radiation-hardened compartment. Post-storm restart successful. Crew absorbed 8 mSv — well within annual limit.',
        scoreEffect: 5,
        stressEffect: 5,
        isOptimal: true,
      },
      {
        id: 'continue-science',
        label: '🔬 Continue science — accept radiation risk for unique data',
        outcome:
          'Collected 4 hours of rare X-flare data — scientifically exceptional! But crew absorbed 31 mSv. Cumulative annual budget now at 78 %. One spectrometer sensor partially degraded.',
        scoreEffect: 8,
        stressEffect: 15,
      },
      {
        id: 'partial-shutdown',
        label: '⚡ Partial shutdown — protect crew, let instruments run',
        outcome:
          'Crew protected (dose: 7 mSv). Instruments not fully safed — camera thermal control affected. Degraded imaging for 2 weeks post-storm.',
        scoreEffect: 2,
        stressEffect: 0,
      },
    ],
    nasaFact:
      'The 2003 Halloween Solar Storms damaged 28 operational satellites. ISS crew sheltered for 36 hours. NASA limits career radiation to 600 mSv for astronauts and 500 mSv/year for deep space missions.',
  },
  {
    id: 'data-storage',
    type: 'engineering',
    title: '💾 Onboard Storage Critical',
    description:
      'High-resolution camera data filling onboard storage 3× faster than modeled. Storage full in 6 hours — ground station contact not available for 9 hours.',
    icon: '💾',
    options: [
      {
        id: 'compress',
        label: '📦 Enable lossless data compression algorithm',
        outcome:
          'Onboard compression achieved 2.4:1 ratio. Storage crisis averted with 18 % headroom. All data preserved at full quality.',
        scoreEffect: 8,
        stressEffect: -5,
        isOptimal: true,
      },
      {
        id: 'reduce-camera',
        label: '📷 Reduce HiRes camera resolution to 8 m/pixel temporarily',
        outcome:
          'Storage pressure relieved. 12-hour window at reduced resolution adds 3 weeks to full-coverage timeline. Data still scientifically valuable for context mapping.',
        scoreEffect: -5,
        stressEffect: 0,
      },
      {
        id: 'delete-old',
        label: '🗑️ Delete lower-priority spectrometer data',
        outcome:
          '180 GB of mineral composition data permanently lost. Post-mission science reviewers flagged the gap — reduced publication output from mission.',
        scoreEffect: -15,
        stressEffect: 8,
      },
    ],
    nasaFact:
      'Mars Reconnaissance Orbiter downlinks ~26 Terabits per year to DSN ground stations. MRO carries 160 GB of onboard flash storage — carefully managed since 2006.',
  },
  {
    id: 'comm-blackout',
    type: 'engineering',
    title: '📡 Mars Solar Conjunction — 14-Day Blackout',
    description:
      'Solar conjunction: the Sun is directly between Earth and Mars. No uplink or downlink possible for 14 days. One-way light travel time is 20 min — the spacecraft must operate fully autonomously.',
    icon: '📡',
    options: [
      {
        id: 'autonomous',
        label: '🤖 Activate full autonomous operations — pre-loaded plans',
        outcome:
          'Spacecraft successfully executed 14 days of pre-loaded observation sequences with 94 % science efficiency. Post-conjunction data burst successful.',
        scoreEffect: 10,
        stressEffect: 5,
        isOptimal: true,
      },
      {
        id: 'safe-mode-comm',
        label: '🛡️ Safe mode — suspend all science, wait for contact',
        outcome:
          'All science suspended for 14 days. No data loss — but 14 days of observation time permanently lost.',
        scoreEffect: -10,
        stressEffect: -10,
      },
      {
        id: 'try-relay',
        label: '📶 Relay via MAVEN and MRO orbiters',
        outcome:
          'Partial relay link established through NASA assets in Mars orbit. 40 % of planned observations completed during blackout. Creative use of infrastructure!',
        scoreEffect: 7,
        stressEffect: 0,
      },
    ],
    nasaFact:
      'Mars solar conjunction occurs every ~26 months and lasts ~2 weeks. During the 2022 conjunction, Perseverance, Curiosity, MAVEN, MRO, and InSight all operated autonomously.',
  },
  // ── HEALTH EVENTS ─────────────────────────────────────────────────────────
  {
    id: 'crew-fatigue',
    type: 'health',
    title: '😴 Crew Wellbeing — Month 8',
    description:
      'Performance metrics declining. Sleep efficiency dropped to 68 % (target: 85 %). Mission surgeon reports fatigue, mild depression, and interpersonal tension — expected symptoms for month 8 of deep space isolation.',
    icon: '💤',
    options: [
      {
        id: 'rest-day',
        label: '☕ Mandatory rest days — 3 days off-duty',
        outcome:
          'Crew performance restored to 94 %. Morale improved significantly. Mission timeline extended 3 days — a worthwhile trade for sustained effectiveness.',
        scoreEffect: 10,
        stressEffect: -20,
        isOptimal: true,
      },
      {
        id: 'light-duty',
        label: '📋 Light duty schedule — maintain minimum operations',
        outcome:
          'Partial recovery to 82 % performance over 1 week. Acceptable outcome. Crew reported the light duty was helpful but insufficient.',
        scoreEffect: 3,
        stressEffect: -10,
      },
      {
        id: 'push-through',
        label: '💪 Mission objectives take priority — push through',
        outcome:
          'Performance degraded further. Two operational errors recorded over 3 weeks. Eventually required emergency 5-day rest — losing more time overall and creating lasting crew tension.',
        scoreEffect: -15,
        stressEffect: 30,
      },
    ],
    nasaFact:
      "ISS astronauts average 6.1 hours of sleep per night vs. the recommended 8+. NASA's Human Research Program identifies behavioral health as a critical risk for deep space missions.",
  },
];

export function pickSimulationEvents(count: number = 3): SimulationEvent[] {
  const hazards = SIMULATION_EVENTS.filter((e) => e.type === 'hazard');
  const others = SIMULATION_EVENTS.filter((e) => e.type !== 'hazard');

  const shuffledHazards = [...hazards].sort(() => Math.random() - 0.5);
  const shuffledOthers = [...others].sort(() => Math.random() - 0.5);

  // Always include at least 1 hazard
  const selected: SimulationEvent[] = [
    shuffledHazards[0],
    ...shuffledOthers.slice(0, count - 1),
  ];

  return selected.sort(() => Math.random() - 0.5);
}
