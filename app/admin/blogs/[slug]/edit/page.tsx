"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Save, Loader2, Trash2 } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";
import RichTextEditor from "@/components/ui/RichTextEditor";
import { showToast, showConfirm, showError } from "@/lib/swal";

export default function EditBlogPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    tags: "",
    coverImage: "",
    published: false,
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        const blog = data.data;
        setFormData({
          title: blog.title || "",
          slug: blog.slug || "",
          excerpt: blog.excerpt || "",
          content: blog.content || "",
          author: blog.author || "",
          tags: blog.tags ? blog.tags.join(", ") : "",
          coverImage: blog.coverImage || "",
          published: blog.published || false,
        });
      } catch (err: any) {
        showError("Failed to Load", err.message || "Failed to load blog");
        router.push("/admin/blogs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchBlog();
  }, [slug, router]);

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: prev.slug === slug ? generateSlug(title) : prev.slug, // Auto-update slug only if untouched from original
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) {
      showToast("Title and content are required.", "warning");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : [],
      };

      const res = await fetch(`/api/blogs/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update blog");

      showToast("Blog updated successfully!", "success");
      if (formData.slug !== slug) {
        router.push("/admin/blogs");
      }
      router.refresh();
    } catch (err: any) {
      showError("Update Failed", err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = await showConfirm("Delete Post?", "Are you sure you want to delete this blog post? This cannot be undone.");
    if (!confirmed) return;
    
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${slug}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete blog");
      
      showToast("Blog deleted successfully", "success");
      router.push("/admin/blogs");
      router.refresh();
    } catch (err: any) {
      showError("Delete Failed", err.message);
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-brand-text-muted">Loading blog details...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link 
            href="/admin/blogs" 
            className="p-2 bg-white border border-[#E8E6E1] rounded-xl hover:bg-brand-bg transition-colors shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-brand-text-muted" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-brand-text font-serif tracking-tight">Edit Blog Post</h1>
            <p className="text-sm font-medium text-brand-text-muted">Update your SEO-optimized article.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
          >
             {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
             Delete
          </button>
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-md shadow-brand-primary/20 hover:bg-brand-primary-dark transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSubmitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-sm space-y-5">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1.5">Post Title *</label>
              <input 
                type="text" 
                value={formData.title}
                onChange={handleTitleChange}
                placeholder="e.g. 5 Benefits of Almonds"
                className="w-full px-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1.5">Content *</label>
              <RichTextEditor 
                value={formData.content}
                onChange={(val) => setFormData({ ...formData, content: val })}
                placeholder="Write your blog content here..."
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-brand-text mb-1.5">Excerpt</label>
              <textarea 
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="A short summary for the blog card..."
                rows={3}
                className="w-full px-4 py-3 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium resize-y"
              />
            </div>
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-brand-text tracking-wide uppercase border-b border-[#E8E6E1] pb-3">Publish Settings</h3>
            
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input 
                  type="checkbox" 
                  className="sr-only" 
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.published ? 'bg-brand-primary' : 'bg-[#E8E6E1]'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.published ? 'transform translate-x-4 shadow-sm' : ''}`}></div>
              </div>
              <div className="font-bold text-sm text-brand-text group-hover:text-brand-primary transition-colors">
                Published
              </div>
            </label>

            <div>
               <label className="block text-sm font-bold text-brand-text mb-1.5 text-brand-text-muted">Author Name</label>
               <input 
                  type="text" 
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="e.g. Chef John"
                  className="w-full px-4 py-2 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
            </div>
            
            <div>
               <label className="block text-sm font-bold text-brand-text mb-1.5 text-brand-text-muted">URL Slug</label>
               <input 
                  type="text" 
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="w-full px-4 py-2 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
            </div>
            
            <div>
               <label className="block text-sm font-bold text-brand-text mb-1.5 text-brand-text-muted">Tags (Comma separated)</label>
               <input 
                  type="text" 
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Healthy, Recipe, Nuts"
                  className="w-full px-4 py-2 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-sm focus:outline-none focus:border-brand-primary transition-all"
                />
            </div>

          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8E6E1] shadow-sm space-y-4">
             <h3 className="text-sm font-bold text-brand-text tracking-wide uppercase border-b border-[#E8E6E1] pb-3">Cover Image</h3>
             <ImageUpload 
               folder="blogs" 
               defaultImage={formData.coverImage}
               onUpload={(url) => setFormData({ ...formData, coverImage: url })} 
             />
          </div>

        </div>
      </div>
    </div>
  );
}
