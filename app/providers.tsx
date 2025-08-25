"use client";
import { Provider } from "react-redux";
import { store } from "@/lib/store";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { clearAuth, setUser } from "@/lib/store/slices/authSlice";
import type { User as SupabaseUser } from "@supabase/supabase-js";

// 🔑 Convert Supabase User -> Redux User
function mapSupabaseUser(user: SupabaseUser) {
  return {
    id: user.id,
    email: user.email ?? "",
    username: user.user_metadata?.username ?? user.email?.split("@")[0] ?? "", // fallback
    display_name: user.user_metadata?.display_name ?? null,
    avatar_url: user.user_metadata?.avatar_url ?? null,
  };
}

export function Providers({ children }: { children: React.ReactNode }) {
  const supabase = createClient();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const mappedUser = mapSupabaseUser(session.user);
        store.dispatch(setUser(mappedUser)); // ✅ safe dispatch
      } else {
        store.dispatch(clearAuth());
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  return <Provider store={store}>{children}</Provider>;
}
