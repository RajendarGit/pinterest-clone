"use client"

import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { setUser, clearAuth } from "@/lib/store/slices/authSlice"
import { createClient } from "@/lib/supabase/client"

export function useSupabaseAuth() {
  const dispatch = useDispatch()
  const supabase = createClient()

  useEffect(() => {
    // 1. Get current user on load
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        dispatch(setUser({
          id: user.id,
          email: user.email!,
          username: user.user_metadata?.username || "",
          display_name: user.user_metadata?.full_name || "",
          avatar_url: user.user_metadata?.avatar_url || "",
        }))
      } else {
        dispatch(clearAuth())
      }
    })

    // 2. Listen for login/logout changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        dispatch(setUser({
          id: session.user.id,
          email: session.user.email!,
          username: session.user.user_metadata?.username || "",
          display_name: session.user.user_metadata?.full_name || "",
          avatar_url: session.user.user_metadata?.avatar_url || "",
        }))
      } else {
        dispatch(clearAuth())
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [dispatch, supabase])
}
