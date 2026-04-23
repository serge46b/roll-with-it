"use client"
import { logout } from "../api/logout"

export function LogoutButton() {
  return (
    <button className="text-1xl font-exo2 cursor-pointer" onClick={logout}>
      ВЫХОД
    </button>
  )
}
