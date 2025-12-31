import { Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImage from "@/assets/hero-trading.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-[500px] md:min-h-[550px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 animate-fade-in">
          #1 Source For Premium Courses
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-8 animate-fade-in" style={{ animationDelay: "0.1s" }}>
          All Kind of Courses Available at Cheap Prices.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search"
              className="w-full h-12 pr-14 bg-white/95 text-foreground border-0 text-base"
            />
            <Button
              size="icon"
              className="absolute right-1 top-1 h-10 w-10 bg-muted hover:bg-muted/80"
              variant="ghost"
            >
              <Search className="w-5 h-5 text-muted-foreground" />
            </Button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-6 text-base rounded-md group"
          >
            Go to Shop
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Currency Badges - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2">
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-l-lg font-medium flex items-center gap-2">
          <span>₹</span>
        </div>
        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-l-lg font-medium flex items-center gap-2">
          <span>$</span>
        </div>
      </div>
    </section>
  );
};

export default Hero;
