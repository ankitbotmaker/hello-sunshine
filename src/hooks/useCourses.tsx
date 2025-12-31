import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Json } from '@/integrations/supabase/types';

export interface CourseModule {
  title: string;
  lessons: string[];
}

export interface Course {
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
  created_at: string;
  updated_at: string;
}

export interface CourseFormData {
  title: string;
  slug: string;
  image_url?: string;
  categories: string[];
  original_price: number;
  current_price: number;
  discount: number;
  description: string;
  instructor: string;
  duration: string;
  lessons: number;
  level: string;
  curriculum: CourseModule[];
  features: string[];
  is_active: boolean;
}

const transformCourse = (data: Record<string, unknown>): Course => {
  return {
    ...data,
    curriculum: (data.curriculum as CourseModule[]) || [],
  } as Course;
};

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching courses:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch courses',
        variant: 'destructive',
      });
    } else {
      setCourses((data || []).map(d => transformCourse(d as Record<string, unknown>)));
    }
    setLoading(false);
  };

  const getCourseBySlug = async (slug: string): Promise<Course | null> => {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('Error fetching course:', error);
      return null;
    }
    return data ? transformCourse(data as Record<string, unknown>) : null;
  };

  const createCourse = async (courseData: CourseFormData): Promise<boolean> => {
    const { error } = await supabase.from('courses').insert([{
      title: courseData.title,
      slug: courseData.slug,
      image_url: courseData.image_url,
      categories: courseData.categories,
      original_price: courseData.original_price,
      current_price: courseData.current_price,
      discount: courseData.discount,
      description: courseData.description,
      instructor: courseData.instructor,
      duration: courseData.duration,
      lessons: courseData.lessons,
      level: courseData.level,
      curriculum: courseData.curriculum as unknown as Json,
      features: courseData.features,
      is_active: courseData.is_active,
    }]);

    if (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Success',
      description: 'Course created successfully',
    });
    await fetchCourses();
    return true;
  };

  const updateCourse = async (id: string, courseData: Partial<CourseFormData>): Promise<boolean> => {
    const { error } = await supabase
      .from('courses')
      .update({
        title: courseData.title,
        slug: courseData.slug,
        image_url: courseData.image_url,
        categories: courseData.categories,
        original_price: courseData.original_price,
        current_price: courseData.current_price,
        discount: courseData.discount,
        description: courseData.description,
        instructor: courseData.instructor,
        duration: courseData.duration,
        lessons: courseData.lessons,
        level: courseData.level,
        curriculum: courseData.curriculum as unknown as Json,
        features: courseData.features,
        is_active: courseData.is_active,
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to update course',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Success',
      description: 'Course updated successfully',
    });
    await fetchCourses();
    return true;
  };

  const deleteCourse = async (id: string): Promise<boolean> => {
    const { error } = await supabase.from('courses').delete().eq('id', id);

    if (error) {
      console.error('Error deleting course:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete course',
        variant: 'destructive',
      });
      return false;
    }

    toast({
      title: 'Success',
      description: 'Course deleted successfully',
    });
    await fetchCourses();
    return true;
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('course-images')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast({
        title: 'Error',
        description: 'Failed to upload image',
        variant: 'destructive',
      });
      return null;
    }

    const { data } = supabase.storage
      .from('course-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return {
    courses,
    loading,
    fetchCourses,
    getCourseBySlug,
    createCourse,
    updateCourse,
    deleteCourse,
    uploadImage,
  };
};
