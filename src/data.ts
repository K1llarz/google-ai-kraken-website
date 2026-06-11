import { LayoutDashboard, Megaphone, Search, PenTool, RefreshCcw, Database, Cpu } from 'lucide-react';

export const services = [
  {
    id: 'strategy',
    title: 'Marketing Strategy Planning',
    description: 'Data-driven roadmaps to position your brand for sustainable, long-term growth and market dominance.',
    icon: LayoutDashboard,
  },
  {
    id: 'meta-ads',
    title: 'Meta Ads',
    description: 'High-converting campaigns across Facebook and Instagram targeting your ideal audience segments.',
    icon: Megaphone,
  },
  {
    id: 'google-ads',
    title: 'Google Ads',
    description: 'Capture high-intent traffic with optimized search, display, and performance max campaigns.',
    icon: Search,
  },
  {
    id: 'graphic-design',
    title: 'Graphic Design',
    description: 'Striking visual assets that communicate your brand narrative clearly and beautifully.',
    icon: PenTool,
  },
  {
    id: 'rebranding',
    title: 'Rebranding',
    description: 'Complete brand transformations reflecting evolved values, mission, and modern aesthetics.',
    icon: RefreshCcw,
  },
  {
    id: 'crm',
    title: 'CRM Implementation',
    description: 'Streamline your sales pipeline and customer relationships with cutting-edge CRM systems.',
    icon: Database,
  },
  {
    id: 'ai-integration',
    title: 'AI Integration',
    description: 'Automate workflows and personalize customer experiences using the latest AI models.',
    icon: Cpu,
  }
];

export const portfolioItems = [
  {
    id: 'aura-skincare',
    title: 'Aura Skincare Rebrand',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=800',
    client: 'Aura Skincare Co.',
    duration: '3 Months',
    challenge: 'Aura was perceived as a generic, outdated brand struggling to appeal to modern demographics, losing market share to new agile D2C competitors.',
    solution: 'A complete brand transformation focusing on minimal, modern elegance with new packaging guidelines, enhanced digital presence, and a refined social strategy.',
    results: ['200% Increase in online sales', '45% Growth in Instagram following', 'Featured in Vogue Beauty'],
    content: 'We began with a comprehensive brand strategy phase, exploring Aura\'s core values and unique selling propositions. We discovered their commitment to organic ingredients was buried under outdated visual noise. The new design system uses a muted, earth-toned palette and clean typography to highlight their premium, natural approach. \n\nWe extended this new visual language across all touchpoints, from packaging to their e-commerce platform, ensuring a seamless and premium experience that resonates with their target audience.'
  },
  {
    id: 'nextech-ai',
    title: 'NexTech AI Conversion',
    category: 'AI/Tech',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=800',
    client: 'NexTech Solutions',
    duration: '6 Months',
    challenge: 'NexTech had a powerful AI product but their website failed to explain its value proposition clearly, resulting in an abysmal 0.5% conversion rate.',
    solution: 'Re-engineered their web architecture and integrated an interactive AI playground directly on the homepage, allowing users to experience the product immediately.',
    results: ['4.2% Conversion rate achieved', '300% Increase in demo bookings', '$2M In pipeline generated'],
    content: 'Understanding complex technical products requires experiential marketing. We stripped away the dense technical jargon and created a scrollytelling experience that demonstrated the AI\'s capabilities in real-time. \n\nBy prioritizing user interaction over static text, we lowered the barrier to entry and transformed passive readers into active users.'
  },
  {
    id: 'urban-fit',
    title: 'Urban Fit ROAS Surge',
    category: 'Performance Marketing',
    image: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=800',
    client: 'Urban Fit Apparel',
    duration: 'Ongoing',
    challenge: 'Customer acquisition costs on Meta were skyrocketing, making their primary acquisition channel unprofitable.',
    solution: 'Implemented a robust creative testing framework combined with predictive LTV modeling to bid aggressively on high-value cohorts.',
    results: ['3.5x ROAS sustained securely', '42% Lower CPA', 'Scaled ad spend by 400%'],
    content: 'We executed a complete overhaul of their ad account structure. By consolidating campaigns and shifting focus to broad targeting combined with highly specific creative angles, we allowed the algorithm to optimize efficiently. \n\nWe introduced rapid creative iteration, testing 50+ ad variations weekly to identify winning concepts and scale them aggressively.'
  },
  {
    id: 'lumina-financial',
    title: 'Lumina Financial App',
    category: 'Design',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    client: 'Lumina Bank',
    duration: '8 Months',
    challenge: 'Lumina\'s legacy application was losing younger demographics to neobanks due to a cluttered, confusing user interface.',
    solution: 'Designed a neo-brutalist inspired, ultra-intuitive mobile application focused on financial clarity and seamless transactions.',
    results: ['4.8 Star App Store rating', '1.2M Downloads in first month', 'Decreased support tickets by 60%'],
    content: 'We audited the existing complex user flows and simplified them drastically. The new design language focuses on large, legible typography, high-contrast layouts, and delightful micro-interactions that make banking feel less like a chore and more like a modern digital experience.'
  },
  {
    id: 'velvet-coffee',
    title: 'Velvet Coffee Co Search',
    category: 'Performance Marketing',
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e013bf?auto=format&fit=crop&q=80&w=800',
    client: 'Velvet Coffee Roasters',
    duration: '4 Months',
    challenge: 'Despite a superior specialty product, Velvet Coffee had virtually zero organic visibility and relied entirely on expensive paid traffic.',
    solution: 'A comprehensive technical SEO overhaul and the execution of a high-intent, long-tail keyword content strategy targeting coffee enthusiasts.',
    results: ['First page for 150+ target keywords', '300% Organic traffic increase', 'Organic revenue overtook paid'],
    content: 'We identified a gap in educational content regarding home brewing techniques. By creating definitive, high-quality guides and optimizing their technical site structure for speed and crawlability, we captured users at the top of the funnel and nurtured them through the purchase journey.'
  },
  {
    id: 'healthhub-gpt',
    title: 'HealthHub GPT Integration',
    category: 'AI/Tech',
    image: 'https://images.unsplash.com/photo-1576091160550-2173ff9e5eb3?auto=format&fit=crop&q=80&w=800',
    client: 'HealthHub Medical',
    duration: '2 Months',
    challenge: 'Patient support teams were overwhelmed with routine triage questions, leading to long wait times and poor patient satisfaction.',
    solution: 'Developed and deployed a custom, HIPAA-compliant LLM assistant trained on HealthHub\'s specific triage protocols.',
    results: ['Resolved 70% of inquiries automatically', '0 Wait time for level-1 support', 'Saved 4,000+ staff hours'],
    content: 'Security and accuracy were paramount. We utilized fine-tuning combined with Retrieval-Augmented Generation (RAG) to ensure the assistant only provided answers based on approved medical guidelines, seamlessly escalating complex cases to human agents.'
  }
];

