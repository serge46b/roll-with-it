"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

function sessionFromRecoveryLink(accessToken: string): boolean {
  try {
    const segment = accessToken.split(".")[1]
    if (!segment) return false
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4)
    const payload = JSON.parse(atob(padded)) as { amr?: { method?: string }[] }
    const amr = payload.amr
    return Array.isArray(amr) && amr.some((e) => e.method === "recovery")
  } catch {
    return false
  }
}

export default function UpdatePasswordPage() {
  const router = useRouter()
  const supabase = createClient()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [sessionEmail, setSessionEmail] = useState<string | null>(null)
  const [recoverySession, setRecoverySession] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setReady(true)
      if (!session) {
        setError(
          "Нет активной сессии. Откройте ссылку из письма или войдите снова.",
        )
        return
      }
      setSessionEmail(session.user.email ?? null)
      setRecoverySession(sessionFromRecoveryLink(session.access_token))
    })
  }, [supabase.auth])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Пароли не совпадают")
      return
    }

    if (password.length < 6) {
      setError("Пароль должен быть не короче 6 символов")
      return
    }

    let emailForReauth: string | undefined
    if (!recoverySession) {
      if (!sessionEmail) {
        setError("Не удалось определить email. Выйдите и войдите снова.")
        return
      }
      if (!currentPassword) {
        setError("Введите текущий пароль")
        return
      }
      emailForReauth = sessionEmail
    }

    setPending(true)

    if (emailForReauth) {
      const { error: reauthError } = await supabase.auth.signInWithPassword({
        email: emailForReauth,
        password: currentPassword,
      })
      if (reauthError) {
        setPending(false)
        setError("Неверный текущий пароль")
        return
      }
    }

    const { error: updateError } = await supabase.auth.updateUser({
      password,
    })
    setPending(false)

    if (updateError) {
      setError(updateError.message)
      return
    }

    router.replace("/habitboard")
    router.refresh()
  }

  if (!ready) {
    return (
      <div className="flex w-full max-w-sm flex-col gap-6 px-4">
        <p className="text-center text-sm text-gray-600">Загрузка…</p>
      </div>
    )
  }

  return (
    <div className="flex w-full max-w-sm flex-col gap-6 px-4">
      <h1 className="text-2xl font-semibold text-center">Новый пароль</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {!recoverySession && (
          <label className="flex flex-col gap-1 text-sm">
            Текущий пароль
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="rounded-md border border-gray-400 px-3 py-2"
            />
          </label>
        )}
        <label className="flex flex-col gap-1 text-sm">
          Новый пароль
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
          Повтор пароля
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
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
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
      <p className="text-center text-sm">
        <Link href="/login" className="underline text-gray-600">
          На страницу входа
        </Link>
      </p>
    </div>
  )
}
