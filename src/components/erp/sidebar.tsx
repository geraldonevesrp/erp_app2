'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Users,
  Package,
  Settings,
  Building2,
  Boxes,
  ShoppingCart,
  FileText,
  Wrench,
  Wallet,
  Receipt,
  ChevronDown,
  ChevronRight
} from 'lucide-react'

interface MenuItem {
  label: string
  icon?: any
  href?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    children: [
      {
        label: 'Geral',
        icon: LayoutDashboard,
        href: '/erp/dashboard'
      }
    ]
  },
  {
    label: 'Cadastros',
    icon: Building2,
    children: [
      {
        label: 'Pessoas',
        icon: Users,
        href: '/erp/pessoas'
      },
      {
        label: 'Produtos',
        icon: Package,
        href: '/erp/produtos'
      }
    ]
  },
  {
    label: 'Estoque',
    icon: Boxes,
    children: [
      {
        label: 'Movimentações',
        icon: Boxes,
        href: '/erp/estoque'
      },
      {
        label: 'Inventário',
        icon: FileText,
        href: '/erp/estoque/inventario'
      }
    ]
  },
  {
    label: 'Vendas',
    icon: ShoppingCart,
    children: [
      {
        label: 'Pedidos',
        icon: ShoppingCart,
        href: '/erp/vendas'
      },
      {
        label: 'Orçamentos',
        icon: FileText,
        href: '/erp/vendas/orcamentos'
      }
    ]
  },
  {
    label: 'Compras',
    icon: Receipt,
    children: [
      {
        label: 'Pedidos',
        icon: Receipt,
        href: '/erp/compras'
      },
      {
        label: 'Cotações',
        icon: FileText,
        href: '/erp/compras/cotacoes'
      }
    ]
  },
  {
    label: 'Serviços',
    icon: Wrench,
    children: [
      {
        label: 'Ordens de Serviço',
        icon: Wrench,
        href: '/erp/servicos'
      },
      {
        label: 'Agendamentos',
        icon: FileText,
        href: '/erp/servicos/agendamentos'
      }
    ]
  },
  {
    label: 'Fiscal',
    icon: FileText,
    children: [
      {
        label: 'Notas Fiscais',
        icon: FileText,
        href: '/erp/fiscal'
      },
      {
        label: 'Relatórios',
        icon: FileText,
        href: '/erp/fiscal/relatorios'
      }
    ]
  },
  {
    label: 'Financeiro',
    icon: Wallet,
    children: [
      {
        label: 'Contas a Receber',
        icon: Wallet,
        href: '/erp/financeiro/receber'
      },
      {
        label: 'Contas a Pagar',
        icon: Wallet,
        href: '/erp/financeiro/pagar'
      },
      {
        label: 'Fluxo de Caixa',
        icon: FileText,
        href: '/erp/financeiro/fluxo'
      }
    ]
  },
  {
    label: 'Configurações',
    icon: Settings,
    children: [
      {
        label: 'Geral',
        icon: Settings,
        href: '/erp/configuracoes'
      },
      {
        label: 'Usuários',
        icon: Users,
        href: '/erp/configuracoes/usuarios'
      },
      {
        label: 'Empresa',
        icon: Building2,
        href: '/erp/configuracoes/empresa'
      }
    ]
  }
]

export function Sidebar() {
  const [expandedMenus, setExpandedMenus] = React.useState<string[]>([])
  const pathname = usePathname()

  // Expandir automaticamente o menu pai da página atual
  React.useEffect(() => {
    const currentMenuItem = menuItems.find(item => 
      item.children?.some(child => child.href === pathname)
    )
    if (currentMenuItem?.label) {
      setExpandedMenus(prev => 
        prev.includes(currentMenuItem.label) 
          ? prev 
          : [...prev, currentMenuItem.label]
      )
    }
  }, [pathname])

  const toggleExpanded = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    )
  }

  const renderMenuItem = (item: MenuItem, index: number) => {
    const Icon = item.icon
    const isExpanded = expandedMenus.includes(item.label)
    const isActive = pathname === item.href
    const hasChildren = item.children && item.children.length > 0
    const isActiveParent = hasChildren && item.children?.some(child => child.href === pathname)

    return (
      <div key={index} className="w-full">
        {item.href && !hasChildren ? (
          <Link
            href={item.href}
            className={cn(
              'flex items-center w-full p-2 text-sm rounded-md hover:bg-accent/50 transition-colors',
              isActive && 'bg-accent text-accent-foreground font-medium'
            )}
          >
            {Icon && <Icon className="h-4 w-4 mr-2" />}
            <span>{item.label}</span>
          </Link>
        ) : (
          <>
            <button
              onClick={() => toggleExpanded(item.label)}
              className={cn(
                'flex items-center justify-between w-full p-2 text-sm rounded-md hover:bg-accent/50 transition-colors',
                isActiveParent && 'bg-accent text-accent-foreground font-medium'
              )}
            >
              <div className="flex items-center">
                {Icon && <Icon className="h-4 w-4 mr-2" />}
                <span>{item.label}</span>
              </div>
              {hasChildren && (
                isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
              )}
            </button>
            {hasChildren && isExpanded && (
              <div className="ml-4 mt-1 space-y-1">
                {item.children?.map((child, childIndex) => renderMenuItem(child, childIndex))}
              </div>
            )}
          </>
        )}
      </div>
    )
  }

  return (
    <div className="h-screen w-64 border-r bg-background p-4 space-y-2">
      <div className="font-semibold text-lg mb-4">ERP System</div>
      <nav className="space-y-2">
        {menuItems.map((item, index) => renderMenuItem(item, index))}
      </nav>
    </div>
  )
}
