import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { deleteProduct } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/crud/DeleteButton";
import EditProductModal from "./EditProductModal";
import CreateProductForm from "@/components/admin/crud/CreateProductForm";
import { Package } from "lucide-react";

export const revalidate = 0;

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    import("next/navigation").then((nav) => nav.redirect("/api/auth/signin?callbackUrl=/admin/products"));
    return null;
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isSuperAdmin = role === "SUPERADMIN";

  await dbConnect();
  
  const filter = isSuperAdmin ? {} : { vendorId: userId };
  const products = await Product.find(filter).populate("vendorId", "name").populate("categoryId", "name").lean();
  const categories = await Category.find(filter).lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Products</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Manage your inventory, pricing, and categories.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm h-fit xl:col-span-1">
          <h2 className="text-lg font-bold text-brand-text mb-6 border-b border-[#E8E6E1] pb-3">Add New Product</h2>
          <CreateProductForm categories={JSON.parse(JSON.stringify(categories))} />
        </div>

        {/* List */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm">
          <h2 className="text-lg font-bold text-brand-text mb-6 border-b border-[#E8E6E1] pb-3">Existing Products</h2>
          
          {products.length === 0 ? (
             <div className="text-center py-16">
               <Package className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No products found</h3>
               <p className="text-brand-text-muted">Fill out the form to add your first product.</p>
             </div>
          ) : (
           <div className="overflow-x-auto rounded-xl border border-[#E8E6E1] pb-2">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-brand-bg">
                  <tr className="border-b border-[#E8E6E1] text-brand-text-muted text-[13px] uppercase tracking-wider">
                    <th className="px-5 py-4 font-bold">Product</th>
                    <th className="px-5 py-4 font-bold">Price</th>
                    <th className="px-5 py-4 font-bold">Category</th>
                    {isSuperAdmin && <th className="px-5 py-4 font-bold">Vendor</th>}
                    <th className="px-5 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1] text-sm">
                  {products.map((prod: any) => {
                    const prodData = JSON.parse(JSON.stringify(prod));
                    const safeCategories = JSON.parse(JSON.stringify(categories));
                    return (
                      <tr key={prodData._id} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="px-5 py-4 text-brand-text font-bold">
                          <div className="flex items-center gap-4">
                             {prodData.images?.[0] ? (
                               // eslint-disable-next-line @next/next/no-img-element
                               <img src={prodData.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#E8E6E1] shadow-sm" />
                             ) : (
                               <div className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-text-muted border border-[#E8E6E1]">?</div>
                             )}
                             <div>
                               <p className="text-[14px] text-brand-text font-bold">{prodData.name}</p>
                               {prodData.heroHighlights?.length > 0 && (
                                 <p className="text-[11px] text-brand-primary font-medium mt-0.5 tracking-wide">{prodData.heroHighlights[0]}</p>
                               )}
                             </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-brand-text font-black">₹{(prodData.price as number).toFixed(2)}</td>
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8E6E1]/50 text-brand-text border border-[#E8E6E1]">
                             {prodData.categoryId?.name || "Uncategorized"}
                          </span>
                        </td>
                        {isSuperAdmin && (
                          <td className="px-5 py-4 text-brand-text-muted font-medium">
                             {prodData.vendorId?.name || "Global"}
                          </td>
                        )}
                        <td className="px-5 py-4 text-right">
                           <div className="flex justify-end gap-2 items-center">
                             <EditProductModal product={prodData} categories={safeCategories} />
                             <DeleteButton id={prodData._id} deleteAction={deleteProduct} />
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
