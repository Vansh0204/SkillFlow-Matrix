# SkillFlow Matrix 🔮
### *Architectural Team Capability Visualization & Strategic Analysis*

SkillFlow Matrix is a high-end, interactive capability graph designed for modern engineering teams. It transforms static skill spreadsheets into a dynamic, living network that allows leaders to identify skill gaps, talent concentrations, and strategic vulnerabilities in real-time.

---

## 🎨 Design Philosophy: "Deep Quartz"
The interface follows a bespoke **Editorial Powerhouse** aesthetic, moving away from generic SaaS templates:
- **Typography**: A curated pairing of **DM Serif Display** (Heads) for architectural elegance and **JetBrains Mono** (Data) for technical precision.
*   **Palette**: The "Deep Quartz" theme utilizes a custom midnight base with **Rose, Teal, and Lavender** accents, providing a sophisticated, human-centric data visualization environment.
*   **Interactivity**: High-fidelity glassmorphism (`backdrop-blur-2xl`) and intelligent connection dimming that focuses the user's attention precisely where it matters.

## 🚀 Core Features

### 🕸️ Interactive Capability Graph
*   **Elastic Connections**: Visualize the web of relationships between team members and technical skills.
*   **Intelligent Highlighting**: Selecting any node automatically dims the rest of the graph, isolating the selected entity's immediate network.
*   **Dagre Layout Engine**: Automated graph organization ensuring a clear hierarchical flow from team members to capabilities.

### 📊 Strategic Network Analytics
*   **Vulnerability Index**: Real-time identification of "Single Points of Failure"—critical skills held by only one individual.
*   **Polymath Tracking**: Data-driven highlighting of cross-functional contributors with the broadest skill sets.
*   **Mastery Concentrations**: Visual breakdown of the team's strongest capabilities (e.g., "Top 3 Skills").

### 🛠️ Total Management
*   **Granular Proficiency**: Map connections with three distinct levels: **Learning**, **Familiar**, and **Expert**.
*   **Real-time CRUD**: Add team members, register new skills, and update the matrix through a sleek, slide-in management interface.
*   **Zero-Database Deployment**: Fully functional via `localStorage` persistence, making it perfect for secure, localized team tracking or quick prototyping.

---

## 🛠️ Tech Stack

- **Core**: [Next.js 14](https://nextjs.org/) (App Router)
- **State & Graph**: [@xyflow/react](https://reactflow.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Typography**: [DM Serif Display](https://fonts.google.com/specimen/DM+Serif+Display) + [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono)
- **Deployment**: Optimized for [Vercel](https://vercel.com/)

---

## 🏁 Getting Started

### 1. Installation
```bash
git clone https://github.com/Vansh0204/SkillFlow-Matrix.git
cd SkillFlow-Matrix
npm install
```

### 2. Launch Development
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the matrix.

### 3. Production Build
```bash
npm run build
npm start
```

---

## 📂 Project Architecture

- **`/app`**: Next.js routing, layout configuration, and the "Editorial Powerhouse" font system.
- **`/components`**:
    - `SkillMatrixGraph`: The primary orchestration layer and React Flow implementation.
    - `DetailPanel`: Profiler for nodes with inline editing and deletion logic.
    - `SummaryPanel`: The analytics engine calculating team health metrics.
    - `CRUDPanel`: Unified data entry for people, skills, and connections.
- **`/lib`**:
    - `storage.ts`: High-performance persistence layer for state and node positions.
    - `types.ts`: Strictly typed interfaces for the entire Capability Graph.

---

Created by [Vansh Agarwal](https://github.com/Vansh0204) using **Antigravity**. 
*Turning complex human networks into actionable strategic data.*
