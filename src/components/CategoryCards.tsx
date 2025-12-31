import { Button } from "@/components/ui/button";
import categoryStock from "@/assets/category-stock.jpg";
import categoryForex from "@/assets/category-forex.jpg";
import categoryMarketing from "@/assets/category-marketing.jpg";

const categories = [
  {
    title: "STOCK Market",
    image: categoryStock,
    href: "#",
  },
  {
    title: "Forex Courses",
    image: categoryForex,
    href: "#",
  },
  {
    title: "Digital MARKETING",
    image: categoryMarketing,
    href: "#",
  },
];

const CategoryCards = () => {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={category.title}
              className="relative group overflow-hidden rounded-lg aspect-[4/3] hover-lift animate-fade-in cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${category.image})` }}
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />

              {/* Content */}
              <div className="relative z-10 h-full flex flex-col items-center justify-center text-white p-6">
                <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">
                  {category.title}
                </h3>
                <Button
                  variant="outline"
                  className="border-primary bg-primary/20 text-white hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  Purchase Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryCards;
