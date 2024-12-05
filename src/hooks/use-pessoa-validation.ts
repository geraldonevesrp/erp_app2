import { Pessoa, PessoaContato, SubGrupo } from "@/types/pessoa"

export interface ValidationErrors {
  [key: string]: string
}

export function usePessoaValidation(subGrupos: SubGrupo[]) {
  const validatePessoa = (pessoa: Pessoa): ValidationErrors => {
    const errors: ValidationErrors = {}

    // Validação de campos obrigatórios
    if (!pessoa.apelido?.trim()) {
      errors.apelido = "Apelido é obrigatório"
    }

    if (!pessoa.nome_razao?.trim()) {
      errors.nome_razao = "Nome/Razão Social é obrigatório"
    }

    // Validação de contatos
    pessoa.pessoas_contatos?.forEach((contato: PessoaContato) => {
      // Ignorar contatos excluídos
      if (contato._isDeleted) return

      const contatoKey = contato.id || contato._tempId

      if (!contato.contato?.trim()) {
        errors[`contato_${contatoKey}`] = "Nome do contato é obrigatório"
      }

      if (contato.email && !isValidEmail(contato.email)) {
        errors[`email_${contatoKey}`] = "E-mail inválido"
      }

      if (contato.telefone && !isValidPhone(contato.telefone)) {
        errors[`telefone_${contatoKey}`] = "Telefone inválido"
      }

      if (contato.celular && !isValidPhone(contato.celular)) {
        errors[`celular_${contatoKey}`] = "Celular inválido"
      }
    })

    // Validação de redes sociais
    pessoa.pessoas_redes_sociais?.forEach((rede) => {
      // Ignorar redes excluídas
      if (rede._isDeleted) return

      const redeKey = rede.id || rede._tempId

      if (!rede.nome?.trim()) {
        errors[`rede_nome_${redeKey}`] = "Nome da rede social é obrigatório"
      }

      if (!rede.link?.trim()) {
        errors[`rede_link_${redeKey}`] = "Link da rede social é obrigatório"
      } else {
        try {
          new URL(rede.link)
        } catch {
          errors[`rede_link_${redeKey}`] = "Link inválido"
        }
      }
    })

    // Validação de subgrupos
    if (pessoa.subgrupos_ids?.length > 0) {
      const invalidSubgrupos = pessoa.subgrupos_ids.filter(
        id => !subGrupos.some(sg => sg.id === id)
      )
      if (invalidSubgrupos.length > 0) {
        errors.subgrupos = "Subgrupos inválidos selecionados"
      }
    }

    return errors
  }

  return {
    validatePessoa
  }
}

function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

function isValidPhone(phone: string) {
  // Remove todos os caracteres não numéricos
  const numericPhone = phone.replace(/\D/g, '')
  // Verifica se tem entre 10 e 11 dígitos (com DDD)
  return numericPhone.length >= 10 && numericPhone.length <= 11
}
