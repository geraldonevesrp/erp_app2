import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRevendaPerfil } from "@/contexts/revendas/perfil"

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Vendas do Mês</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Clientes Ativos</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comissões Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">R$ 0,00</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 