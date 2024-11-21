'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavMenuProps {
  items: {
    title: string
    items: {
      name: string
      href: string
    }[]
  }[]
}

export function NavMenu({ items }: NavMenuProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([])
  const pathname = usePathname()

  // Expandir automaticamente o menu pai da página atual
  React.useEffect(() => {
    const currentParent = items.find(item => 
      item.items.some(subItem => subItem.href === pathname)
    )
    if (currentParent?.title) {
      setExpandedItems([currentParent.title]) // Apenas o item atual
    }
  }, [pathname, items])

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <nav className="space-y-1">
      {items.map((item, index) => {
        const isExpanded = expandedItems.includes(item.title)
        const hasActiveChild = item.items.some(subItem => subItem.href === pathname)

        return (
          <div key={index} className="relative">
            <button
              onClick={() => toggleExpanded(item.title)}
              className={cn(
                'flex items-center justify-between w-full px-4 py-2 text-sm font-medium rounded-md transition-colors',
                'hover:bg-accent hover:text-accent-foreground',
                hasActiveChild && 'bg-accent/50 text-accent-foreground',
                isExpanded && 'bg-accent text-accent-foreground'
              )}
            >
              <span>{item.title}</span>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4" />
              </motion.div>
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="pt-1 pl-4">
                    {item.items.map((subItem, subIndex) => {
                      const isActive = pathname === subItem.href
                      return (
                        <Link
                          key={subIndex}
                          href={subItem.href}
                          className={cn(
                            'flex items-center group px-4 py-2 text-sm rounded-md transition-colors',
                            'hover:bg-accent hover:text-accent-foreground',
                            isActive && 'bg-accent text-accent-foreground font-medium'
                          )}
                        >
                          <span>{subItem.name}</span>
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )
      })}
    </nav>
  )
}
