import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, X, ShoppingCart, Check, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AnnouncementBar from "@/components/AnnouncementBar";
import { supabase } from "@/integrations/supabase/client";
import { useCart } from "@/hooks/useCart";
import { useToast } from "@/hooks/use-toast";

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
  is_active: boolean;
}

const Courses = () => {
  const { addToCart, isInCart } = useCart();
  const { toast } = useToast();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"default" | "price-low" | "price-high" | "discount">("default");

  useEffect(() => {
    const fetchCourses = async () => {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching courses:', error);
      } else {
        setCourses(data || []);
      }
      setLoading(false);
    };

    fetchCourses();
  }, []);

  // Extract unique categories and levels from fetched courses
  const allCategories = useMemo(() => 
    Array.from(new Set(courses.flatMap((c) => c.categories || []))).sort(),
    [courses]
  );

  const allLevels = useMemo(() => 
    Array.from(new Set(courses.map((c) => c.level))).sort(),
    [courses]
  );

  const priceRange = useMemo(() => ({
    min: courses.length > 0 ? Math.floor(Math.min(...courses.map((c) => c.current_price))) : 0,
    max: courses.length > 0 ? Math.ceil(Math.max(...courses.map((c) => c.current_price))) : 100,
  }), [courses]);

  const [priceFilter, setPriceFilter] = useState<[number, number]>([0, 100]);

  useEffect(() => {
    if (courses.length > 0) {
      setPriceFilter([priceRange.min, priceRange.max]);
    }
  }, [priceRange]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLevelToggle = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedLevels([]);
    setPriceFilter([priceRange.min, priceRange.max]);
    setSortBy("default");
  };

  const filteredCourses = useMemo(() => {
    let result = courses.filter((course) => {
      // Search filter
      if (
        searchQuery &&
        !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !(course.description || '').toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (
        selectedCategories.length > 0 &&
        !(course.categories || []).some((cat) => selectedCategories.includes(cat))
      ) {
        return false;
      }

      // Level filter
      if (selectedLevels.length > 0 && !selectedLevels.includes(course.level)) {
        return false;
      }

      // Price filter
      if (
        course.current_price < priceFilter[0] ||
        course.current_price > priceFilter[1]
      ) {
        return false;
      }

      return true;
    });

    // Sort
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price-high":
        result.sort((a, b) => b.current_price - a.current_price);
        break;
      case "discount":
        result.sort((a, b) => b.discount - a.discount);
        break;
    }

    return result;
  }, [courses, searchQuery, selectedCategories, selectedLevels, priceFilter, sortBy]);

  const activeFiltersCount =
    selectedCategories.length +
    selectedLevels.length +
    (priceFilter[0] !== priceRange.min || priceFilter[1] !== priceRange.max ? 1 : 0);

  const handleAddToCart = (e: React.MouseEvent, course: Course) => {
    e.preventDefault();
    e.stopPropagation();
    
    const cartItem = {
      id: course.id,
      slug: course.slug,
      title: course.title,
      image: course.image_url || '/placeholder.svg',
      categories: course.categories || [],
      originalPrice: course.original_price,
      currentPrice: course.current_price,
      discount: course.discount,
      description: course.description || '',
      instructor: course.instructor || '',
      duration: course.duration || '',
      lessons: course.lessons,
      level: course.level,
      curriculum: [],
      features: course.features || [],
    };

    if (isInCart(course.id)) {
      toast({
        title: "Already in Cart",
        description: "This course is already in your cart.",
      });
      return;
    }
    addToCart(cartItem);
    toast({
      title: "Added to Cart",
      description: `${course.title} has been added to your cart.`,
    });
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <Accordion type="multiple" defaultValue={["categories", "levels", "price"]} className="w-full">
        {/* Categories */}
        <AccordionItem value="categories">
          <AccordionTrigger className="text-foreground hover:no-underline">
            Categories
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {allCategories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={`cat-${category}`}
                    className="text-sm text-foreground cursor-pointer flex-1"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Levels */}
        <AccordionItem value="levels">
          <AccordionTrigger className="text-foreground hover:no-underline">
            Difficulty Level
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3">
              {allLevels.map((level) => (
                <div key={level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level}`}
                    checked={selectedLevels.includes(level)}
                    onCheckedChange={() => handleLevelToggle(level)}
                  />
                  <label
                    htmlFor={`level-${level}`}
                    className="text-sm text-foreground cursor-pointer flex-1"
                  >
                    {level}
                  </label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger className="text-foreground hover:no-underline">
            Price Range
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <Slider
                value={priceFilter}
                onValueChange={(value) => setPriceFilter(value as [number, number])}
                min={priceRange.min}
                max={priceRange.max}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>${priceFilter[0].toFixed(2)}</span>
                <span>${priceFilter[1].toFixed(2)}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {activeFiltersCount > 0 && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full"
        >
          <X className="w-4 h-4 mr-2" />
          Clear All Filters
        </Button>
      )}
    </div>
  );

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

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AnnouncementBar />
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-secondary/50 py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              All Courses
            </h1>
            <p className="text-muted-foreground">
              Browse our collection of {courses.length} premium trading courses
            </p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Search and Sort Bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex gap-2">
              {/* Mobile Filter Button */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden relative">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 bg-primary text-primary-foreground w-5 h-5 p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FilterContent />
                  </div>
                </SheetContent>
              </Sheet>

              {/* Sort Dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="px-4 py-2 border border-border rounded-md bg-background text-foreground"
              >
                <option value="default">Sort: Default</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="discount">Highest Discount</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedCategories.map((cat) => (
                <Badge
                  key={cat}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleCategoryToggle(cat)}
                >
                  {cat}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {selectedLevels.map((level) => (
                <Badge
                  key={level}
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => handleLevelToggle(level)}
                >
                  {level}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              ))}
              {(priceFilter[0] !== priceRange.min ||
                priceFilter[1] !== priceRange.max) && (
                <Badge
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setPriceFilter([priceRange.min, priceRange.max])}
                >
                  ${priceFilter[0]} - ${priceFilter[1]}
                  <X className="w-3 h-3 ml-1" />
                </Badge>
              )}
            </div>
          )}

          <div className="flex gap-8">
            {/* Desktop Sidebar Filters */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-24 bg-card border border-border rounded-xl p-6">
                <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  Filters
                </h3>
                <FilterContent />
              </div>
            </aside>

            {/* Course Grid */}
            <div className="flex-1">
              <p className="text-muted-foreground mb-6">
                Showing {filteredCourses.length} of {courses.length} courses
              </p>

              {filteredCourses.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-foreground mb-2">
                    No courses found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Link
                      to={`/course/${course.slug}`}
                      key={course.id}
                      className="group bg-card rounded-lg overflow-hidden shadow-md hover-lift border border-border block"
                    >
                      {/* Image Container */}
                      <div className="relative aspect-video overflow-hidden">
                        <img
                          src={course.image_url || '/placeholder.svg'}
                          alt={course.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute top-3 left-3 bg-destructive text-destructive-foreground text-sm font-bold px-2 py-1 rounded">
                          -{course.discount}%
                        </div>
                        <Badge className="absolute top-3 right-3 bg-background/80 text-foreground">
                          {course.level}
                        </Badge>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        {/* Categories */}
                        <div className="flex flex-wrap gap-1 mb-2">
                          {(course.categories || []).slice(0, 2).map((cat) => (
                            <span
                              key={cat}
                              className="text-xs text-primary"
                            >
                              {cat}
                              {(course.categories || []).indexOf(cat) <
                                Math.min((course.categories || []).length, 2) - 1 && ","}
                            </span>
                          ))}
                        </div>

                        {/* Title */}
                        <h3 className="font-semibold text-card-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>

                        {/* Price */}
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-muted-foreground line-through text-sm">
                            ${course.original_price.toFixed(2)}
                          </span>
                          <span className="text-primary font-bold text-lg">
                            ${course.current_price.toFixed(2)}
                          </span>
                        </div>

                        {/* Add to Cart Button */}
                        <Button
                          className={`w-full ${
                            isInCart(course.id)
                              ? "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                              : "bg-primary hover:bg-primary/90 text-primary-foreground"
                          }`}
                          size="sm"
                          onClick={(e) => handleAddToCart(e, course)}
                        >
                          {isInCart(course.id) ? (
                            <>
                              <Check className="w-4 h-4 mr-2" />
                              In Cart
                            </>
                          ) : (
                            <>
                              <ShoppingCart className="w-4 h-4 mr-2" />
                              Add to cart
                            </>
                          )}
                        </Button>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Courses;
