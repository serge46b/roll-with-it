import type { SupabaseClient } from "@supabase/supabase-js"
import type { Tables } from "@/shared/supabase/dbSchema"

export const fetchUserName = async (supabase: SupabaseClient) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return
  const { data: profile, error: profileError } = await supabase
    .from("profile")
    .select("nickname")
    .eq("user", user.id)
    .single()
  if (profileError) {
    throw new Error(profileError.message)
  }
  return profile.nickname
}
