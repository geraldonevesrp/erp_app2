export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      api_config: {
        Row: {
          key: string
          value: string
        }
        Insert: {
          key: string
          value: string
        }
        Update: {
          key?: string
          value?: string
        }
        Relationships: []
      }
      asaas_clientes: {
        Row: {
          additionalemails: string | null
          address: string
          addressnumber: string
          asaas_contas_id: number | null
          asaas_id: string
          candelete: boolean
          canedit: boolean
          cannotbedeletedreason: string | null
          cannoteditreason: string | null
          city: string
          cityname: string
          company: string
          complement: string | null
          country: string
          cpfcnpj: string
          datecreated: string
          deleted: boolean
          email: string
          empresas_id: number | null
          externalreference: string | null
          id: number
          mobilephone: string | null
          municipalinscription: string | null
          name: string
          notificationdisabled: boolean
          object: string
          observations: string | null
          perfis_id: string | null
          persontype: string
          pessoas_id: number | null
          phone: string | null
          postalcode: string
          province: string
          state: string
          stateinscription: string | null
        }
        Insert: {
          additionalemails?: string | null
          address: string
          addressnumber: string
          asaas_contas_id?: number | null
          asaas_id: string
          candelete: boolean
          canedit: boolean
          cannotbedeletedreason?: string | null
          cannoteditreason?: string | null
          city: string
          cityname: string
          company: string
          complement?: string | null
          country: string
          cpfcnpj: string
          datecreated: string
          deleted: boolean
          email: string
          empresas_id?: number | null
          externalreference?: string | null
          id?: number
          mobilephone?: string | null
          municipalinscription?: string | null
          name: string
          notificationdisabled: boolean
          object: string
          observations?: string | null
          perfis_id?: string | null
          persontype: string
          pessoas_id?: number | null
          phone?: string | null
          postalcode: string
          province: string
          state: string
          stateinscription?: string | null
        }
        Update: {
          additionalemails?: string | null
          address?: string
          addressnumber?: string
          asaas_contas_id?: number | null
          asaas_id?: string
          candelete?: boolean
          canedit?: boolean
          cannotbedeletedreason?: string | null
          cannoteditreason?: string | null
          city?: string
          cityname?: string
          company?: string
          complement?: string | null
          country?: string
          cpfcnpj?: string
          datecreated?: string
          deleted?: boolean
          email?: string
          empresas_id?: number | null
          externalreference?: string | null
          id?: number
          mobilephone?: string | null
          municipalinscription?: string | null
          name?: string
          notificationdisabled?: boolean
          object?: string
          observations?: string | null
          perfis_id?: string | null
          persontype?: string
          pessoas_id?: number | null
          phone?: string | null
          postalcode?: string
          province?: string
          state?: string
          stateinscription?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "asaas_clientes_asaas_contas_id_fkey"
            columns: ["asaas_contas_id"]
            isOneToOne: false
            referencedRelation: "asaas_contas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asaas_clientes_empresas_id_fkey"
            columns: ["empresas_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asaas_clientes_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asaas_clientes_pessoas_id_fkey"
            columns: ["pessoas_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "asaas_clientes_pessoas_id_fkey"
            columns: ["pessoas_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      asaas_contas: {
        Row: {
          account_number: Json
          address: string
          address_number: string
          api_key: string
          asaas_id: string
          birth_date: string | null
          city: number
          commercial_info_expiration: string | null
          company_type: string | null
          complement: string | null
          country: string
          cpf_cnpj: string
          email: string
          id: number
          income_range: string | null
          income_value: number
          login_email: string
          mobile_phone: string
          name: string
          object: string
          perfis_id: string | null
          person_type: string
          phone: string | null
          postal_code: string
          province: string
          site: string | null
          state: string
          wallet_id: string
        }
        Insert: {
          account_number: Json
          address: string
          address_number: string
          api_key: string
          asaas_id?: string
          birth_date?: string | null
          city: number
          commercial_info_expiration?: string | null
          company_type?: string | null
          complement?: string | null
          country: string
          cpf_cnpj: string
          email: string
          id?: number
          income_range?: string | null
          income_value: number
          login_email: string
          mobile_phone: string
          name: string
          object?: string
          perfis_id?: string | null
          person_type: string
          phone?: string | null
          postal_code: string
          province: string
          site?: string | null
          state: string
          wallet_id?: string
        }
        Update: {
          account_number?: Json
          address?: string
          address_number?: string
          api_key?: string
          asaas_id?: string
          birth_date?: string | null
          city?: number
          commercial_info_expiration?: string | null
          company_type?: string | null
          complement?: string | null
          country?: string
          cpf_cnpj?: string
          email?: string
          id?: number
          income_range?: string | null
          income_value?: number
          login_email?: string
          mobile_phone?: string
          name?: string
          object?: string
          perfis_id?: string | null
          person_type?: string
          phone?: string | null
          postal_code?: string
          province?: string
          site?: string | null
          state?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "asaas_contas_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      asaas_webhooks: {
        Row: {
          asaas_event: string | null
          asaas_id: string | null
          asaas_json: Json | null
          created_at: string
          id: number
        }
        Insert: {
          asaas_event?: string | null
          asaas_id?: string | null
          asaas_json?: Json | null
          created_at?: string
          id?: number
        }
        Update: {
          asaas_event?: string | null
          asaas_id?: string | null
          asaas_json?: Json | null
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      assinaturas_planos: {
        Row: {
          created_at: string
          descricao: string | null
          id: number
          mensalidade: number | null
          nome: string | null
          perfis_id: string | null
        }
        Insert: {
          created_at?: string
          descricao?: string | null
          id?: number
          mensalidade?: number | null
          nome?: string | null
          perfis_id?: string | null
        }
        Update: {
          created_at?: string
          descricao?: string | null
          id?: number
          mensalidade?: number | null
          nome?: string | null
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_planos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas: {
        Row: {
          asaas: Json | null
          cedente_perfil_id: string | null
          cedente_pessoa_id: number | null
          cobrancas_tipos_id: number | null
          created_at: string
          erp_assinaturas_id: number | null
          id: number
          paga: boolean | null
          pago_em: string | null
          sacado_empresa_id: number | null
          sacado_perfil_id: string | null
          valor: number | null
          vencimento: string | null
        }
        Insert: {
          asaas?: Json | null
          cedente_perfil_id?: string | null
          cedente_pessoa_id?: number | null
          cobrancas_tipos_id?: number | null
          created_at?: string
          erp_assinaturas_id?: number | null
          id?: number
          paga?: boolean | null
          pago_em?: string | null
          sacado_empresa_id?: number | null
          sacado_perfil_id?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Update: {
          asaas?: Json | null
          cedente_perfil_id?: string | null
          cedente_pessoa_id?: number | null
          cobrancas_tipos_id?: number | null
          created_at?: string
          erp_assinaturas_id?: number | null
          id?: number
          paga?: boolean | null
          pago_em?: string | null
          sacado_empresa_id?: number | null
          sacado_perfil_id?: string | null
          valor?: number | null
          vencimento?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "cobrancas_cedente_perfil_id_fkey"
            columns: ["cedente_perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cedente_pessoa_id_fkey"
            columns: ["cedente_pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cedente_pessoa_id_fkey"
            columns: ["cedente_pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_cobrancas_tipos_id_fkey"
            columns: ["cobrancas_tipos_id"]
            isOneToOne: false
            referencedRelation: "cobrancas_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_erp_assinaturas_id_fkey"
            columns: ["erp_assinaturas_id"]
            isOneToOne: false
            referencedRelation: "erp_assinaturas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_sacado_empresa_id_fkey"
            columns: ["sacado_empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cobrancas_sacado_perfil_id_fkey"
            columns: ["sacado_perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      cobrancas_tipos: {
        Row: {
          id: number
          tipo: string | null
        }
        Insert: {
          id?: number
          tipo?: string | null
        }
        Update: {
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      compras: {
        Row: {
          created_at: string
          data: string | null
          deposito_id: number | null
          empresa_id: number | null
          fornecedor_id: number | null
          fornecedor_num_pedido: string | null
          fornecedor_numero_nf: string | null
          id: number
          numero: number
          orcamento_prazo_ate: string | null
          perfis_id: string
          status_id: number | null
        }
        Insert: {
          created_at?: string
          data?: string | null
          deposito_id?: number | null
          empresa_id?: number | null
          fornecedor_id?: number | null
          fornecedor_num_pedido?: string | null
          fornecedor_numero_nf?: string | null
          id?: number
          numero: number
          orcamento_prazo_ate?: string | null
          perfis_id: string
          status_id?: number | null
        }
        Update: {
          created_at?: string
          data?: string | null
          deposito_id?: number | null
          empresa_id?: number | null
          fornecedor_id?: number | null
          fornecedor_num_pedido?: string | null
          fornecedor_numero_nf?: string | null
          id?: number
          numero?: number
          orcamento_prazo_ate?: string | null
          perfis_id?: string
          status_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_deposito_id_fkey"
            columns: ["deposito_id"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_itens: {
        Row: {
          compras_id: number | null
          created_at: string
          despesas: number | null
          fator_conversao: number | null
          frete: number | null
          id: number
          produto_id: number | null
          qt: number | null
          qt_itens: number | null
          total: number | null
          unidade: string | null
          unitario: number | null
        }
        Insert: {
          compras_id?: number | null
          created_at?: string
          despesas?: number | null
          fator_conversao?: number | null
          frete?: number | null
          id?: number
          produto_id?: number | null
          qt?: number | null
          qt_itens?: number | null
          total?: number | null
          unidade?: string | null
          unitario?: number | null
        }
        Update: {
          compras_id?: number | null
          created_at?: string
          despesas?: number | null
          fator_conversao?: number | null
          frete?: number | null
          id?: number
          produto_id?: number | null
          qt?: number | null
          qt_itens?: number | null
          total?: number | null
          unidade?: string | null
          unitario?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_compras_id_fkey"
            columns: ["compras_id"]
            isOneToOne: false
            referencedRelation: "compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_compras_id_fkey"
            columns: ["compras_id"]
            isOneToOne: false
            referencedRelation: "v_compras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      compras_itens_depositos: {
        Row: {
          compras_itens_id: number | null
          created_at: string
          depositos_id: number | null
          fator_conversao: number | null
          id: number
          qt: number | null
          qt_itens: number | null
          unidade: string | null
        }
        Insert: {
          compras_itens_id?: number | null
          created_at?: string
          depositos_id?: number | null
          fator_conversao?: number | null
          id?: number
          qt?: number | null
          qt_itens?: number | null
          unidade?: string | null
        }
        Update: {
          compras_itens_id?: number | null
          created_at?: string
          depositos_id?: number | null
          fator_conversao?: number | null
          id?: number
          qt?: number | null
          qt_itens?: number | null
          unidade?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_itens_depositos_Compras_itens_id_fkey"
            columns: ["compras_itens_id"]
            isOneToOne: false
            referencedRelation: "compras_itens"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_itens_depositos_depositos_id_fkey"
            columns: ["depositos_id"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id"]
          },
        ]
      }
      compras_status: {
        Row: {
          id: number
          status: string | null
        }
        Insert: {
          id?: number
          status?: string | null
        }
        Update: {
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      depositos: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          perfis_id: string
          principal: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          perfis_id?: string
          principal?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          perfis_id?: string
          principal?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "depositos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      depositos_emp_prod: {
        Row: {
          created_at: string
          depositos_id: number | null
          empresas_id: number | null
          estoque_minimo: number | null
          id: number
          local_estoque: string | null
          produtos_id: number | null
          qt_reservada: number | null
          quantidade: number | null
        }
        Insert: {
          created_at?: string
          depositos_id?: number | null
          empresas_id?: number | null
          estoque_minimo?: number | null
          id?: number
          local_estoque?: string | null
          produtos_id?: number | null
          qt_reservada?: number | null
          quantidade?: number | null
        }
        Update: {
          created_at?: string
          depositos_id?: number | null
          empresas_id?: number | null
          estoque_minimo?: number | null
          id?: number
          local_estoque?: string | null
          produtos_id?: number | null
          qt_reservada?: number | null
          quantidade?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "depositos_empresa_produtos_empresas_id_fkey"
            columns: ["empresas_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_depositos_id_fkey"
            columns: ["depositos_id"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      empresa_asaas: {
        Row: {
          accountnumber: Json | null
          address: string | null
          addressnumber: string | null
          apikey: string | null
          birthdate: string | null
          city: string | null
          commercialInfoexpiration: string | null
          companytype: string | null
          complement: string | null
          country: string | null
          cpfcnpj: string | null
          created_at: string
          email: string | null
          empresas_id: number | null
          id: number
          id_asaas: string | null
          incomerange: string | null
          incomevalue: number | null
          loginemail: string | null
          mobilephone: string | null
          nome: string | null
          persontype: string | null
          phone: string | null
          postalcode: string | null
          province: string | null
          site: string | null
          state: string | null
          walletid: string | null
        }
        Insert: {
          accountnumber?: Json | null
          address?: string | null
          addressnumber?: string | null
          apikey?: string | null
          birthdate?: string | null
          city?: string | null
          commercialInfoexpiration?: string | null
          companytype?: string | null
          complement?: string | null
          country?: string | null
          cpfcnpj?: string | null
          created_at?: string
          email?: string | null
          empresas_id?: number | null
          id?: number
          id_asaas?: string | null
          incomerange?: string | null
          incomevalue?: number | null
          loginemail?: string | null
          mobilephone?: string | null
          nome?: string | null
          persontype?: string | null
          phone?: string | null
          postalcode?: string | null
          province?: string | null
          site?: string | null
          state?: string | null
          walletid?: string | null
        }
        Update: {
          accountnumber?: Json | null
          address?: string | null
          addressnumber?: string | null
          apikey?: string | null
          birthdate?: string | null
          city?: string | null
          commercialInfoexpiration?: string | null
          companytype?: string | null
          complement?: string | null
          country?: string | null
          cpfcnpj?: string | null
          created_at?: string
          email?: string | null
          empresas_id?: number | null
          id?: number
          id_asaas?: string | null
          incomerange?: string | null
          incomevalue?: number | null
          loginemail?: string | null
          mobilephone?: string | null
          nome?: string | null
          persontype?: string | null
          phone?: string | null
          postalcode?: string | null
          province?: string | null
          site?: string | null
          state?: string | null
          walletid?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresa_asaas_empresas_id_fkey"
            columns: ["empresas_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      empresas: {
        Row: {
          bairro: string | null
          beneficio_fiscal_icms: boolean | null
          bficms_observacoes: string | null
          boleto_multa_padrao: number | null
          boletos_juros_mensais: number | null
          capital_social: number | null
          celular: string | null
          cep: string | null
          cnae: string | null
          cnpj: string | null
          cnpj_raiz: string | null
          cob_juros_mensais: number | null
          cob_juros_modo: number | null
          cod_municipio: string | null
          cod_uf: string | null
          complemento: string | null
          created_at: string | null
          email: string | null
          email_boletos: string | null
          email_compras: string | null
          email_nfe: string | null
          email_vendas: string | null
          endereco: string | null
          fantasia: string | null
          fis_regimes_tributarios_id: number | null
          fone: string | null
          id: number
          ie: string | null
          ie_st: string | null
          im: string | null
          logo_url: string | null
          logradouro: string | null
          municipio: string | null
          natureza_juridica_descricao: string | null
          natureza_juridica_id: string | null
          nome_email_boletos: string | null
          nome_email_compras: string | null
          nome_email_nfe: string | null
          nome_email_vendas: string | null
          numero: string | null
          observacoes: string | null
          padrao: boolean | null
          perfis_id: string | null
          porte_descricao: string | null
          porte_id: string | null
          qualificacao_do_responsavel_descricao: string | null
          qualificacao_do_responsavel_id: string | null
          razao_social: string | null
          registro_sif: boolean | null
          renda: number | null
          sif_numero: string | null
          st_observacoes: string | null
          st_ocorrencia_fiscal: string | null
          st_posto_fiscal: string | null
          subistituto_tributario: boolean | null
          uf: string | null
          whatsapp: string | null
        }
        Insert: {
          bairro?: string | null
          beneficio_fiscal_icms?: boolean | null
          bficms_observacoes?: string | null
          boleto_multa_padrao?: number | null
          boletos_juros_mensais?: number | null
          capital_social?: number | null
          celular?: string | null
          cep?: string | null
          cnae?: string | null
          cnpj?: string | null
          cnpj_raiz?: string | null
          cob_juros_mensais?: number | null
          cob_juros_modo?: number | null
          cod_municipio?: string | null
          cod_uf?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          email_boletos?: string | null
          email_compras?: string | null
          email_nfe?: string | null
          email_vendas?: string | null
          endereco?: string | null
          fantasia?: string | null
          fis_regimes_tributarios_id?: number | null
          fone?: string | null
          id?: number
          ie?: string | null
          ie_st?: string | null
          im?: string | null
          logo_url?: string | null
          logradouro?: string | null
          municipio?: string | null
          natureza_juridica_descricao?: string | null
          natureza_juridica_id?: string | null
          nome_email_boletos?: string | null
          nome_email_compras?: string | null
          nome_email_nfe?: string | null
          nome_email_vendas?: string | null
          numero?: string | null
          observacoes?: string | null
          padrao?: boolean | null
          perfis_id?: string | null
          porte_descricao?: string | null
          porte_id?: string | null
          qualificacao_do_responsavel_descricao?: string | null
          qualificacao_do_responsavel_id?: string | null
          razao_social?: string | null
          registro_sif?: boolean | null
          renda?: number | null
          sif_numero?: string | null
          st_observacoes?: string | null
          st_ocorrencia_fiscal?: string | null
          st_posto_fiscal?: string | null
          subistituto_tributario?: boolean | null
          uf?: string | null
          whatsapp?: string | null
        }
        Update: {
          bairro?: string | null
          beneficio_fiscal_icms?: boolean | null
          bficms_observacoes?: string | null
          boleto_multa_padrao?: number | null
          boletos_juros_mensais?: number | null
          capital_social?: number | null
          celular?: string | null
          cep?: string | null
          cnae?: string | null
          cnpj?: string | null
          cnpj_raiz?: string | null
          cob_juros_mensais?: number | null
          cob_juros_modo?: number | null
          cod_municipio?: string | null
          cod_uf?: string | null
          complemento?: string | null
          created_at?: string | null
          email?: string | null
          email_boletos?: string | null
          email_compras?: string | null
          email_nfe?: string | null
          email_vendas?: string | null
          endereco?: string | null
          fantasia?: string | null
          fis_regimes_tributarios_id?: number | null
          fone?: string | null
          id?: number
          ie?: string | null
          ie_st?: string | null
          im?: string | null
          logo_url?: string | null
          logradouro?: string | null
          municipio?: string | null
          natureza_juridica_descricao?: string | null
          natureza_juridica_id?: string | null
          nome_email_boletos?: string | null
          nome_email_compras?: string | null
          nome_email_nfe?: string | null
          nome_email_vendas?: string | null
          numero?: string | null
          observacoes?: string | null
          padrao?: boolean | null
          perfis_id?: string | null
          porte_descricao?: string | null
          porte_id?: string | null
          qualificacao_do_responsavel_descricao?: string | null
          qualificacao_do_responsavel_id?: string | null
          razao_social?: string | null
          registro_sif?: boolean | null
          renda?: number | null
          sif_numero?: string | null
          st_observacoes?: string | null
          st_ocorrencia_fiscal?: string | null
          st_posto_fiscal?: string | null
          subistituto_tributario?: boolean | null
          uf?: string | null
          whatsapp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "empresas_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      enderecos: {
        Row: {
          bairro: string | null
          cep: string | null
          complemento: string | null
          created_at: string
          ddd: string | null
          gia: string | null
          ibge: string | null
          id: number
          localidade: string | null
          logradouro: string | null
          numero: string | null
          perfil_id: string
          principal: boolean | null
          siafi: string | null
          titulo: string | null
          uf: string | null
          uf_cod: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          perfil_id?: string
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
          uf_cod?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          perfil_id?: string
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
          uf_cod?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "enderecos_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      erp_assinaturas: {
        Row: {
          asaas: Json | null
          assinaturas_planos_id: number | null
          created_at: string
          empresas_id: number | null
          id: number
          perfis_id: string | null
        }
        Insert: {
          asaas?: Json | null
          assinaturas_planos_id?: number | null
          created_at?: string
          empresas_id?: number | null
          id?: number
          perfis_id?: string | null
        }
        Update: {
          asaas?: Json | null
          assinaturas_planos_id?: number | null
          created_at?: string
          empresas_id?: number | null
          id?: number
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "erp_assinatura_assinaturas_planos_id_fkey"
            columns: ["assinaturas_planos_id"]
            isOneToOne: false
            referencedRelation: "assinaturas_planos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "erp_assinatura_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "erp_assinaturas_empresas_id_fkey"
            columns: ["empresas_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
        ]
      }
      fis_atividades_prepoderantes: {
        Row: {
          atividade: string | null
          id: number
        }
        Insert: {
          atividade?: string | null
          id?: number
        }
        Update: {
          atividade?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_cenq: {
        Row: {
          codigo: string | null
          descricao: string | null
          grupo: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          descricao?: string | null
          grupo?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          descricao?: string | null
          grupo?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_cest: {
        Row: {
          cod_cest: string | null
          descricao: string | null
          id: number
          ncm: string | null
        }
        Insert: {
          cod_cest?: string | null
          descricao?: string | null
          id?: number
          ncm?: string | null
        }
        Update: {
          cod_cest?: string | null
          descricao?: string | null
          id?: number
          ncm?: string | null
        }
        Relationships: []
      }
      fis_cfop: {
        Row: {
          cfop: string | null
          descricao_resumida: string | null
          id: number
          indcomunica: number | null
          inddevol: number | null
          indnfe: number | null
          indtransp: number | null
        }
        Insert: {
          cfop?: string | null
          descricao_resumida?: string | null
          id?: number
          indcomunica?: number | null
          inddevol?: number | null
          indnfe?: number | null
          indtransp?: number | null
        }
        Update: {
          cfop?: string | null
          descricao_resumida?: string | null
          id?: number
          indcomunica?: number | null
          inddevol?: number | null
          indnfe?: number | null
          indtransp?: number | null
        }
        Relationships: []
      }
      fis_csosn: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_cst: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          id: number
          titulo: string | null
        }
        Insert: {
          codigo?: string | null
          created_at: string
          descricao?: string | null
          id?: number
          titulo?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: number
          titulo?: string | null
        }
        Relationships: []
      }
      fis_cst_ipi: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          Grupo: string | null
          id: number
          tipo: string | null
        }
        Insert: {
          codigo?: string | null
          created_at: string
          descricao?: string | null
          Grupo?: string | null
          id?: number
          tipo?: string | null
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          Grupo?: string | null
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      fis_cst_pis_cofins: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          created_at: string
          descricao?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_ipi_enquadramentos: {
        Row: {
          codigo: string | null
          created_at: string
          descricao: string | null
          grupo_cst: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          created_at: string
          descricao?: string | null
          grupo_cst?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          created_at?: string
          descricao?: string | null
          grupo_cst?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_naturezas: {
        Row: {
          id: number
          natureza: string | null
        }
        Insert: {
          id?: number
          natureza?: string | null
        }
        Update: {
          id?: number
          natureza?: string | null
        }
        Relationships: []
      }
      fis_ncm: {
        Row: {
          Ano: string | null
          Ato_Legal: string | null
          Data_Fim: string | null
          Data_Inicio: string | null
          Descricao: string | null
          descricao_completa: string | null
          id: number
          ncm: string
          numero: string | null
        }
        Insert: {
          Ano?: string | null
          Ato_Legal?: string | null
          Data_Fim?: string | null
          Data_Inicio?: string | null
          Descricao?: string | null
          descricao_completa?: string | null
          id?: number
          ncm: string
          numero?: string | null
        }
        Update: {
          Ano?: string | null
          Ato_Legal?: string | null
          Data_Fim?: string | null
          Data_Inicio?: string | null
          Descricao?: string | null
          descricao_completa?: string | null
          id?: number
          ncm?: string
          numero?: string | null
        }
        Relationships: []
      }
      fis_origem_produto: {
        Row: {
          codigo: string | null
          descricao: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          descricao?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          descricao?: string | null
          id?: number
        }
        Relationships: []
      }
      fis_regimes_tributarios: {
        Row: {
          id: number
          regime: string | null
        }
        Insert: {
          id?: number
          regime?: string | null
        }
        Update: {
          id?: number
          regime?: string | null
        }
        Relationships: []
      }
      grupos: {
        Row: {
          created_at: string
          grupo: string | null
          id: number
          perfis_id: string | null
          tipo: number | null
        }
        Insert: {
          created_at?: string
          grupo?: string | null
          id?: number
          perfis_id?: string | null
          tipo?: number | null
        }
        Update: {
          created_at?: string
          grupo?: string | null
          id?: number
          perfis_id?: string | null
          tipo?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "grupos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "grupos_tipo_fkey"
            columns: ["tipo"]
            isOneToOne: false
            referencedRelation: "grupos_tipos"
            referencedColumns: ["id"]
          },
        ]
      }
      grupos_tipos: {
        Row: {
          id: number
          tipo: string | null
        }
        Insert: {
          id?: number
          tipo?: string | null
        }
        Update: {
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      http_resposta: {
        Row: {
          created_at: string
          id: number
          response_id: number | null
          resposta: Json | null
        }
        Insert: {
          created_at?: string
          id?: number
          response_id?: number | null
          resposta?: Json | null
        }
        Update: {
          created_at?: string
          id?: number
          response_id?: number | null
          resposta?: Json | null
        }
        Relationships: []
      }
      last_nfe: {
        Row: {
          ambiente: string | null
          api_created_at: string | null
          api_id: string | null
          api_status: string | null
          autorizacao: Json | null
          chave: string | null
          created_at: string | null
          data_emissao: string | null
          empresas_id: number | null
          id: number | null
          id_emissor: number | null
          infNFe: Json | null
          infNFeSupl: Json | null
          modelo: number | null
          numero: number | null
          perfis_id: string | null
          pessoas_id: number | null
          referencia: string | null
          serie: number | null
          tipo_emissao: number | null
          transportador_endereco_id: number | null
          transportador_id: number | null
          valor_total: number | null
        }
        Insert: {
          ambiente?: string | null
          api_created_at?: string | null
          api_id?: string | null
          api_status?: string | null
          autorizacao?: Json | null
          chave?: string | null
          created_at?: string | null
          data_emissao?: string | null
          empresas_id?: number | null
          id?: number | null
          id_emissor?: number | null
          infNFe?: Json | null
          infNFeSupl?: Json | null
          modelo?: number | null
          numero?: number | null
          perfis_id?: string | null
          pessoas_id?: number | null
          referencia?: string | null
          serie?: number | null
          tipo_emissao?: number | null
          transportador_endereco_id?: number | null
          transportador_id?: number | null
          valor_total?: number | null
        }
        Update: {
          ambiente?: string | null
          api_created_at?: string | null
          api_id?: string | null
          api_status?: string | null
          autorizacao?: Json | null
          chave?: string | null
          created_at?: string | null
          data_emissao?: string | null
          empresas_id?: number | null
          id?: number | null
          id_emissor?: number | null
          infNFe?: Json | null
          infNFeSupl?: Json | null
          modelo?: number | null
          numero?: number | null
          perfis_id?: string | null
          pessoas_id?: number | null
          referencia?: string | null
          serie?: number | null
          tipo_emissao?: number | null
          transportador_endereco_id?: number | null
          transportador_id?: number | null
          valor_total?: number | null
        }
        Relationships: []
      }
      nfe: {
        Row: {
          api_created_at: string | null
          api_id: string | null
          api_status: string | null
          autorizacao: Json | null
          chave: string | null
          created_at: string
          data_emissao: string | null
          empresas_id: number | null
          fis_naturezas_id: number | null
          id: number
          id_emissor: number | null
          infNFe: Json | null
          infNFeSupl: Json | null
          perfis_id: string | null
          pessoa_endereco_id: number | null
          pessoas_id: number | null
          transportador_endereco_id: number | null
          transportador_id: number | null
        }
        Insert: {
          api_created_at?: string | null
          api_id?: string | null
          api_status?: string | null
          autorizacao?: Json | null
          chave?: string | null
          created_at?: string
          data_emissao?: string | null
          empresas_id?: number | null
          fis_naturezas_id?: number | null
          id?: number
          id_emissor?: number | null
          infNFe?: Json | null
          infNFeSupl?: Json | null
          perfis_id?: string | null
          pessoa_endereco_id?: number | null
          pessoas_id?: number | null
          transportador_endereco_id?: number | null
          transportador_id?: number | null
        }
        Update: {
          api_created_at?: string | null
          api_id?: string | null
          api_status?: string | null
          autorizacao?: Json | null
          chave?: string | null
          created_at?: string
          data_emissao?: string | null
          empresas_id?: number | null
          fis_naturezas_id?: number | null
          id?: number
          id_emissor?: number | null
          infNFe?: Json | null
          infNFeSupl?: Json | null
          perfis_id?: string | null
          pessoa_endereco_id?: number | null
          pessoas_id?: number | null
          transportador_endereco_id?: number | null
          transportador_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Nfe_empresas_id_fkey"
            columns: ["empresas_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_fis_naturezas_id_fkey"
            columns: ["fis_naturezas_id"]
            isOneToOne: false
            referencedRelation: "fis_naturezas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Nfe_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_pessoa_endereco_id_fkey"
            columns: ["pessoa_endereco_id"]
            isOneToOne: false
            referencedRelation: "pessoas_enderecos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_pessoa_endereco_id_fkey"
            columns: ["pessoa_endereco_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["endereco_id"]
          },
          {
            foreignKeyName: "nfe_pessoas_id_fkey"
            columns: ["pessoas_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_pessoas_id_fkey"
            columns: ["pessoas_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_transportador_endereco_id_fkey"
            columns: ["transportador_endereco_id"]
            isOneToOne: false
            referencedRelation: "pessoas_enderecos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_transportador_endereco_id_fkey"
            columns: ["transportador_endereco_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["endereco_id"]
          },
          {
            foreignKeyName: "nfe_transportador_id_fkey"
            columns: ["transportador_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nfe_transportador_id_fkey"
            columns: ["transportador_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis: {
        Row: {
          apelido: string | null
          celular: string | null
          cpf_cnpj: string | null
          created_at: string
          dominio: string | null
          email: string | null
          faturamento: number | null
          fone: string | null
          foto_url: string | null
          id: string
          nascimento: string | null
          nome_completo: string | null
          revenda_id: string | null
          revenda_status: number | null
          tipo: number | null
          user_id: string | null
          wathsapp: string | null
        }
        Insert: {
          apelido?: string | null
          celular?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          dominio?: string | null
          email?: string | null
          faturamento?: number | null
          fone?: string | null
          foto_url?: string | null
          id?: string
          nascimento?: string | null
          nome_completo?: string | null
          revenda_id?: string | null
          revenda_status?: number | null
          tipo?: number | null
          user_id?: string | null
          wathsapp?: string | null
        }
        Update: {
          apelido?: string | null
          celular?: string | null
          cpf_cnpj?: string | null
          created_at?: string
          dominio?: string | null
          email?: string | null
          faturamento?: number | null
          fone?: string | null
          foto_url?: string | null
          id?: string
          nascimento?: string | null
          nome_completo?: string | null
          revenda_id?: string | null
          revenda_status?: number | null
          tipo?: number | null
          user_id?: string | null
          wathsapp?: string | null
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
        ]
      }
      perfis_asaas_webhook_key: {
        Row: {
          created_at: string
          id: string
          perfis_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          perfis_id: string
        }
        Update: {
          created_at?: string
          id?: string
          perfis_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_asaas_webhook_key_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_enderecos: {
        Row: {
          bairro: string | null
          cep: string | null
          complemento: string | null
          created_at: string
          ddd: string | null
          geo_point: string | null
          gia: string | null
          ibge: string | null
          id: number
          localidade: string | null
          logradouro: string | null
          numero: string | null
          perfis_id: string | null
          principal: boolean | null
          siafi: string | null
          titulo: string | null
          uf: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          geo_point?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          perfis_id?: string | null
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          geo_point?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          perfis_id?: string | null
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_enderecos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      perfis_tipos: {
        Row: {
          created_at: string
          id: number
          tipo: string
        }
        Insert: {
          created_at?: string
          id?: number
          tipo: string
        }
        Update: {
          created_at?: string
          id?: number
          tipo?: string
        }
        Relationships: []
      }
      perfis_users: {
        Row: {
          created_at: string
          id: number
          perfil_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          perfil_id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          perfil_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "perfis_users_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas: {
        Row: {
          apelido: string | null
          atividade_principal: Json | null
          atividades_ids: number[] | null
          atividades_secundarias: Json | null
          capital_social: number | null
          cpf_cnpj: string | null
          created_at: string
          data_inicio_atividades: string | null
          foto_url: string | null
          genero: string | null
          grupos_ids: number[] | null
          id: number
          IM: string | null
          indIEDest: number | null
          ISUF: string | null
          matriz: boolean | null
          nascimento: string | null
          natureza_juridica: Json | null
          nome_razao: string | null
          obs: string | null
          perfis_id: string
          pessoas_tipos: number[] | null
          porte: Json | null
          profissoes_id: number | null
          ramo_id: number | null
          renda: string | null
          rg_ie: string | null
          situacao_cadastral: Json | null
          socios: Json | null
          status_id: number | null
          subgrupos_ids: number[] | null
          tipo: string | null
        }
        Insert: {
          apelido?: string | null
          atividade_principal?: Json | null
          atividades_ids?: number[] | null
          atividades_secundarias?: Json | null
          capital_social?: number | null
          cpf_cnpj?: string | null
          created_at?: string
          data_inicio_atividades?: string | null
          foto_url?: string | null
          genero?: string | null
          grupos_ids?: number[] | null
          id?: number
          IM?: string | null
          indIEDest?: number | null
          ISUF?: string | null
          matriz?: boolean | null
          nascimento?: string | null
          natureza_juridica?: Json | null
          nome_razao?: string | null
          obs?: string | null
          perfis_id?: string
          pessoas_tipos?: number[] | null
          porte?: Json | null
          profissoes_id?: number | null
          ramo_id?: number | null
          renda?: string | null
          rg_ie?: string | null
          situacao_cadastral?: Json | null
          socios?: Json | null
          status_id?: number | null
          subgrupos_ids?: number[] | null
          tipo?: string | null
        }
        Update: {
          apelido?: string | null
          atividade_principal?: Json | null
          atividades_ids?: number[] | null
          atividades_secundarias?: Json | null
          capital_social?: number | null
          cpf_cnpj?: string | null
          created_at?: string
          data_inicio_atividades?: string | null
          foto_url?: string | null
          genero?: string | null
          grupos_ids?: number[] | null
          id?: number
          IM?: string | null
          indIEDest?: number | null
          ISUF?: string | null
          matriz?: boolean | null
          nascimento?: string | null
          natureza_juridica?: Json | null
          nome_razao?: string | null
          obs?: string | null
          perfis_id?: string
          pessoas_tipos?: number[] | null
          porte?: Json | null
          profissoes_id?: number | null
          ramo_id?: number | null
          renda?: string | null
          rg_ie?: string | null
          situacao_cadastral?: Json | null
          socios?: Json | null
          status_id?: number | null
          subgrupos_ids?: number[] | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_ramo_id_fkey"
            columns: ["ramo_id"]
            isOneToOne: false
            referencedRelation: "pessoas_ramos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "pessoas_status"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_anexos: {
        Row: {
          arquivo: string | null
          created_at: string
          descricao: string | null
          download: string | null
          id: number
          nome: string | null
          pessoa_id: number | null
        }
        Insert: {
          arquivo?: string | null
          created_at?: string
          descricao?: string | null
          download?: string | null
          id?: number
          nome?: string | null
          pessoa_id?: number | null
        }
        Update: {
          arquivo?: string | null
          created_at?: string
          descricao?: string | null
          download?: string | null
          id?: number
          nome?: string | null
          pessoa_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_anexos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_anexos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_atividades: {
        Row: {
          atividade: string | null
          created_at: string
          id: number
          perfis_id: string | null
        }
        Insert: {
          atividade?: string | null
          created_at?: string
          id?: number
          perfis_id?: string | null
        }
        Update: {
          atividade?: string | null
          created_at?: string
          id?: number
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_atividades_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_contatos: {
        Row: {
          cargo: string | null
          celular: string | null
          contato: string | null
          created_at: string
          departamento: string | null
          email: string | null
          id: number
          pessoa_id: number | null
          telefone: string | null
          zap: boolean | null
        }
        Insert: {
          cargo?: string | null
          celular?: string | null
          contato?: string | null
          created_at?: string
          departamento?: string | null
          email?: string | null
          id?: number
          pessoa_id?: number | null
          telefone?: string | null
          zap?: boolean | null
        }
        Update: {
          cargo?: string | null
          celular?: string | null
          contato?: string | null
          created_at?: string
          departamento?: string | null
          email?: string | null
          id?: number
          pessoa_id?: number | null
          telefone?: string | null
          zap?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_contatos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_contatos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_email_tipos: {
        Row: {
          tipo: string
        }
        Insert: {
          tipo: string
        }
        Update: {
          tipo?: string
        }
        Relationships: []
      }
      pessoas_emails: {
        Row: {
          created_at: string
          email: string
          id: number
          pessoa_id: number
          responsavel: string | null
          tipo: string | null
        }
        Insert: {
          created_at?: string
          email: string
          id?: number
          pessoa_id: number
          responsavel?: string | null
          tipo?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          id?: number
          pessoa_id?: number
          responsavel?: string | null
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_emails_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_emails_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_emails_tipo_fkey"
            columns: ["tipo"]
            isOneToOne: false
            referencedRelation: "pessoas_email_tipos"
            referencedColumns: ["tipo"]
          },
        ]
      }
      pessoas_enderecos: {
        Row: {
          bairro: string | null
          cep: string | null
          complemento: string | null
          created_at: string
          ddd: string | null
          geo_point: string | null
          gia: string | null
          ibge: string | null
          id: number
          localidade: string | null
          logradouro: string | null
          numero: string | null
          pessoa_id: number | null
          principal: boolean | null
          siafi: string | null
          titulo: string | null
          uf: string | null
        }
        Insert: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          geo_point?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          pessoa_id?: number | null
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
        }
        Update: {
          bairro?: string | null
          cep?: string | null
          complemento?: string | null
          created_at?: string
          ddd?: string | null
          geo_point?: string | null
          gia?: string | null
          ibge?: string | null
          id?: number
          localidade?: string | null
          logradouro?: string | null
          numero?: string | null
          pessoa_id?: number | null
          principal?: boolean | null
          siafi?: string | null
          titulo?: string | null
          uf?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Pessoas_Enderecos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Pessoas_Enderecos_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_ramos: {
        Row: {
          id: number
          ramo: string | null
        }
        Insert: {
          id?: number
          ramo?: string | null
        }
        Update: {
          id?: number
          ramo?: string | null
        }
        Relationships: []
      }
      pessoas_redes_sociais: {
        Row: {
          created_at: string
          id: number
          link: string | null
          nome: string | null
          pessoa_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          link?: string | null
          nome?: string | null
          pessoa_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          link?: string | null
          nome?: string | null
          pessoa_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_redes_sociais_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_redes_sociais_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
        ]
      }
      pessoas_status: {
        Row: {
          id: number
          status: string | null
        }
        Insert: {
          id?: number
          status?: string | null
        }
        Update: {
          id?: number
          status?: string | null
        }
        Relationships: []
      }
      pessoas_telefones: {
        Row: {
          created_at: string
          id: number
          numero: string | null
          pessoa_id: number
          tipo: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          numero?: string | null
          pessoa_id: number
          tipo?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          numero?: string | null
          pessoa_id?: number
          tipo?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_telefones_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_telefones_pessoa_id_fkey"
            columns: ["pessoa_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_telefones_tipo_fkey"
            columns: ["tipo"]
            isOneToOne: false
            referencedRelation: "pessoas_telefones_tipos"
            referencedColumns: ["tipo"]
          },
        ]
      }
      pessoas_telefones_tipos: {
        Row: {
          tipo: string
        }
        Insert: {
          tipo: string
        }
        Update: {
          tipo?: string
        }
        Relationships: []
      }
      pessoas_tipos: {
        Row: {
          created_at: string
          id: number
          tipo: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          tipo?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          tipo?: string | null
        }
        Relationships: []
      }
      pg_grupos: {
        Row: {
          created_at: string
          grupo: string | null
          icon_margem_left: string | null
          icon_size: string | null
          icone: string | null
          id: number
          ordem: number | null
          painel_id: number | null
        }
        Insert: {
          created_at?: string
          grupo?: string | null
          icon_margem_left?: string | null
          icon_size?: string | null
          icone?: string | null
          id?: number
          ordem?: number | null
          painel_id?: number | null
        }
        Update: {
          created_at?: string
          grupo?: string | null
          icon_margem_left?: string | null
          icon_size?: string | null
          icone?: string | null
          id?: number
          ordem?: number | null
          painel_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "pg_grupos_painel_id_fkey"
            columns: ["painel_id"]
            isOneToOne: false
            referencedRelation: "pg_paineis"
            referencedColumns: ["id"]
          },
        ]
      }
      pg_paginas: {
        Row: {
          created_at: string
          grupo_id: number
          icone: string | null
          id: number
          ordem: number | null
          pagina: string | null
          pg_id: string | null
        }
        Insert: {
          created_at?: string
          grupo_id: number
          icone?: string | null
          id?: number
          ordem?: number | null
          pagina?: string | null
          pg_id?: string | null
        }
        Update: {
          created_at?: string
          grupo_id?: number
          icone?: string | null
          id?: number
          ordem?: number | null
          pagina?: string | null
          pg_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pg_paginas_grupo_id_fkey"
            columns: ["grupo_id"]
            isOneToOne: false
            referencedRelation: "pg_grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      pg_paineis: {
        Row: {
          created_at: string
          id: number
          painel: string
        }
        Insert: {
          created_at?: string
          id?: number
          painel: string
        }
        Update: {
          created_at?: string
          id?: number
          painel?: string
        }
        Relationships: []
      }
      pre_pessoas: {
        Row: {
          Cidade: string | null
          cnpj: string | null
          ID: number | null
          Nome_Fantasia: string | null
          perfis_id: string | null
          Ramo_atividade: string | null
          Razao_Social: string | null
          Representante: string | null
          status: number | null
          UF: string | null
        }
        Insert: {
          Cidade?: string | null
          cnpj?: string | null
          ID?: number | null
          Nome_Fantasia?: string | null
          perfis_id?: string | null
          Ramo_atividade?: string | null
          Razao_Social?: string | null
          Representante?: string | null
          status?: number | null
          UF?: string | null
        }
        Update: {
          Cidade?: string | null
          cnpj?: string | null
          ID?: number | null
          Nome_Fantasia?: string | null
          perfis_id?: string | null
          Ramo_atividade?: string | null
          Razao_Social?: string | null
          Representante?: string | null
          status?: number | null
          UF?: string | null
        }
        Relationships: []
      }
      prod_categorias: {
        Row: {
          categoria: string | null
          created_at: string
          id: number
          perfis_id: string | null
        }
        Insert: {
          categoria?: string | null
          created_at?: string
          id?: number
          perfis_id?: string | null
        }
        Update: {
          categoria?: string | null
          created_at?: string
          id?: number
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_categorias_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      prod_fornecedores: {
        Row: {
          created_at: string
          fornecedor_id: number | null
          id: number
          principal: boolean | null
          produto_id: number | null
        }
        Insert: {
          created_at?: string
          fornecedor_id?: number | null
          id?: number
          principal?: boolean | null
          produto_id?: number | null
        }
        Update: {
          created_at?: string
          fornecedor_id?: number | null
          id?: number
          principal?: boolean | null
          produto_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_fornecedores_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_fornecedores_produto_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      prod_genero: {
        Row: {
          codigo: string | null
          genero: string | null
          id: number
        }
        Insert: {
          codigo?: string | null
          genero?: string | null
          id?: number
        }
        Update: {
          codigo?: string | null
          genero?: string | null
          id?: number
        }
        Relationships: []
      }
      prod_imagens: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          ordem: number | null
          produtos_id: number | null
          size: number | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          ordem?: number | null
          produtos_id?: number | null
          size?: number | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          ordem?: number | null
          produtos_id?: number | null
          size?: number | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Prod_Imagens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prod_Imagens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Prod_Imagens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      prod_marcas: {
        Row: {
          created_at: string
          id: number
          marca: string | null
          perfis_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          marca?: string | null
          perfis_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          marca?: string | null
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_marcas_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      prod_subcategorias: {
        Row: {
          categoria_id: number | null
          created_at: string
          id: number
          perfis_id: string | null
          subcategoria: string | null
        }
        Insert: {
          categoria_id?: number | null
          created_at?: string
          id?: number
          perfis_id?: string | null
          subcategoria?: string | null
        }
        Update: {
          categoria_id?: number | null
          created_at?: string
          id?: number
          perfis_id?: string | null
          subcategoria?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_subcategorias_categoria_id_fkey"
            columns: ["categoria_id"]
            isOneToOne: false
            referencedRelation: "prod_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_subcategorias_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      prod_tipos: {
        Row: {
          id: number
          tipo: string
        }
        Insert: {
          id?: number
          tipo: string
        }
        Update: {
          id?: number
          tipo?: string
        }
        Relationships: []
      }
      prod_unid_medidas: {
        Row: {
          id: number
          nome: string | null
        }
        Insert: {
          id?: number
          nome?: string | null
        }
        Update: {
          id?: number
          nome?: string | null
        }
        Relationships: []
      }
      prod_variacao1: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          produtos_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          produtos_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          produtos_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_variacao1_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_variacao1_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_variacao1_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      prod_variacao2: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          produtos_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          produtos_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          produtos_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "prod_variacao2_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_variacao2_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "prod_variacao2_produto_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      produto_fiscal: {
        Row: {
          cBarraTrib: string | null
          cBenef: string | null
          cEANTrib: string | null
          cest_id: number | null
          cfop_id: number | null
          created_at: string
          EXTIPI: string | null
          id: number
          ncm_id: number | null
          produtos_id: number | null
          tributacoes_id: number | null
        }
        Insert: {
          cBarraTrib?: string | null
          cBenef?: string | null
          cEANTrib?: string | null
          cest_id?: number | null
          cfop_id?: number | null
          created_at?: string
          EXTIPI?: string | null
          id?: number
          ncm_id?: number | null
          produtos_id?: number | null
          tributacoes_id?: number | null
        }
        Update: {
          cBarraTrib?: string | null
          cBenef?: string | null
          cEANTrib?: string | null
          cest_id?: number | null
          cfop_id?: number | null
          created_at?: string
          EXTIPI?: string | null
          id?: number
          ncm_id?: number | null
          produtos_id?: number | null
          tributacoes_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "produto_fiscal_cest_id_fkey"
            columns: ["cest_id"]
            isOneToOne: false
            referencedRelation: "fis_cest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_cest_id_fkey"
            columns: ["cest_id"]
            isOneToOne: false
            referencedRelation: "v_fis_cest"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_cfop_id_fkey"
            columns: ["cfop_id"]
            isOneToOne: false
            referencedRelation: "fis_cfop"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_cfop_id_fkey"
            columns: ["cfop_id"]
            isOneToOne: false
            referencedRelation: "v_fis_cfop"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_ncm_id_fkey"
            columns: ["ncm_id"]
            isOneToOne: false
            referencedRelation: "fis_ncm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_ncm_id_fkey"
            columns: ["ncm_id"]
            isOneToOne: false
            referencedRelation: "v_fis_ncm"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: true
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: true
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_fiscal_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: true
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "produto_fiscal_tributacoes_id_fkey"
            columns: ["tributacoes_id"]
            isOneToOne: false
            referencedRelation: "tributacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          ativo: boolean | null
          cashback: number | null
          cashback_p: number | null
          cod_barras: string | null
          cod_sequencial: number | null
          comissao: number | null
          composto: boolean | null
          compra_frete: number | null
          compra_frete_p: number | null
          controlado_lote: boolean | null
          created_at: string | null
          custo_ultima_comp: number | null
          data_ultima_compra: string | null
          data_ultima_venda: string | null
          descricao: string | null
          embalagem: string | null
          estoque_ideal: number | null
          estoque_negativo: boolean | null
          food: boolean | null
          grade_de: number | null
          id: number
          nome: string | null
          perfis_id: string | null
          peso_bruto: number | null
          peso_liquido: number | null
          prod_categorias_id: number | null
          prod_generos_id: number | null
          prod_marcas_id: number | null
          prod_subcategorias_id: number | null
          prod_tipos_id: number | null
          prod_variacao1_id: number | null
          prod_variacao2_id: number | null
          ref_fornecedor: string | null
          sku: string | null
          sub_codigo_sequencial: number | null
          unid_compra: number | null
          unid_fator_conversao: number | null
          unid_venda: number | null
          validade: string | null
          variacao1: string | null
          variacao2: string | null
          visivel_catalogo: boolean | null
        }
        Insert: {
          ativo?: boolean | null
          cashback?: number | null
          cashback_p?: number | null
          cod_barras?: string | null
          cod_sequencial?: number | null
          comissao?: number | null
          composto?: boolean | null
          compra_frete?: number | null
          compra_frete_p?: number | null
          controlado_lote?: boolean | null
          created_at?: string | null
          custo_ultima_comp?: number | null
          data_ultima_compra?: string | null
          data_ultima_venda?: string | null
          descricao?: string | null
          embalagem?: string | null
          estoque_ideal?: number | null
          estoque_negativo?: boolean | null
          food?: boolean | null
          grade_de?: number | null
          id?: number
          nome?: string | null
          perfis_id?: string | null
          peso_bruto?: number | null
          peso_liquido?: number | null
          prod_categorias_id?: number | null
          prod_generos_id?: number | null
          prod_marcas_id?: number | null
          prod_subcategorias_id?: number | null
          prod_tipos_id?: number | null
          prod_variacao1_id?: number | null
          prod_variacao2_id?: number | null
          ref_fornecedor?: string | null
          sku?: string | null
          sub_codigo_sequencial?: number | null
          unid_compra?: number | null
          unid_fator_conversao?: number | null
          unid_venda?: number | null
          validade?: string | null
          variacao1?: string | null
          variacao2?: string | null
          visivel_catalogo?: boolean | null
        }
        Update: {
          ativo?: boolean | null
          cashback?: number | null
          cashback_p?: number | null
          cod_barras?: string | null
          cod_sequencial?: number | null
          comissao?: number | null
          composto?: boolean | null
          compra_frete?: number | null
          compra_frete_p?: number | null
          controlado_lote?: boolean | null
          created_at?: string | null
          custo_ultima_comp?: number | null
          data_ultima_compra?: string | null
          data_ultima_venda?: string | null
          descricao?: string | null
          embalagem?: string | null
          estoque_ideal?: number | null
          estoque_negativo?: boolean | null
          food?: boolean | null
          grade_de?: number | null
          id?: number
          nome?: string | null
          perfis_id?: string | null
          peso_bruto?: number | null
          peso_liquido?: number | null
          prod_categorias_id?: number | null
          prod_generos_id?: number | null
          prod_marcas_id?: number | null
          prod_subcategorias_id?: number | null
          prod_tipos_id?: number | null
          prod_variacao1_id?: number | null
          prod_variacao2_id?: number | null
          ref_fornecedor?: string | null
          sku?: string | null
          sub_codigo_sequencial?: number | null
          unid_compra?: number | null
          unid_fator_conversao?: number | null
          unid_venda?: number | null
          validade?: string | null
          variacao1?: string | null
          variacao2?: string | null
          visivel_catalogo?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "produtos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_categorias_id_fkey"
            columns: ["prod_categorias_id"]
            isOneToOne: false
            referencedRelation: "prod_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_generos_id_fkey"
            columns: ["prod_generos_id"]
            isOneToOne: false
            referencedRelation: "prod_genero"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_marcas_id_fkey"
            columns: ["prod_marcas_id"]
            isOneToOne: false
            referencedRelation: "prod_marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_subcategorias_id_fkey"
            columns: ["prod_subcategorias_id"]
            isOneToOne: false
            referencedRelation: "prod_subcategorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_tipos_id_fkey"
            columns: ["prod_tipos_id"]
            isOneToOne: false
            referencedRelation: "prod_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao1_id_fkey"
            columns: ["prod_variacao1_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao2_id_fkey"
            columns: ["prod_variacao2_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_compra_fkey"
            columns: ["unid_compra"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_venda_fkey"
            columns: ["unid_venda"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
        ]
      }
      Produtos_Base: {
        Row: {
          categoria: string | null
          cest_codigo: string | null
          codbar: number
          embalagem: string | null
          foto_png: string | null
          foto_webp: string | null
          img_gtin: string | null
          marca: string | null
          ncm: string | null
          peso: string | null
          preco_medio: string | null
          produto: string | null
          produto_acento: string | null
          produto_upper: string | null
          quantidade_embalagem: string | null
        }
        Insert: {
          categoria?: string | null
          cest_codigo?: string | null
          codbar: number
          embalagem?: string | null
          foto_png?: string | null
          foto_webp?: string | null
          img_gtin?: string | null
          marca?: string | null
          ncm?: string | null
          peso?: string | null
          preco_medio?: string | null
          produto?: string | null
          produto_acento?: string | null
          produto_upper?: string | null
          quantidade_embalagem?: string | null
        }
        Update: {
          categoria?: string | null
          cest_codigo?: string | null
          codbar?: number
          embalagem?: string | null
          foto_png?: string | null
          foto_webp?: string | null
          img_gtin?: string | null
          marca?: string | null
          ncm?: string | null
          peso?: string | null
          preco_medio?: string | null
          produto?: string | null
          produto_acento?: string | null
          produto_upper?: string | null
          quantidade_embalagem?: string | null
        }
        Relationships: []
      }
      Revendas_Config: {
        Row: {
          id: number
          termo_uso_erps: string | null
        }
        Insert: {
          id?: number
          termo_uso_erps?: string | null
        }
        Update: {
          id?: number
          termo_uso_erps?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "sub_grupos_grupos_id_fkey"
            columns: ["grupos_id"]
            isOneToOne: false
            referencedRelation: "grupos"
            referencedColumns: ["id"]
          },
        ]
      }
      tabelas_precos: {
        Row: {
          created_at: string
          id: number
          nome: string | null
          padrao: boolean | null
          perfis_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          nome?: string | null
          padrao?: boolean | null
          perfis_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          nome?: string | null
          padrao?: boolean | null
          perfis_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tabelas_precos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      tabelas_precos_itens: {
        Row: {
          created_at: string
          custo: number | null
          custo_total: number | null
          despesas: number | null
          despesas_p: number | null
          fcp_st: number | null
          fcp_st_p: number | null
          frete: number | null
          frete_p: number | null
          icms: number | null
          icms_p: number | null
          icms_st: number | null
          icms_st_p: number | null
          id: number
          ipi: number | null
          ipi_p: number | null
          margem_lucro: number | null
          margem_lucro_p: number | null
          preco: number | null
          produtos_id: number | null
          seguro: number | null
          seguro_p: number | null
          tabelas_precos_id: number | null
        }
        Insert: {
          created_at?: string
          custo?: number | null
          custo_total?: number | null
          despesas?: number | null
          despesas_p?: number | null
          fcp_st?: number | null
          fcp_st_p?: number | null
          frete?: number | null
          frete_p?: number | null
          icms?: number | null
          icms_p?: number | null
          icms_st?: number | null
          icms_st_p?: number | null
          id?: number
          ipi?: number | null
          ipi_p?: number | null
          margem_lucro?: number | null
          margem_lucro_p?: number | null
          preco?: number | null
          produtos_id?: number | null
          seguro?: number | null
          seguro_p?: number | null
          tabelas_precos_id?: number | null
        }
        Update: {
          created_at?: string
          custo?: number | null
          custo_total?: number | null
          despesas?: number | null
          despesas_p?: number | null
          fcp_st?: number | null
          fcp_st_p?: number | null
          frete?: number | null
          frete_p?: number | null
          icms?: number | null
          icms_p?: number | null
          icms_st?: number | null
          icms_st_p?: number | null
          id?: number
          ipi?: number | null
          ipi_p?: number | null
          margem_lucro?: number | null
          margem_lucro_p?: number | null
          preco?: number | null
          produtos_id?: number | null
          seguro?: number | null
          seguro_p?: number | null
          tabelas_precos_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_tabelas_precos_id_fkey"
            columns: ["tabelas_precos_id"]
            isOneToOne: false
            referencedRelation: "tabelas_precos"
            referencedColumns: ["id"]
          },
        ]
      }
      temas_erp: {
        Row: {
          created_at: string
          id: number
          modelo: boolean | null
          nome: string | null
          perfis_id: string | null
          usando: boolean | null
        }
        Insert: {
          created_at?: string
          id?: number
          modelo?: boolean | null
          nome?: string | null
          perfis_id?: string | null
          usando?: boolean | null
        }
        Update: {
          created_at?: string
          id?: number
          modelo?: boolean | null
          nome?: string | null
          perfis_id?: string | null
          usando?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "temas_erp_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      temas_erp_cores: {
        Row: {
          ativo_bg: string | null
          ativo_txt: string | null
          bg_01: string | null
          bg_02: string | null
          bg_03: string | null
          bg_04: string | null
          borda_erro: string | null
          borda_focus: string | null
          borda_pg: string | null
          botao_acao_bg: string | null
          botao_acao_text: string | null
          cab_bg: string | null
          cab_borda: string | null
          cab_icon: string | null
          cab_iconbg: string | null
          cab_text: string | null
          created_at: string
          grid_borda: string | null
          grid_cab_bg: string | null
          grid_cab_txt: string | null
          Icone: string | null
          id: number
          input_borda: string | null
          input_disable_bg: string | null
          Mn_CorFundo: string | null
          Mn_CorTextoLogo: string | null
          Mn_Grupo_atual_IconeCor: string | null
          Mn_Grupo_CorFundo: string | null
          Mn_Grupo_FonteCor: string | null
          Mn_Grupo_IconeCor: string | null
          Mn_Grupo_SetaCor: string | null
          Mn_Item_CorBarra: string | null
          Mn_Item_CorBarra_Hover: string | null
          Mn_Item_CorFonte: string | null
          Mn_Item_CorFundo: string | null
          Mn_Item_CorIcone: string | null
          Mn_Item_Hover_CorFonte: string | null
          Mn_Item_Hover_CorFundo: string | null
          Mn_Item_Hover_CorIcone: string | null
          Mn_ItemAtual_CorBarra: string | null
          Mn_ItemAtual_CorFonte: string | null
          Mn_ItemAtual_CorFundo: string | null
          Mn_ItemAtual_CorIcone: string | null
          modelo: string | null
          positivo_ok: string | null
          temas_id: number | null
          texto: string | null
          texto_alerta: string | null
          texto_titulos: string | null
        }
        Insert: {
          ativo_bg?: string | null
          ativo_txt?: string | null
          bg_01?: string | null
          bg_02?: string | null
          bg_03?: string | null
          bg_04?: string | null
          borda_erro?: string | null
          borda_focus?: string | null
          borda_pg?: string | null
          botao_acao_bg?: string | null
          botao_acao_text?: string | null
          cab_bg?: string | null
          cab_borda?: string | null
          cab_icon?: string | null
          cab_iconbg?: string | null
          cab_text?: string | null
          created_at?: string
          grid_borda?: string | null
          grid_cab_bg?: string | null
          grid_cab_txt?: string | null
          Icone?: string | null
          id?: number
          input_borda?: string | null
          input_disable_bg?: string | null
          Mn_CorFundo?: string | null
          Mn_CorTextoLogo?: string | null
          Mn_Grupo_atual_IconeCor?: string | null
          Mn_Grupo_CorFundo?: string | null
          Mn_Grupo_FonteCor?: string | null
          Mn_Grupo_IconeCor?: string | null
          Mn_Grupo_SetaCor?: string | null
          Mn_Item_CorBarra?: string | null
          Mn_Item_CorBarra_Hover?: string | null
          Mn_Item_CorFonte?: string | null
          Mn_Item_CorFundo?: string | null
          Mn_Item_CorIcone?: string | null
          Mn_Item_Hover_CorFonte?: string | null
          Mn_Item_Hover_CorFundo?: string | null
          Mn_Item_Hover_CorIcone?: string | null
          Mn_ItemAtual_CorBarra?: string | null
          Mn_ItemAtual_CorFonte?: string | null
          Mn_ItemAtual_CorFundo?: string | null
          Mn_ItemAtual_CorIcone?: string | null
          modelo?: string | null
          positivo_ok?: string | null
          temas_id?: number | null
          texto?: string | null
          texto_alerta?: string | null
          texto_titulos?: string | null
        }
        Update: {
          ativo_bg?: string | null
          ativo_txt?: string | null
          bg_01?: string | null
          bg_02?: string | null
          bg_03?: string | null
          bg_04?: string | null
          borda_erro?: string | null
          borda_focus?: string | null
          borda_pg?: string | null
          botao_acao_bg?: string | null
          botao_acao_text?: string | null
          cab_bg?: string | null
          cab_borda?: string | null
          cab_icon?: string | null
          cab_iconbg?: string | null
          cab_text?: string | null
          created_at?: string
          grid_borda?: string | null
          grid_cab_bg?: string | null
          grid_cab_txt?: string | null
          Icone?: string | null
          id?: number
          input_borda?: string | null
          input_disable_bg?: string | null
          Mn_CorFundo?: string | null
          Mn_CorTextoLogo?: string | null
          Mn_Grupo_atual_IconeCor?: string | null
          Mn_Grupo_CorFundo?: string | null
          Mn_Grupo_FonteCor?: string | null
          Mn_Grupo_IconeCor?: string | null
          Mn_Grupo_SetaCor?: string | null
          Mn_Item_CorBarra?: string | null
          Mn_Item_CorBarra_Hover?: string | null
          Mn_Item_CorFonte?: string | null
          Mn_Item_CorFundo?: string | null
          Mn_Item_CorIcone?: string | null
          Mn_Item_Hover_CorFonte?: string | null
          Mn_Item_Hover_CorFundo?: string | null
          Mn_Item_Hover_CorIcone?: string | null
          Mn_ItemAtual_CorBarra?: string | null
          Mn_ItemAtual_CorFonte?: string | null
          Mn_ItemAtual_CorFundo?: string | null
          Mn_ItemAtual_CorIcone?: string | null
          modelo?: string | null
          positivo_ok?: string | null
          temas_id?: number | null
          texto?: string | null
          texto_alerta?: string | null
          texto_titulos?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "temas_erp_cores_temas_id_fkey"
            columns: ["temas_id"]
            isOneToOne: false
            referencedRelation: "temas_erp"
            referencedColumns: ["id"]
          },
        ]
      }
      themes: {
        Row: {
          created_at: string
          dark: Json
          id: string
          light: Json
          name: string
          perfil_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          dark: Json
          id?: string
          light: Json
          name: string
          perfil_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          dark?: Json
          id?: string
          light?: Json
          name?: string
          perfil_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "themes_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: true
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      tributacoes: {
        Row: {
          cofins: Json | null
          created_at: string
          icms: Json | null
          id: number
          ipi: Json | null
          nome: string | null
          perfis_id: string | null
          pis: Json | null
        }
        Insert: {
          cofins?: Json | null
          created_at?: string
          icms?: Json | null
          id?: number
          ipi?: Json | null
          nome?: string | null
          perfis_id?: string | null
          pis?: Json | null
        }
        Update: {
          cofins?: Json | null
          created_at?: string
          icms?: Json | null
          id?: number
          ipi?: Json | null
          nome?: string | null
          perfis_id?: string | null
          pis?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "tributacoes_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      v_asaas_response: {
        Row: {
          content: Json | null
        }
        Insert: {
          content?: Json | null
        }
        Update: {
          content?: Json | null
        }
        Relationships: []
      }
    }
    Views: {
      v_compras: {
        Row: {
          created_at: string | null
          data: string | null
          deposito_id: number | null
          empresa_cnpj: string | null
          empresa_fantasia: string | null
          empresa_id: number | null
          empresa_razao_social: string | null
          fornecedor_apelido: string | null
          fornecedor_cpf_cnpj: string | null
          fornecedor_id: number | null
          fornecedor_nome_razao: string | null
          fornecedor_num_pedido: string | null
          fornecedor_numero_nf: string | null
          id: number | null
          numero: number | null
          orcamento_prazo_ate: string | null
          perfis_id: string | null
          qt_itens: number | null
          qt_produtos: number | null
          status_id: number | null
          valor_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "compras_deposito_id_fkey"
            columns: ["deposito_id"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_empresa_id_fkey"
            columns: ["empresa_id"]
            isOneToOne: false
            referencedRelation: "empresas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "v_pessoas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "compras_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      v_depositos_produto: {
        Row: {
          created_at: string | null
          deposito_nome: string | null
          depositos_id: number | null
          estoque_minimo: number | null
          id: number | null
          local_estoque: string | null
          produto_nome: string | null
          produtos_id: number | null
          qt_reservada: number | null
          quantidade: number | null
        }
        Relationships: [
          {
            foreignKeyName: "depositos_produtos_depositos_id_fkey"
            columns: ["depositos_id"]
            isOneToOne: false
            referencedRelation: "depositos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "depositos_produtos_produtos_id_fkey"
            columns: ["produtos_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
        ]
      }
      v_fis_cest: {
        Row: {
          cod_cest: string | null
          cod_cest_descricao: string | null
          descricao: string | null
          id: number | null
          ncm: string | null
        }
        Insert: {
          cod_cest?: string | null
          cod_cest_descricao?: never
          descricao?: string | null
          id?: number | null
          ncm?: string | null
        }
        Update: {
          cod_cest?: string | null
          cod_cest_descricao?: never
          descricao?: string | null
          id?: number | null
          ncm?: string | null
        }
        Relationships: []
      }
      v_fis_cfop: {
        Row: {
          cfop: string | null
          cfop_descricao: string | null
          descricao_resumida: string | null
          id: number | null
          indcomunica: number | null
          inddevol: number | null
          indnfe: number | null
          indtransp: number | null
        }
        Insert: {
          cfop?: string | null
          cfop_descricao?: never
          descricao_resumida?: string | null
          id?: number | null
          indcomunica?: number | null
          inddevol?: number | null
          indnfe?: number | null
          indtransp?: number | null
        }
        Update: {
          cfop?: string | null
          cfop_descricao?: never
          descricao_resumida?: string | null
          id?: number | null
          indcomunica?: number | null
          inddevol?: number | null
          indnfe?: number | null
          indtransp?: number | null
        }
        Relationships: []
      }
      v_fis_csosn: {
        Row: {
          codigo: string | null
          codigo_descricao: string | null
          created_at: string | null
          descricao: string | null
          id: number | null
        }
        Insert: {
          codigo?: string | null
          codigo_descricao?: never
          created_at?: string | null
          descricao?: string | null
          id?: number | null
        }
        Update: {
          codigo?: string | null
          codigo_descricao?: never
          created_at?: string | null
          descricao?: string | null
          id?: number | null
        }
        Relationships: []
      }
      v_fis_ncm: {
        Row: {
          Ano: string | null
          Ato_Legal: string | null
          Data_Fim: string | null
          Data_Inicio: string | null
          Descricao: string | null
          descricao_completa: string | null
          id: number | null
          ncm: string | null
          ncm_descricao: string | null
          numero: string | null
        }
        Insert: {
          Ano?: string | null
          Ato_Legal?: string | null
          Data_Fim?: string | null
          Data_Inicio?: string | null
          Descricao?: string | null
          descricao_completa?: string | null
          id?: number | null
          ncm?: string | null
          ncm_descricao?: never
          numero?: string | null
        }
        Update: {
          Ano?: string | null
          Ato_Legal?: string | null
          Data_Fim?: string | null
          Data_Inicio?: string | null
          Descricao?: string | null
          descricao_completa?: string | null
          id?: number | null
          ncm?: string | null
          ncm_descricao?: never
          numero?: string | null
        }
        Relationships: []
      }
      v_fis_origem_produto: {
        Row: {
          codigo: string | null
          codigo_descricao: string | null
          descricao: string | null
          id: number | null
        }
        Insert: {
          codigo?: string | null
          codigo_descricao?: never
          descricao?: string | null
          id?: number | null
        }
        Update: {
          codigo?: string | null
          codigo_descricao?: never
          descricao?: string | null
          id?: number | null
        }
        Relationships: []
      }
      v_perfis_users: {
        Row: {
          created_at: string | null
          email: string | null
          id: number | null
          perfil_id: string | null
          user_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "perfis_users_perfil_id_fkey"
            columns: ["perfil_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      v_pessoas: {
        Row: {
          apelido: string | null
          atividades: string[] | null
          atividades_ids: number[] | null
          cpf_cnpj: string | null
          created_at: string | null
          emails: string[] | null
          endereco_bairro: string | null
          endereco_cep: string | null
          endereco_complemento: string | null
          endereco_created_at: string | null
          endereco_ddd: string | null
          endereco_geo_point: string | null
          endereco_gia: string | null
          endereco_ibge: string | null
          endereco_id: number | null
          endereco_localidade: string | null
          endereco_logradouro: string | null
          endereco_numero: string | null
          endereco_principal: boolean | null
          endereco_siafi: string | null
          endereco_titulo: string | null
          endereco_uf: string | null
          foto_url: string | null
          genero: string | null
          grupos: string[] | null
          grupos_ids: number[] | null
          id: number | null
          IM: string | null
          indIEDest: number | null
          ISUF: string | null
          nascimento: string | null
          nome_razao: string | null
          obs: string | null
          perfis_id: string | null
          pessoas_tipos: number[] | null
          profissoes_id: number | null
          ramo: string | null
          ramo_id: number | null
          renda: string | null
          rg_ie: string | null
          status_id: number | null
          subgrupos: string[] | null
          subgrupos_ids: number[] | null
          telefones: string[] | null
          tipo: string | null
          tipospessoas: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "pessoas_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_ramo_id_fkey"
            columns: ["ramo_id"]
            isOneToOne: false
            referencedRelation: "pessoas_ramos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pessoas_status_id_fkey"
            columns: ["status_id"]
            isOneToOne: false
            referencedRelation: "pessoas_status"
            referencedColumns: ["id"]
          },
        ]
      }
      v_produtos: {
        Row: {
          ativo: boolean | null
          cashback: number | null
          cashback_p: number | null
          cod_barras: string | null
          cod_sequencial: number | null
          comissao: number | null
          composto: boolean | null
          controlado_lote: boolean | null
          created_at: string | null
          custo_ultima_comp: number | null
          data_ultima_compra: string | null
          data_ultima_venda: string | null
          descricao: string | null
          embalagem: string | null
          estoque_ideal: number | null
          estoque_negativo: boolean | null
          food: boolean | null
          grade_de: number | null
          grade_de_id: number | null
          id: number | null
          nome: string | null
          perfis_apelido: string | null
          perfis_id: string | null
          peso_bruto: number | null
          peso_liquido: number | null
          prod_categoria: string | null
          prod_categorias_id: number | null
          prod_genero: string | null
          prod_generos_id: number | null
          prod_marca: string | null
          prod_marcas_id: number | null
          prod_subcategoria: string | null
          prod_subcategorias_id: number | null
          prod_tipo: string | null
          prod_tipos_id: number | null
          prod_variacao1: string | null
          prod_variacao1_id: number | null
          prod_variacao2: string | null
          prod_variacao2_id: number | null
          ref_fornecedor: string | null
          sku: string | null
          sub_codigo_sequencial: number | null
          unid_compra: number | null
          unid_compra_nome: string | null
          unid_fator_conversao: number | null
          unid_venda: number | null
          unid_venda_nome: string | null
          validade: string | null
          variacao1: string | null
          variacao2: string | null
          visivel_catalogo: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "produtos_perfis_id_fkey"
            columns: ["perfis_id"]
            isOneToOne: false
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_categorias_id_fkey"
            columns: ["prod_categorias_id"]
            isOneToOne: false
            referencedRelation: "prod_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_generos_id_fkey"
            columns: ["prod_generos_id"]
            isOneToOne: false
            referencedRelation: "prod_genero"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_marcas_id_fkey"
            columns: ["prod_marcas_id"]
            isOneToOne: false
            referencedRelation: "prod_marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_subcategorias_id_fkey"
            columns: ["prod_subcategorias_id"]
            isOneToOne: false
            referencedRelation: "prod_subcategorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_tipos_id_fkey"
            columns: ["prod_tipos_id"]
            isOneToOne: false
            referencedRelation: "prod_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao1_id_fkey"
            columns: ["prod_variacao1_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao2_id_fkey"
            columns: ["prod_variacao2_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_compra_fkey"
            columns: ["unid_compra"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_venda_fkey"
            columns: ["unid_venda"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
        ]
      }
      v_produtos_get: {
        Row: {
          ativo: boolean | null
          cashback: number | null
          cashback_p: number | null
          cod_barras: string | null
          cod_sequencial: number | null
          comissao: number | null
          composto: boolean | null
          controlado_lote: boolean | null
          custo: number | null
          custo_total: number | null
          custo_ultima_comp: number | null
          data_ultima_compra: string | null
          data_ultima_venda: string | null
          depositos: Json | null
          descricao: string | null
          despesas: number | null
          despesas_p: number | null
          embalagem: string | null
          estoque_ideal: number | null
          estoque_negativo: boolean | null
          fcp_st: number | null
          fcp_st_p: number | null
          food: boolean | null
          frete: number | null
          frete_p: number | null
          grade_de: number | null
          icms: number | null
          icms_p: number | null
          icms_st: number | null
          icms_st_p: number | null
          imagens: Json | null
          ipi: number | null
          ipi_p: number | null
          margem_lucro: number | null
          margem_lucro_p: number | null
          peso_bruto: number | null
          peso_liquido: number | null
          preco: number | null
          prod_categorias_id: number | null
          prod_generos_id: number | null
          prod_marcas_id: number | null
          prod_subcategorias_id: number | null
          prod_tipos_id: number | null
          prod_variacao1_id: number | null
          prod_variacao2_id: number | null
          produto_created_at: string | null
          produto_id: number | null
          produto_nome: string | null
          ref_fornecedor: string | null
          seguro: number | null
          seguro_p: number | null
          sku: string | null
          sub_codigo_sequencial: number | null
          tabela_preco_item_created_at: string | null
          tabela_preco_item_id: number | null
          tabelas_precos_id: number | null
          unid_compra: number | null
          unid_fator_conversao: number | null
          unid_venda: number | null
          validade: string | null
          variacao1: string | null
          variacao2: string | null
          visivel_catalogo: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_grade_de_fkey"
            columns: ["grade_de"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "produtos_prod_categorias_id_fkey"
            columns: ["prod_categorias_id"]
            isOneToOne: false
            referencedRelation: "prod_categorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_generos_id_fkey"
            columns: ["prod_generos_id"]
            isOneToOne: false
            referencedRelation: "prod_genero"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_marcas_id_fkey"
            columns: ["prod_marcas_id"]
            isOneToOne: false
            referencedRelation: "prod_marcas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_subcategorias_id_fkey"
            columns: ["prod_subcategorias_id"]
            isOneToOne: false
            referencedRelation: "prod_subcategorias"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_tipos_id_fkey"
            columns: ["prod_tipos_id"]
            isOneToOne: false
            referencedRelation: "prod_tipos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao1_id_fkey"
            columns: ["prod_variacao1_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao1"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_prod_variacao2_id_fkey"
            columns: ["prod_variacao2_id"]
            isOneToOne: false
            referencedRelation: "prod_variacao2"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_compra_fkey"
            columns: ["unid_compra"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produtos_unid_venda_fkey"
            columns: ["unid_venda"]
            isOneToOne: false
            referencedRelation: "prod_unid_medidas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_produtos_id_fkey"
            columns: ["produto_id"]
            isOneToOne: false
            referencedRelation: "v_produtos"
            referencedColumns: ["grade_de_id"]
          },
          {
            foreignKeyName: "tabelas_precos_itens_tabelas_precos_id_fkey"
            columns: ["tabelas_precos_id"]
            isOneToOne: false
            referencedRelation: "tabelas_precos"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      api_asaas_assinatura_add: {
        Args: {
          asaas_clientes_id: number
          p_autoredirect?: boolean
          p_description?: string
          p_fixedvalue?: number
          p_nextduedate?: string
          p_successurl?: string
          p_value?: number
          p_walletid?: string
        }
        Returns: number
      }
      api_asaas_assinatura_cobrancas: {
        Args: {
          p_subscription_id: string
          p_asaas_contas_id: number
        }
        Returns: Json
      }
      api_asaas_cliente_add: {
        Args: {
          p_name: string
          p_cpfcnpj: string
          p_email: string
          p_phone: string
          p_mobilephone: string
          p_address: string
          p_addressnumber: string
          p_complement: string
          p_province: string
          p_postalcode: string
          p_externalreference: string
          p_notificationdisabled: boolean
          p_perfis_id: string
          p_additionalemails?: string
          p_municipalinscription?: string
          p_stateinscription?: string
          p_observations?: string
          p_groupname?: string
          p_company?: string
        }
        Returns: Json
      }
      api_asaas_cobranca_add: {
        Args: {
          p_billingtype: string
          p_customer: string
          p_value: number
          p_duedate: string
          p_description: string
          p_daysafterduedatetoregistrationcancellation: number
          p_externalreference: string
          p_postalservice: boolean
        }
        Returns: number
      }
      api_asaas_subcontas_add: {
        Args: {
          p_name: string
          p_email: string
          p_loginemail: string
          p_cpfcnpj: string
          p_birthdate: string
          p_companytype: string
          p_phone: string
          p_mobilephone: string
          p_site: string
          p_incomevalue: number
          p_address: string
          p_addressnumber: string
          p_complement: string
          p_province: string
          p_postalcode: string
          p_webhook_url: string
          p_webhook_email: string
          p_webhook_events: string[]
          p_perfis_id: string
        }
        Returns: number
      }
      api_teste: {
        Args: {
          p_nome: string
          p_sobrenome: string
          p_ativo: boolean
        }
        Returns: string
      }
      asaas_clientes_add: {
        Args: {
          p_response_id: number
          p_perfis_id: string
          p_empresas_id: number
        }
        Returns: Json
      }
      asaas_customers: {
        Args: {
          email: string
        }
        Returns: Json
      }
      asaas_subcontas_add: {
        Args: {
          p_response_id: number
          p_perfis_id: string
        }
        Returns: Json
      }
      asaas_webhook: {
        Args: {
          p_json: Json
          p_token: string
        }
        Returns: undefined
      }
      cobrancas_revendas_add: {
        Args: {
          p_cobranca_id: number
          p_response_id: number
        }
        Returns: Json
      }
      compras_get_next_numero: {
        Args: {
          p_id: string
        }
        Returns: number
      }
      criar_itens_grade: {
        Args: {
          produto_grade_id: number
        }
        Returns: undefined
      }
      erpapp_asaas_cliente_add: {
        Args: {
          p_perfis_id: string
          p_response_id: number
        }
        Returns: Json
      }
      get_assinaturas_planos: {
        Args: {
          p_perfis_id: string
        }
        Returns: {
          created_at: string
          descricao: string | null
          id: number
          mensalidade: number | null
          nome: string | null
          perfis_id: string | null
        }[]
      }
      get_localidades_unicas: {
        Args: {
          perfis_id: string
          uf_list: string[]
        }
        Returns: {
          localidade: string
        }[]
      }
      get_response_details: {
        Args: {
          response_id: number
        }
        Returns: Json
      }
      get_uf_unicas: {
        Args: {
          perfis_id: string
        }
        Returns: {
          uf: string
        }[]
      }
      http: {
        Args: {
          request: Database["public"]["CompositeTypes"]["http_request"]
        }
        Returns: unknown
      }
      http_delete:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
      http_get:
        | {
            Args: {
              uri: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_head: {
        Args: {
          uri: string
        }
        Returns: unknown
      }
      http_header: {
        Args: {
          field: string
          value: string
        }
        Returns: Database["public"]["CompositeTypes"]["http_header"]
      }
      http_list_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: {
          curlopt: string
          value: string
        }[]
      }
      http_patch: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_post:
        | {
            Args: {
              uri: string
              content: string
              content_type: string
            }
            Returns: unknown
          }
        | {
            Args: {
              uri: string
              data: Json
            }
            Returns: unknown
          }
      http_put: {
        Args: {
          uri: string
          content: string
          content_type: string
        }
        Returns: unknown
      }
      http_reset_curlopt: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      http_set_curlopt: {
        Args: {
          curlopt: string
          value: string
        }
        Returns: boolean
      }
      ler_get_response_details: {
        Args: {
          response_id: number
        }
        Returns: string
      }
      prod_imagens_trocar_ordem: {
        Args: {
          p_id: number
          p_operacao: string
        }
        Returns: undefined
      }
      sand_asaas_subconta_delete: {
        Args: {
          subaccount_id: string
        }
        Returns: number
      }
      sandbox_asaas_subcontas_list: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      test_http_post: {
        Args: Record<PropertyKey, never>
        Returns: Json
      }
      urlencode:
        | {
            Args: {
              data: Json
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
        | {
            Args: {
              string: string
            }
            Returns: string
          }
      verificar_usuario_existe: {
        Args: {
          email_input: string
        }
        Returns: boolean
      }
      via_cep: {
        Args: {
          cep: string
        }
        Returns: Json
      }
      your_function_name: {
        Args: {
          response_id: number
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      http_header: {
        field: string | null
        value: string | null
      }
      http_request: {
        method: unknown | null
        uri: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content_type: string | null
        content: string | null
      }
      http_response: {
        status: number | null
        content_type: string | null
        headers: Database["public"]["CompositeTypes"]["http_header"][] | null
        content: string | null
      }
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
