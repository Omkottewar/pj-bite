import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import CloudinaryUpload from "@/components/ui/CloudinaryUpload";
import dbConnect from "@/lib/mongodb";
import Category from "@/models/Category";
import { createCategory, deleteCategory } from "@/app/actions/admin";
import DeleteButton from "@/components/admin/crud/DeleteButton";
import EditCategoryModal from "./EditCategoryModal";
import { LayoutList } from "lucide-react";

export const revalidate = 0;

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    import("next/navigation").then((nav) => nav.redirect("/api/auth/signin?callbackUrl=/admin/categories"));
    return null;
  }

  const role = (session.user as any).role;
  const userId = (session.user as any).id;
  const isSuperAdmin = role === "SUPERADMIN";

  await dbConnect();
  
  const filter = isSuperAdmin ? {} : { vendorId: userId };
  const categories = await Category.find(filter).populate("vendorId", "name email").lean();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-brand-text font-serif tracking-tight">Manage Categories</h1>
          <p className="text-brand-text-muted mt-1 font-medium">Organize your products into collections.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form */}
        <div className="bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm h-fit">
          <h2 className="text-lg font-bold text-brand-text mb-6 border-b border-[#E8E6E1] pb-3">Create Category</h2>
          <form action={createCategory} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1.5">Category Name *</label>
              <input 
                type="text" 
                name="name" 
                required
                className="w-full px-4 py-2.5 bg-brand-bg/50 border border-[#E8E6E1] rounded-xl text-brand-text focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-all font-medium"
                placeholder="e.g. Premium Nuts"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-brand-text mb-1.5">Category Image</label>
              <CloudinaryUpload name="image" maxFiles={1} />
            </div>
            <button 
              type="submit" 
              className="w-full bg-brand-primary hover:bg-brand-primary-dark text-white font-bold py-3 rounded-xl transition-all shadow-md shadow-brand-primary/20 mt-4"
            >
              Add Category
            </button>
          </form>
        </div>

        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-[#E8E6E1] shadow-sm">
          <h2 className="text-lg font-bold text-brand-text mb-6 border-b border-[#E8E6E1] pb-3">Existing Categories</h2>
          
          {categories.length === 0 ? (
             <div className="text-center py-16">
               <LayoutList className="w-12 h-12 text-brand-text-muted/50 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-brand-text mb-2 font-serif">No categories found</h3>
               <p className="text-brand-text-muted">Fill out the form to create your first product category.</p>
             </div>
          ) : (
             <div className="overflow-x-auto rounded-xl border border-[#E8E6E1] pb-2">
              <table className="w-full text-left whitespace-nowrap">
                <thead className="bg-[#E8E6E1]/30">
                  <tr className="border-b border-[#E8E6E1] text-[12px] uppercase tracking-wider font-bold text-brand-text-muted">
                    <th className="px-5 py-4">Name</th>
                    <th className="px-5 py-4">Slug</th>
                    {isSuperAdmin && <th className="px-5 py-4">Vendor</th>}
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6E1] text-sm">
                  {categories.map((cat: any) => {
                    const catData = JSON.parse(JSON.stringify(cat));
                    return (
                      <tr key={catData._id} className="hover:bg-brand-bg/50 transition-colors">
                        <td className="px-5 py-4 text-brand-text font-bold">
                          <div className="flex items-center gap-4">
                             {catData.image ? (
                               // eslint-disable-next-line @next/next/no-img-element
                               <img src={catData.image} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#E8E6E1] shadow-sm" />
                             ) : (
                               <div className="w-12 h-12 bg-white border border-[#E8E6E1] rounded-xl flex items-center justify-center text-brand-text-muted text-xs shadow-sm">?</div>
                             )}
                             <span className="text-[14px] text-brand-text font-bold">{catData.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-brand-text-muted font-medium">{catData.slug}</td>
                        {isSuperAdmin && (
                          <td className="px-5 py-4">
                             <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-[#E8E6E1]/50 text-brand-text border border-[#E8E6E1]">
                               {catData.vendorId?.name || "Global / Self"}
                             </span>
                          </td>
                        )}
                        <td className="px-5 py-4 text-right">
                           <div className="flex justify-end gap-2 items-center">
                             <EditCategoryModal category={catData} />
                             <DeleteButton id={catData._id} deleteAction={deleteCategory} />
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
