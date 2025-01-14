export default function InscricaoRevendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/30 via-background/90 to-secondary/30">
      <div className="container mx-auto py-8">
        {children}
      </div>
    </div>
  )
}
