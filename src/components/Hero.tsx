import { Search, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { motion } from "framer-motion";

const Hero = () => {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 });

  return (
    <section
      ref={ref}
      className={`relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0f172a] py-20 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* Background Effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl animate-pulse-slow mix-blend-screen" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000 mix-blend-screen" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-b from-indigo-500/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container relative z-10 mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel mb-8 hover:bg-white/10 transition-colors cursor-default border border-white/5 bg-white/5 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-sm font-medium text-emerald-200">
            Premium Courses. Unbeatable Prices.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="font-heading text-5xl sm:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8"
        >
          <span className="block text-white mb-2">Maximize Your</span>
          <span className="text-gradient animate-text block">Potential</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-400 mb-12 leading-relaxed"
        >
          Unlock your true potential with our expertly curated collection of premium courses.
          From trading to coding, master high-income skills today.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-cyan-500 hover:opacity-90 transition-all rounded-xl shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] group border-0 text-white"
          >
            Explore Courses
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="w-full sm:w-auto px-8 py-6 text-lg font-semibold bg-transparent border-white/10 text-white hover:bg-white/5 hover:text-emerald-400 transition-all rounded-xl backdrop-blur-sm"
          >
            View All Categories
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
