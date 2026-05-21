"use client"

import Link from "next/link"
import { AuthPanel, authButtonClass } from "../components/AuthPanel"

export default function AuthErrorPage() {
  return (
    <AuthPanel
      title="Ошибка входа"
      frame="compact"
      bodyClassName="items-center justify-center text-center"
    >
      <div className="flex max-w-[26rem] flex-col items-center gap-4">
        <svg viewBox="0 0 24 24" fill="none" className="h-14 w-14 text-red-400">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <p className="text-center text-sm text-white/80">
          Произошла ошибка.
          <br />
          Пожалуйста, попробуйте снова или свяжитесь с поддержкой.
        </p>
        <Link
          href="/login"
          className={`${authButtonClass} mt-4 flex max-w-[12.5rem] items-center justify-center text-center`}
        >
          На страницу входа
        </Link>
      </div>
    </AuthPanel>
  )
}
