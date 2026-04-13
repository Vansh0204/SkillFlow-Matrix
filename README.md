# SkillFlow Matrix 🚀

A premium Team Skill Matrix Graph built with Next.js 14, TypeScript, Tailwind CSS, and React Flow. This application allows teams to visualize, manage, and analyze their collective technical capabilities in an immersive, interactive graph environment.

## ✨ Features

- **Interactive Skill Graph**: Built on React Flow with a custom physics-based layout (Dagre).
- **Intelligent Focus**: Selecting a node automatically dims unrelated connections, allowing you to focus on specific individuals or skill networks.
- **Dynamic Analysis**: 
  - **Skill Gaps**: Automatically identifies "Single Points of Failure" (skills only one person knows).
  - **Polymath Tracking**: Highlights top contributors with the broadest skill sets.
  - **Capability Leaders**: Shows the most prevalent skills within the team.
- **Full CRUD Support**: 
  - Add/Edit/Delete team members and skills.
  - Link people to skills with granular proficiency levels: **Learning**, **Familiar**, or **Expert**.
- **State Persistence**: All changes and node positions are persisted via `localStorage`.

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Visualization**: @xyflow/react (React Flow)
- **Layouting**: Dagre
- **Icons**: Lucide React
- **Animations**: Tailwind Animate + Framer Motion

## 🚀 Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
npm install
```

### 2. Development Mode

Run the development server:

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### 3. Build for Production

```bash
npm run build
npm start
```

## 📦 Project Structure

- `/app`: Next.js App Router and global styles.
- `/components`:
  - `SkillMatrixGraph`: Core canvas and orchestration.
  - `DetailPanel`: Deep-dive inspector and inline editor.
  - `CRUDPanel`: Panel for adding new data points.
  - `SummaryPanel`: Real-time analytics and skill gap analysis.
- `/lib`:
  - `types`: TypeScript interfaces.
  - `seedData`: Sample dataset.
  - `storage`: LocalStorage persistence logic.

---

Created with ❤️ using Antigravity.
