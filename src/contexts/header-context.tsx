"use client"

import React, { createContext, useContext, useState } from 'react'

interface HeaderContextData {
  title: string
  subtitle: string | null
  setTitle: (title: string) => void
  setSubtitle: (subtitle: string | null) => void
}

const HeaderContext = createContext<HeaderContextData>({} as HeaderContextData)

export function HeaderProvider({ children }: { children: React.ReactNode }) {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState<string | null>(null)

  return (
    <HeaderContext.Provider
      value={{
        title,
        subtitle,
        setTitle,
        setSubtitle
      }}
    >
      {children}
    </HeaderContext.Provider>
  )
}

export function useHeader() {
  const context = useContext(HeaderContext)
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider')
  }
  return context
}
