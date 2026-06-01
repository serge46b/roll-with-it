"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { AuthMessage, AuthPanel, authButtonClass, authInputClass, authLabelClass } from "../components/AuthPanel"

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
    <AuthPanel
      title="Регистрация"
      frame="tall-compact"
      footer={
        <p className="text-center text-sm text-white/70">
          Уже есть аккаунт?{" "}
          <Link href="/login" className="underline underline-offset-4 hover:text-white">
            Войти
          </Link>
        </p>
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
            className={authInputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={authLabelClass}>Пароль</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={authInputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className={authLabelClass}>Введите пароль ещё раз</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            className={authInputClass}
          />
        </label>
        {error ? (
          <AuthMessage tone="error" role="alert">
            {error}
          </AuthMessage>
        ) : null}
        {info ? (
          <AuthMessage role="status">
            {info}
          </AuthMessage>
        ) : null}
        <button type="submit" disabled={pending} className={`${authButtonClass} mt-4`}>
          {pending ? "Регистрация…" : "Зарегистрироваться"}
        </button>
      </form>
    </AuthPanel>
  )
}
