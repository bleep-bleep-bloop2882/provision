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
  }
];

export const MOCK_GAPS = [
  { question: "How do I access the AWS staging database?", count: 14, status: "Unanswered" },
  { question: "What is the policy for sick leave for contractors?", count: 8, status: "Low Confidence" },
  { question: "Where is the design system Figma file?", count: 5, status: "Unanswered" }
];

export const MOCK_EXPERTS = [
  { name: "Priya Nair", topic: "DevOps & Deployments", score: 98, role: "Lead DevOps" },
  { name: "Alex Rivera", topic: "Contractor Policies", score: 95, role: "HR Operations" },
  { name: "Sarah Johnson", topic: "Engineering & Tech", score: 92, role: "VP Engineering" }
];

// Simple simulation of an embedding logic or Vector DB Search (RAG)
export function searchKnowledgeBase(query) {
  const q = query.toLowerCase();
  
  // Find matches by keyword (simulated spatial similarity)
  const scoredDocs = MOCK_KNOWLEDGE_BASE.map(doc => {
    let score = 0;
    if (doc.content.toLowerCase().includes(q) || doc.title.toLowerCase().includes(q)) {
      score += 50; // direct hit
    }
    
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
    // Generate a contextualized 'answer' based on the content (mocking LLM generation over top retrieved chunks)
    return {
      success: true,
      confidence: Math.min(scoredDocs[0].score + 40, 96),
      answer: `Based on the internal documentation, here is the answer:\n\n> ${scoredDocs[0].content}`,
      document: scoredDocs[0]
    };
  }

  // Low confidence return / knowledge gap hit
  return {
    success: false,
    confidence: scoredDocs[0].score || 12,
    answer: "I couldn't find a high-confidence answer in our knowledge base.",
    expert: MOCK_EXPERTS[Math.floor(Math.random() * MOCK_EXPERTS.length)]
  };
}
