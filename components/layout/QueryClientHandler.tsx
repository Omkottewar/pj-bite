"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useCartStore } from "@/store/useCartStore";

function QueryHandlerInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { openAuthModal, openCheckout } = useCartStore();

  useEffect(() => {
    const auth = searchParams.get("auth");
    const checkout = searchParams.get("checkout");

    if (auth === "open") {
      openAuthModal();
      // Clean up URL
      router.replace("/");
    }
    if (checkout === "open") {
      openCheckout();
      // Clean up URL
      router.replace("/");
    }
  }, [searchParams, openAuthModal, openCheckout, router]);

  return null;
}

export default function QueryClientHandler() {
  return (
    <Suspense fallback={null}>
      <QueryHandlerInner />
    </Suspense>
  );
}
