export function getSubdomain(hostname: string): string | null {
  // Remove a porta se existir
  const host = hostname.split(':')[0]
  
  // Se for localhost, pega o primeiro segmento
  if (host.includes('localhost')) {
    const subdomain = host.split('.')[0]
    return subdomain === 'localhost' ? null : subdomain
  }
  
  // Para domínios normais
  const parts = host.split('.')
  if (parts.length > 2) {
    return parts[0]
  }
  
  return null
}

export function isRootDomain(hostname: string): boolean {
  const subdomain = getSubdomain(hostname)
  return !subdomain || subdomain === 'www'
}
