import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import course1 from "@/assets/course-1.jpg";
import course2 from "@/assets/course-2.jpg";
import course3 from "@/assets/course-3.jpg";
import course4 from "@/assets/course-4.jpg";

const courses = [
  {
    id: 1,
    title: "Rochit Singh Course",
    image: course1,
    categories: ["Equity", "Option Trading", "Price Action Courses", "Stock Market"],
    originalPrice: 60.00,
    currentPrice: 3.48,
    discount: 94,
  },
  {
    id: 2,
    title: "Trademix Fly Strategy 2025",
    image: course2,
    categories: ["Option Trading", "Stock Market"],
    originalPrice: 45.00,
    currentPrice: 12.60,
    discount: 72,
  },
  {
    id: 3,
    title: "Advanced SL Hunting Masterclass",
    image: course3,
    categories: ["Forex Courses", "Price Action Courses"],
    originalPrice: 120.00,
    currentPrice: 8.40,
    discount: 93,
  },
  {
    id: 4,
    title: "Price Action Complete Course",
    image: course4,
    categories: ["Price Action Courses", "Stock Market"],
    originalPrice: 80.00,
    currentPrice: 4.80,
    discount: 94,
  },
];

const CourseGrid = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-center text-primary mb-10">
          Our Latest Courses
        </h2>

        {/* Course Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <div
              key={course.id}
              className="group bg-card rounded-lg overflow-hidden shadow-md hover-lift animate-fade-in border border-border"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                
                {/* Discount Badge */}
                <div className="absolute top-3 left-3 bg-discount text-white text-sm font-bold px-2 py-1 rounded">
                  -{course.discount}%
                </div>

                {/* Quick Add Button - Shows on Hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="icon"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-12 h-12"
                  >
                    <ShoppingCart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Categories */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {course.categories.slice(0, 2).map((cat) => (
                    <span
                      key={cat}
                      className="text-xs text-primary hover:underline cursor-pointer"
                    >
                      {cat}
                      {course.categories.indexOf(cat) < Math.min(course.categories.length, 2) - 1 && ","}
                    </span>
                  ))}
                  {course.categories.length > 2 && (
                    <span className="text-xs text-muted-foreground">
                      +{course.categories.length - 2} more
                    </span>
                  )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                  {course.title}
                </h3>

                {/* Price */}
                <div className="flex items-center gap-2">
                  <span className="text-price-original line-through text-sm">
                    ${course.originalPrice.toFixed(2)}
                  </span>
                  <span className="text-price-current font-bold text-lg">
                    ${course.currentPrice.toFixed(2)}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                  className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseGrid;
