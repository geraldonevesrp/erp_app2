export interface Theme {
  id: string
  created_at: string
  updated_at: string
  name: string
  perfil_id: string
  dark: Record<string, any>
  light: Record<string, any>
}
