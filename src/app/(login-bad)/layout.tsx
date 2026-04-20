// TODO: Refactor all login pages, main logic should be in modules

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <main className="flex flex-col items-center justify-center h-screen">{children}</main>
}
