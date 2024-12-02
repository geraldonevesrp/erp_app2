"use client"

import * as React from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface ExpandableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: React.ReactNode
  description?: string
  defaultExpanded?: boolean
  children: React.ReactNode
  actions?: React.ReactNode
}

export function ExpandableCard({ 
  title, 
  description,
  defaultExpanded = false,
  children,
  className,
  actions,
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
      <div className="flex items-center justify-between p-4">
        <div 
          className="flex-1 cursor-pointer select-none"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2">
            {title}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {actions}
          <ChevronDown
            className={cn(
              "h-5 w-5 transition-transform duration-200 cursor-pointer",
              isExpanded && "transform rotate-180"
            )}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        </div>
      </div>
      <div
        className={cn(
          "transition-all duration-200 ease-in-out",
          isExpanded ? "max-h-[2000px] pb-4" : "max-h-0 !overflow-hidden"
        )}
      >
        <div className="px-4 space-y-4">
          {children}
        </div>
      </div>
    </div>
  )
}
