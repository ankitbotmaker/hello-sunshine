import Header from "@/components/Header";
import Hero from "@/components/Hero";

import CourseGrid from "@/components/CourseGrid";
import Footer from "@/components/Footer";
import { useCourses } from "@/hooks/useCourses";

const Index = () => {
  const { courses, loading } = useCourses();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />

        <CourseGrid courses={courses} isLoading={loading} />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
