"use server";

import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import Product from "@/models/Product";
import User from "@/models/User";
import Order from "@/models/Order";
import Coupon from "@/models/Coupon";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
// ==============================
// TYPES & HELPERS
// ==============================

type Role = "SUPERADMIN" | "VENDOR" | "CUSTOMER";

const VALID_DELIVERY_STATUSES = [
  "PENDING",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;

type DeliveryStatus = (typeof VALID_DELIVERY_STATUSES)[number];

async function getAuthorizedSession(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session) throw new Error("Unauthorized");

  const role = (session.user as { role: Role }).role;
  if (allowedRoles && !allowedRoles.includes(role)) {
    throw new Error("Forbidden: insufficient permissions");
  }

  return session;
}

function getStr(formData: FormData, key: string): string {
  return (formData.get(key) as string | null)?.trim() ?? "";
}

function getNum(formData: FormData, key: string): number {
  return Number(formData.get(key));
}

function parseJsonField<T>(value: string | null, fallback: T): T {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    throw new Error(`Invalid JSON for field`);
  }
}



async function generateSlug(
  base: string,
  model: typeof Category | typeof Product,
  excludeId?: string
): Promise<string> {
  let slug = base.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  let counter = 1;
  const original = slug;

  while (true) {
    const query = { slug, ...(excludeId ? { _id: { $ne: excludeId } } : {}) };
    const exists = await model.exists(query as any);
    if (!exists) break;

    slug = `${original}-${counter}`;
    counter++;
  }

  return slug;
}

// ==============================
// CATEGORY ACTIONS
// ==============================

export async function createCategory(formData: FormData) {
  const session = await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  const name = getStr(formData, "name");
  const image = getStr(formData, "image");

  if (!name) throw new Error("Category name is required");

  await dbConnect();

  const slug = await generateSlug(name, Category);

  await Category.create({
    name,
    slug,
    image: image || "",
    vendorId: (session.user as { id: string }).id,
  });

  revalidatePath("/admin/categories");
}

