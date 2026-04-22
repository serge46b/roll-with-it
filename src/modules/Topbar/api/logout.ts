import { createClient } from "@/shared/supabase/client"
import { redirect } from "next/navigation"

export async function logout() {
  const supabase = await createClient()
  const { data: claimsData } = await supabase.auth.getClaims()
  if (claimsData?.claims) {
    await supabase.auth.signOut()
  }
  redirect("/login")
}
