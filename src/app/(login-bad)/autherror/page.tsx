"use client"

import Link from "next/link"

export default function AuthErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 flex flex-col items-center gap-6">
        <svg viewBox="0 0 24 24" fill="none" className="w-16 h-16 text-red-500">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
          <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <h1 className="text-2xl font-semibold text-gray-800 text-center">Ошибка входа</h1>
        <p className="text-gray-600 text-center">
          Произошла ошибка.
          <br />
          Пожалуйста, попробуйте снова или свяжитесь с поддержкой.
        </p>
        <Link
          href="/login"
          className="rounded-md border border-gray-500 px-4 py-2 text-sm text-gray-500 hover:bg-gray-200/50 transition-colors"
        >
          На страницу входа
        </Link>
      </div>
    </div>
  )
}
