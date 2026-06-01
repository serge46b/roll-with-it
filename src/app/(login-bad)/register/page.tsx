"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function RegisterPage() {
  const router = useRouter()
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordAgain, setPasswordAgain] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (password !== passwordAgain) {
      setError("Пароли не совпадают.")
      return
    }

    setPending(true)

    const origin = typeof window !== "undefined" ? window.location.origin : ""

    const { data, error: signError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/habitboard`,
      },
    })

    setPending(false)

    if (signError) {
      setError(signError.message)
      return
    }

    if (data.session) {
      router.replace("/habitboard")
      router.refresh()
      return
    }

    setInfo("Проверьте почту: мы отправили ссылку для подтверждения.")
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <h1 className="text-2xl font-semibold text-center">Регистрация</h1>
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
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Введите пароль ещё раз
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            className="rounded-md border border-gray-400 px-3 py-2"
          />
        </label>
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
        {info && (
          <p className="text-sm text-gray-600" role="status">
            {info}
          </p>
        )}
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-background disabled:opacity-50"
        >
          {pending ? "Регистрация…" : "Зарегистрироваться"}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600">
        Уже есть аккаунт?{" "}
        <Link href="/login" className="underline">
          Войти
        </Link>
      </p>
    </div>
  )
}
