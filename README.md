# 🚀 Mission Trade-Off

**NASA Space Apps Challenge 2026** | Team: Califa Studio 🇦🇷

> *"Every decision shapes the mission. Build smart. Launch far."*

[![NASA Space Apps](https://img.shields.io/badge/NASA-Space%20Apps%202026-blue?logo=nasa)](https://www.spaceappschallenge.org)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)

## 🌍 The Problem

Designing a space mission means making hundreds of competing decisions across engineering, environment, and human health. For students and aspiring engineers, these trade-offs remain abstract — there's no accessible way to experience a full mission from concept to operation.

**Mission Trade-Off bridges that gap.**

## 🎮 What is Mission Trade-Off?

An interactive web game where **1-4 players** collaboratively design, build, and simulate a complete space mission — managing real engineering constraints, environmental responsibility, and crew safety in real time.

### ⚖️ The 3 Axes Every Mission Must Balance

| Axis | What You Manage |
|------|----------------|
| ⚙️ **Engineering & Resources** | Mass, power, budget, data rate, communications, mission lifetime |
| 🌱 **Environmental Impact** | Launch emissions, propulsion type, space debris, non-renewable resource use |
| 💚 **Crew Health & Risk** | Radiation exposure, microgravity effects, isolation, medical support delays |

> No other mission design game includes all three axes. We added Environmental Impact and Crew Health because **space is humanity's common heritage — and every mission leaves a mark.**

## 🎯 MVP Scenario: Mars High-Resolution Mapping

**Objective:** Achieve global Mars surface mapping at ≤5m/pixel resolution over 70%+ of the planet, within a 2-4 year mission lifetime.

**Key engineering challenges:**
- High-resolution camera → massive data generation → communications bottleneck
- Polar orbit for full coverage → higher power demands
- 3-year mission → elevated crew radiation exposure (NASA HHP limit: 500 mSv/year)
- Real budget constraints based on NASA Discovery-class missions (~$350M)

## 🎲 How to Play

```
1. 🎯 Choose your mission scenario (Mars Mapping in MVP)
2. 🛸 Select spacecraft bus → defines your foundation
3. ⚡ Add propulsion system → impacts environment dramatically
4. 🔭 Choose scientific instruments → balance science vs. resources
5. 📡 Set up communications → handle data downlink
6. 🛡️ Add crew health systems → manage radiation & microgravity
7. 📊 Watch real-time dashboard → meters go green/yellow/red
8. 🚀 Simulate the mission → face random events
9. 📋 Read your mission report → score + recommendations
```

## 🛰️ NASA Resources Used

| Problem | NASA Resource | How We Use It |
|---------|--------------|---------------|
| Crew radiation risk | NASA Health & Human Performance (HHP) | In-game crew risk calculator; 500 mSv/year limit |
| Space debris | NASA Orbital Debris Program (ODPO) | Debris score per propulsion type; cleanup costs |
| Orbital mechanics | NASA GMAT Tool | Simplified orbit physics for trajectory planning |
| Mars mission parameters | Mars Reconnaissance Orbiter (MRO) data | MVP scenario: orbit, resolution, data volumes |
| Mission budgets | NASA Discovery/New Frontiers cost data | Realistic budget categories and limits |
| Environmental emissions | NASA launch environmental reports | Propulsion emission factors per kg to orbit |

## 🏆 Scoring System

| Category | Weight | What It Measures |
|----------|--------|-----------------|
| 🔭 Scientific Value | 35% | Instrument capability + objective completion |
| ⚙️ Resource Efficiency | 20% | How well you used mass/power/budget |
| 🎯 Mission Objectives | 15% | Did you meet the core mission goal? |
| 🌱 Environmental Impact | 15% | Lower debris + emissions = higher score |
| 💚 Crew Health | 15% | Radiation dose + countermeasures |

## 👥 Player Roles

| Role | Responsibility |
|------|---------------|
| 🧑‍💼 Mission Manager | Objectives, budget, timeline |
| 🔧 Spacecraft Engineer | Bus, power, propulsion systems |
| 🔬 Payload Scientist | Instruments, scientific value |
| 📡 Operations & Health | Communications, crew safety |

Roles auto-adapt for 1-3 players.

## 🛠️ Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19 + Tailwind CSS 4
- **State:** Zustand 5
- **Language:** TypeScript 5
- **Deploy:** Vercel (zero-config)

## 🚀 Run Locally

```bash
git clone https://github.com/califastudio/mission-tradeoff
cd mission-tradeoff
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📂 Project Structure

```
mission-tradeoff/
├── app/
│   ├── page.tsx          # Landing page
│   ├── game/page.tsx     # Main game screen
│   ├── report/page.tsx   # Mission report
│   └── layout.tsx
├── types/
│   └── mission.ts        # TypeScript types
├── data/
│   └── components.ts     # Spacecraft component catalog
└── store/
    └── missionStore.ts   # Zustand global state
```

## 🗺️ Roadmap

- [x] MVP: Mars scenario, 1-4 players, 3-axis real-time dashboard
- [x] Component catalog with real NASA-based data
- [x] Simulation with random events
- [x] Mission report with actionable recommendations
- [ ] Multiplayer (Socket.io real-time)
- [ ] 3D spacecraft visualization (Three.js)
- [ ] Classroom/educator mode with lesson plans
- [ ] Additional scenarios: Asteroid Defense, Lunar Base, Europa Clipper
- [ ] Save, share, and compare mission designs
- [ ] Mobile-responsive version

## 👨‍👩‍👦 Team

**Califa Studio** — Buenos Aires, Argentina 🇦🇷

- **Berno** — Lead developer & designer
- **Mom** — Co-designer & mission strategist

*First-time NASA Space Apps participants. Building for the next generation of space mission designers.*

## 📄 License

MIT — Open source for educational use.

---

*Built with ❤️ for NASA Space Apps Challenge 2026*

*"Space is humanity's common heritage. Every decision leaves a mark."*
