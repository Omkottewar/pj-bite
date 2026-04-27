"use client";

import { useState, useEffect } from "react";
import { UploadCloud, X, Loader2, Crop } from "lucide-react";
import Script from "next/script";

interface CloudinaryUploadProps {
  name?: string;
  maxFiles?: number;
  onUpload?: (url: string) => void; // ← added
}

export default function CloudinaryUpload({
  name = "image",
  maxFiles = 1,
  onUpload,
}: CloudinaryUploadProps) {
  const [urls, setUrls] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if ((window as any).cloudinary) {
      setIsLoaded(true);
    }
  }, []);

  const openWidget = () => {
    if (typeof window === "undefined" || !(window as any).cloudinary) return;

    (window as any).cloudinary.openUploadWidget(
      {
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        sources: ["local", "url", "camera"],
        multiple: maxFiles > 1,
        maxFiles: maxFiles,
        cropping: true,
        croppingAspectRatio: 1,
        showSkipCropButton: false,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
          fonts: {
            default: null,
            "'Helvetica Neue', Helvetica, Arial, sans-serif": {
              url: null,
              active: true,
            },
          },
        },
      },
      (error: any, result: any) => {
        if (!error && result && result.event === "success") {
          const newUrl: string = result.info.secure_url;
          setUrls((prev) => {
            if (prev.length >= maxFiles) return prev;
            return [...prev, newUrl];
          });
          onUpload?.(newUrl); // ← call the callback if provided
        }
      }
    );
  };

  const onRemove = (urlToRemove: string) => {
    setUrls((prev) => prev.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="w-full">
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => setIsLoaded(true)}
      />

      <input type="hidden" name={name} value={urls.join(",")} />

      {urls.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {urls.map((url) => (
            <div
              key={url}
              className="relative w-24 h-24 border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="Uploaded" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => onRemove(url)}
                  className="bg-white p-2 rounded-full text-red-500 hover:scale-110 transition-transform shadow-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {urls.length < maxFiles && (
        <button
          type="button"
          onClick={openWidget}
          disabled={!isLoaded}
          className="w-full h-32 border-2 border-dashed border-gray-200 rounded-2xl hover:border-[var(--color-brand-green)] hover:bg-green-50/50 transition-all bg-gray-50/30 flex flex-col items-center justify-center group relative overflow-hidden"
        >
          {!isLoaded ? (
            <Loader2 className="w-8 h-8 text-gray-300 animate-spin" />
          ) : (
            <>
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-[var(--color-brand-green)] transition-colors" />
              </div>
              <div className="text-center">
                <span className="block text-sm font-bold text-gray-700 mb-1 group-hover:text-[var(--color-brand-green)] transition-colors">
                  Upload & Crop {maxFiles > 1 ? "Images" : "Image"}
                </span>
                <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Crop className="w-3 h-3" /> Precision Cropping Enabled
                </span>
              </div>
            </>
          )}
        </button>
      )}
    </div>
  );
}