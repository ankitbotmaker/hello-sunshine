-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  image_url TEXT,
  categories TEXT[] NOT NULL DEFAULT '{}',
  original_price NUMERIC NOT NULL DEFAULT 0,
  current_price NUMERIC NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0,
  description TEXT,
  instructor TEXT,
  duration TEXT,
  lessons INTEGER NOT NULL DEFAULT 0,
  level TEXT NOT NULL DEFAULT 'Beginner',
  curriculum JSONB DEFAULT '[]',
  features TEXT[] DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Anyone can view active courses
CREATE POLICY "Anyone can view active courses" 
ON public.courses 
FOR SELECT 
USING (is_active = true);

-- Admins can view all courses
CREATE POLICY "Admins can view all courses" 
ON public.courses 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'));

-- Admins can insert courses
CREATE POLICY "Admins can insert courses" 
ON public.courses 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'));

-- Admins can update courses
CREATE POLICY "Admins can update courses" 
ON public.courses 
FOR UPDATE 
USING (has_role(auth.uid(), 'admin'));

-- Admins can delete courses
CREATE POLICY "Admins can delete courses" 
ON public.courses 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'));

-- Create trigger for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for course images
INSERT INTO storage.buckets (id, name, public) VALUES ('course-images', 'course-images', true);

-- Storage policies for course images
CREATE POLICY "Course images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'course-images');

CREATE POLICY "Admins can upload course images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update course images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete course images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'course-images' AND has_role(auth.uid(), 'admin'));