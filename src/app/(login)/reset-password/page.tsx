"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useState } from "react"
import { AuthMessage, AuthPanel, authButtonClass, authInputClass, authLabelClass } from "../components/AuthPanel"

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
      "Если адрес зарегистрирован, то мы отправим письмо со ссылкой для сброса пароля.",
    )
  }

  return (
    <AuthPanel
      title="Сброс пароля"
      frame="compact"
      footer={
        <p className="text-center text-sm">
          <Link href="/login" className="underline underline-offset-4 text-white/70 hover:text-white">
            Назад ко входу
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
        <label className="mx-auto flex w-full max-w-[32rem] flex-col gap-1">
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
        <button type="submit" disabled={pending} className={`${authButtonClass} mt-auto`}>
          {pending ? "Отправка…" : "Отправить ссылку"}
        </button>
      </form>
    </AuthPanel>
  )
}
