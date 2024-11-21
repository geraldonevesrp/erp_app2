'use client'

import { Card, Title, Text } from '@tremor/react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { ArrowUpRight, ArrowDownRight, DollarSign, ShoppingCart, Users, Package } from 'lucide-react'

// Dados simulados
const salesData = [
  { month: 'Jan', vendas: 4000, pedidos: 2400 },
  { month: 'Fev', vendas: 3000, pedidos: 1398 },
  { month: 'Mar', vendas: 2000, pedidos: 9800 },
  { month: 'Abr', vendas: 2780, pedidos: 3908 },
  { month: 'Mai', vendas: 1890, pedidos: 4800 },
  { month: 'Jun', vendas: 2390, pedidos: 3800 }
]

const productData = [
  { name: 'Eletrônicos', value: 400 },
  { name: 'Móveis', value: 300 },
  { name: 'Roupas', value: 300 },
  { name: 'Acessórios', value: 200 }
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral do seu negócio</p>
      </div>

      {/* Cards de Métricas */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Text>Vendas Hoje</Text>
            <DollarSign className="h-4 w-4 text-green-500" />
          </div>
          <Title>R$ 12.450</Title>
          <div className="flex items-center text-xs text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+15% em relação a ontem</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Text>Pedidos Hoje</Text>
            <ShoppingCart className="h-4 w-4 text-blue-500" />
          </div>
          <Title>45</Title>
          <div className="flex items-center text-xs text-red-500">
            <ArrowDownRight className="h-4 w-4 mr-1" />
            <span>-5% em relação a ontem</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Text>Novos Clientes</Text>
            <Users className="h-4 w-4 text-purple-500" />
          </div>
          <Title>12</Title>
          <div className="flex items-center text-xs text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+20% em relação a ontem</span>
          </div>
        </Card>

        <Card className="space-y-2">
          <div className="flex items-center justify-between">
            <Text>Produtos Vendidos</Text>
            <Package className="h-4 w-4 text-orange-500" />
          </div>
          <Title>89</Title>
          <div className="flex items-center text-xs text-green-500">
            <ArrowUpRight className="h-4 w-4 mr-1" />
            <span>+10% em relação a ontem</span>
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <Title>Vendas vs Pedidos</Title>
          <Text>Comparativo dos últimos 6 meses</Text>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="vendas" fill="#0088FE" name="Vendas" />
                <Bar dataKey="pedidos" fill="#00C49F" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <Title>Vendas por Categoria</Title>
          <Text>Distribuição atual</Text>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={productData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="md:col-span-2">
          <Title>Tendência de Vendas</Title>
          <Text>Evolução diária</Text>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="vendas"
                  stroke="#0088FE"
                  name="Vendas"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}
