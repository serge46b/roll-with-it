"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

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
    router.replace("/habitboard")
    router.refresh()
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <h1 className="text-2xl font-semibold text-center">Вход</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Пароль
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-50"
        >
          {pending ? "Вход…" : "Войти"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Нет аккаунта?{" "}
        <Link href="/register" className="underline">
          Регистрация
        </Link>
      </p>
      <p className="text-center text-sm">
        <Link href="/reset-password" className="text-gray-600 underline">
          Забыли пароль?
        </Link>
      </p>
    </div>
  )
}
