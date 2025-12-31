import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Clock, BookOpen, BarChart3, Check, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { getCourseBySlug } from "@/data/courses";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const CourseDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState<number[]>([0]);
  const [isPurchasing, setIsPurchasing] = useState(false);

  const course = getCourseBySlug(slug || "");

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <AnnouncementBar />
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">Course Not Found</h1>
            <Link to="/" className="text-primary hover:underline">
              Return to Home
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

  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to purchase this course.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setIsPurchasing(true);
    try {
      const { error } = await supabase.from("purchases").insert({
        user_id: user.id,
        course_title: course.title,
        course_image: course.image,
        price: course.currentPrice,
        original_price: course.originalPrice,
        status: "completed",
        download_url: `/downloads/${course.slug}`,
      });

      if (error) throw error;

      toast({
        title: "Purchase Successful!",
        description: "You can now access your course from My Account.",
      });
      navigate("/my-account");
    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const totalLessons = course.curriculum.reduce((acc, module) => acc + module.lessons.length, 0);

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

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-secondary/50 to-background py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-8 items-start">
              {/* Course Image */}
              <div className="relative rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full aspect-video object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-destructive text-destructive-foreground text-lg px-3 py-1">
                    -{course.discount}% OFF
                  </Badge>
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-6">
                {/* Categories */}
                <div className="flex flex-wrap gap-2">
                  {course.categories.map((cat) => (
                    <Badge key={cat} variant="outline" className="text-primary border-primary">
                      {cat}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {course.title}
                </h1>

                <p className="text-muted-foreground text-lg">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="flex flex-wrap gap-6 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span>{course.lessons} Lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    <span>{course.level}</span>
                  </div>
                </div>

                {/* Instructor */}
                <p className="text-foreground">
                  <span className="text-muted-foreground">Instructor:</span>{" "}
                  <span className="font-semibold text-primary">{course.instructor}</span>
                </p>

                {/* Price & Purchase */}
                <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-primary">
                      ${course.currentPrice.toFixed(2)}
                    </span>
                    <span className="text-xl text-muted-foreground line-through">
                      ${course.originalPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-destructive text-destructive-foreground">
                      Save {course.discount}%
                    </Badge>
                  </div>

                  <Button
                    onClick={handlePurchase}
                    disabled={isPurchasing}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-lg py-6"
                    size="lg"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isPurchasing ? "Processing..." : "Purchase Now"}
                  </Button>

                  {/* Features */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-border">
                    {course.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
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
                          {module.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                    {expandedModules.includes(index) ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </button>

                  {expandedModules.includes(index) && (
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
      </main>

      <Footer />
    </div>
  );
};

export default CourseDetail;
