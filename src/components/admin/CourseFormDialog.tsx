import { useState, useEffect } from 'react';
import { Course, CourseFormData, CourseModule } from '@/hooks/useCourses';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2, Upload, X } from 'lucide-react';

interface CourseFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course?: Course | null;
  onSubmit: (data: CourseFormData) => Promise<boolean>;
  onUploadImage: (file: File) => Promise<string | null>;
}

const CATEGORIES = [
  'Equity',
  'Option Trading',
  'Price Action Courses',
  'Stock Market',
  'Forex Courses',
  'Crypto Trading',
  'Technical Analysis',
];

const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Beginner to Advanced'];

const generateSlug = (title: string) => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
};

const CourseFormDialog = ({
  open,
  onOpenChange,
  course,
  onSubmit,
  onUploadImage,
}: CourseFormDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    slug: '',
    image_url: '',
    categories: [],
    original_price: 0,
    current_price: 0,
    discount: 0,
    description: '',
    instructor: '',
    duration: '',
    lessons: 0,
    level: 'Beginner',
    curriculum: [],
    features: [],
    is_active: true,
  });
  const [newCategory, setNewCategory] = useState('');
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    if (course) {
      setFormData({
        title: course.title,
        slug: course.slug,
        image_url: course.image_url || '',
        categories: course.categories || [],
        original_price: course.original_price,
        current_price: course.current_price,
        discount: course.discount,
        description: course.description || '',
        instructor: course.instructor || '',
        duration: course.duration || '',
        lessons: course.lessons,
        level: course.level,
        curriculum: course.curriculum || [],
        features: course.features || [],
        is_active: course.is_active,
      });
    } else {
      setFormData({
        title: '',
        slug: '',
        image_url: '',
        categories: [],
        original_price: 0,
        current_price: 0,
        discount: 0,
        description: '',
        instructor: '',
        duration: '',
        lessons: 0,
        level: 'Beginner',
        curriculum: [],
        features: [],
        is_active: true,
      });
    }
  }, [course, open]);

  const handleTitleChange = (title: string) => {
    setFormData(prev => ({
      ...prev,
      title,
      slug: course ? prev.slug : generateSlug(title),
    }));
  };

  const handlePriceChange = (field: 'original_price' | 'current_price', value: number) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };
      if (updated.original_price > 0) {
        updated.discount = Math.round((1 - updated.current_price / updated.original_price) * 100);
      }
      return updated;
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    const url = await onUploadImage(file);
    if (url) {
      setFormData(prev => ({ ...prev, image_url: url }));
    }
    setLoading(false);
  };

  const addCategory = (category: string) => {
    if (category && !formData.categories.includes(category)) {
      setFormData(prev => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
    setNewCategory('');
  };

  const removeCategory = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(c => c !== category),
    }));
  };

  const addFeature = () => {
    if (newFeature && !formData.features.includes(newFeature)) {
      setFormData(prev => ({
        ...prev,
        features: [...prev.features, newFeature],
      }));
      setNewFeature('');
    }
  };

  const removeFeature = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter(f => f !== feature),
    }));
  };

  const addModule = () => {
    setFormData(prev => ({
      ...prev,
      curriculum: [...prev.curriculum, { title: '', lessons: [] }],
    }));
  };

  const updateModule = (index: number, module: CourseModule) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.map((m, i) => (i === index ? module : m)),
    }));
  };

  const removeModule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      curriculum: prev.curriculum.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const success = await onSubmit(formData);
    setLoading(false);
    if (success) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>{course ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={e => handleTitleChange(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={e => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instructor">Instructor</Label>
                  <Input
                    id="instructor"
                    value={formData.instructor}
                    onChange={e => setFormData(prev => ({ ...prev, instructor: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Select
                    value={formData.level}
                    onValueChange={value => setFormData(prev => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {LEVELS.map(level => (
                        <SelectItem key={level} value={level}>{level}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={e => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="e.g., 12+ Hours"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lessons">Total Lessons</Label>
                  <Input
                    id="lessons"
                    type="number"
                    value={formData.lessons}
                    onChange={e => setFormData(prev => ({ ...prev, lessons: parseInt(e.target.value) || 0 }))}
                  />
                </div>
              </div>
            </div>

            {/* Image */}
            <div className="space-y-4">
              <h3 className="font-semibold">Course Image</h3>
              <div className="flex items-center gap-4">
                {formData.image_url && (
                  <img
                    src={formData.image_url}
                    alt="Course preview"
                    className="w-24 h-24 object-cover rounded"
                  />
                )}
                <div className="flex-1">
                  <Input
                    id="image_url"
                    value={formData.image_url}
                    onChange={e => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                    placeholder="Image URL"
                  />
                </div>
                <Label htmlFor="image-upload" className="cursor-pointer">
                  <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-md hover:bg-secondary/80">
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </Label>
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4">
              <h3 className="font-semibold">Pricing</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="original_price">Original Price ($)</Label>
                  <Input
                    id="original_price"
                    type="number"
                    step="0.01"
                    value={formData.original_price}
                    onChange={e => handlePriceChange('original_price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="current_price">Current Price ($)</Label>
                  <Input
                    id="current_price"
                    type="number"
                    step="0.01"
                    value={formData.current_price}
                    onChange={e => handlePriceChange('current_price', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount">Discount (%)</Label>
                  <Input
                    id="discount"
                    type="number"
                    value={formData.discount}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold">Categories</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.categories.map(cat => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                  >
                    {cat}
                    <button type="button" onClick={() => removeCategory(cat)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Select value={newCategory} onValueChange={addCategory}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Add category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.filter(c => !formData.categories.includes(c)).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="font-semibold">Features</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.features.map(feature => (
                  <span
                    key={feature}
                    className="inline-flex items-center gap-1 px-2 py-1 bg-secondary rounded-md text-sm"
                  >
                    {feature}
                    <button type="button" onClick={() => removeFeature(feature)}>
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={e => setNewFeature(e.target.value)}
                  placeholder="Add feature (e.g., Lifetime Access)"
                  onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                />
                <Button type="button" variant="outline" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Curriculum */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Curriculum</h3>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  <Plus className="h-4 w-4 mr-1" /> Add Module
                </Button>
              </div>
              {formData.curriculum.map((module, moduleIndex) => (
                <div key={moduleIndex} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center gap-2">
                    <Input
                      value={module.title}
                      onChange={e => updateModule(moduleIndex, { ...module, title: e.target.value })}
                      placeholder="Module title"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                  <div className="space-y-2 pl-4">
                    {module.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="flex items-center gap-2">
                        <Input
                          value={lesson}
                          onChange={e => {
                            const newLessons = [...module.lessons];
                            newLessons[lessonIndex] = e.target.value;
                            updateModule(moduleIndex, { ...module, lessons: newLessons });
                          }}
                          placeholder="Lesson title"
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newLessons = module.lessons.filter((_, i) => i !== lessonIndex);
                            updateModule(moduleIndex, { ...module, lessons: newLessons });
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        updateModule(moduleIndex, { ...module, lessons: [...module.lessons, ''] });
                      }}
                    >
                      <Plus className="h-4 w-4 mr-1" /> Add Lesson
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label>Course Status</Label>
                <p className="text-sm text-muted-foreground">
                  {formData.is_active ? 'Course is visible to users' : 'Course is hidden'}
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={checked => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default CourseFormDialog;
