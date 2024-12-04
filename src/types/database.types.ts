export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      grupos: {
        Row: {
          created_at: string
          grupo: string | null
          id: number
          perfis_id: string | null
        }
        Insert: {
          created_at?: string
          grupo?: string | null
          id?: number
          perfis_id?: string | null
        }
        Update: {
          created_at?: string
          grupo?: string | null
          id?: number
          perfis_id?: string | null
        }
      }
      pessoas: {
        Row: {
          apelido: string | null
          created_at: string
          foto_url: string | null
          grupos_ids: number[] | null
          id: number
          nome_razao: string | null
          perfis_id: string | null
          subgrupos_ids: number[] | null
          tipo: string | null
        }
        Insert: {
          apelido?: string | null
          created_at?: string
          foto_url?: string | null
          grupos_ids?: number[] | null
          id?: number
          nome_razao?: string | null
          perfis_id?: string | null
          subgrupos_ids?: number[] | null
          tipo?: string | null
        }
        Update: {
          apelido?: string | null
          created_at?: string
          foto_url?: string | null
          grupos_ids?: number[] | null
          id?: number
          nome_razao?: string | null
          perfis_id?: string | null
          subgrupos_ids?: number[] | null
          tipo?: string | null
        }
      }
      pessoas_contatos: {
        Row: {
          created_at: string
          email: string | null
          id: number
          nome: string | null
          pessoas_id: number | null
          principal: boolean | null
          setor: string | null
          telefone: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id?: number
          nome?: string | null
          pessoas_id?: number | null
          principal?: boolean | null
          setor?: string | null
          telefone?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: number
          nome?: string | null
          pessoas_id?: number | null
          principal?: boolean | null
          setor?: string | null
          telefone?: string | null
          tipo?: string | null
        }
      }
      pessoas_telefones: {
        Row: {
          created_at: string
          id: number
          pessoas_id: number | null
          principal: boolean | null
          telefone: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          pessoas_id?: number | null
          principal?: boolean | null
          telefone?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          pessoas_id?: number | null
          principal?: boolean | null
          telefone?: string | null
          tipo?: string | null
        }
      }
      sub_grupos: {
        Row: {
          created_at: string
          grupos_id: number | null
          id: number
          subgrupo: string | null
        }
        Insert: {
          created_at?: string
          grupos_id?: number | null
          id?: number
          subgrupo?: string | null
        }
        Update: {
          created_at?: string
          grupos_id?: number | null
          id?: number
          subgrupo?: string | null
        }
      }
    }
    Views: {
      v_pessoas: {
        Row: {
          apelido: string | null
          created_at: string | null
          foto_url: string | null
          grupos: string[] | null
          grupos_ids: number[] | null
          id: number | null
          nome_razao: string | null
          perfis_id: string | null
          subgrupos: string[] | null
          subgrupos_ids: number[] | null
          tipo: string | null
        }
      }
    }
  }
}
