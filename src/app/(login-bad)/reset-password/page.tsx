"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useState } from "react"

export default function ResetPasswordPage() {
  const supabase = createClient()
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setPending(true)

    const origin = typeof window !== "undefined" ? window.location.origin : ""

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: `${origin}/update-password`,
      },
    )

    setPending(false)

    if (resetError) {
      setError(resetError.message)
      return
    }

    setInfo(
      "Если адрес зарегистрирован, мы отправили письмо со ссылкой для сброса пароля.",
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <h1 className="text-2xl font-semibold text-center">Сброс пароля</h1>
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
          {pending ? "Отправка…" : "Отправить ссылку"}
        </button>
      </form>
      <p className="text-center text-sm">
        <Link href="/login" className="underline text-gray-600">
          Назад ко входу
        </Link>
      </p>
    </div>
  )
}
