/**
 * Seed script — populates all static home page content into MongoDB.
 *
 * Run from project root:
 *   node scripts/seed-home.mjs
 *
 * Requires MONGODB_URI in .env.local
 */

import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

const MONGODB_URI = "mongodb+srv://pjbite:r1cBoF1l3IHuAsRI@cluster0.grs7ebr.mongodb.net/";
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not found in .env.local");
  process.exit(1);
}

// ── Inline schemas (avoids TypeScript compile step) ───────────────────────
const FAQSchema = new mongoose.Schema(
  { question: String, answer: String, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } },
  { timestamps: true }
);

const TestimonialSchema = new mongoose.Schema(
  { name: String, location: String, detail: String, text: String, rating: { type: Number, default: 5 }, active: { type: Boolean, default: true }, order: { type: Number, default: 0 } },
  { timestamps: true }
);

const QualityCardSchema = new mongoose.Schema(
  { title: String, desc: String, img: String, alt: String, order: { type: Number, default: 0 }, active: { type: Boolean, default: true } },
  { timestamps: true }
);

const HomeSettingsSchema = new mongoose.Schema(
  {
    trustStrip:    { type: mongoose.Schema.Types.Mixed, default: [] },
    benefits:      { type: mongoose.Schema.Types.Mixed, default: [] },
    purposes:      { type: mongoose.Schema.Types.Mixed, default: [] },
    qualityClaims: { type: [String], default: [] },
    whyPjBite:     { type: mongoose.Schema.Types.Mixed, default: [] },
    howItWorks:    { type: mongoose.Schema.Types.Mixed, default: [] },
    bulkOrder:     { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

// ── Seed data ──────────────────────────────────────────────────────────────

const FAQS = [
  {
    question: "How long do dry fruits stay fresh?",
    answer:   "When stored in an airtight container in a cool, dry place, our dry fruits stay fresh for 6–12 months. Refrigeration can extend shelf life further.",
    order: 0,
  },
  {
    question: "Are your products free from preservatives?",
    answer:   "Yes! We use natural dehydration technology to preserve fruits. No artificial preservatives, chemicals, or additives are ever used.",
    order: 1,
  },
  {
    question: "Which dry fruit is best for daily consumption?",
    answer:   "Almonds, walnuts, and dates are excellent for daily use. They are packed with Omega-3, fiber, and natural energy.",
    order: 2,
  },
  {
    question: "Do you offer bulk orders for businesses?",
    answer:   "Absolutely! We offer special pricing for bulk orders. Contact us at infopjbite@gmail.com for corporate or wholesale inquiries.",
    order: 3,
  },
  {
    question: "How are your products sourced?",
    answer:   "We work directly with farmers across India and abroad, eliminating middlemen to ensure freshness, fair pricing, and quality.",
    order: 4,
  },
];

const TESTIMONIALS = [
  { name: "Priya S.",  location: "Mumbai",    detail: "Mumbai · Almonds Premium",   text: "Absolutely love the quality! The almonds are so fresh and crunchy. Zero artificial taste — just pure goodness in every bite.",                     rating: 5, order: 0 },
  { name: "Rahul M.", location: "Pune",       detail: "Pune · Gift Collection",     text: "Ordered the Diwali gift box and everyone loved it. The packaging is premium and the dry fruits taste absolutely amazing.",                           rating: 5, order: 1 },
  { name: "Sneha K.", location: "Bangalore",  detail: "Bangalore · Cashews",        text: "Great quality, fast delivery. The cashews melt in your mouth. Price is very reasonable for this level of premium quality.",                           rating: 5, order: 2 },
  { name: "Arjun V.", location: "Jaipur",     detail: "Jaipur · Mixed Fruit Pack",  text: "The mixed fruit pack is my daily morning snack now. Natural, no sugar coating, and the freshness is unmatched anywhere else.",                       rating: 5, order: 3 },
  { name: "Divya R.", location: "Ahmedabad",  detail: "Ahmedabad · Walnuts",        text: "Tried the walnuts after my doctor recommended them. Best I've had — not bitter at all, perfectly dried and full of flavour.",                         rating: 5, order: 4 },
  { name: "Ishita B.",location: "Kolkata",    detail: "Kolkata · Dates Premium",    text: "Farm-direct sourcing really shows. You can taste the difference from supermarket stuff. Will always order from PJ Bite.",                             rating: 5, order: 5 },
];

const QUALITY_CARDS = [
  {
    title: "In-House R&D Experts",
    desc:  "Our in-house R&D team ensures every product meets the highest standards of nutrition and safety.",
    img:   "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop",
    alt:   "R&D Experts",
    order: 0,
  },
  {
    title: "See the Proof. Don't Just Trust Us.",
    desc:  "Lab reports for every batch. Because real trust is built on transparency.",
    img:   "https://images.unsplash.com/photo-1586281380349-632531db7ed4?q=80&w=800&auto=format&fit=crop",
    alt:   "Lab Report",
    order: 1,
  },
  {
    title: "Pesticide Residue Test",
    desc:  "Every batch is tested for pesticide residue. Zero chemical contamination guaranteed.",
    img:   "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800&auto=format&fit=crop",
    alt:   "Pesticide Test",
    order: 2,
  },
  {
    title: "Nutritional Analysis & Shelf Life",
    desc:  "Comprehensive nutrition profiling & shelf-life testing ensures premium quality in every bite.",
    img:   "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop",
    alt:   "Nutritional Analysis",
    order: 3,
  },
];

const HOME_SETTINGS = {
  trustStrip: [
    { label: "No Colour Added",  subline: "100% Raw Nature",      iconType: "no-color"    },
    { label: "No Added Sugar",   subline: "Natural Fruit Sugars", iconType: "no-sugar"    },
    { label: "No Chemical",      subline: "Zero Toxins",          iconType: "no-chemical" },
    { label: "No Flavour",       subline: "Authentic Taste",      iconType: "no-flavor"   },
  ],
  benefits: [
    { label: "Free Shipping",    sub: "On Orders Above ₹499",        iconName: "Truck"   },
    { label: "100% Natural",     sub: "No Preservatives Added",       iconName: "Shield"  },
    { label: "Farm Direct",      sub: "Sourced From Farmers",         iconName: "Leaf"    },
    { label: "Quality Assured",  sub: "FSSAI Licensed Lab Tested",    iconName: "Award"   },
  ],
  purposes: [
    { label: "Gifting",  iconName: "Gift",     href: "/products?category=gifts"   },
    { label: "Snacking", iconName: "Sprout",   href: "/products?category=snacks"  },
    { label: "Cooking",  iconName: "Utensils", href: "/products?category=cooking" },
    { label: "Fitness",  iconName: "Dumbbell", href: "/products?category=fitness" },
  ],
  qualityClaims: [
    "✔ 100% Natural",
    "✔ No Added Sugar*",
    "✔ No Preservatives",
    "✔ No Artificial Colors or Flavours",
    "✔ Farm Direct Sourcing",
    "✔ Hygienically Processed",
    "✔ Clean Label Product",
  ],
  whyPjBite: [
    { title: "No Chemicals Ever",      desc: "We never use artificial preservatives, colors, or flavor enhancers. What you eat is exactly what nature made.",                           iconName: "Leaf"   },
    { title: "Farm-to-Door",           desc: "We partner directly with farmers, cutting out middlemen so you get fresher produce at better prices.",                                   iconName: "Sprout" },
    { title: "Natural Dehydration",    desc: "Using sun-drying and modern dehydration tech to preserve nutrients, taste, and texture naturally.",                                       iconName: "Sun"    },
  ],
  howItWorks: [
    { step: "01", label: "Farm Sourcing",       desc: "Direct from ethical farmers",    iconName: "Leaf"         },
    { step: "02", label: "Natural Drying",      desc: "Zero chemical processing",       iconName: "Sun"          },
    { step: "03", label: "Quality Check",       desc: "Premium quality standards",      iconName: "CheckCircle"  },
    { step: "04", label: "Doorstep Delivery",   desc: "Fresh & sealed arrival",         iconName: "Truck"        },
  ],
  bulkOrder: {
    badge:    "Corporate & Wholesale",
    title:    "Big Savings on Bulk Orders! 🥜",
    subtitle: "Contact our team for special pricing on bulk dry fruit orders for events, gifting, and retail.",
  },
};

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("🔌  Connecting to MongoDB…");
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected\n");

  const FAQ          = mongoose.models.FAQ          || mongoose.model("FAQ",          FAQSchema);
  const Testimonial  = mongoose.models.Testimonial  || mongoose.model("Testimonial",  TestimonialSchema);
  const QualityCard  = mongoose.models.QualityCard  || mongoose.model("QualityCard",  QualityCardSchema);
  const HomeSettings = mongoose.models.HomeSettings || mongoose.model("HomeSettings", HomeSettingsSchema);

  // ── FAQs ──────────────────────────────────────────────────────────────────
  const existingFaqs = await FAQ.countDocuments();
  if (existingFaqs > 0) {
    console.log(`⏭️   FAQs already seeded (${existingFaqs} found) — skipping`);
  } else {
    await FAQ.insertMany(FAQS);
    console.log(`✅  Seeded ${FAQS.length} FAQs`);
  }

  // ── Testimonials ──────────────────────────────────────────────────────────
  const existingT = await Testimonial.countDocuments();
  if (existingT > 0) {
    console.log(`⏭️   Testimonials already seeded (${existingT} found) — skipping`);
  } else {
    await Testimonial.insertMany(TESTIMONIALS);
    console.log(`✅  Seeded ${TESTIMONIALS.length} Testimonials`);
  }

  // ── Quality Cards ─────────────────────────────────────────────────────────
  const existingQC = await QualityCard.countDocuments();
  if (existingQC > 0) {
    console.log(`⏭️   Quality Cards already seeded (${existingQC} found) — skipping`);
  } else {
    await QualityCard.insertMany(QUALITY_CARDS);
    console.log(`✅  Seeded ${QUALITY_CARDS.length} Quality Cards`);
  }

  // ── Home Settings (upsert — always keeps data fresh) ─────────────────────
  const existing = await HomeSettings.findOne();
  if (existing) {
    Object.assign(existing, HOME_SETTINGS);
    await existing.save();
    console.log("✅  Home Settings updated");
  } else {
    await HomeSettings.create(HOME_SETTINGS);
    console.log("✅  Home Settings created");
  }

  console.log("\n🎉  Seed complete. Disconnecting…");
  await mongoose.disconnect();
  console.log("👋  Done.");
}

main().catch((err) => {
  console.error("❌  Seed failed:", err);
  mongoose.disconnect();
  process.exit(1);
});
