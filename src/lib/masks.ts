export function formatCPF(cpf: string): string {
  const cleaned = cpf.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})(\d{2})$/)
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}-${match[4]}`
  }
  return cleaned
}

export function formatCNPJ(cnpj: string): string {
  const cleaned = cnpj.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/)
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`
  }
  return cleaned
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{2})(\d{4,5})(\d{4})$/)
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`
  }
  return cleaned
}

export function formatCEP(cep: string): string {
  const cleaned = cep.replace(/\D/g, "")
  const match = cleaned.match(/^(\d{5})(\d{3})$/)
  if (match) {
    return `${match[1]}-${match[2]}`
  }
  return cleaned
}

// Remove formatação
export function unformat(value: string): string {
  return value.replace(/\D/g, "")
}

// Formata valor monetário
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

// Formata data
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("pt-BR")
}
