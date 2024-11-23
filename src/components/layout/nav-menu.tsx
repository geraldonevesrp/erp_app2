"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useState } from "react"

interface NavMenuProps {
  items: {
    title: string
    items: {
      name: string
      href: string
      disabled?: boolean
    }[]
  }[]
}

export function NavMenu({ items }: NavMenuProps) {
  const pathname = usePathname()
  const [openSections, setOpenSections] = useState<string[]>(() => {
    // Inicializa com as seções que contêm a página atual
    return items
      .filter(section => section.items.some(item => pathname.startsWith(item.href)))
      .map(section => section.title)
  })

  const toggleSection = (title: string) => {
    setOpenSections((prev) =>
      prev.includes(title)
        ? prev.filter((t) => t !== title)
        : [...prev, title]
    )
  }

  return (
    <nav className="space-y-1">
      {items.map((section) => {
        const isOpen = openSections.includes(section.title)
        const hasActiveItem = section.items.some(item => pathname.startsWith(item.href))
        
        return (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className={cn(
                'flex w-full items-center justify-between px-2 py-2 text-sm font-medium rounded-md',
                'hover:bg-accent hover:text-accent-foreground',
                (isOpen || hasActiveItem) && 'bg-accent/50'
              )}
            >
              <span>{section.title}</span>
              <ChevronDown
                className={cn(
                  'h-4 w-4 transition-transform duration-200',
                  isOpen && 'transform rotate-180'
                )}
              />
            </button>
            {isOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col space-y-1 pt-1 px-2">
                  {section.items.map((item, index) => {
                    const isActive = pathname.startsWith(item.href)
                    return item.disabled ? (
                      <span
                        key={index}
                        className="cursor-not-allowed text-sm text-muted-foreground/70 hover:text-muted-foreground px-4 py-2 rounded-md"
                        title="Em desenvolvimento"
                      >
                        {item.name}
                      </span>
                    ) : (
                      <Link
                        key={index}
                        href={item.href}
                        className={cn(
                          'flex items-center px-4 py-2 text-sm rounded-md transition-colors',
                          'hover:bg-accent hover:text-accent-foreground',
                          isActive && 'bg-accent text-accent-foreground font-medium'
                        )}
                      >
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              </motion.div>
            )}
          </div>
        )
      })}
    </nav>
  )
}
