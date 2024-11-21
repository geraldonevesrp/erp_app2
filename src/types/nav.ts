export interface NavItem {
  name: string
  href: string
}

export interface NavMenuItem {
  title: string
  items: NavItem[]
}
