'use client'

export default function ClientesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Testes do Asaas</h2>
          <p className="text-muted-foreground">
            Área de testes das integrações com o Asaas
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}
