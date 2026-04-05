export const MOCK_KNOWLEDGE_BASE = [
  {
    id: "doc_1",
    title: "Engineering Best Practices",
    content: "All code must be peer-reviewed by at least one other engineer before merging. Our primary tech stack is React for frontend and Node.js for backend. We use GitHub for version control.",
    source: "Confluence",
    lastUpdated: "3 days ago",
    expert: "Sarah Johnson",
    keywords: ["peer review", "tech stack", "backend", "frontend", "github", "engineering"]
  },
  {
    id: "doc_2",
    title: "Contractor Onboarding Guide",
    content: "Contractors should bill hours using the Provision App. VPN access is required for production databases but not for staging. All contractors must complete security training week 1.",
    source: "Google Drive",
    lastUpdated: "2 weeks ago",
    expert: "Alex Rivera",
    keywords: ["contractor", "onboarding", "vpn", "billing", "security training", "hours"]
  },
  {
    id: "doc_3",
    title: "Deployment Schedule",
    content: "We deploy to production every Tuesday and Thursday at 10 AM EST. Code freezes happen on Monday and Wednesday at 5 PM EST. Do not deploy on Fridays.",
    source: "Notion",
    lastUpdated: "1 month ago",
    expert: "Priya Nair",
    keywords: ["deploy", "deployment", "schedule", "friday", "code freeze", "production"]
  },
  {
    id: "doc_4",
    title: "API Rate Limits",
    content: "Our public APIs are rate limited to 1000 requests per minute per IP address. Internal microservices have a soft limit of 10k RPM. Rate limit errors return HTTP 429.",
    source: "Confluence",
    lastUpdated: "5 days ago",
    expert: "Jordan Lee",
    keywords: ["api", "rate limit", "429", "requests", "rpm", "public api"]
  },
  {
    id: "doc_5",
    title: "Expense Policy",
    content: "Contractors can expense software licenses if pre-approved by their manager. Hardware (laptops) is not expensable. Submit expenses by the 5th of the month via Expensify.",
    source: "Google Drive",
    lastUpdated: "6 months ago",
    expert: "Morgan Chen",
    keywords: ["expense", "expensify", "software license", "hardware", "laptop"]
  },
  {
    id: "doc_6",
    title: "Bug Fix & Triage Protocol",
    content: "When working on your first bug fix (like a 'Good First Issue' ticket), always branch off 'develop'. For historical context on old bugs, check the closed PRs labeled 'legacy-bug' in GitHub. Ensure you run the local Cypress tests before submitting your Pull Request.",
    source: "Confluence",
    lastUpdated: "1 week ago",
    expert: "Priya Nair",
    keywords: ["bug", "bug fix", "fix", "good first issue", "old details", "legacy", "cypress", "pr", "pull request"]
  }
];

import { JIRA_TASKS, calcProgress } from './data';

export const MOCK_EXPERTS = [
  { name: "Priya Nair", topic: "DevOps & Deployments", score: 98, role: "Lead DevOps" },
  { name: "Alex Rivera", topic: "Contractor Policies", score: 95, role: "HR Operations" },
  { name: "Sarah Johnson", topic: "Engineering & Tech", score: 92, role: "VP Engineering" }
];

