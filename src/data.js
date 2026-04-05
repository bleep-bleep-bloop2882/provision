// ─── Departments & Roles ──────────────────────────────────────────────────────
export const DEPARTMENTS = {
  Engineering: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer', 'Staff Engineer', 'QA Engineer'],
  Design: ['UI/UX Designer', 'Brand Designer', 'Design Lead'],
  Product: ['Product Manager', 'Associate PM', 'Technical PM'],
  Data: ['Data Analyst', 'Data Engineer', 'ML Engineer'],
  Legal: ['Legal Counsel', 'Compliance Analyst'],
  Finance: ['Financial Analyst', 'Controller', 'Finance Manager'],
  Sales: ['Account Executive', 'Sales Engineer', 'Customer Success'],
  Testing: ['Manual Tester', 'QA Automation Engineer', 'SDET', 'Test Lead'],
};

// ─── Systems ──────────────────────────────────────────────────────────────────
// level: 'admin' | 'write' | 'read' | 'none' | 'granted'
export const SYSTEMS = [
  { id: 'github',     name: 'GitHub',           icon: '🐙', desc: 'Source code & version control' },
  { id: 'jira',       name: 'Jira',             icon: '📋', desc: 'Issue tracking & sprint management' },
  { id: 'aws',        name: 'AWS',              icon: '☁️',  desc: 'Cloud infrastructure' },
  { id: 'slack',      name: 'Slack',            icon: '💬', desc: 'Team communication' },
  { id: 'notion',     name: 'Notion',           icon: '📓', desc: 'Docs, wikis & knowledge base' },
  { id: 'prod_db',    name: 'Production DB',    icon: '🗄️',  desc: 'Live database access' },
  { id: 'vpn',        name: 'VPN',              icon: '🔒', desc: 'Secure network access' },
  { id: 'datadog',    name: 'Datadog',          icon: '📊', desc: 'Monitoring & observability' },
  { id: 'figma',      name: 'Figma',            icon: '🎨', desc: 'Design & prototyping' },
  { id: 'salesforce', name: 'Salesforce',       icon: '☁️',  desc: 'CRM & sales pipeline' },
  { id: 'looker',     name: 'Looker',           icon: '🔍', desc: 'BI & data analytics' },
  { id: 'zoom',       name: 'Zoom',             icon: '📹', desc: 'Video conferencing' },
];

