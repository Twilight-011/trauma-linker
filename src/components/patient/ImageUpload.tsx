import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Upload, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (files: FileList | null) => void;
  onDemoImageSelect: (imageUrl: string) => void;
}

const ImageUpload = ({ onImagesChange, onDemoImageSelect }: ImageUploadProps) => {
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const fileArray = Array.from(files);
      setSelectedImages(fileArray);
      onImagesChange(files);
    }
  };

  const handleDemoImageClick = () => {
    // For now, just call with a placeholder demo URL
    onDemoImageSelect('https://example.com/demo-trauma-image.jpg');
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center">
          <Camera className="h-5 w-5 mr-2 text-primary" />
          Medical Images
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="image-upload" className="text-sm font-medium">
              Upload Images
            </label>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileChange}
              className="cursor-pointer"
            />
            <p className="text-xs text-gray-500">
              Supported: JPG, PNG, WebP (Max 5MB each)
            </p>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Demo Images</label>
            <Button
              variant="outline"
              onClick={handleDemoImageClick}
              className="w-full"
            >
              <ImageIcon className="h-4 w-4 mr-2" />
              Select Demo Image
            </Button>
            <p className="text-xs text-gray-500">
              Use pre-loaded trauma cases for testing
            </p>
          </div>
        </div>

        {selectedImages.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Selected Images:</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {selectedImages.map((file, index) => (
                <div key={index} className="relative">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Selected ${index + 1}`}
                    className="w-full h-20 object-cover rounded-md border"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-md">
                    {file.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ImageUpload;