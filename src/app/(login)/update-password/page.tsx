"use client"

import { createClient } from "@/shared/supabase/client"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { AuthPanel, authButtonClass, authInputClass, authLabelClass } from "../components/AuthPanel"

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
      <AuthPanel title="Новый пароль" frame="tall-compact">
        <p className="text-center text-sm text-white/70">Загрузка…</p>
      </AuthPanel>
    )
  }

  return (
    <AuthPanel
      title="Новый пароль"
      frame="tall-compact"
      footer={
        <p className="text-center text-sm">
          <Link href="/login" className="underline text-white/70 underline-offset-4 hover:text-white">
            На страницу входа
          </Link>
        </p>
      }
    >
      <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col gap-4">
        {!recoverySession && (
          <label className="flex flex-col gap-1">
            <span className={authLabelClass}>Текущий пароль</span>
            <input
              type="password"
              autoComplete="current-password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className={authInputClass}
            />
          </label>
        )}
        <label className="flex flex-col gap-1">
          <span className={authLabelClass}>Новый пароль</span>
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
          <span className={authLabelClass}>Повтор пароля</span>
          <input
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className={authInputClass}
          />
        </label>
        {error ? (
          <p role="alert" className="text-center text-sm leading-snug text-red-300">
            {error}
          </p>
        ) : null}
        <button type="submit" disabled={pending} className={authButtonClass}>
          {pending ? "Сохранение…" : "Сохранить"}
        </button>
      </form>
    </AuthPanel>
  )
}
