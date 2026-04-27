import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { Banner } from "@/models/Banner";
import HomeClient from "./HomeClient";

export const revalidate = 0;

export default async function HomePage() {
  await dbConnect();

  const [rawBanners, rawCategories, rawNewArrivals, featuredRaw] = await Promise.all([
    Banner.find({ type: "home", active: true }).sort({ order: 1 }).lean(),
    Category.find({}).select("name slug image").lean(),
    Product.find({}).sort({ createdAt: -1 }).limit(8).lean(),
    Product.find({ isFeatured: true }).limit(4).lean(),
  ]);

  // Fall back to latest if no featured products
  const rawProducts = featuredRaw.length > 0
    ? featuredRaw
    : await Product.find({}).sort({ createdAt: -1 }).limit(4).lean();

  // Serialize — strip ObjectIds before passing to Client Components
  const dbBanners = rawBanners.map((b) => ({
    imageUrl: b.imageUrl as string,
    title: b.title as string,
  }));

  const dbCategories = rawCategories.map((c) => ({
    _id: c._id.toString(),
    name: c.name as string,
    slug: c.slug as string,
    image: (c.image as string) || "",
  }));

  const dbProducts = rawProducts.map((p) => ({
    _id: p._id.toString(),
    name: p.name as string,
    slug: p.slug as string,
    price: p.price as number,
    originalPrice: (p.originalPrice as number) || undefined,
    images: (p.images as string[]) || [],
    vendorId: p.vendorId?.toString() || "",
  }));

  const dbNewArrivals = rawNewArrivals.map((p) => ({
    _id: p._id.toString(),
    name: p.name as string,
    slug: p.slug as string,
    price: p.price as number,
    originalPrice: (p.originalPrice as number) || undefined,
    images: (p.images as string[]) || [],
    vendorId: p.vendorId?.toString() || "",
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://www.pjbite.com/#organization",
        name: "PJ Bite",
        url: "https://www.pjbite.com",
        logo: "https://www.pjbite.com/pjbite-logo.svg",
        description: "Premium selection of 100% natural dried fruits and healthy snacks. No added sugar, no preservatives.",
        sameAs: ["https://www.instagram.com/pjbite", "https://www.facebook.com/pjbite"],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Are your dried fruits 100% natural?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes, according to PJ Bite standards, our dried fruits are 100% natural, containing no added sugars or artificial preservatives.",
            },
          },
          {
            "@type": "Question",
            name: "How does PJ Bite ensure quality?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "We source our products directly from farms, ensuring clean label ingredients and hygienic processing methods.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient
        dbBanners={dbBanners}
        dbProducts={dbProducts}
        dbCategories={dbCategories}
        dbNewArrivals={dbNewArrivals}
      />
    </>
  );
}