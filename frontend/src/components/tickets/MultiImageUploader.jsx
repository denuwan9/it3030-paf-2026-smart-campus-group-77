import React, { useState } from 'react';
import { ImagePlus, X, Loader2, Camera } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const MultiImageUploader = ({ onImagesChange, maxImages = 3 }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > maxImages) {
      toast.error(`You can only upload up to ${maxImages} images`);
      return;
    }

    setUploading(true);
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default';
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo';

    try {
      const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        return axios.post(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
          formData
        );
      });

      const results = await Promise.all(uploadPromises);
      const newUrls = results.map(res => res.data.secure_url);
      
      const updatedImages = [...images, ...newUrls];
      setImages(updatedImages);
      onImagesChange(updatedImages);
      toast.success('Images uploaded successfully');
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
    onImagesChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, i) => (
          <div key={i} className="relative w-24 h-24 rounded-2xl overflow-hidden border-2 border-white shadow-sm group">
            <img src={url} alt="Incident" className="w-full h-full object-cover" />
            <button
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {images.length < maxImages && (
          <label className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-nexer-brand-primary hover:bg-slate-50 transition-all text-slate-400 group relative overflow-hidden">
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-nexer-brand-primary" />
            ) : (
              <>
                <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase mt-1 tracking-widest">Add Image</span>
              </>
            )}
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        )}
      </div>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
        Attachments ({images.length} / {maxImages})
      </p>
    </div>
  );
};

export default MultiImageUploader;
