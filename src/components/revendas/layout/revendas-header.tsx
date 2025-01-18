"use client"

import { Bell, Sun, Moon, User, LogOut, Settings, Menu, ChevronLeft } from 'lucide-react'
import { useTheme } from 'next-themes'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRevendaPerfil } from '@/contexts/revendas/perfil'

interface RevendasHeaderProps {
  onMenuClick: () => void
  onLogout: () => void
}

export function RevendasHeader({ onMenuClick, onLogout }: RevendasHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { perfil } = useRevendaPerfil()

  return (
    <header className="h-12 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-4">
        {/* Botão do Menu */}
        <button
          onClick={onMenuClick}
          className="p-2 rounded-md hover:bg-accent"
          title="Toggle menu"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Ações do Header */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="p-2 rounded-md hover:bg-accent">
            <Bell className="w-5 h-5" />
          </button>

          {/* Tema */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="p-2 rounded-md hover:bg-accent"
          >
            {theme === 'dark' ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative p-1 rounded-full hover:bg-accent">
                <Avatar className="w-8 h-8 border-2 border-border">
                  <AvatarImage src={perfil?.foto_url || undefined} />
                  <AvatarFallback className="font-medium">
                    {perfil?.apelido?.[0]?.toUpperCase() || '?'}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-3 py-2 bg-muted rounded-t-lg">
                <p className="text-sm font-medium">{perfil?.apelido || 'Usuário'}</p>
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
                <DropdownMenuItem onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