// ─── Permission map per role ──────────────────────────────────────────────────
export const ROLE_PERMISSIONS = {
  'Frontend Developer':  { github: 'write', jira: 'write', aws: 'read', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'read', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'Backend Developer':   { github: 'write', jira: 'write', aws: 'write', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'write', figma: 'none', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'DevOps Engineer':     { github: 'admin', jira: 'write', aws: 'admin', slack: 'granted', notion: 'write', prod_db: 'write', vpn: 'granted', datadog: 'admin', figma: 'none', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'Staff Engineer':      { github: 'admin', jira: 'admin', aws: 'admin', slack: 'granted', notion: 'admin', prod_db: 'write', vpn: 'granted', datadog: 'admin', figma: 'read', salesforce: 'none', looker: 'read', zoom: 'granted' },
  'QA Engineer':         { github: 'read',  jira: 'write', aws: 'read', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'read', figma: 'read', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'UI/UX Designer':      { github: 'read',  jira: 'write', aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'write', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'Brand Designer':      { github: 'none',  jira: 'read',  aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'none', datadog: 'none', figma: 'admin', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'Design Lead':         { github: 'read',  jira: 'write', aws: 'none', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'admin', salesforce: 'none', looker: 'read', zoom: 'granted' },
  'Product Manager':     { github: 'read',  jira: 'admin', aws: 'none', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'write', salesforce: 'read', looker: 'write', zoom: 'granted' },
  'Associate PM':        { github: 'read',  jira: 'write', aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'read', salesforce: 'read', looker: 'read', zoom: 'granted' },
  'Technical PM':        { github: 'read',  jira: 'admin', aws: 'read', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'write', salesforce: 'read', looker: 'write', zoom: 'granted' },
  'Data Analyst':        { github: 'read',  jira: 'read',  aws: 'read', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'read', figma: 'none', salesforce: 'read', looker: 'write', zoom: 'granted' },
  'Data Engineer':       { github: 'write', jira: 'write', aws: 'write', slack: 'granted', notion: 'write', prod_db: 'write', vpn: 'granted', datadog: 'write', figma: 'none', salesforce: 'none', looker: 'admin', zoom: 'granted' },
  'ML Engineer':         { github: 'write', jira: 'write', aws: 'write', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'read', figma: 'none', salesforce: 'none', looker: 'write', zoom: 'granted' },
  'Legal Counsel':       { github: 'none',  jira: 'write', aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'none', salesforce: 'read', looker: 'none', zoom: 'granted' },
  'Compliance Analyst':  { github: 'read',  jira: 'read',  aws: 'read', slack: 'granted', notion: 'read', prod_db: 'read', vpn: 'granted', datadog: 'read', figma: 'none', salesforce: 'read', looker: 'read', zoom: 'granted' },
  'Financial Analyst':   { github: 'none',  jira: 'read',  aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'none', salesforce: 'write', looker: 'write', zoom: 'granted' },
  'Controller':          { github: 'none',  jira: 'write', aws: 'none', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'none', salesforce: 'admin', looker: 'admin', zoom: 'granted' },
  'Finance Manager':     { github: 'none',  jira: 'write', aws: 'none', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'none', figma: 'none', salesforce: 'admin', looker: 'admin', zoom: 'granted' },
  'Account Executive':   { github: 'none',  jira: 'read',  aws: 'none', slack: 'granted', notion: 'read',  prod_db: 'none', vpn: 'none', datadog: 'none', figma: 'none', salesforce: 'admin', looker: 'read', zoom: 'granted' },
  'Sales Engineer':      { github: 'read',  jira: 'write', aws: 'read', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'read', salesforce: 'write', looker: 'read', zoom: 'granted' },
  'Customer Success':    { github: 'none',  jira: 'read',  aws: 'none', slack: 'granted', notion: 'read',  prod_db: 'none', vpn: 'none', datadog: 'none', figma: 'none', salesforce: 'write', looker: 'read', zoom: 'granted' },
  'Manual Tester':          { github: 'read',  jira: 'write', aws: 'none', slack: 'granted', notion: 'write', prod_db: 'none', vpn: 'granted', datadog: 'read', figma: 'read', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'QA Automation Engineer': { github: 'write', jira: 'write', aws: 'read', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'write', figma: 'read', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'SDET':                   { github: 'write', jira: 'write', aws: 'write', slack: 'granted', notion: 'write', prod_db: 'read', vpn: 'granted', datadog: 'write', figma: 'read', salesforce: 'none', looker: 'none', zoom: 'granted' },
  'Test Lead':              { github: 'admin', jira: 'admin', aws: 'read', slack: 'granted', notion: 'admin', prod_db: 'none', vpn: 'granted', datadog: 'admin', figma: 'read', salesforce: 'none', looker: 'read', zoom: 'granted' },
};

// ─── Company Policies ─────────────────────────────────────────────────────────
export const POLICIES = [
  {
    id: 'coc', title: 'Code of Conduct', icon: '📜', required: true,
    summary: 'Our Code of Conduct defines the standards of behavior expected from all employees and contractors. It covers respectful communication, zero tolerance for harassment, conflict of interest, and how to report concerns. All employees must read and acknowledge this before starting work.',
    readTime: '8 min read',
  },
  {
    id: 'security', title: 'Information Security Policy', icon: '🔐', required: true,
    summary: 'This policy governs how employees handle company data, access credentials, and company devices. Key requirements: use a password manager, enable MFA on all accounts, never share credentials, report suspicious activity within 24 hours, and lock your screen when stepping away.',
    readTime: '12 min read',
  },
  {
    id: 'privacy', title: 'Data Privacy & GDPR Policy', icon: '🛡️', required: true,
    summary: 'Covers how we collect, process, and store personal data in compliance with GDPR, CCPA, and other regulations. All employees who handle customer data must complete this. Key rule: never export customer PII without a signed DPA and legal approval.',
    readTime: '15 min read',
  },
  {
    id: 'acceptable_use', title: 'Acceptable Use Policy', icon: '💻', required: true,
    summary: 'Defines acceptable use of company systems, devices, and network. Company devices are for business use. Personal use is tolerated if minimal. Prohibited: installing unlicensed software, accessing prohibited content, using company resources for personal commercial activities.',
    readTime: '6 min read',
  },
  {
    id: 'remote', title: 'Remote Work Guidelines', icon: '🏠', required: false,
    summary: 'Guidelines for working remotely including: core hours (10am–3pm local time), camera-on policy for team meetings, home office equipment stipend ($500/year), and how to expense internet costs. Managers must approve remote locations outside the home country.',
    readTime: '5 min read',
  },
  {
    id: 'expense', title: 'Expense & Reimbursement Policy', icon: '💳', required: false,
    summary: 'Submit expenses within 30 days via the Finance portal. Limits: meals $60/person, travel per diem $150/day, no alcohol on company card. Receipts required for all expenses over $25. Manager approval required for anything over $500.',
    readTime: '4 min read',
  },
];

// ─── Project Intros per Department ────────────────────────────────────────────
export const PROJECT_INTROS = {
  Engineering: {
    overview: 'You\'re joining the Engineering org building our core SaaS platform. We serve 12,000+ enterprise customers and process ~8M API requests/day. The stack is React + TypeScript on the frontend, Go microservices on the backend, deployed on AWS EKS.',
    currentSprint: 'Sprint 47 (Apr 1–14): Migrating the authentication service to OAuth 2.1, improving API rate limiting, and closing 6 P1 bugs from the Q1 audit.',
    keyTools: ['GitHub (source control + CI)', 'Jira (sprint tracking)', 'Datadog (monitoring)', 'AWS Console', 'Slack: #eng-general, #deployments, #incidents'],
    watchFirst: [
      { title: 'System Architecture Overview', duration: '22 min' },
      { title: 'Dev Environment Setup Guide', duration: '15 min' },
      { title: 'Our Incident Response Playbook', duration: '10 min' },
    ],
  },
  Design: {
    overview: 'The Design team owns the product\'s visual and interaction layer across web, mobile, and marketing. We run a tight design system (Figma component library) used by 3 product squads. You\'ll collaborate closely with Product and Eng.',
    currentSprint: 'Current focus: Redesigning the onboarding flow for new users (Q2 priority), updating the component library to v4.0, and conducting 6 user research sessions this month.',
    keyTools: ['Figma (design + handoff)', 'Notion (design docs)', 'Jira (tickets)', 'Slack: #design, #design-critique, #ux-research'],
    watchFirst: [
      { title: 'Design System Tour', duration: '18 min' },
      { title: 'Our Design Process & Review Cadence', duration: '12 min' },
      { title: 'Brand Guidelines Overview', duration: '8 min' },
    ],
  },
  Product: {
    overview: 'Product works across 4 squads: Acquisition, Activation, Retention, and Platform. You\'ll own a product area end-to-end — strategy, roadmap, and delivery. We run fully data-driven prioritization using RICE scoring.',
    currentSprint: 'Q2 OKRs: Reduce time-to-first-value from 14 days to 7 days, increase trial-to-paid conversion by 12%, and launch the new pricing tier by May 15.',
    keyTools: ['Jira (roadmap + sprints)', 'Notion (PRDs, specs)', 'Looker (product metrics)', 'Figma (specs review)', 'Slack: #product, #roadmap'],
    watchFirst: [
      { title: 'Product Strategy & 2024 Roadmap', duration: '25 min' },
      { title: 'How We Write PRDs', duration: '14 min' },
      { title: 'Metrics Dashboard Walkthrough', duration: '10 min' },
    ],
  },
  Data: {
    overview: 'The Data team owns our analytics infrastructure, ML models, and self-serve BI tooling. We run on BigQuery + dbt + Looker. All product decisions and experiments go through us for measurement design and analysis.',
    currentSprint: 'Current: building the customer health score model (ML), migrating 3 legacy pipelines to dbt, and publishing the first version of our experimentation framework docs.',
    keyTools: ['BigQuery (data warehouse)', 'dbt (transformations)', 'Looker (BI)', 'Airflow (orchestration)', 'Slack: #data-eng, #analytics, #ml-platform'],
    watchFirst: [
      { title: 'Data Infrastructure Overview', duration: '20 min' },
      { title: 'How to Run an Experiment Here', duration: '16 min' },
      { title: 'dbt Model Structure & Naming Conventions', duration: '12 min' },
    ],
  },
  Legal: {
    overview: 'The Legal team covers contracts, compliance, privacy, and intellectual property. We support all product and GTM decisions that have legal exposure. You\'ll be embedded with specific business units and own their ongoing legal needs.',
    currentSprint: 'Current priorities: Q2 SOC 2 Type II audit preparation, updating DPAs across 40+ vendor contracts, and reviewing the new pricing model for regulatory impact in EU markets.',
    keyTools: ['Ironclad (contracts)', 'Jira (legal tickets)', 'Notion (legal wikis)', 'Slack: #legal, #privacy, #compliance'],
    watchFirst: [
      { title: 'Our Legal Request Process', duration: '10 min' },
      { title: 'Regulatory Overview: GDPR, CCPA, SOC 2', duration: '22 min' },
      { title: 'Contract Template Library Tour', duration: '8 min' },
    ],
  },
  Finance: {
    overview: 'Finance owns financial planning, reporting, and controls for a $48M ARR business. The team works across FP&A, accounting, and revenue operations. You\'ll collaborate with GTM on commissions/quotas and Engineering on infra cost controls.',
    currentSprint: 'Q2 focus: closing Q1 books, rebuilding the headcount forecasting model, auditing AWS spend (target: 15% reduction), and preparing for Series C board materials.',
    keyTools: ['Salesforce (CRM/revenue data)', 'Looker (financial dashboards)', 'NetSuite (GL/accounting)', 'Notion (finance wikis)', 'Slack: #finance, #rev-ops'],
    watchFirst: [
      { title: 'Financial Model & ARR Overview', duration: '18 min' },
      { title: 'Month-End Close Process', duration: '12 min' },
      { title: 'How to Submit a Budget Request', duration: '6 min' },
    ],
  },
  Sales: {
    overview: 'Sales owns the full revenue funnel from outbound prospecting to closed-won. We run a PLG + enterprise hybrid motion. AEs own $800K–$2M quotas. SEs provide technical depth. CS owns retention and expansion. All revenue data is in Salesforce.',
    currentSprint: 'Q2 focus: closing the remaining 12 enterprise pilots from Q1, launching outbound motion in EMEA, reducing sales cycle from 42 to 30 days average.',
    keyTools: ['Salesforce (CRM + pipeline)', 'Outreach (sequences)', 'Zoom (demos)', 'Notion (playbooks)', 'Slack: #sales, #wins, #pipeline-review'],
    watchFirst: [
      { title: 'Product Demo: Full Walkthrough', duration: '28 min' },
      { title: 'Sales Playbook & ICP Definition', duration: '20 min' },
      { title: 'Using Salesforce: Opportunity Management', duration: '14 min' },
    ],
  },
  Testing: {
    overview: 'The Testing team ensures product quality across all modules. We embed deeply with engineering squads to validate features, write automated test cases, and execute release protocols before any code hits production environments.',
    currentSprint: 'Current focus: E2E Cypress automation coverage for the onboarding flow (reaching 80%), organizing exploratory ad-hoc testing for the new pricing tiers, and validating sprint fixes.',
    keyTools: ['Jira (tickets & test plans)', 'GitHub (automation scripts)', 'DataDog (error logging)', 'Slack: #qa, #releases, #bug-triage'],
    watchFirst: [
      { title: 'How We Handle Releases & Hotfixes', duration: '15 min' },
      { title: 'Cypress E2E Testing Guidelines', duration: '20 min' },
      { title: 'Writing Excellent Bug Reports', duration: '8 min' }
    ],
  },
};

// ─── Seed employees ───────────────────────────────────────────────────────────
export const SEED_EMPLOYEES = [
  { id: 1, name: 'Alex Rivera',    email: 'alex.r@acme.com',   department: 'Engineering', role: 'Frontend Developer',  startDate: '2026-04-01', status: 'Active',      acknowledged: ['coc','security','acceptable_use'], watchedVideos: [0,1], completedChecklist: [] },
  { id: 2, name: 'Priya Nair',     email: 'priya.n@acme.com',  department: 'Design',      role: 'UI/UX Designer',       startDate: '2026-03-15', status: 'Active',      acknowledged: ['coc','security','privacy','acceptable_use','remote','expense'], watchedVideos: [0,1,2], completedChecklist: [] },
  { id: 3, name: 'Jordan Lee',     email: 'jordan.l@acme.com', department: 'Product',     role: 'Product Manager',      startDate: '2026-04-07', status: 'Onboarding',  acknowledged: ['coc'], watchedVideos: [], completedChecklist: [] },
  { id: 4, name: 'Sam Okafor',     email: 'sam.o@acme.com',    department: 'Data',        role: 'Data Analyst',         startDate: '2026-04-10', status: 'Pending',     acknowledged: [], watchedVideos: [], completedChecklist: [] },
  { id: 5, name: 'Taylor Jenkins', email: 'taylor.j@acme.com', department: 'Testing',     role: 'QA Automation Engineer',startDate: '2026-04-05', status: 'Active',      acknowledged: ['coc'], watchedVideos: [], completedChecklist: [] },
  { id: 6, name: 'Morgan Chen',    email: 'morgan.c@acme.com', department: 'Testing',     role: 'Manual Tester',        startDate: '2026-04-12', status: 'Onboarding',  acknowledged: ['coc', 'security'], watchedVideos: [0], completedChecklist: [] },
];

export function getPermissions(role) {
  return ROLE_PERMISSIONS[role] || {};
}

export function calcProgress(employee) {
  const policyPct = POLICIES.filter(p => (employee.acknowledged||[]).includes(p.id)).length / POLICIES.length;
  const intro = PROJECT_INTROS[employee.department];
  const videoPct = intro ? (employee.watchedVideos||[]).length / intro.watchFirst.length : 0;
  return Math.round(((policyPct + videoPct) / 2) * 100);
}

// ─── Jira Tasks ───────────────────────────────────────────────────────────────
export const JIRA_TASKS = {
  Engineering: [
    { id: 'ENG-1042', title: 'Setup local dev environment pointing to staging DB', status: 'To Do', priority: 'High', type: 'Task' },
    { id: 'ENG-1043', title: 'Review Q1 Architecture Doc', status: 'In Progress', priority: 'Medium', type: 'Story' },
    { id: 'ENG-1045', title: 'Submit PR for your first bug fix (Good first issue)', status: 'To Do', priority: 'Medium', type: 'Bug' },
  ],
  Design: [
    { id: 'DES-402', title: 'Audit current component library states in Figma', status: 'To Do', priority: 'Medium', type: 'Task' },
    { id: 'DES-403', title: 'Meet with Product Lead for onboarding sync', status: 'Done', priority: 'High', type: 'Epic' },
  ],
  Product: [
    { id: 'PRD-812', title: 'Read the latest strategy memo for Q2', status: 'In Progress', priority: 'High', type: 'Story' },
    { id: 'PRD-813', title: 'Shadow 3 user research calls this week', status: 'To Do', priority: 'Medium', type: 'Task' },
  ],
  Testing: [
    { id: 'QA-1101', title: 'Verify the React 19 upgrade on the dashboard', status: 'To Do', priority: 'High', type: 'Task' }
  ]
};

// ─── Chat History ─────────────────────────────────────────────────────────────
export const CHAT_HISTORY = [
  {
    id: 1, sender: 'IT Support Team', time: '10:02 AM',
    message: 'Welcome to the team! We noticed your laptop was delivered successfully. Let us know if you need help connecting to the VPN.',
    unread: true
  },
  {
    id: 2, sender: 'Sarah Johnson (Manager)', time: 'Yesterday',
    message: 'Hey, looking forward to our 1:1 sync later. Let me know if you hit any roadblocks going through the onboarding checklist.',
    unread: false
  }
];
