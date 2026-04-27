import { MetadataRoute } from 'next';
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import { Blog } from "@/models/Blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pjbite.com';
  
  // 1. Array of static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/refunds`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/shipping`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];

  // 2. Fetch all dynamic products
  let dynamicProducts: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    // Assuming you have an "isActive" field, otherwise just fetch all
    const products = await Product.find({ isActive: { $ne: false } }).select('slug updatedAt createdAt').lean();
    
    dynamicProducts = products.map((product: any) => ({
      url: `${baseUrl}/products/${product.slug}`,
      // Use updatedAt if it exists, otherwise createdAt, otherwise current date
      lastModified: product.updatedAt || product.createdAt || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating product sitemap:", error);
    // Continue despite error so static pages still work
  }

  // 3. Fetch all active blogs
  let dynamicBlogs: MetadataRoute.Sitemap = [];
  try {
    await dbConnect();
    const activeBlogs = await Blog.find({ published: true }).select('slug updatedAt publishedAt').lean();
    
    dynamicBlogs = activeBlogs.map((blog: any) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified: blog.updatedAt || blog.publishedAt || new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    }));
  } catch (error) {
    console.error("Error generating blog sitemap:", error);
  }

  // Ensure arrays are flattened and concatenated properly
  return [...staticPages, ...dynamicProducts, ...dynamicBlogs];
}
