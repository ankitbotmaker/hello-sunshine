import { useState, useMemo } from "react";
import { Search, ShoppingCart, Info, Sparkles, Filter, Code, DollarSign, BarChart3, TrendingUp, Monitor, ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { useAuth } from "@/hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { Course } from "@/hooks/useCourses";

const TELEGRAM_USERNAME = "stcs111111111111";

interface CourseGridProps {
  courses?: Course[];
  isLoading?: boolean;
}

const CourseGrid = ({ courses: propCourses, isLoading: propLoading }: CourseGridProps) => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.1 });
  const [filter, setFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // Mock data if no courses provided
  const defaultCourses: Partial<Course>[] = [
    {
      id: "1",
      title: "Advanced Option Trading Masterclass",
      instructor: "Trading Legend",
      original_price: 14999,
      current_price: 4999,
      discount: 66,
      level: "Advanced",
      categories: ["Trading"],
      image_url: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2070&auto=format&fit=crop",
      slug: "option-trading-masterclass",
      description: "Master the art of option selling and hedging strategies.",
      is_active: true
    },
    {
      id: "2",
      title: "Complete Vedic Astrology",
      instructor: "Astro Guru",
      original_price: 5999,
      current_price: 999,
      discount: 83,
      level: "Beginner",
      categories: ["Astrology"],
      image_url: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?q=80&w=2071&auto=format&fit=crop",
      slug: "vedic-astrology",
      description: "Learn the secrets of the stars and planets.",
      is_active: true
    },
    {
      id: "3",
      title: "Full Stack Web Development (CodeWithHarry Style)",
      instructor: "Code Master",
      original_price: 4999,
      current_price: 499,
      discount: 90,
      level: "Intermediate",
      categories: ["Coding"],
      image_url: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop",
      slug: "web-dev-bootcamp",
      description: "Build real-world projects with React, Node, and more.",
      is_active: true
    },
    {
      id: "4",
      title: "Placement Batch (Apna College Style)",
      instructor: "Placement Expert",
      original_price: 6999,
      current_price: 699,
      discount: 90,
      level: "Beginner",
      categories: ["Skill"],
      image_url: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop",
      slug: "placement-batch",
      description: "Crack your dream job with DSA and system design.",
      is_active: true
    },
    {
      id: "5",
      title: "Forex Trading Secrets",
      instructor: "Forex Pro",
      original_price: 8999,
      current_price: 1999,
      discount: 78,
      level: "Advanced",
      categories: ["Trading"],
      image_url: "https://images.unsplash.com/photo-1526304640155-41198bc660e9?q=80&w=2069&auto=format&fit=crop",
      slug: "forex-trading-secrets",
      description: "Maximize your profits in the currency market.",
      is_active: true
    },
    {
      id: "6",
      title: "Digital Marketing Mastery",
      instructor: "Growth Hacker",
      original_price: 2999,
      current_price: 299,
      discount: 90,
      level: "Beginner",
      categories: ["Skill"],
      image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
      slug: "digital-marketing-mastery",
      description: "Scale your business with proven marketing strategies.",
      is_active: true
    },
  ];

  const courses = propCourses && propCourses.length > 0 ? propCourses : (defaultCourses as Course[]);

  // Filter courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // Check if filter matches 'All' or is present in course.categories array
      const matchesFilter = filter === "All" || (course.categories && course.categories.includes(filter));
      const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [courses, filter, searchQuery]);

  const categories = ["All", "Trading", "Astrology", "Coding", "Skill"];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Trading": return <BarChart3 className="w-4 h-4" />;
      case "Astrology": return <Sparkles className="w-4 h-4" />;
      case "Coding": return <Code className="w-4 h-4" />;
      case "Skill": return <Monitor className="w-4 h-4" />;
      default: return <Info className="w-4 h-4" />;
    }
  };

  const handleBuyNow = (e: React.MouseEvent, course: Partial<Course>) => {
    e.preventDefault();
    e.stopPropagation();

    const currentPrice = course.current_price ?? 0;
    const originalPrice = course.original_price ?? 0;
    const discount = course.discount ?? 0;

    const message = encodeURIComponent(
      `🎓 *Course Purchase Request*\n\n` +
      `📚 *Course:* ${course.title}\n` +
      `💰 *Price:* ₹${currentPrice.toFixed(2)} (Original: ₹${originalPrice.toFixed(2)})\n` +
      `🏷️ *Discount:* ${discount}% OFF\n` +
      `📊 *Level:* ${course.level || 'All Levels'}\n\n` +
      `I'm interested in purchasing this course!`
    );
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${message}`, '_blank');
  };

  return (
    <section ref={ref} className={`py-12 md:py-24 bg-background transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Premium Collection</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl font-heading text-gradient">
            Explore Our Courses
          </h2>
          <p className="max-w-[700px] text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Choose from our wide range of premium courses in Trading, Astrology, Coding, and more.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-hover:text-primary transition-colors h-4 w-4" />
            <input
              type="text"
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-white/10 bg-white/5 focus:bg-white/10 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-white placeholder:text-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${filter === cat
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                  : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {propLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {filteredCourses.map((course, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  key={course.id}
                  className="group relative rounded-2xl overflow-hidden glass-panel hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] flex flex-col h-full"
                >
                  {/* Image Container */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      alt={course.title}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                      src={course.image_url || "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=2070&auto=format&fit=crop"}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent opacity-80" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70">
                        {course.categories?.[0] || "General"}
                      </Badge>
                      {course.discount > 0 && (
                        <Badge className="bg-red-500/90 text-white border-0 animate-pulse">
                          {course.discount}% OFF
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-5 relative">
                    <div className="mb-auto">
                      <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                        {course.description}
                      </p>

                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1">
                          <Monitor className="w-3 h-3" />
                          <span>{course.lessons || '10+'} Lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-3 h-3" />
                          <span>{course.level}</span>
                        </div>
                        <div className="flex items-center gap-1 text-emerald-400">
                          <Star className="w-3 h-3 fill-emerald-400" />
                          <span>4.8</span>
                        </div>
                      </div>
                    </div>

                    {/* Price and Action */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-4 mt-4">
                      <div>
                        <div className="text-xs text-muted-foreground line-through">₹{course.original_price}</div>
                        <div className="text-xl font-bold text-foreground flex items-center gap-1">
                          ₹{course.current_price}
                        </div>
                      </div>

                      <Button
                        onClick={(e) => handleBuyNow(e, course)}
                        className="flex-1 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 text-white border-0 shadow-lg shadow-emerald-500/20 group/btn relative overflow-hidden"
                      >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Buy Now <ShoppingCart className="w-4 h-4" />
                        </span>
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default CourseGrid;
