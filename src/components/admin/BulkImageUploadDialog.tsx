import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Upload, X, Check, Image, Trash2, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkImageUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadImage: (file: File) => Promise<string | null>;
}

interface UploadedImage {
  id: string;
  file: File;
  url: string | null;
  status: 'pending' | 'uploading' | 'done' | 'error';
  preview: string;
}

const BulkImageUploadDialog = ({
  open,
  onOpenChange,
  onUploadImage,
}: BulkImageUploadDialogProps) => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addFiles(files);
  };

  const addFiles = (files: File[]) => {
    const imageFiles = files.filter(f => f.type.startsWith('image/'));
    const newImages: UploadedImage[] = imageFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: null,
      status: 'pending',
      preview: URL.createObjectURL(file),
    }));
    setImages(prev => [...prev, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    addFiles(files);
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const img = prev.find(i => i.id === id);
      if (img) {
        URL.revokeObjectURL(img.preview);
      }
      return prev.filter(i => i.id !== id);
    });
  };

  const uploadAll = async () => {
    setUploading(true);
    const pendingImages = images.filter(img => img.status === 'pending');

    for (const img of pendingImages) {
      setImages(prev =>
        prev.map(i => (i.id === img.id ? { ...i, status: 'uploading' } : i))
      );

      try {
        const url = await onUploadImage(img.file);
        setImages(prev =>
          prev.map(i =>
            i.id === img.id
              ? { ...i, url, status: url ? 'done' : 'error' }
              : i
          )
        );
      } catch {
        setImages(prev =>
          prev.map(i => (i.id === img.id ? { ...i, status: 'error' } : i))
        );
      }
    }

    setUploading(false);
    toast({
      title: 'Upload Complete',
      description: `${pendingImages.length} images uploaded successfully.`,
    });
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'URL Copied',
      description: 'Image URL copied to clipboard.',
    });
  };

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview));
    setImages([]);
  };

  const pendingCount = images.filter(i => i.status === 'pending').length;
  const doneCount = images.filter(i => i.status === 'done').length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-slate-800 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Image className="h-5 w-5" />
            Bulk Image Upload
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Drop Zone */}
          <div
            className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add('border-primary', 'bg-primary/5');
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
            }}
            onDrop={(e) => {
              e.currentTarget.classList.remove('border-primary', 'bg-primary/5');
              handleDrop(e);
            }}
            onClick={() => document.getElementById('bulk-image-input')?.click()}
          >
            <Upload className="h-12 w-12 text-white/30 mx-auto mb-3" />
            <p className="text-white/70 mb-2">
              Drag & drop multiple images here, or click to browse
            </p>
            <p className="text-white/40 text-sm">
              Supports JPG, PNG, WEBP • Max 10MB per file
            </p>
            <input
              id="bulk-image-input"
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
          </div>

          {/* Stats */}
          {images.length > 0 && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex gap-4">
                <span className="text-white/50">
                  Total: <span className="text-white">{images.length}</span>
                </span>
                <span className="text-white/50">
                  Pending: <span className="text-yellow-400">{pendingCount}</span>
                </span>
                <span className="text-white/50">
                  Uploaded: <span className="text-primary">{doneCount}</span>
                </span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Clear All
                </Button>
                <Button
                  size="sm"
                  onClick={uploadAll}
                  disabled={uploading || pendingCount === 0}
                  className="bg-gradient-to-r from-primary to-emerald-400"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-1" />
                      Upload All ({pendingCount})
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Image Grid */}
          {images.length > 0 && (
            <ScrollArea className="h-[400px]">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 p-1">
                {images.map((img) => (
                  <div
                    key={img.id}
                    className="relative group bg-white/5 rounded-lg overflow-hidden border border-white/10"
                  >
                    <img
                      src={img.preview}
                      alt="Preview"
                      className="w-full aspect-square object-cover"
                    />
                    
                    {/* Status Overlay */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-opacity ${
                      img.status === 'uploading' ? 'bg-black/60' : 
                      img.status === 'done' ? 'bg-black/40' : 
                      img.status === 'error' ? 'bg-red-500/40' : 
                      'bg-black/0 group-hover:bg-black/40'
                    }`}>
                      {img.status === 'uploading' && (
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
                      )}
                      {img.status === 'done' && (
                        <div className="p-2 bg-primary rounded-full">
                          <Check className="h-5 w-5 text-white" />
                        </div>
                      )}
                      {img.status === 'error' && (
                        <div className="p-2 bg-red-500 rounded-full">
                          <X className="h-5 w-5 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.url && (
                        <button
                          onClick={() => copyUrl(img.url!)}
                          className="p-1.5 bg-blue-500 rounded-md text-white hover:bg-blue-600"
                          title="Copy URL"
                        >
                          <Copy className="h-3 w-3" />
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(img.id)}
                        className="p-1.5 bg-red-500 rounded-md text-white hover:bg-red-600"
                        title="Remove"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>

                    {/* File Name */}
                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                      <p className="text-white text-xs truncate">{img.file.name}</p>
                      {img.url && (
                        <p className="text-primary text-xs truncate">{img.url}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}

          {/* Empty State */}
          {images.length === 0 && (
            <div className="text-center py-8 text-white/40">
              <Image className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <p>No images selected</p>
              <p className="text-sm">Add images to upload them to your course library</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkImageUploadDialog;
