"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useWishlistStore } from "@/store/useWishlistStore";

/**
 * Syncs server wishlist into the local Zustand store when the user logs in.
 * Also pushes any local (guest) wishlist items to the server after login.
 */
export function useWishlistSync() {
  const { status } = useSession();
  const syncFromServer = useWishlistStore((s) => s.syncFromServer);
  const localItems = useWishlistStore((s) => s.items);
  const hasSynced = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || hasSynced.current) return;
    hasSynced.current = true;

    // Push local (guest) items to server first, then fetch full server state
    const pushLocalAndSync = async () => {
      try {
        // Upload any locally saved items that aren't yet on the server
        await Promise.all(
          localItems.map((item) =>
            fetch("/api/wishlist", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ productId: item._id }),
            }).catch(() => null)
          )
        );

        // Then pull the full persisted wishlist
        const res = await fetch("/api/wishlist");
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data.items)) {
          syncFromServer(data.items);
        }
      } catch {
        // Silent fail — local state still works
      }
    };

    pushLocalAndSync();
  }, [status, syncFromServer, localItems]);
}