export const blogPosts = [
  {
    id: 'future-of-ai',
    title: 'The Future of AI in Performance Marketing',
    category: 'AI',
    author: 'Elena Rodriguez',
    authorRole: 'Head of Growth',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 12, 2026',
    content: 'Artificial Intelligence is no longer a buzzword; it is the foundational infrastructure of modern performance marketing. \n\nWe are moving beyond simple automated bidding into an era where AI generates creative variations, predicts lifetime value before the first click, and orchestrates cross-channel journeys natively. \n\nThe marketers who will thrive are those who treat AI as an operating system, utilizing predictive analytics to preemptively bid on high-intent cohorts while dynamic creative optimization ensures the perfect message lands at the perfect time.'
  },
  {
    id: 'designing-for-gen-z',
    title: 'Designing for Gen Z: What Actually Works',
    category: 'Design',
    author: 'Marcus Chen',
    authorRole: 'Creative Director',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800',
    date: 'Oct 05, 2026',
    content: 'Gen Z possesses an unprecedentedly refined digital bullshit detector. They reject overly polished, corporate aesthetics in favor of raw, authentic, and sometimes chaotic design languages. \n\nTo design for this demographic, we must prioritize community-driven visual cues over pristine minimalism. This means embracing lo-fi assets, meme-culture references, and highly interactive formats that invite participation rather than passive consumption. Trust is built through transparency and a willingness to step outside traditional brand safety guidelines.'
  },
  {
    id: 'maximizing-roi-meta',
    title: 'Maximizing ROI on Meta During Q4',
    category: 'Ads',
    author: 'Sarah Jenkins',
    authorRole: 'VP Paid Media',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&q=80&w=800',
    date: 'Sep 28, 2026',
    content: 'Q4 on Meta is historically a battleground of soaring CPMs and intense competition. Success requires abandoning static strategies. \n\nThe key to cutting through the noise lies in aggressive offer testing and utilizing Advantage+ campaigns with a massive volume of distinct creative angles. Do not rely on one hero asset. Instead, seed the algorithm with varied hooks, formats, and value propositions. \n\nFurthermore, focusing heavily on retargeting high-intent custom audiences built in Q3 will offset top-of-funnel acquisition costs.'
  }
];

export const jobOpenings = [
  {
    id: 'sr-designer',
    title: 'Senior Visual Designer',
    department: 'Creative',
    location: 'Remote',
    type: 'Full-time'
  },
  {
    id: 'perf-marketer',
    title: 'Performance Marketing Lead',
    department: 'Paid Media',
    location: 'New York / Hybrid',
    type: 'Full-time'
  },
  {
    id: 'ai-engineer',
    title: 'AI Automation Specialist',
    department: 'Engineering',
    location: 'Remote',
    type: 'Contract'
  }
];
