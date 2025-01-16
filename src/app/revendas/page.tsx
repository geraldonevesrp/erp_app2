'use client'

import { Card } from '@/components/ui/card'
import { useEffect, useState } from 'react'

export default function RevendasPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null // Evita renderização no servidor
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Área do Revendedor</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Clientes</h2>
          <p className="text-muted-foreground">
            Gerencie seus clientes e leads.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Comissões</h2>
          <p className="text-muted-foreground">
            Acompanhe suas comissões e vendas.
          </p>
        </Card>

        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-2">Suporte</h2>
          <p className="text-muted-foreground">
            Acesse recursos de suporte e ajuda.
          </p>
        </Card>
      </div>
    </div>
  )
}
