import { fetchUserName } from "../api/getUser"
import { createClient } from "@/shared/supabase/server"
import Image from "next/image"
import { LogoutButton } from "./logoutButton"
import Link from "next/link"

export async function TopBar() {
  const supabase = await createClient()
  const userName = await fetchUserName(supabase)

  return (
    <header className="sticky top-0 left-0 flex h-12 w-full items-center justify-between bg-[#050709]">
      <div className="relative my-2 ml-[2%] h-8 w-8 rounded-[10%] border border-white p-1">
        <Link href="/">
          <Image src="/svgs/logo.svg" alt="На главную" fill className="object-contain p-1" />
        </Link>
      </div>
      <div className="mr-[2%] flex items-center justify-center gap-4">
        <p className="text-1xl font-exo2 border-r border-white pr-4 text-white">{userName}</p>
        <LogoutButton />
      </div>
    </header>
  )
}
