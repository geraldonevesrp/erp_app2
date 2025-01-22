import './global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Domínio Inválido',
  description: 'Esta página só pode ser acessada através de um subdomínio válido.',
}

export default function DominioInvalidoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
