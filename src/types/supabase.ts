import { Database as DatabaseGenerated } from './database.types'

export interface Database {
  public: {
    Tables: {
      perfis: {
        Row: {
          id: string
          created_at: string
          foto_url: string | null
          apelido: string | null
          dominio: string | null
          tipo: number | null
          nome_completo: string | null
          user_id: string | null
          revenda_id: string | null
          cpf_cnpj: string | null
          fone: string | null
          celular: string | null
          wathsapp: string | null
          revenda_status: number | null
          email: string | null
          nascimento: string | null
          faturamento: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          foto_url?: string | null
          apelido?: string | null
          dominio?: string | null
          tipo?: number | null
          nome_completo?: string | null
          user_id?: string | null
          revenda_id?: string | null
          cpf_cnpj?: string | null
          fone?: string | null
          celular?: string | null
          wathsapp?: string | null
          revenda_status?: number | null
          email?: string | null
          nascimento?: string | null
          faturamento?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          foto_url?: string | null
          apelido?: string | null
          dominio?: string | null
          tipo?: number | null
          nome_completo?: string | null
          user_id?: string | null
          revenda_id?: string | null
          cpf_cnpj?: string | null
          fone?: string | null
          celular?: string | null
          wathsapp?: string | null
          revenda_status?: number | null
          email?: string | null
          nascimento?: string | null
          faturamento?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_revenda_id_fkey"
            columns: ["revenda_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_tipo_fkey"
            columns: ["tipo"]
            isOneToOne: false
            referencedRelation: "perfis_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "perfis_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    } & DatabaseGenerated['public']['Tables']
    Views: DatabaseGenerated['public']['Views']
    Functions: DatabaseGenerated['public']['Functions']
    Enums: DatabaseGenerated['public']['Enums']
  }
}
