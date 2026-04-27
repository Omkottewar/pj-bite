import dbConnect from "@/lib/mongodb";
import { Blog } from "@/models/Blog";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, ArrowLeft, Tag, Clock } from "lucide-react";
import { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const blog = await Blog.findOne({ slug }).lean() as any;
  if (!blog) return { title: "Post Not Found | PJ Bite" };
  return {
    title: `${blog.title} | PJ Bite Journal`,
    description: blog.excerpt || blog.title,
    openGraph: { images: blog.coverImage ? [blog.coverImage] : [] },
  };
}

export const revalidate = 3600;

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  await dbConnect();

  const blog = await Blog.findOne({ slug }).lean() as any;
  if (!blog || !blog.published) notFound();

  const relatedPosts = await Blog.find({
    published: true,
    _id: { $ne: blog._id },
  }).sort({ createdAt: -1 }).limit(3).lean() as any[];

  const readingTime = Math.max(1, Math.ceil((blog.content?.replace(/<[^>]+>/g, "").split(/\s+/).length || 0) / 200));

  return (
    <div className="bg-[#FAF7F2] min-h-screen">

      {/* ─── HERO ─────────────────────────────────────── */}
      <div className="bg-[#111A0E] pt-32 pb-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">

          {/* Back link */}
          <Link href="/blogs"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors mb-8 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            Back to Journal
          </Link>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white font-serif leading-[1.15] mb-8 text-balance">
            {blog.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-white/50 text-xs font-bold uppercase tracking-widest border-t border-white/10 pt-6">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              {new Date(blog.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 shrink-0" />
              {blog.author || "Editorial Team"}
            </span>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              {readingTime} min read
            </span>
          </div>
        </div>

        {/* Cover image — bleeds to edge */}
        {blog.coverImage && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="w-full aspect-[21/9] rounded-t-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={blog.coverImage}
                alt={blog.title}
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>
          </div>
        )}
      </div>

      {/* ─── ARTICLE BODY ─────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20">

        {/* Excerpt / Lead */}
        {blog.excerpt && (
          <p className="text-xl sm:text-2xl text-brand-text font-serif italic font-medium leading-relaxed mb-10 pb-10 border-b border-[#E8E6E1]">
            {blog.excerpt}
          </p>
        )}

        {/* Rich text content */}
        <div
          className="blog-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags?.length > 0 && (
          <div className="mt-16 pt-8 border-t border-[#E8E6E1]">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-black text-brand-text uppercase tracking-widest">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag: string, i: number) => (
                <span key={i}
                  className="px-4 py-1.5 bg-[#FAF7F2] text-brand-text-muted text-[11px] font-black uppercase tracking-widest rounded-full border border-[#E8E6E1] hover:border-brand-primary transition-colors cursor-default">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Author card */}
        <div className="mt-12 p-6 bg-white rounded-2xl border border-[#E8E6E1] flex items-start gap-5">
          <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-black text-lg shrink-0">
            {(blog.author || "E").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xs font-black text-brand-primary uppercase tracking-widest mb-1">Written by</p>
            <p className="font-black text-brand-text">{blog.author || "Editorial Team"}</p>
            <p className="text-sm text-brand-text-muted font-medium mt-1">PJ Bite Journal · Sharing stories from the field to your table.</p>
          </div>
        </div>
      </div>

      {/* ─── RELATED POSTS ────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="bg-white border-t border-[#E8E6E1] py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl sm:text-3xl font-black text-brand-text font-serif">More from the Journal</h2>
              <Link href="/blogs"
                className="hidden sm:inline-flex items-center gap-2 text-xs font-black text-brand-primary uppercase tracking-widest hover:text-[#164a20] transition-colors">
                View All <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => (
                <Link href={`/blogs/${post.slug}`} key={String(post._id)}
                  className="group bg-[#FAF7F2] rounded-2xl border border-[#E8E6E1] overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col">
                  <div className="aspect-[16/9] bg-[#E8E6E1] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.coverImage || "https://placehold.co/800x450/f0ede8/a0a0a0?text=Journal"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-2">
                      {new Date(post.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </p>
                    <h3 className="text-base font-black text-brand-text font-serif leading-snug line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
