"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthMessage, AuthPanel, authButtonClass, authInputClass, authLabelClass } from "../components/AuthPanel"

export default function LoginPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setPending(true)
    const { error: signError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    setPending(false)
    if (signError) {
      setError(signError.message)
      return
    }
    router.replace("/")
    router.refresh()
  }

  return (
    <AuthPanel
      title="Вход в сервис"
      frame="compact"
      footer={
        <div className="flex flex-col gap-2 text-center text-sm">
          <p className="text-white/70">
            Нет аккаунта?{" "}
            <Link href="/register" className="underline underline-offset-4 hover:text-white">
              Зарегистрируйтесь
            </Link>
          </p>
          <p>
            <Link href="/reset-password" className="text-white/70 underline underline-offset-4 hover:text-white">
              Забыли пароль?
            </Link>
          </p>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
        <label className="flex flex-col gap-1">
          <span className={authLabelClass}>Email</span>
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.ru"
            className={authInputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={authLabelClass}>Пароль</span>
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Введите пароль"
            className={authInputClass}
          />
        </label>
        {error ? (
          <AuthMessage tone="error" role="alert">
            {error}
          </AuthMessage>
        ) : null}
        <button type="submit" disabled={pending} className={`${authButtonClass} mt-2`}>
          {pending ? "Вход…" : "Войти"}
        </button>
      </form>
    </AuthPanel>
  )
}
