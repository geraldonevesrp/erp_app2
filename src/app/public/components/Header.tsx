'use client'

import { useRevendaPerfil } from '@/contexts/revendas/perfil'
import Image from 'next/image'
import Link from 'next/link'

export function Header() {
  const { perfil } = useRevendaPerfil()

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              {perfil?.foto_url ? (
                <Image
                  src={perfil.foto_url}
                  alt={perfil.nome_completo || 'Logo'}
                  width={48}
                  height={48}
                  className="h-10 w-auto"
                />
              ) : (
                <h1 className="text-2xl font-bold text-indigo-600">{perfil?.apelido || 'ERP'}</h1>
              )}
            </div>
          </div>
          <div className="hidden md:flex md:space-x-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900">Home</Link>
            <Link href="#recursos" className="text-gray-500 hover:text-gray-900">Recursos</Link>
            <Link href="#precos" className="text-gray-500 hover:text-gray-900">Preços</Link>
            <Link href="#contato" className="text-gray-500 hover:text-gray-900">Contato</Link>
          </div>
        </nav>
      </div>
    </header>
  )
} 