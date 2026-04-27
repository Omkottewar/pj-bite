import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import Link from "next/link";
import { FileText, Plus, Search, Edit, Trash2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminBlogsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;
  const role = (session.user as any).role;
  if (role !== "SUPERADMIN" && role !== "ADMIN") {
    return <div className="p-8 text-center text-red-500">Access Denied</div>;
  }

  await dbConnect();
  const blogs = await Blog.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif">Blogs</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Manage your articles and SEO content here.</p>
        </div>
        <Link 
          href="/admin/blogs/new" 
          className="flex items-center gap-2 px-5 py-2.5 bg-brand-primary text-white text-sm font-bold rounded-xl shadow-md shadow-brand-primary/20 hover:bg-brand-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Blog Post
        </Link>
      </div>

      {/* Filters & Search (Static for now, but UI is ready) */}
      <div className="bg-white p-4 rounded-xl border border-[#E8E6E1] flex gap-4 items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-text-muted" />
          <input 
            type="text" 
            placeholder="Search blogs..." 
            className="w-full pl-9 pr-4 py-2 bg-brand-bg/50 border border-[#E8E6E1] rounded-lg text-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all text-brand-text"
          />
        </div>
      </div>

      {/* Blogs Table */}
      <div className="bg-white rounded-2xl border border-[#E8E6E1] shadow-sm overflow-hidden">
        {blogs.length === 0 ? (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No blog posts yet</h3>
            <p className="text-brand-text-muted mb-6">Create your first blog post to attract more customers.</p>
            <Link 
              href="/admin/blogs/new" 
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary text-white text-sm font-bold rounded-lg shadow-sm hover:bg-brand-primary-dark transition-colors"
            >
              <Plus className="w-4 h-4" /> Write First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-brand-bg border-b border-[#E8E6E1] text-xs font-bold text-brand-text-muted uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6E1]">
                {blogs.map((blog) => (
                  <tr key={blog._id.toString()} className="hover:bg-brand-bg/50 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-brand-text">{blog.title}</p>
                      <p className="text-xs text-brand-text-muted font-medium mt-0.5">/{blog.slug}</p>
                    </td>
                    <td className="px-6 py-4">
                      {blog.published ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-[#1E5C2A]/10 text-[#1E5C2A] border-[#1E5C2A]/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#1E5C2A]"></span> Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border bg-gray-100 text-gray-700 border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted font-medium">
                      {blog.author}
                    </td>
                    <td className="px-6 py-4 text-sm text-brand-text-muted font-medium">
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/blogs/${blog.slug}/edit`}
                          className="p-2 text-brand-text-muted hover:text-brand-primary hover:bg-brand-primary/10 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <button className="p-2 text-brand-text-muted hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
