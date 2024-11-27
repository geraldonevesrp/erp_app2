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
import { usePerfil } from '@/contexts/perfil'
import { useHeader } from "@/contexts/header-context"

interface ErpHeaderProps {
  isMenuOpen: boolean
  setIsMenuOpen: (isOpen: boolean) => void
  onLogout: () => void
}

export function ErpHeader({ isMenuOpen, setIsMenuOpen, onLogout }: ErpHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { perfil_user } = usePerfil()
  const { title, subtitle } = useHeader()

  const toggleMenu = () => {
    console.log('Toggle menu:', !isMenuOpen) // Debug
    setIsMenuOpen((prev) => !prev)
  }

  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between h-full px-8">
        {/* Botão do Menu */}
        <button
          onClick={toggleMenu}
          className="p-2 rounded-md hover:bg-accent"
          title={isMenuOpen ? "Fechar menu" : "Abrir menu"}
          aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
        >
          {isMenuOpen ? (
            <ChevronLeft className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>

        {/* Título e Subtítulo */}
        <div className={`flex flex-col h-full py-2 ${subtitle ? 'justify-between' : 'justify-center'}`}>
          <h1 className="text-xl font-semibold tracking-tight text-center">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground text-center">
              {subtitle}
            </p>
          )}
        </div>

        {/* Ações do Header */}
        <div className="flex items-center space-x-4">
          {/* Notificações */}
          <button className="p-2 rounded-md hover:bg-accent">
            <Bell className="w-5 h-5" />
          </button>

          {/* Tema */}
          <button
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            className="p-2 rounded-md hover:bg-accent"
          >
            {theme === "light" ? (
              <Moon className="w-5 h-5" />
            ) : (
              <Sun className="w-5 h-5" />
            )}
          </button>

          {/* Menu do Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={perfil_user?.foto_url || ""} alt={perfil_user?.apelido || ""} />
                  <AvatarFallback>{perfil_user?.apelido?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
