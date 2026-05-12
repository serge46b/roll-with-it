import { TopBar } from "@/modules/Topbar"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar />
      <main>{children}</main>
    </>
  )
}
