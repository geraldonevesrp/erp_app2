"use client"

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { usePerfil } from '@/contexts/perfil'
import { UserCircle } from 'lucide-react'

interface MenuItem {
  name: string
  href: string
  disabled?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface ErpSidebarProps {
  isOpen: boolean
  onClose: () => void
  menuItems: MenuGroup[]
}

export function ErpSidebar({ isOpen, onClose, menuItems }: ErpSidebarProps) {
  const pathname = usePathname()
  const { perfilPublico } = usePerfil()

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
        <div className="flex flex-col items-center justify-center py-6 border-b w-full px-4">
          {perfilPublico?.foto_url ? (
            <div className="relative w-full h-[70px]">
              <Image
                src={perfilPublico.foto_url}
                alt="Logo"
                fill
                className="object-contain dark:invert"
                priority
              />
            </div>
          ) : (
            <div className="w-full h-[70px] bg-muted flex items-center justify-center rounded">
              <UserCircle className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          {perfilPublico?.apelido && (
            <span className="mt-3 text-sm font-medium text-muted-foreground">
              {perfilPublico.apelido}
            </span>
          )}
        </div>

        {/* Menu de Navegação */}
        <nav className="flex-1 overflow-y-auto p-4">
          {menuItems.map((group, groupIndex) => (
            <div key={groupIndex} className="mb-6">
              <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
                {group.title}
              </h2>
              <div className="space-y-1">
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
          ))}
        </nav>
      </aside>
    </>
  )
}