export function searchKnowledgeBase(query, context = {}) {
  const { currentUser, employees = [] } = context;
  const q = query.toLowerCase();

  // Manager Assign Task Intent
  if (q.includes('assign task') || q.includes('create task') || q.includes('new task') || q.includes('assign a task')) {
    if (currentUser && currentUser.type === 'manager') {
       return {
         success: true,
         type: 'action_assign_task',
         answer: "I've structured a task batch operation based on your instructions. I can blast this assignment push to all employees' targeted Jira dashboards concurrently.",
         taskDetails: {
           title: "Mandatory Core Product Q2 Security Audit Review",
           assignees: "All Active Sub-Employees",
           priority: "High",
           storyPoints: 2,
         }
       };
    } else {
       return {
         success: false,
         confidence: 10,
         answer: "Only managers possess the elevated topological clearance permissions required to assign wide-scale workspace tasks to other users."
       }
    }
  }

  // Tasks Status intent
  if (q.includes('task') || q.includes('progress') || q.includes('to do') || q.includes('todo') || q.includes('status')) {
    if (currentUser) {
      if (currentUser.type === 'manager') {
        const avgProgress = Math.round(employees.reduce((acc, emp) => acc + calcProgress(emp), 0) / (employees.length || 1));
        return {
          success: true,
          type: 'action_summary',
          answer: `Hi ${currentUser.name}. Based on the live dashboard metrics, here is the organizational summary:\n\n> The overall team completion progress for onboarding policies and training is currently at **${avgProgress}%**.\n> There are **${employees.length}** employees tracked in your system.\n\nWould you like me to ping the team about any outstanding tasks?`
        };
      } else {
        const myTasks = JIRA_TASKS[currentUser.department] || [];
        const todo = myTasks.filter(t => t.status === 'To Do');
        const active = myTasks.filter(t => t.status === 'In Progress');
        
        let answer = `I've directly accessed your live ${currentUser.department} Jira board. Here is your personalized task list mapping:\n\n`;
        if (myTasks.length === 0) {
          answer += `> You currently have no tasks assigned. You're all caught up!`;
        } else {
          answer += `You have **${todo.length} tasks To Do** and **${active.length} active** tasks currently tracked:\n`;
          myTasks.forEach(t => {
            answer += `\n> **[${t.status}]** ${t.title} (${t.storyPoints} pts)`;
          });
        }
        return { success: true, type: 'action_tasks', answer };
      }
    }
  }

  if (q.includes('schedule') || q.includes('meeting') || q.includes('invite') || q.includes('calendar')) {
    return {
      success: true,
      type: 'action_meeting',
      answer: "I've drafted a meeting invite based on your request. Should I automatically send this out to the participant calendars?",
      meetingDetails: {
        title: "Team Sync via KnowledgeOS",
        time: "Tomorrow at 10:00 AM EST",
        participants: ["You", "Sarah Johnson", "Alex Rivera"]
      }
    };
  }

  if (q.includes('email') || q.includes('mail') || q.includes('draft') || q.includes('write')) {
    return {
      success: true,
      type: 'action_email',
      answer: "I've analyzed your context and drafted a highly professional email response for you avoiding passive language:\n\n> Subject: Follow up on Q4 Project Milestones\n> \n> Hi Team,\n> \n> I wanted to quickly follow up on the recent action items we discussed regarding the infrastructure deployment schema. Please let me know your availability for a quick sync later this week to unblock the staging blockers.\n> \n> Best regards,\n> [Your Name]",
    };
  }
  
  const scoredDocs = MOCK_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    if (doc.content.toLowerCase().includes(q) || doc.title.toLowerCase().includes(q)) score += 50;
    
    const words = q.split(' ');
    words.forEach(word => {
      if (word.length > 3) {
        if (doc.keywords.some(k => k.includes(word))) score += 25;
        if (doc.content.toLowerCase().includes(word)) score += 10;
      }
    });

    return { ...doc, score };
  });

  scoredDocs.sort((a, b) => b.score - a.score);
  
  if (scoredDocs[0].score >= 20) {
    return {
      success: true,
      confidence: Math.min(scoredDocs[0].score + 40, 96),
      answer: `Based on the internal documentation, here is the answer:\n\n> ${scoredDocs[0].content}`,
      document: scoredDocs[0]
    };
  }

  return {
    success: false,
    confidence: scoredDocs[0].score || 12,
    answer: "I couldn't find a high-confidence answer in our knowledge base.",
    expert: MOCK_EXPERTS[Math.floor(Math.random() * MOCK_EXPERTS.length)]
  };
}
