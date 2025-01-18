'use client'

import { useRevendaPerfil } from '@/contexts/revendas/perfil'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function PublicHome() {
  const { perfil } = useRevendaPerfil()

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <section className="bg-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold mb-4">
            {perfil?.nome_completo || 'Bem-vindo ao nosso ERP'}
          </h1>
          <p className="text-lg mb-8">
            Sistema completo de gestão empresarial para sua empresa
          </p>
          <Button asChild>
            <Link href="/public/inscricao-erp" className="bg-white text-indigo-600 hover:bg-gray-100">
              Começar Agora
            </Link>
          </Button>
        </div>
      </section>

      {/* Recursos */}
      <section id="recursos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos Principais</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Gestão Financeira</h3>
              <p className="text-gray-600">
                Controle completo de contas a pagar, receber, fluxo de caixa e DRE
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Controle de Estoque</h3>
              <p className="text-gray-600">
                Gestão de produtos, movimentações e inventário em tempo real
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Vendas e NFe</h3>
              <p className="text-gray-600">
                PDV completo com emissão de notas fiscais integrada
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Preços */}
      <section id="precos" className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Planos Disponíveis</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Básico</h3>
              <p className="text-3xl font-bold mb-4">R$ 99/mês</p>
              <ul className="space-y-2 mb-6">
                <li>✓ Gestão Financeira</li>
                <li>✓ Controle de Estoque</li>
                <li>✓ 1 Usuário</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/public/inscricao-erp?plano=basico">
                  Escolher Plano
                </Link>
              </Button>
            </Card>
            <Card className="p-6 border-indigo-500 border-2">
              <h3 className="text-xl font-semibold mb-2">Profissional</h3>
              <p className="text-3xl font-bold mb-4">R$ 199/mês</p>
              <ul className="space-y-2 mb-6">
                <li>✓ Tudo do Básico</li>
                <li>✓ Emissão de NFe</li>
                <li>✓ 3 Usuários</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/public/inscricao-erp?plano=profissional">
                  Escolher Plano
                </Link>
              </Button>
            </Card>
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-2">Enterprise</h3>
              <p className="text-3xl font-bold mb-4">R$ 299/mês</p>
              <ul className="space-y-2 mb-6">
                <li>✓ Tudo do Profissional</li>
                <li>✓ Múltiplas Empresas</li>
                <li>✓ Usuários Ilimitados</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/public/inscricao-erp?plano=enterprise">
                  Escolher Plano
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Contato */}
      <section id="contato" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-8">Entre em Contato</h2>
          <p className="text-lg mb-8">
            Tire suas dúvidas e comece a usar o melhor ERP para sua empresa
          </p>
          {perfil?.celular && (
            <p className="text-xl font-semibold mb-4">
              Telefone: {perfil.celular}
            </p>
          )}
          {perfil?.email && (
            <p className="text-xl font-semibold">
              Email: {perfil.email}
            </p>
          )}
        </div>
      </section>
    </div>
  )
} 