import { PlanetScreen } from "@/modules/PlanetScreen"
import { createClient } from "@/shared/supabase/server"
import { redirect } from "next/navigation"

export default async function Home() {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error && error.status !== 400) {
    throw new Error(error.message)
  }
  if (!user) {
    redirect("/login")
  }
  return <PlanetScreen></PlanetScreen>
}
