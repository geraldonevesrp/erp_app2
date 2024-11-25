"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { usePerfil } from '@/contexts/perfil'
import { UserCircle, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'

interface MenuItem {
  name: string
  href: string
  disabled?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface MasterSidebarProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuGroup[]
}

export function MasterSidebar({ isOpen, onClose, menuItems }: MasterSidebarProps) {
  const pathname = usePathname()
  const { perfilPublico } = usePerfil()
  
  // Inicializa todos os grupos fechados
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({})

  // Define o estado inicial apenas uma vez na montagem do componente
  useEffect(() => {
    const initialState = menuItems.reduce((acc, group) => ({
      ...acc,
      [group.title]: group.items.some(item => pathname.startsWith(item.href))
    }), {})
    setExpandedGroups(initialState)
  }, [menuItems]) // Remove pathname da dependência

  const toggleGroup = (groupTitle: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupTitle]: !prev[groupTitle]
    }))
  }

  // Função para verificar se um grupo está ativo
  const isGroupActive = (group: MenuGroup) => {
    return group.items.some(item => pathname.startsWith(item.href))
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm md:hidden z-30"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:fixed top-0 left-0 h-screen w-64 bg-background border-r z-40",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo e Info do Perfil */}
        <div className="flex flex-col items-center justify-center py-6 border-b w-full px-2">
          {perfilPublico?.foto_url ? (
            <div className="relative w-full h-[120px]">
              <Image
                src={perfilPublico.foto_url}
                alt="Logo"
                fill
                className="object-contain dark:invert"
                priority
              />
            </div>
          ) : (
            <div className="w-full h-[120px] bg-muted flex items-center justify-center rounded">
              <UserCircle className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {perfilPublico?.apelido && (
            <span className="mt-3 text-sm font-medium text-muted-foreground">
              {perfilPublico.apelido}
            </span>
          )}
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 overflow-hidden p-4">
          <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-accent scrollbar-track-transparent pr-2">
            {menuItems.map((group, groupIndex) => {
              const active = isGroupActive(group)
              return (
                <div key={groupIndex} className="mb-6">
                  <button
                    onClick={() => toggleGroup(group.title)}
                    className={cn(
                      "flex items-center justify-between w-full mb-2 px-2 py-2 text-lg font-semibold tracking-tight rounded-md",
                      "hover:bg-accent hover:text-accent-foreground transition-colors",
                      active && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span>{group.title}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 transition-transform duration-200",
                        expandedGroups[group.title] ? "transform rotate-180" : ""
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      "space-y-1 overflow-hidden transition-all duration-200",
                      expandedGroups[group.title] ? "max-h-96" : "max-h-0"
                    )}
                  >
                    {group.items.map((item, itemIndex) => (
                      <Link
                        key={itemIndex}
                        href={item.disabled ? "#" : item.href}
                        className={cn(
                          "flex items-center px-2 py-2 text-sm rounded-md transition-colors",
                          pathname === item.href
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent hover:text-accent-foreground",
                          item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                        onClick={(e) => {
                          if (item.disabled) {
                            e.preventDefault()
                          } else if (window.innerWidth < 768) {
                            onClose()
                          }
                        }}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </nav>
      </aside>
    </>
  )
}
