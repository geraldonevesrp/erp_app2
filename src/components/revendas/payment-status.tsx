import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Clock, AlertCircle, Ban } from "lucide-react"

interface PaymentStatusProps {
  status?: string
  valor?: number
  dueDate?: string
  paymentLink?: string
}

const statusConfig = {
  PENDING: {
    label: 'Pendente',
    color: 'bg-yellow-500',
    icon: Clock
  },
  RECEIVED: {
    label: 'Pago',
    color: 'bg-green-500',
    icon: CheckCircle2
  },
  OVERDUE: {
    label: 'Vencido',
    color: 'bg-red-500',
    icon: AlertCircle
  },
  CANCELLED: {
    label: 'Cancelado',
    color: 'bg-gray-500',
    icon: Ban
  }
}

export function PaymentStatus({ status = 'PENDING', valor, dueDate, paymentLink }: PaymentStatusProps) {
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className={`h-5 w-5 ${config.color} text-white rounded-full p-1`} />
          <span className="font-medium">{config.label}</span>
        </div>
        <Badge variant={status === 'RECEIVED' ? 'default' : 'secondary'}>
          R$ {valor?.toFixed(2)}
        </Badge>
      </div>

      {dueDate && (
        <div className="text-sm text-muted-foreground">
          Vencimento: {new Date(dueDate).toLocaleDateString('pt-BR')}
        </div>
      )}

      {paymentLink && status !== 'RECEIVED' && (
        <a
          href={paymentLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline block mt-2"
        >
          Visualizar Boleto/Pagar
        </a>
      )}
    </Card>
  )
}
