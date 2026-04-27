"use client";

import { useState, useEffect } from "react";
import { Edit, X, Loader2, Plus } from "lucide-react";
import { editProduct } from "@/app/actions/admin";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import { showSuccess, showError } from "@/lib/swal";

export default function EditProductModal({ product, categories }: { product: any, categories: any[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [variants, setVariants] = useState<{_id?: string, name: string, price: number, stock: number}[]>(product.variants || []);
  const [claims, setClaims] = useState<string[]>(product.claims?.length > 0 ? product.claims : ["No Added Sugar", "No Preservatives", "Packed with Goodness", "With Natural Farming"]);
  const [heroHighlights, setHeroHighlights] = useState<string[]>(product.heroHighlights || []);

  useEffect(() => {
    setVariants(product.variants || []);
    setClaims(product.claims?.length > 0 ? product.claims : ["No Added Sugar", "No Preservatives", "Packed with Goodness", "With Natural Farming"]);
    setHeroHighlights(product.heroHighlights || []);
  }, [product]);

  const handleAddVariant = () => {
    setVariants([...variants, { name: "", price: 0, stock: 0 }]);
  };

  const handleRemoveVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantChange = (index: number, field: "name" | "price" | "stock", value: string | number) => {
    const newVariants = [...variants];
    newVariants[index][field] = value as never;
    setVariants(newVariants);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.append("variants", JSON.stringify(variants));
      formData.append("claims", JSON.stringify(claims));
      formData.append("heroHighlights", JSON.stringify(heroHighlights));
      
      // If the CloudinaryUpload component was not interacted with, it might pass an empty string. 
      // If so, we need to preserve the old array. We detect this by checking if the 'images' field is empty.
      const currentImages = formData.get("images") as string;
      if (!currentImages && product.images?.length > 0) {
        formData.set("images", product.images.join(","));
      }

      const currentDescImages = formData.get("descriptionImages") as string;
      if (!currentDescImages && product.descriptionImages?.length > 0) {
        formData.set("descriptionImages", product.descriptionImages.join(","));
      }

      await editProduct(formData);
      setIsOpen(false);
      showSuccess("Product Updated", `${product.name} has been updated successfully.`);
    } catch (err: any) {
      showError("Save Failed", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="p-2 text-gray-400 hover:text-brand-primary hover:bg-green-50 rounded-lg transition-colors"
        title="Edit Product"
      >
        <Edit className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          
          <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full premium-shadow z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto border border-[#E8E6E1]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900 font-serif">Edit Product</h2>
              <button type="button" onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input type="hidden" name="id" value={product._id.toString()} />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input type="text" name="name" defaultValue={product.name} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select name="categoryId" defaultValue={product.categoryId?.toString() || product.categoryId?._id?.toString()} required className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary">
                    <option value="">Select Category</option>
                    {categories.map((c: any) => (
                      <option key={c._id.toString()} value={c._id.toString()}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-4">
                <label className="block text-sm font-bold text-gray-900 mb-3">Inventory & Pricing</label>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Base Price (₹)</label>
                    <input type="number" name="price" defaultValue={product.price} required min="0" step="0.01" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Base Stock</label>
                    <input type="number" name="stock" defaultValue={product.stock || 0} required min="0" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary" />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-medium text-gray-500">Variant-Specific Stock & Prices</label>
                    <button type="button" onClick={handleAddVariant} className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline">
                      <Plus className="w-3 h-3" /> Add Size/Variant
                    </button>
                  </div>
                  
                  {variants.length === 0 && <p className="text-xs text-gray-400 italic">No variants active. Using Base stock/price.</p>}

                  {variants.map((variant: any, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input 
                        type="text" 
                        placeholder="Size (e.g. 500g)" 
                        value={variant.name} 
                        onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                        className="flex-1 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary" 
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Price" 
                        min="0"
                        step="0.01"
                        value={variant.price || ""} 
                        onChange={(e) => handleVariantChange(idx, "price", parseFloat(e.target.value))}
                        className="w-16 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary" 
                        required
                      />
                      <input 
                        type="number" 
                        placeholder="Stock" 
                        min="0"
                        value={variant.stock || 0} 
                        onChange={(e) => handleVariantChange(idx, "stock", parseInt(e.target.value))}
                        className="w-16 px-3 py-2 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary" 
                        required
                      />
                      <button type="button" onClick={() => handleRemoveVariant(idx)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea name="description" defaultValue={product.description} required rows={3} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary"></textarea>
              </div>
              
              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Replace Images (Leaves existing if blank)</label>
                <CloudinaryUpload name="images" maxFiles={5} />
              </div>

              <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                <label className="block text-[13px] font-bold text-amber-900 border-l-4 border-amber-500 pl-2 mb-1">
                  Product Description Banners
                </label>
                <p className="text-[11px] text-amber-700/80 mb-3 ml-3">
                  Optional. Upload stacked infographics here to replace standard text layout on the product page.
                </p>
                <CloudinaryUpload name="descriptionImages" maxFiles={10} />
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-6">
                <label className="block text-sm font-bold text-gray-900 border-l-4 border-brand-primary pl-2">Dynamic Storefront Presentation</label>
                
                {/* Claims Array */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Product Features (Claims)</label>
                    <button type="button" onClick={() => setClaims([...claims, ""])} className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline">
                      <Edit className="w-3 h-3" /> Add Feature
                    </button>
                  </div>
                  <div className="space-y-2">
                     {claims.map((claim, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={claim} onChange={(e) => { const c = [...claims]; c[idx] = e.target.value; setClaims(c); }} className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary" placeholder="e.g. No Added Sugar" required />
                          <button type="button" onClick={() => setClaims(claims.filter((_, i) => i !== idx))} className="p-1.5 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                     ))}
                  </div>
                </div>

                {/* Hero Highlights Array */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest">Slider Subtitles (Hero Highlights)</label>
                    <button type="button" onClick={() => setHeroHighlights([...heroHighlights, ""])} className="text-xs text-brand-primary font-bold flex items-center gap-1 hover:underline">
                      <Edit className="w-3 h-3" /> Add Subtitle
                    </button>
                  </div>
                  <div className="space-y-2">
                     {heroHighlights.length === 0 && <p className="text-xs text-gray-400 italic">No custom subtitles. Will fallback to Product Name.</p>}
                     {heroHighlights.map((hh, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input type="text" value={hh} onChange={(e) => { const h = [...heroHighlights]; h[idx] = e.target.value; setHeroHighlights(h); }} className="flex-1 px-3 py-1.5 text-sm rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-primary" placeholder="e.g. Wholesome Nutrition in Every Bite" required />
                          <button type="button" onClick={() => setHeroHighlights(heroHighlights.filter((_, i) => i !== idx))} className="p-1.5 text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
                        </div>
                     ))}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-4">
                <label className="block text-sm font-bold text-gray-900 border-l-4 border-gray-900 pl-2">Product Rich Metadata (Optional)</label>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Ingredients Log</label>
                  <textarea name="ingredients" defaultValue={product.ingredients} placeholder="e.g. 100% Organic Almonds..." rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Nutritional Information</label>
                  <textarea name="nutrition" defaultValue={product.nutrition} placeholder="e.g. Calories: 576kcal..." rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Health Benefits</label>
                  <textarea name="benefits" defaultValue={product.benefits} placeholder="e.g. Rich in Vitamin E..." rows={2} className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary resize-y" />
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setIsOpen(false)} className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="flex-1 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 flex justify-center items-center">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
