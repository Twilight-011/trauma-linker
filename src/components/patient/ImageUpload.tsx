
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Camera, Upload } from 'lucide-react';
import DemoImageSelector from './DemoImageSelector';

interface ImageUploadProps {
  onImagesChange: (files: FileList | null) => void;
  onDemoImageSelect?: (imageUrl: string) => void;
}

const ImageUpload = ({ onImagesChange, onDemoImageSelect }: ImageUploadProps) => {
  const { toast } = useToast();
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    onImagesChange(files);
    
    // Create preview URLs
    const newPreviewUrls: string[] = [];
    Array.from(files).forEach(file => {
      const url = URL.createObjectURL(file);
      newPreviewUrls.push(url);
    });
    
    setPreviewUrls(newPreviewUrls);
  };

  const handleCameraCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      
      // Create a video element to show the stream
      const video = document.createElement('video');
      video.srcObject = stream;
      video.play();
      
      // Create a modal to show the stream and capture button
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
      
      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white p-4 rounded-lg flex flex-col items-center max-w-xl';
      
      const videoContainer = document.createElement('div');
      videoContainer.className = 'w-full h-64 relative overflow-hidden bg-gray-900 rounded-lg';
      videoContainer.appendChild(video);
      
      const captureBtn = document.createElement('button');
      captureBtn.className = 'mt-4 px-4 py-2 bg-primary text-white rounded-lg';
      captureBtn.textContent = 'Capture Photo';
      
      const closeBtn = document.createElement('button');
      closeBtn.className = 'mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg';
      closeBtn.textContent = 'Cancel';
      
      modalContent.appendChild(videoContainer);
      modalContent.appendChild(captureBtn);
      modalContent.appendChild(closeBtn);
      modal.appendChild(modalContent);
      document.body.appendChild(modal);
      
      // Handle capture button click
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d')!.drawImage(video, 0, 0);
        
        // Convert to blob and create a file
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
            const dt = new DataTransfer();
            dt.items.add(file);
            
            onImagesChange(dt.files);
            
            const url = URL.createObjectURL(blob);
            setPreviewUrls([...previewUrls, url]);
            
            // Clean up
            stream.getTracks().forEach(track => track.stop());
            document.body.removeChild(modal);
          }
        }, 'image/jpeg');
      };
      
      // Handle close button click
      closeBtn.onclick = () => {
        stream.getTracks().forEach(track => track.stop());
        document.body.removeChild(modal);
      };
    } catch (error) {
      console.error('Error accessing camera:', error);
      toast({
        title: 'Camera Error',
        description: 'Could not access camera. Please check permissions.',
        variant: 'destructive'
      });
    }
  };

  const removeImage = (index: number) => {
    const newPreviewUrls = [...previewUrls];
    newPreviewUrls.splice(index, 1);
    setPreviewUrls(newPreviewUrls);
    
    // Update FileList
    if (previewUrls.length > 0) {
      const dt = new DataTransfer();
      Array.from(previewUrls).forEach((_, i) => {
        if (i !== index) dt.items.add(new File([], `image-${i}.jpg`));
      });
      onImagesChange(dt.files.length > 0 ? dt.files : null);
    } else {
      onImagesChange(null);
    }
  };

  const handleDemoImageSelect = (imageUrl: string, imageFile: File) => {
    // Create a FileList with the demo image
    const dt = new DataTransfer();
    dt.items.add(imageFile);
    onImagesChange(dt.files);
    
    // Create preview URL
    setPreviewUrls([imageUrl]);
    
    // Callback for additional demo handling if needed
    onDemoImageSelect?.(imageUrl);
  };

  return (
    <div className="space-y-4">
      <DemoImageSelector onImageSelect={handleDemoImageSelect} />
      
      <div className="space-y-2">
        <Label className="block mb-2">Upload Your Own Images (for AI Analysis)</Label>
        <div className="flex flex-wrap gap-2 mb-4">
          <Button 
            type="button" 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleCameraCapture}
          >
            <Camera className="h-4 w-4" />
            Capture Photo
          </Button>
          <div className="relative">
            <Input
              id="injuryPhotos"
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => document.getElementById('injuryPhotos')?.click()}
            >
              <Upload className="h-4 w-4" />
              Upload Photos
            </Button>
          </div>
        </div>
        
        {previewUrls.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 mt-4">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative">
                <img
                  src={url}
                  alt={`Injury ${index + 1}`}
                  className="w-full h-24 object-cover rounded-md border"
                />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  onClick={() => removeImage(index)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        
        {previewUrls.length === 0 && (
          <div className="border border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500 mt-4">
            <p>Upload or capture photos of injuries for AI analysis</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
