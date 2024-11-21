import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
      <div className="max-w-2xl mx-auto px-4 text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
          ErpApp2 - Sistema ERP White Label
        </h1>
        <p className="text-lg text-muted-foreground">
          Sistema completo de gestão empresarial com módulos personalizáveis e interface moderna
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/erp"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-primary-foreground bg-primary rounded-lg shadow-lg hover:bg-primary/90 transition-colors"
          >
            Acessar ERP
          </Link>
          <Link
            href="/revendedores"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium bg-secondary text-secondary-foreground rounded-lg shadow hover:bg-secondary/80 transition-colors"
          >
            Área de Revendedores
          </Link>
        </div>
      </div>
    </div>
  )
}
