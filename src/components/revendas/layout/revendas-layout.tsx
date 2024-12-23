"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSupabase } from '@/contexts/supabase'
import { RevendasHeader } from './revendas-header'
import { RevendasSidebar } from './revendas-sidebar'
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

interface RevendasLayoutProps {
  children: React.ReactNode
  menuItems: MenuGroup[]
}

export function RevendasLayout({ children, menuItems }: RevendasLayoutProps) {
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
      <RevendasSidebar
        isOpen={isMenuOpen}
        menuItems={menuItems}
        onClose={() => setIsMenuOpen(false)}
      />

      {/* Conteúdo Principal */}
      <div className="flex flex-col flex-1 h-full overflow-hidden w-full">
        <RevendasHeader
          isMenuOpen={isMenuOpen}
          setIsMenuOpen={setIsMenuOpen}
          onLogout={handleLogout}
        />
        <main className="flex-1 p-4 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