export async function editCategory(formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  const id = getStr(formData, "id");
  const name = getStr(formData, "name");
  const image = getStr(formData, "image");

  if (!id) throw new Error("Category ID is required");
  if (!name) throw new Error("Category name is required");

  await dbConnect();

  const slug = await generateSlug(name, Category, id);

  await Category.findByIdAndUpdate(id, { $set: { name, slug, image } });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function deleteCategory(id: string) {
  await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  if (!id) throw new Error("Category ID is required");

  await dbConnect();

  await Category.findByIdAndDelete(id);

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products");
  revalidatePath("/products");
}

// ==============================
// PRODUCT ACTIONS
// ==============================

export async function createProduct(formData: FormData) {
  const session = await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  const name = getStr(formData, "name");
  const description = getStr(formData, "description");
  const categoryId = getStr(formData, "categoryId");
  const price = getNum(formData, "price");
  const stock = getNum(formData, "stock") || 0;

  if (!name) throw new Error("Product name is required");
  if (!description) throw new Error("Product description is required");
  if (!categoryId) throw new Error("Category is required");
  if (isNaN(price) || price <= 0) throw new Error("Valid price is required");
  if (stock < 0) throw new Error("Stock cannot be negative");

  const imagesStr = getStr(formData, "images");
  const descImagesStr = getStr(formData, "descriptionImages");
  const variantsStr = formData.get("variants")?.toString() || "";
  const claimsStr = formData.get("claims")?.toString() || "[]";
  const heroHighlightsStr = formData.get("heroHighlights")?.toString() || "[]";
  const ingredients = getStr(formData, "ingredients");
  const nutrition = getStr(formData, "nutrition");
  const benefits = getStr(formData, "benefits");

  const images = imagesStr
    ? imagesStr.split(",").map((i) => i.trim()).filter(Boolean)
    : [];
  const descriptionImages = descImagesStr
    ? descImagesStr.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const variants = parseJsonField(variantsStr || "[]", []);
  const claims = parseJsonField(claimsStr, []);
  const heroHighlights = parseJsonField(heroHighlightsStr, []);

  await dbConnect();

  const slug = await generateSlug(name, Product);

  await Product.create({
    name,
    slug,
    description,
    price,
    stock,
    variants,
    categoryId,
    images,
    descriptionImages,
    claims,
    heroHighlights,
    ingredients: ingredients || undefined,
    nutrition: nutrition || undefined,
    benefits: benefits || undefined,
    vendorId: (session.user as { id: string }).id,
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function editProduct(formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  const id = getStr(formData, "id");
  const name = getStr(formData, "name");
  const description = getStr(formData, "description");
  const categoryId = getStr(formData, "categoryId");
  const price = getNum(formData, "price");
  const stock = getNum(formData, "stock") || 0;

  if (!id) throw new Error("Product ID is required");
  if (!name) throw new Error("Product name is required");
  if (!description) throw new Error("Product description is required");
  if (!categoryId) throw new Error("Category is required");
  if (isNaN(price) || price <= 0) throw new Error("Valid price is required");
  if (stock < 0) throw new Error("Stock cannot be negative");

  const imagesStr = getStr(formData, "images");
  const descImagesStr = getStr(formData, "descriptionImages");
  const ingredients = getStr(formData, "ingredients");
  const nutrition = getStr(formData, "nutrition");
  const benefits = getStr(formData, "benefits");

  const images = imagesStr
    ? imagesStr.split(",").map((i) => i.trim()).filter(Boolean)
    : [];
  const descriptionImages = descImagesStr
    ? descImagesStr.split(",").map((i) => i.trim()).filter(Boolean)
    : [];

  const variants = parseJsonField(formData.get("variants")?.toString() || "[]", []);
  const claims = parseJsonField(formData.get("claims")?.toString() || "[]", []);
  const heroHighlights = parseJsonField(formData.get("heroHighlights")?.toString() || "[]", []);

  await dbConnect();

  const slug = await generateSlug(name, Product, id);

  await Product.findByIdAndUpdate(id, {
    $set: {
      name,
      slug,
      description,
      price,
      stock,
      variants,
      categoryId,
      images,
      descriptionImages,
      claims,
      heroHighlights,
      ingredients: ingredients || undefined,
      nutrition: nutrition || undefined,
      benefits: benefits || undefined,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  await getAuthorizedSession(["SUPERADMIN", "VENDOR"]);

  if (!id) throw new Error("Product ID is required");

  await dbConnect();

  await Product.findByIdAndDelete(id);

  revalidatePath("/admin/products");
  revalidatePath("/products");
}

// ==============================
// VENDOR ACTIONS (SUPERADMIN ONLY)
// ==============================

export async function createVendor(formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN"]);

  const name = getStr(formData, "name");
  const email = getStr(formData, "email");
  const passwordText = getStr(formData, "password");

  if (!name) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");
  if (!passwordText || passwordText.length < 6)
    throw new Error("Password must be at least 6 characters");

  await dbConnect();

  const existing = await User.findOne({ email });
  if (existing) throw new Error("Email already exists");

  const password = await bcrypt.hash(passwordText, 10);

  await User.create({ name, email, password, role: "VENDOR" });

  revalidatePath("/admin/vendors");
}

export async function editVendor(formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN"]);

  const id = getStr(formData, "id");
  const name = getStr(formData, "name");
  const email = getStr(formData, "email");
  const passwordText = getStr(formData, "password");

  if (!id) throw new Error("Vendor ID is required");
  if (!name) throw new Error("Name is required");
  if (!email) throw new Error("Email is required");

  await dbConnect();

  const updateData: { name: string; email: string; password?: string } = {
    name,
    email,
  };

  if (passwordText) {
    if (passwordText.length < 6)
      throw new Error("Password must be at least 6 characters");
    updateData.password = await bcrypt.hash(passwordText, 10);
  }

  await User.findByIdAndUpdate(id, { $set: updateData });

  revalidatePath("/admin/vendors");
}

export async function deleteVendor(id: string) {
  await getAuthorizedSession(["SUPERADMIN"]);

  if (!id) throw new Error("Vendor ID is required");

  await dbConnect();

  await User.findByIdAndDelete(id);

  revalidatePath("/admin/vendors");
}

// ==============================
// ORDER ACTIONS
// ==============================

export async function updateOrderStatus(
  orderId: string,
  deliveryStatus: DeliveryStatus
) {
  await getAuthorizedSession(["SUPERADMIN"]);

  if (!orderId) throw new Error("Order ID is required");
  if (!VALID_DELIVERY_STATUSES.includes(deliveryStatus)) {
    throw new Error(`Invalid delivery status: ${deliveryStatus}`);
  }

  await dbConnect();

  await Order.findByIdAndUpdate(orderId, { $set: { deliveryStatus } });

  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin/orders");
}

// ==============================
// COUPON ACTIONS (SUPERADMIN ONLY)
// ==============================

export async function createCoupon(formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN"]);

  const code = getStr(formData, "code").toUpperCase();
  const discountType = getStr(formData, "discountType");
  const discountValue = getNum(formData, "discountValue");
  const minOrderValue = getNum(formData, "minOrderValue");
  const expiryDateStr = getStr(formData, "expiryDate");

  if (!code) throw new Error("Coupon code is required");
  if (!["PERCENTAGE", "FLAT"].includes(discountType))
    throw new Error("Invalid discount type");
  if (isNaN(discountValue) || discountValue <= 0)
    throw new Error("Valid discount value is required");
  if (!expiryDateStr) throw new Error("Expiry date is required");

  const expiryDate = new Date(expiryDateStr);
  if (isNaN(expiryDate.getTime())) throw new Error("Invalid expiry date");
  if (expiryDate <= new Date()) throw new Error("Expiry date must be in the future");

  await dbConnect();

  try {
    await Coupon.create({
      code,
      discountType,
      discountValue,
      minOrderValue,
      isActive: formData.get("isActive") === "on",
      expiryDate,
    });

    revalidatePath("/admin/coupons");
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 11000)
      throw new Error("Coupon code already exists");
    throw err;
  }
}

export async function editCoupon(id: string, formData: FormData) {
  await getAuthorizedSession(["SUPERADMIN"]);

  if (!id) throw new Error("Coupon ID is required");

  const code = getStr(formData, "code").toUpperCase();
  const discountType = getStr(formData, "discountType");
  const discountValue = getNum(formData, "discountValue");
  const minOrderValue = getNum(formData, "minOrderValue");
  const expiryDateStr = getStr(formData, "expiryDate");

  if (!code) throw new Error("Coupon code is required");
  if (!["PERCENTAGE", "FLAT"].includes(discountType))
    throw new Error("Invalid discount type");
  if (isNaN(discountValue) || discountValue <= 0)
    throw new Error("Valid discount value is required");
  if (!expiryDateStr) throw new Error("Expiry date is required");

  const expiryDate = new Date(expiryDateStr);
  if (isNaN(expiryDate.getTime())) throw new Error("Invalid expiry date");

  await dbConnect();

  await Coupon.findByIdAndUpdate(id, {
    code,
    discountType,
    discountValue,
    minOrderValue,
    isActive: formData.get("isActive") === "on",
    expiryDate,
  });

  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(id: string) {
  await getAuthorizedSession(["SUPERADMIN"]);

  if (!id) throw new Error("Coupon ID is required");

  await dbConnect();

  await Coupon.findByIdAndDelete(id);

  revalidatePath("/admin/coupons");
}

export async function toggleCouponActive(id: string, activeStatus: boolean) {
  await getAuthorizedSession(["SUPERADMIN"]);

  if (!id) throw new Error("Coupon ID is required");

  await dbConnect();

  await Coupon.findByIdAndUpdate(id, { isActive: activeStatus });

  revalidatePath("/admin/coupons");
}