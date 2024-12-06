"use client"

import { createContext, useContext } from "react"

interface MenuContextType {
  isMenuOpen: boolean
}

export const MenuContext = createContext<MenuContextType>({ isMenuOpen: true })

export function useMenu() {
  return useContext(MenuContext)
}
