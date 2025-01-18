'use client'

import { useRevendaPerfil } from '@/contexts/revendas/perfil'

export function Footer() {
  const { perfil } = useRevendaPerfil()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">{perfil?.nome_completo}</h3>
            {perfil?.fone && (
              <p className="mb-2">Fone: {perfil.fone}</p>
            )}
            {perfil?.celular && (
              <p className="mb-2">Celular: {perfil.celular}</p>
            )}
            {perfil?.email && (
              <p className="mb-2">Email: {perfil.email}</p>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li><a href="#recursos" className="hover:text-indigo-400">Recursos</a></li>
              <li><a href="#precos" className="hover:text-indigo-400">Preços</a></li>
              <li><a href="#contato" className="hover:text-indigo-400">Contato</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Endereço</h3>
            <p>Entre em contato para mais informações</p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p>&copy; {currentYear} {perfil?.apelido || 'ERP'}. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
} 