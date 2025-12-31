import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";
import course4 from "@/assets/course-4.jpg";

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
  id: number;
  slug: string;
  title: string;
  image: string;
  categories: string[];
  originalPrice: number;
  currentPrice: number;
  discount: number;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: string;
  curriculum: CourseModule[];
  features: string[];
}

export const courses: Course[] = [
  {
    id: 1,
    slug: "rochit-singh-course",
    title: "Rochit Singh Course",
    image: course1,
    categories: ["Equity", "Option Trading", "Price Action Courses", "Stock Market"],
    originalPrice: 60.00,
    currentPrice: 3.48,
    discount: 94,
    description: "Master the art of trading with Rochit Singh's comprehensive course covering equity markets, options trading, and advanced price action strategies. This course is designed for traders who want to take their skills to the next level.",
    instructor: "Rochit Singh",
    duration: "12+ Hours",
    lessons: 45,
    level: "Intermediate",
    curriculum: [
      {
        title: "Introduction to Trading",
        lessons: ["Welcome & Course Overview", "Understanding Market Basics", "Setting Up Your Trading Platform", "Risk Management Fundamentals"]
      },
      {
        title: "Price Action Mastery",
        lessons: ["Reading Candlestick Patterns", "Support & Resistance Zones", "Trend Identification", "Entry & Exit Strategies"]
      },
      {
        title: "Options Trading",
        lessons: ["Options Basics", "Call & Put Options", "Options Greeks", "Advanced Options Strategies"]
      },
      {
        title: "Live Trading Sessions",
        lessons: ["Market Analysis Techniques", "Real-time Trade Execution", "Position Sizing", "Managing Open Trades"]
      }
    ],
    features: ["Lifetime Access", "Certificate of Completion", "24/7 Support", "Downloadable Resources", "Mobile Access"]
  },
  {
    id: 2,
    slug: "trademix-fly-strategy-2025",
    title: "Trademix Fly Strategy 2025",
    image: course2,
    categories: ["Option Trading", "Stock Market"],
    originalPrice: 45.00,
    currentPrice: 12.60,
    discount: 72,
    description: "Learn the exclusive Fly Strategy that has helped thousands of traders achieve consistent profits. This 2025 edition includes updated techniques and real-world case studies.",
    instructor: "TradeMix Team",
    duration: "8+ Hours",
    lessons: 32,
    level: "Advanced",
    curriculum: [
      {
        title: "Strategy Foundation",
        lessons: ["Understanding Fly Spreads", "Market Conditions Analysis", "Strategy Selection Criteria"]
      },
      {
        title: "Implementation",
        lessons: ["Setting Up Trades", "Position Management", "Adjustments & Hedging"]
      },
      {
        title: "Advanced Techniques",
        lessons: ["Volatility Trading", "Time Decay Strategies", "Portfolio Integration"]
      }
    ],
    features: ["Lifetime Access", "Strategy Templates", "Weekly Updates", "Private Community Access"]
  },
  {
    id: 3,
    slug: "advanced-sl-hunting-masterclass",
    title: "Advanced SL Hunting Masterclass",
    image: course3,
    categories: ["Forex Courses", "Price Action Courses"],
    originalPrice: 120.00,
    currentPrice: 8.40,
    discount: 93,
    description: "Discover how institutional traders hunt stop losses and learn to position yourself on the right side of the market. This masterclass reveals the secrets of smart money concepts.",
    instructor: "Market Masters",
    duration: "15+ Hours",
    lessons: 58,
    level: "Advanced",
    curriculum: [
      {
        title: "Smart Money Concepts",
        lessons: ["Institutional Order Flow", "Liquidity Pools", "Order Blocks", "Fair Value Gaps"]
      },
      {
        title: "SL Hunting Patterns",
        lessons: ["Identifying Hunt Zones", "Timing the Hunt", "Entry Techniques", "Risk Management"]
      },
      {
        title: "Forex Application",
        lessons: ["Major Pairs Analysis", "Session-based Trading", "News Trading Strategies"]
      },
      {
        title: "Live Examples",
        lessons: ["Real Trade Breakdowns", "Market Analysis Sessions", "Q&A Sessions"]
      }
    ],
    features: ["Lifetime Access", "Live Sessions", "Trade Signals", "Personal Mentorship"]
  },
  {
    id: 4,
    slug: "price-action-complete-course",
    title: "Price Action Complete Course",
    image: course4,
    categories: ["Price Action Courses", "Stock Market"],
    originalPrice: 80.00,
    currentPrice: 4.80,
    discount: 94,
    description: "The most comprehensive price action course available. From basics to advanced techniques, this course covers everything you need to become a profitable price action trader.",
    instructor: "Trading Academy",
    duration: "20+ Hours",
    lessons: 72,
    level: "Beginner to Advanced",
    curriculum: [
      {
        title: "Price Action Basics",
        lessons: ["What is Price Action?", "Chart Types", "Timeframe Selection", "Market Structure"]
      },
      {
        title: "Candlestick Patterns",
        lessons: ["Single Candle Patterns", "Multi-Candle Patterns", "Pattern Confluence", "Pattern Trading"]
      },
      {
        title: "Technical Analysis",
        lessons: ["Support & Resistance", "Trend Lines", "Chart Patterns", "Fibonacci Levels"]
      },
      {
        title: "Trading Psychology",
        lessons: ["Emotional Control", "Trading Plan Development", "Journal Keeping", "Continuous Improvement"]
      }
    ],
    features: ["Lifetime Access", "PDF Workbooks", "Practice Exercises", "Community Forum", "Monthly Webinars"]
  },
];

export const getCourseBySlug = (slug: string): Course | undefined => {
  return courses.find(course => course.slug === slug);
};
