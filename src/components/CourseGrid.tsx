import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

const TELEGRAM_USERNAME = "stcs111111111111";

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
  features: string[];
}

const CourseGrid = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(8);

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  const handleBuyNow = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    
    const message = encodeURIComponent(
      `🎓 *Course Purchase Request*\n\n` +
      `📚 *Course:* ${course.title}\n` +
      `💰 *Price:* $${course.current_price.toFixed(2)} (Original: $${course.original_price.toFixed(2)})\n` +
      `🏷️ *Discount:* ${course.discount}% OFF\n` +
      `📊 *Level:* ${course.level}\n\n` +
      `I'm interested in purchasing this course!`
    );
    window.open(`https://t.me/${TELEGRAM_USERNAME}?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <section className="py-12 md:py-16 bg-[hsl(var(--nav-bg))]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-primary mb-10">
            Our Latest Courses
          </h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        </div>
      </section>
    );
  }

  if (courses.length === 0) {
    return (
      <section className="py-12 md:py-16 bg-[hsl(var(--nav-bg))]">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-primary mb-10">
            Our Latest Courses
          </h2>
          <p className="text-center text-muted-foreground">No courses available yet.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 md:py-16 bg-[hsl(var(--nav-bg))]">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-primary mb-10">
          Our Latest Courses
        </h2>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <Link
              to={`/course/${course.slug}`}
              key={course.id}
              className="group bg-secondary rounded-lg overflow-hidden shadow-lg hover-lift animate-fade-in border border-border/50 block"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.image_url || '/placeholder.svg'}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-sm font-bold px-2 py-1 rounded">
                  -{course.discount}%
                </div>

                {/* Quick Buy Button - Shows on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={(e) => handleBuyNow(e, course)}
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {(course.categories || []).slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      {cat}
                      {(course.categories || []).indexOf(cat) < Math.min((course.categories || []).length, 2) - 1 && ","}
                    </span>
                  ))}
                  {(course.categories || []).length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{(course.categories || []).length - 2} more
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground line-through text-sm">
                    ${course.original_price.toFixed(2)}
                  </span>
                  <span className="text-primary font-bold text-lg">
                    ${course.current_price.toFixed(2)}
                  </span>
                </div>

                {/* Buy Now Button */}
                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                  onClick={(e) => handleBuyNow(e, course)}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
