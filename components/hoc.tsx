"use client";

import { useAppSelector } from "@/lib/hooks/redux";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth<P extends object>(WrappedComponent: React.ComponentType<P>) {
  return function ProtectedComponent(props: P) {
    const { user } = useAppSelector((state) => state.auth);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/auth/login"); // 🚪 redirect if not logged in
      }
    }, [user, router]);

    // While redirecting or if user is null → don’t render the page
    if (!user) {
      return null; 
      // or return <div>Loading...</div>
    }

    return <WrappedComponent {...props} />;
  };
}
