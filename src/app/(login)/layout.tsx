// TODO: Refactor all login pages, main logic should be in modules

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="login-stars flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-4">
      {children}
    </main>
  )
}
