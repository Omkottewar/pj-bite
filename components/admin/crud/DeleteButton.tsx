"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { showToast, showError } from "@/lib/swal";

export default function DeleteButton({ 
  id, 
  deleteAction 
}: { 
  id: string, 
  deleteAction: (id: string) => Promise<void> 
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this item? This action cannot be undone.")) {
      startTransition(async () => {
        try {
          await deleteAction(id);
          showToast("Item deleted successfully!");
        } catch (error: any) {
          showError("Delete Error", "Failed to delete: " + error.message);
        }
      });
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
      title="Delete"
    >
      {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
