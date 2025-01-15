'use client'

import { useEffect, useState } from 'react'
import { AsaasClient } from '@/lib/asaas/api'

export default function TestarAsaasPage() {
  const [status, setStatus] = useState<string>('Testando conexão...')

  useEffect(() => {
    async function testarConexao() {
      try {
        const asaas = new AsaasClient()
        const resultado = await asaas.testConnection()
        setStatus(resultado ? 'Conexão OK!' : 'Erro na conexão')
      } catch (error: any) {
        setStatus(`Erro: ${error.message}`)
      }
    }

    testarConexao()
  }, [])

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Conexão com Asaas</h1>
      <div className="p-4 border rounded">
        <p>Status: {status}</p>
      </div>
    </div>
  )
}
