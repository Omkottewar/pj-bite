"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/ui/ImageUpload";
import { Loader2, Trash2, Plus, CheckCircle2, XCircle, Edit2, X } from "lucide-react";
import { showToast, showConfirm, showError } from "@/lib/swal";

interface Banner {
  _id: string;
  title: string;
  subtitle: string;
  linkUrl: string;
  imageUrl: string;
  active: boolean;
  order: number;
  type: "home" | "product";
}

interface EditBannerForm {
  title: string;
  subtitle: string;
  linkUrl: string;
  imageUrl: string;
  order: number;
}

export default function AdminBannersPage() {
  const [activeTab, setActiveTab] = useState<"home" | "product">("home");
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // New Banner Form State
  const [isCreating, setIsCreating] = useState(false);
  const [newBanner, setNewBanner] = useState({
    title: "",
    subtitle: "",
    linkUrl: "",
    imageUrl: "",
    active: true,
    order: 0,
  });

  // Edit Banner State
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [editForm, setEditForm] = useState<EditBannerForm>({
    title: "",
    subtitle: "",
    linkUrl: "",
    imageUrl: "",
    order: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/banners`);
      const data = await res.json();
      if (res.ok) {
        setBanners(data.data || []);
      }
    } catch {
      showError("Failed to load banners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async () => {
    if (!newBanner.imageUrl) {
      showToast("Please upload an image for the banner", "warning");
      return;
    }

    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newBanner, type: activeTab }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
 
      showToast("Banner created successfully", "success");
      setIsCreating(false);
      setNewBanner({ title: "", subtitle: "", linkUrl: "", imageUrl: "", active: true, order: 0 });
      fetchBanners();
    } catch (err: any) {
      showError("Creation Failed", err.message);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm("Delete Banner?", "Are you sure you want to delete this banner?");
    if (!confirmed) return;
    try {
      const res = await fetch(`/api/banners/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete banner");
      showToast("Banner deleted", "success");
      fetchBanners();
    } catch (err: any) {
      showError("Delete Failed", err.message);
    }
  };

  const handleToggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/banners/${banner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !banner.active }),
      });
      if (!res.ok) throw new Error("Failed to update banner");
      showToast(banner.active ? "Banner deactivated" : "Banner activated", "success");
      fetchBanners();
    } catch (err: any) {
      showError("Update Failed", err.message);
    }
  };

  const openEdit = (banner: Banner) => {
    setEditingBanner(banner);
    setEditForm({
      title: banner.title || "",
      subtitle: banner.subtitle || "",
      linkUrl: banner.linkUrl || "",
      imageUrl: banner.imageUrl || "",
      order: banner.order || 0,
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBanner) return;
    if (!editForm.imageUrl) {
      showToast("Banner must have an image", "warning");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch(`/api/banners/${editingBanner._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update banner");
      showToast("Banner updated successfully", "success");
      setEditingBanner(null);
      fetchBanners();
    } catch (err: any) {
      showError("Update Failed", err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredBanners = banners
    .filter((b) => b.type === activeTab)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Manage Banners</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Control the hero sections of your store.</p>
        </div>
        {!isCreating && (
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-md shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Banner
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[#E8E6E1]/50 rounded-xl w-fit">
        <button
          onClick={() => { setActiveTab("home"); setIsCreating(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "home" ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-text"}`}
        >
          Home Page
        </button>
        <button
          onClick={() => { setActiveTab("product"); setIsCreating(false); }}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "product" ? "bg-white text-brand-primary shadow-sm" : "text-brand-text-muted hover:text-brand-text"}`}
        >
          Product Pages
        </button>
      </div>

      {/* Create New Form */}
      {isCreating && (
        <div className="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-brand-text mb-4 border-b border-[#E8E6E1] pb-3">
            Add New {activeTab === "home" ? "Home" : "Product"} Banner
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1.5">Banner Image *</label>
                <ImageUpload folder="banners" onUpload={(url) => setNewBanner({ ...newBanner, imageUrl: url })} />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1.5">Title</label>
                <input type="text" value={newBanner.title} onChange={e => setNewBanner({ ...newBanner, title: e.target.value })} className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg text-sm" placeholder="e.g. Summer Sale" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1.5">Subtitle</label>
                <input type="text" value={newBanner.subtitle} onChange={e => setNewBanner({ ...newBanner, subtitle: e.target.value })} className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg text-sm" placeholder="e.g. Up to 50% off on all items" />
              </div>
              <div>
                <label className="block text-sm font-bold text-brand-text mb-1.5">Link URL</label>
                <input type="text" value={newBanner.linkUrl} onChange={e => setNewBanner({ ...newBanner, linkUrl: e.target.value })} className="w-full px-4 py-2 border border-[#E8E6E1] rounded-lg text-sm" placeholder="/products?category=nuts" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-[#E8E6E1]">
                <button onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-bold text-brand-text-muted hover:text-brand-text">Cancel</button>
                <button onClick={handleCreate} className="px-6 py-2 bg-brand-primary text-white rounded-lg text-sm font-bold hover:bg-brand-primary-dark">Save Banner</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners List */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center text-brand-text-muted flex justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>
        ) : filteredBanners.length === 0 ? (
          <div className="p-12 text-center text-brand-text-muted">No banners found for this section.</div>
        ) : (
          <ul className="divide-y divide-[#E8E6E1]">
            {filteredBanners.map((banner) => (
              <li key={banner._id} className="p-4 flex flex-col md:flex-row gap-6 items-center hover:bg-brand-bg/50 transition-colors">

                {/* Visual */}
                <div className="w-full md:w-64 aspect-[21/9] bg-brand-bg rounded-lg border border-[#E8E6E1] overflow-hidden shrink-0 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={banner.imageUrl} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                  {!banner.active && (
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                      <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest">Inactive</span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 space-y-1 w-full text-center md:text-left">
                  <h4 className="font-bold text-lg text-brand-text">{banner.title || "Untitled Banner"}</h4>
                  {banner.subtitle && <p className="text-sm text-brand-text-muted">{banner.subtitle}</p>}
                  {banner.linkUrl && <p className="text-xs text-brand-accent font-medium mt-2">{banner.linkUrl}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => openEdit(banner)}
                    className="p-2 text-brand-text-muted hover:text-brand-primary hover:bg-green-50 rounded-lg transition-colors border border-transparent hover:border-green-100"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`p-2 rounded-lg border transition-colors ${banner.active ? "bg-green-50 border-green-200 text-green-700 hover:bg-green-100" : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100"}`}
                    title={banner.active ? "Deactivate" : "Activate"}
                  >
                    {banner.active ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                  </button>
                  <button
                    onClick={() => handleDelete(banner._id)}
                    className="p-2 text-brand-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Edit Banner Modal */}
      {editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditingBanner(null)} />
          <div className="relative bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Banner</h2>
              <button type="button" onClick={() => setEditingBanner(null)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Image */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Banner Image</label>
                <ImageUpload
                  folder="banners"
                  defaultImage={editForm.imageUrl}
                  onUpload={(url) => {
                    if (url) setEditForm({ ...editForm, imageUrl: url });
                  }}
                />
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  placeholder="e.g. Summer Sale"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={editForm.subtitle}
                  onChange={(e) => setEditForm({ ...editForm, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  placeholder="e.g. Up to 50% off"
                />
              </div>

              {/* Link URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input
                  type="text"
                  value={editForm.linkUrl}
                  onChange={(e) => setEditForm({ ...editForm, linkUrl: e.target.value })}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                  placeholder="/products?category=nuts"
                />
              </div>

              {/* Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Display Order</label>
                <input
                  type="number"
                  min={0}
                  value={editForm.order}
                  onChange={(e) => setEditForm({ ...editForm, order: parseInt(e.target.value) || 0 })}
                  className="w-32 px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-primary text-sm"
                />
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingBanner(null)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={isSaving}
                  className="flex-1 bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-xl transition-all disabled:opacity-75 flex justify-center items-center gap-2"
                >
                  {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
