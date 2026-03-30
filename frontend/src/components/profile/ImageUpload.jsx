import React, { useState } from 'react';
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const ImageUpload = ({ currentImage, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Local Preview
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    reader.readAsDataURL(file);

    // Use environment variables for Cloudinary config
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'ml_default'; 
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'demo'; 

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

    setUploading(true);
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData
      );
      
      const secureUrl = response.data.secure_url;
      onUploadSuccess(secureUrl);
      toast.success('Profile photo uploaded successfully');
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      toast.error('Failed to upload image. Please check your Cloudinary config.');
      setPreview(null); // Reset preview on error
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative group">
      <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2.5rem] bg-slate-100 overflow-hidden border-4 border-white shadow-lumina-md relative">
        {uploading && (
          <div className="absolute inset-0 z-20 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}
        
        <img 
          src={preview || currentImage || 'https://via.placeholder.com/150'} 
          alt="Profile" 
          className="w-full h-full object-cover"
        />
        
        <label className="absolute inset-0 z-10 flex items-center justify-center bg-black/0 hover:bg-black/40 text-transparent hover:text-white transition-all cursor-pointer">
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange}
            disabled={uploading}
          />
          <div className="flex flex-col items-center gap-1">
            <Camera className="w-6 h-6" />
            <span className="text-[10px] font-black uppercase tracking-widest">Change</span>
          </div>
        </label>
      </div>

      {uploading ? (
        <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-2 shadow-lumina-sm border border-slate-50">
          <Loader2 className="w-4 h-4 text-lumina-brand-primary animate-spin" />
        </div>
      ) : preview ? (
        <div className="absolute -bottom-2 -right-2 bg-white rounded-2xl p-2 shadow-lumina-sm border border-emerald-100">
          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        </div>
      ) : null}
    </div>
  );
};

export default ImageUpload;
