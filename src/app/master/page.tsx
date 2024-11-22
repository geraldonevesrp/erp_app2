'use client'

import { Card } from '@/components/ui/card'
import { 
  Users, 
  Settings, 
  CreditCard, 
  BarChart3,
  Shield 
} from 'lucide-react'

export default function MasterPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Painel Administrativo</h1>
        <div className="flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full">
          <Shield className="w-4 h-4" />
          <span className="text-sm font-medium">Acesso Master</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Gestão de Perfis</h2>
              <p className="text-muted-foreground">
                Gerencie perfis e permissões do sistema.
              </p>
            </div>
            <Users className="w-6 h-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Configurações</h2>
              <p className="text-muted-foreground">
                Configure parâmetros do sistema.
              </p>
            </div>
            <Settings className="w-6 h-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Financeiro</h2>
              <p className="text-muted-foreground">
                Gerencie assinaturas e pagamentos.
              </p>
            </div>
            <CreditCard className="w-6 h-6 text-primary" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold mb-2">Métricas</h2>
              <p className="text-muted-foreground">
                Acompanhe indicadores do sistema.
              </p>
            </div>
            <BarChart3 className="w-6 h-6 text-primary" />
          </div>
        </Card>
      </div>
    </div>
  )
}
