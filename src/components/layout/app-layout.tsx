"use client"

import { useState } from 'react'
import Image from 'next/image'
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
  const { perfil, perfil_user } = usePerfil()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="flex items-center justify-between h-full px-4">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="p-2 rounded-md hover:bg-accent"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-md hover:bg-accent">
              <Bell className="w-5 h-5" />
            </button>

            <button
              onClick={() =>
                setTheme(theme === 'dark' ? 'light' : 'dark')
              }
              className="p-2 rounded-md hover:bg-accent"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="relative p-1 rounded-full hover:bg-accent">
                  <Avatar className="w-8 h-8 border-2 border-border">
                    <AvatarImage src={perfil_user?.foto_url || undefined} />
                    <AvatarFallback className="font-medium">
                      {perfil_user?.apelido?.[0]?.toUpperCase() || '?'}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2 bg-muted rounded-t-lg">
                  <p className="text-sm font-medium">{perfil_user?.apelido || 'Usuário'}</p>
                </div>
                <div className="mt-2.5">
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    <span>Configurações</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-12 bottom-0 w-64 border-r bg-background transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        {/* Logo do Perfil */}
        {perfil?.foto_url && (
          <div className="w-full p-4 border-b">
            <div className="relative w-full aspect-[3/2]">
              <Image
                src={perfil.foto_url}
                alt="Logo da Empresa"
                fill
                sizes="256px"
                className="object-contain"
                priority
              />
            </div>
          </div>
        )}
        <NavMenu items={menuItems} />
      </aside>

      {/* Main Content */}
      <main
        className={`flex-1 mt-12 transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        <div className="h-[calc(100vh-3rem)] overflow-auto p-4">{children}</div>
      </main>
    </div>
  )
}
