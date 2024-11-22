"use client"

import { useState } from 'react'
import { Menu, Bell, Sun, Moon, User, LogOut, Settings } from 'lucide-react'
import { useTheme } from 'next-themes'
import { NavMenu } from './nav-menu'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { usePerfil } from '@/contexts/perfil'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AppLayoutProps {
  children: React.ReactNode
  menuItems: {
    title: string
    items: {
      name: string
      href: string
      disabled?: boolean
    }[]
  }[]
}

export function AppLayout({ children, menuItems }: AppLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = createClient()
  const { perfil } = usePerfil()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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

            <button 
              className="p-2 hover:bg-accent rounded-md transition-colors relative" 
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 p-2 hover:bg-accent rounded-md transition-colors">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={perfil?.foto_url || ''} />
                    <AvatarFallback>
                      {perfil?.nome?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline-block">
                    {perfil?.nome || 'Usuário'}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push('/erp/perfil')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push('/erp/configuracoes')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-12 bottom-0 w-64 border-r bg-background transition-transform duration-200 ease-in-out z-40 ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <NavMenu items={menuItems} />
      </aside>

      {/* Main Content */}
      <main className={`flex-1 mt-12 ${isMenuOpen ? 'ml-64' : ''} transition-[margin] duration-200 ease-in-out`}>
        {children}
      </main>
    </div>
  )
}
