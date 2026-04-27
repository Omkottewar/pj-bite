"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Edit, X, Loader2 } from "lucide-react";
import { editCategory } from "@/app/actions/admin";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import { showSuccess, showError } from "@/lib/swal";

interface Category {
  _id: string;
  name: string;
  image?: string;
  slug?: string;
}

export default function EditCategoryModal({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(category.image || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Reset image state when modal opens
  useEffect(() => {
    if (isOpen) {
      setImageUrl(category.image || "");
    }
  }, [isOpen, category.image]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      if (imageUrl) formData.set("image", imageUrl);

      await editCategory(formData);
      setIsOpen(false);
      showSuccess("Category Updated", `Category "${category.name}" has been updated successfully.`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to update category";
      showError("Save Failed", message);
    } finally {
      setLoading(false);
    }
  };

  const modal = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />
      <div className="relative bg-white rounded-2xl max-w-lg w-full shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-50 sticky top-0 bg-white z-20">
          <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close modal"
            className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
            <input type="hidden" name="id" value={category._id} />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category Name
              </label>
              <input
                type="text"
                name="name"
                defaultValue={category.name}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-green)] focus:border-transparent transition-all"
                placeholder="Enter category name"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Category Branding
              </label>

              <div className="p-4 border border-gray-100 rounded-xl bg-gray-50/50 flex flex-col items-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Current Representative Image
                </span>
                {imageUrl ? (
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-white shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageUrl}
                      alt={category.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-white rounded-xl border border-dashed border-gray-200 flex items-center justify-center text-gray-400">
                    <span className="text-xs italic">No image</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-[11px] text-gray-500 bg-blue-50/50 p-2 rounded-lg border border-blue-100/50">
                  💡 Tip: Use the <strong>Crop</strong> tool to center the product. Square crops
                  look best as circles on the Home Page.
                </p>
                <div className="rounded-xl overflow-hidden border border-gray-100">
                  <CloudinaryUpload
                    name="image"
                    maxFiles={1}
                    onUpload={(url: string) => setImageUrl(url)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/30 flex gap-4 sticky bottom-0 z-20">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-white hover:border-gray-300 transition-all shadow-sm active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[var(--color-brand-green)] hover:bg-[var(--color-brand-green-dark)] text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-green-200 disabled:opacity-75 disabled:shadow-none flex justify-center items-center active:scale-95"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Update Category"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Edit category"
        className="p-2 text-gray-400 hover:text-[var(--color-brand-green)] hover:bg-green-50 rounded-lg transition-colors"
      >
        <Edit className="w-4 h-4" />
      </button>

      {mounted && isOpen && createPortal(modal, document.body)}
    </>
  );
}