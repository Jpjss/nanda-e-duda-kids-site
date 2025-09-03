"use client"

import { SessionProvider } from 'next-auth/react'
import AdminLayoutContent from './layout-content'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <AdminLayoutContent>
        {children}
      </AdminLayoutContent>
    </SessionProvider>
  )
}