import { useParams, Link, useNavigate } from "react-router-dom";
import { Clock, BookOpen, BarChart3, Check, ChevronDown, ChevronUp, ArrowLeft, Send, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import CourseReviews from "@/components/CourseReviews";
import { supabase } from "@/integrations/supabase/client";

const TELEGRAM_USERNAME = "stcs111111111111";

interface CourseModule {
  title: string;
  lessons: string[];
}

interface Course {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  categories: string[];
  original_price: number;
  current_price: number;
  discount: number;
  description: string | null;
  instructor: string | null;
  duration: string | null;
  lessons: number;
  level: string;
  curriculum: CourseModule[];
  features: string[];
  is_active: boolean;
}

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .maybeSingle();

      if (error) {
        console.error('Error fetching course:', error);
      } else if (data) {
        setCourse({
          ...data,
          curriculum: (data.curriculum as unknown as CourseModule[]) || [],
        } as Course);
      }
      setLoading(false);
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <Link to="/courses" className="text-primary hover:underline">
              Browse All Courses
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const toggleModule = (index: number) => {
    setExpandedModules(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleBuyNow = () => {
    const message = encodeURIComponent(
      `🎓 *Course Purchase Request*\n\n` +
      `📚 *Course:* ${course.title}\n` +
      `💰 *Price:* $${course.current_price.toFixed(2)} (Original: $${course.original_price.toFixed(2)})\n` +
      `🏷️ *Discount:* ${course.discount}% OFF\n` +
      `📊 *Level:* ${course.level}\n` +
      `⏱️ *Duration:* ${course.duration || 'Self-paced'}\n` +
      `📖 *Lessons:* ${course.lessons}\n\n` +
      `I'm interested in purchasing this course!`
    );
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${message}`, '_blank');
  };

  const totalLessons = course.curriculum?.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="bg-secondary/50 py-4">
          <div className="container mx-auto px-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Courses</span>
            </button>
          </div>
        </div>

        {/* Premium Hero Section */}
        <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden flex items-center">
          {/* Background Image with Gradient Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={course.image_url || '/placeholder.svg'}
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-900/50" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
          </div>

          <div className="container relative z-10 px-4 pt-20">
            <div className="max-w-3xl space-y-6 animate-fade-in-up">
              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {course.categories?.map((cat) => (
                  <Badge key={cat} variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1">
                    {cat}
                  </Badge>
                ))}
                {course.discount > 0 && (
                  <Badge className="bg-red-500/90 text-white animate-pulse border-0 px-3 py-1">
                    {course.discount}% OFF Limit Time
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <h1 className="text-4xl md:text-6xl font-bold font-heading text-white leading-tight">
                {course.title}
              </h1>
              <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
                {course.description}
              </p>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-gray-400 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  <span>{course.duration || 'Self-paced'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-emerald-400" />
                  <span>{course.lessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-white">(4.8/5)</span>
                </div>
              </div>

              {/* Instructor Mini-Profile */}
              {course.instructor && (
                <div className="flex items-center gap-3 pt-4 border-t border-white/10 mt-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Created by</p>
                    <p className="text-white font-medium">{course.instructor}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        {course.curriculum && course.curriculum.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
                Course Curriculum
                <span className="text-muted-foreground text-lg font-normal ml-4">
                  {course.curriculum.length} Modules • {totalLessons} Lessons
                </span>
              </h2>

              <div className="space-y-4 max-w-3xl">
                {course.curriculum.map((module, index) => (
                  <div
                    key={index}
                    className="bg-card border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => toggleModule(index)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-secondary/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-semibold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h3 className="font-semibold text-foreground">{module.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {module.lessons?.length || 0} lessons
                          </p>
                        </div>
                      </div>
                      {expandedModules.includes(index) ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </button>

                    {expandedModules.includes(index) && module.lessons && (
                      <div className="border-t border-border">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lessonIndex}
                            className="flex items-center gap-4 p-4 pl-16 hover:bg-secondary/30 transition-colors border-b border-border last:border-b-0"
                          >
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-foreground">{lesson}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <CourseReviews courseSlug={course.slug} />
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
