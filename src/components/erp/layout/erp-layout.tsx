"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase'
import { ErpHeader } from './erp-header'
import { ErpSidebar } from './erp-sidebar'
import { cn } from '@/lib/utils'

interface MenuItem {
  name: string
  href: string
  disabled?: boolean
}

interface MenuGroup {
  title: string
  items: MenuItem[]
}

interface ErpLayoutProps {
  children: React.ReactNode
  menuItems: MenuGroup[]
}

export function ErpLayout({ children, menuItems }: ErpLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(true)
  const { supabase } = useSupabase()
  const router = useRouter()

  // Inicializa o menu fechado em dispositivos móveis
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 768
      setIsMenuOpen(!isMobile)
    }

    handleResize() // Inicializa
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  return (
    <div className={cn(
      "flex h-screen overflow-hidden transition-[padding] duration-300",
      isMenuOpen ? "md:pl-64" : "md:pl-0"
    )}>
      {/* Sidebar */}
      <ErpSidebar
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        menuItems={menuItems}
        onLogout={handleLogout}
      />

      {/* Conteúdo Principal */}
      <div className="flex-1 flex flex-col min-h-0">
        <ErpHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
