"use client"

import { useState } from 'react'
import { Menu, Bell, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { NavMenu } from './nav-menu'

interface AppLayoutProps {
  children: React.ReactNode
  menuItems: {
    title: string
    items: {
      name: string
      href: string
    }[]
  }[]
}

export function AppLayout({ children, menuItems }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { theme, setTheme } = useTheme()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 hover:bg-accent rounded-md transition-colors"
            aria-label="Toggle menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 hover:bg-accent rounded-md transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button className="p-2 hover:bg-accent rounded-md transition-colors relative" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className={`fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background transition-transform duration-300 ${
        isMenuOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4">
          <NavMenu items={menuItems} />
        </div>
      </aside>

      {/* Main Content */}
      <main className={`pt-16 transition-all duration-300 ${
        isMenuOpen ? 'pl-64' : 'pl-0'
      }`}>
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
