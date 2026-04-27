import Link from "next/link";
import { ArrowRight, Star, SlidersHorizontal, Leaf, Search, ChevronDown, ChevronRight, Grid3x3, List, ShoppingBag, Eye, Lock } from "lucide-react";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import ProductFilters from "@/components/products/ProductFilters";
import { Suspense } from "react";
import { Banner } from "@/models/Banner";

import ProductGridCard from "@/components/products/ProductGridCard";

export const revalidate = 0;

interface SearchParams {
  q?: string;
  category?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

async function getProducts(params: SearchParams) {
  await dbConnect();

  const query: Record<string, any> = {};

  if (params.q?.trim()) {
    query.$or = [
      { name: { $regex: params.q.trim(), $options: "i" } },
      { description: { $regex: params.q.trim(), $options: "i" } },
    ];
  }

  if (params.category) {
    const cat = await Category.findOne({ slug: params.category }).select("_id").lean();
    if (cat) {
      query.categoryId = (cat as any)._id;
    } else {
      return { products: [], categories: [] };
    }
  }

  if (params.minPrice || params.maxPrice) {
    query.price = {};
    if (params.minPrice) query.price.$gte = parseFloat(params.minPrice);
    if (params.maxPrice) query.price.$lte = parseFloat(params.maxPrice);
  }

  let sortOption: Record<string, any> = { createdAt: -1 };
  if (params.sort === "price_asc") sortOption = { price: 1 };
  else if (params.sort === "price_desc") sortOption = { price: -1 };
  else if (params.sort === "popular") sortOption = { isFeatured: -1, createdAt: -1 };

  const [productsRaw, categoriesRaw] = await Promise.all([
    Product.find(query)
      .populate("categoryId", "name slug")
      .sort(sortOption)
      .lean(),
    Category.find({}).lean(),
  ]);

  const products = JSON.parse(JSON.stringify(productsRaw));
  const categories = JSON.parse(JSON.stringify(categoriesRaw));

  return { products, categories };
}

export default async function ProductsListingPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const { products, categories } = await getProducts(searchParams);
  
  const hasFilters = searchParams.q || searchParams.category || searchParams.sort || searchParams.minPrice || searchParams.maxPrice;
  const activeCat = (categories as any[]).find((c: any) => c.slug === searchParams.category);

  // Group categories for the left sidebar (like Nutraj's "Shop By Collection")
  const catGroups = [
    { label: "Nuts", slugs: ["nuts", "cashews", "almonds", "walnuts", "pistachios", "peanuts"] },
    { label: "Dry Fruits", slugs: ["dry-fruits", "raisins", "dates", "figs", "apricots"] },
    { label: "Seeds", slugs: ["seeds", "chia", "flaxseeds", "pumpkin-seeds", "sunflower-seeds"] },
    { label: "Mixes", slugs: ["mixes", "trail-mix", "premium-mix"] },
    { label: "Healthy Snacks", slugs: ["snacks", "chips", "bars"] },
  ];

  return (
    <div className="bg-[#FAF7F2] min-h-screen pb-24 lg:pb-8">



      {/* ── Breadcrumb ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium text-brand-text-muted bg-white/50 px-3 py-1.5 rounded-md w-fit border border-[#E8E6E1]">
          <Link href="/" className="hover:text-brand-primary">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-brand-text">Products</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">

        {/* ── Main Layout ── */}
        <div className="flex gap-6 items-start mt-2">

          {/* ── LEFT SIDEBAR ── */}
          <aside className="hidden lg:block w-[260px] shrink-0 sticky top-28">
            <Suspense fallback={null}>
              <ProductFilters categories={(categories as any[]).map((c: any) => ({ ...c, _id: c._id.toString() }))} />
            </Suspense>
          </aside>

          {/* ── PRODUCTS GRID ── */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar (Grid/List, Count, Sort) */}
            <div className="flex items-center justify-between bg-white border border-[#E8E6E1] p-2 sm:p-3 rounded-lg mb-6 shadow-sm">
               <div className="hidden sm:flex items-center gap-4 text-brand-primary px-2">
                  <Grid3x3 className="w-5 h-5 cursor-pointer" />
                  <List className="w-5 h-5 text-gray-400 cursor-pointer hover:text-brand-primary transition-colors" />
               </div>
               <div className="text-[10px] sm:text-xs font-bold text-brand-primary text-center sm:text-left flex-1 sm:flex-none">
                 {products.length} Products
               </div>
               <div className="flex items-center gap-2 text-[10px] sm:text-xs text-brand-text font-bold px-2">
                 <span className="hidden sm:block">Sort by:</span>
                 <select className="border border-[#E8E6E1] rounded-md px-2 py-1.5 sm:px-3 sm:py-2 bg-white outline-none focus:border-brand-primary cursor-pointer text-brand-text">
                   <option>Alphabetically, A-Z</option>
                   <option>Price, Low to High</option>
                   <option>Price, High to Low</option>
                   <option>Featured</option>
                 </select>
               </div>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-lg border border-[#E8E6E1]">
                <Leaf className="w-10 h-10 text-brand-text-muted/30 mx-auto mb-4" />
                <h3 className="text-lg font-black text-brand-text font-serif mb-3">No Products Found</h3>
                <p className="text-sm text-brand-text-muted font-medium mb-6">
                  {searchParams.q ? `No products match "${searchParams.q}".` : "No products match your filters."}
                </p>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-brand-primary text-white font-black px-6 py-2.5 rounded-full text-xs uppercase tracking-widest hover:bg-[#164a20] transition-colors"
                >
                  <Leaf className="w-3.5 h-3.5" /> View All
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(products as any[]).map((prod: any) => (
                  <ProductGridCard key={prod._id.toString()} prod={prod} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── FAQ Section (bottom, like Nutraj) ── */}
        {!hasFilters && (
          <div className="mt-16 max-w-3xl mx-auto">
            <h2 className="text-base font-black text-brand-text uppercase tracking-widest mb-5 text-center">FAQs</h2>
            <div className="bg-white rounded-2xl border border-[#E8E6E1] px-5 shadow-sm divide-y divide-[#E8E6E1]">
              {[
                { q: "How many dry fruits should I eat in a day?", a: "A small handful (30g) of mixed dry fruits per day is optimal for most adults." },
                { q: "Which dry fruit is best for weight loss?", a: "Almonds, walnuts, and dates in moderation can support weight management due to their fiber and protein content." },
                { q: "Which dry fruit is good for skin?", a: "Walnuts (Omega-3), almonds (Vitamin E), and figs are excellent for glowing skin." },
                { q: "Which dry fruit is good for hair?", a: "Almonds, walnuts, and cashews are rich in biotin and zinc which promote hair growth." },
                { q: "Can we eat dry fruits in fast?", a: "Yes! Most dry fruits like almonds, walnuts, and raisins are considered satvik and suitable for fasting." },
              ].map((faq, i) => (
                <details key={i} className="group">
                  <summary className="flex items-center justify-between py-4 cursor-pointer text-sm font-bold text-brand-text list-none">
                    {faq.q}
                    <ChevronDown className="w-4 h-4 text-brand-text-muted group-open:rotate-180 transition-transform shrink-0 ml-2" />
                  </summary>
                  <p className="text-sm text-brand-text-muted font-medium pb-4 leading-relaxed">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── Mobile Bottom Nav (spacer) ── */}
      <div className="h-16 lg:hidden" />
    </div>
  );
}
