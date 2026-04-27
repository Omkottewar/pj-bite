import dbConnect from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Nature's Soul Shop",
  description: "Read the latest news, recipes, and health tips from Nature's Soul Shop.",
};

export const revalidate = 3600; // revalidate every hour

async function getBlogs() {
  await dbConnect();
  const blogs = await Blog.find({ published: true }).sort({ createdAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
}

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className="bg-brand-bg min-h-screen py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 lg:mb-24">
          <p className="text-sm font-black text-brand-primary uppercase tracking-[0.2em] mb-4">Our Journal</p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-text font-serif tracking-tight mb-6">
            Words of Wellness
          </h1>
          <p className="text-lg text-brand-text-muted font-medium leading-relaxed">
            Discover our curated collection of articles on nutrition, health, and living a vibrant life with nature's finest ingredients.
          </p>
        </div>

        {/* Blog Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-[#E8E6E1] premium-shadow">
            <h2 className="text-2xl font-bold text-brand-text font-serif mb-3">No articles yet</h2>
            <p className="text-brand-text-muted font-medium">We're brewing up some fresh content. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-12">
            {blogs.map((blog: any) => (
              <Link href={`/blogs/${blog.slug}`} key={blog._id} className="group flex flex-col h-full bg-white rounded-[2rem] border border-[#E8E6E1] overflow-hidden premium-shadow hover:shadow-2xl transition-all duration-300">
                {/* Image */}
                <div className="aspect-[4/3] bg-brand-bg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-300" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img 
                    src={blog.coverImage || "https://placehold.co/800x600/f8f9fa/a0a0a0?text=Blog"} 
                    alt={blog.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  {/* Tags Overlay */}
                  {blog.tags && blog.tags.length > 0 && (
                     <div className="absolute top-4 left-4 z-20 flex gap-2 flex-wrap">
                       {blog.tags.slice(0, 2).map((tag: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-white/90 backdrop-blur-sm text-brand-text text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
                            {tag}
                          </span>
                       ))}
                     </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 sm:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-xs font-bold text-brand-text-muted mb-4 uppercase tracking-widest">
                    <span className="flex items-center gap-1.5 whitespace-nowrap">
                      <Calendar className="w-3.5 h-3.5 text-brand-primary" />
                      {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#E8E6E1]" />
                    <span className="flex items-center gap-1.5 truncate">
                      <User className="w-3.5 h-3.5 text-brand-primary" />
                      {blog.author || "Admin"}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-black text-brand-text font-serif leading-tight mb-3 group-hover:text-brand-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h3>
                  
                  <p className="text-brand-text-muted text-sm leading-relaxed mb-6 line-clamp-3 font-medium flex-1">
                    {blog.excerpt || blog.content?.replace(/<[^>]*>?/gm, '').substring(0, 150) + "..."}
                  </p>

                  <div className="flex items-center gap-2 mt-auto text-sm font-black text-brand-primary uppercase tracking-widest group-hover:translate-x-2 transition-transform duration-300">
                    Read Story <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
