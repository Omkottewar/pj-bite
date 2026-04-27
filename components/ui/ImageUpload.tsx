"use client";

import { useState } from "react";
import { UploadCloud, X, Loader2, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  onUpload: (url: string) => void;
  defaultImage?: string;
  folder?: string;
}

export default function ImageUpload({ onUpload, defaultImage, folder = "general" }: ImageUploadProps) {
  const [image, setImage] = useState<string | null>(defaultImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (e.g. max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setImage(data.url);
      onUpload(data.url);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearImage = () => {
    setImage(null);
    onUpload(""); // Pass empty string to parent indicating removal
  };

  return (
    <div className="w-full">
      {image ? (
        <div className="relative rounded-2xl overflow-hidden border border-[#E8E6E1] bg-brand-bg group aspect-video">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={image} 
            alt="Uploaded image" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
             <button
                type="button"
                onClick={clearImage}
                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg"
             >
               <X className="w-5 h-5" />
             </button>
          </div>
        </div>
      ) : (
        <label className={`
          relative flex flex-col items-center justify-center w-full aspect-video 
          border-2 border-dashed border-[#E8E6E1] rounded-2xl bg-brand-bg/50
          hover:bg-brand-primary/5 hover:border-brand-primary/30 transition-all cursor-pointer group
          ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
            {isUploading ? (
              <>
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin mb-3" />
                <p className="text-sm font-bold text-brand-text">Uploading image...</p>
                <p className="text-xs text-brand-text-muted mt-1">Please wait</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform">
                   <UploadCloud className="w-6 h-6 text-brand-primary" />
                </div>
                <p className="text-sm font-bold text-brand-text mb-1">
                  Click to upload <span className="font-normal text-brand-text-muted">or drag and drop</span>
                </p>
                <p className="text-xs text-brand-text-muted">SVG, PNG, JPG or WEBP (MAX. 5MB)</p>
              </>
            )}
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      )}
      {error && <p className="mt-2 text-sm text-red-600 font-medium">{error}</p>}
    </div>
  );
}
