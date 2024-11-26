"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  icon?: React.ReactNode
  defaultExpanded?: boolean
  children: React.ReactNode
}

export function ExpandableCard({ 
  title, 
  icon, 
  defaultExpanded = false,
  children,
  className,
  ...props 
}: ExpandableCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded)

  return (
    <div
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm",
        className
      )}
      {...props}
    >
      <div
        className="flex items-center justify-between p-4 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {icon}
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-200",
            isExpanded && "transform rotate-180"
          )}
        />
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-[2000px] pb-4" : "max-h-0"
        )}
      >
        <div className="px-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}
