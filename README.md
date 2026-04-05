# Enterprise Provision Platform

An advanced internal tool built for enterprise scale, specializing in employee lifecycle mapping, unified task management, and inter-departmental communication tracking.

## Core Features
*   **Employee Onboarding Hub**: Employees receive guided tracking for watching orientation materials, acknowledging security policies, and connecting their provisioning credentials seamlessly.
*   **Kanban Task Architecture (Jira Sync)**: Integrated Story/Task/Bug metric tracking using interactive Kanban boards. Automatically spins up internal QA subtasks when engineers mark deployments ready for Review. 
*   **Manager Configuration Module**: Allows management personnel to visually map out organizational units and explicitly spin up new hires using Role-Based Access Control (RBAC) across external systems (AWS, Datadog, Slack, Notion).
*   **Simulated Communication Vectors**: Built-in mock Chat and stand-alone Outlook-style Email workflows that adapt to internal department hierarchies.

## Design & Tech Stack
*   **Framework**: React (Bootstrapped via Vite)
*   **Styling Engine**: Tailwind CSS (Leveraging heavy utilities, glassmorphic paneling, and a centralized `index.css` component design system).
*   **Animation**: Framer Motion (Utilized for step-indicators and slide-overs)
*   **Icons**: Lucide React

## Local Development
Getting up and running locally is extremely quick. 

1. Ensure you have the current LTS of [Node.js](https://nodejs.org/en) installed.
2. Clone the repository and install dependencies:
   ```bash
   npm install
   ```
3. Spin up the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the interface locally at `http://localhost:5173/`. *(You can cycle between Employee and Manager viewpoints using the mock login panel).*


<!-- redeploy trigger -->
