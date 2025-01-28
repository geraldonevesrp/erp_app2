'use client'
import { useState } from 'react'

export default function SubcontasPage() {
  const [loading, setLoading] = useState(false)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const criarSubconta = async () => {
    try {
      setLoading(true)
      setResponse(null)
      setError(null)
      
      const testData = {
        name: "Subconta Teste",
        email: `teste${Date.now()}@teste.com`,
        loginEmail: `teste${Date.now()}@teste.com`,
        cpfCnpj: "31382903000108",
        birthDate: "1994-05-16",
        companyType: "LIMITED", // Valores possíveis: MEI, LIMITED, INDIVIDUAL, ASSOCIATION
        personType: "JURIDICA",
        phone: "11 32300606",
        mobilePhone: "11988451155",
        site: "https://meusite.com.br",
        incomeValue: 5000.00,
        address: "Av. Rolf Wiest",
        addressNumber: "277",
        complement: "Sala 502",
        province: "Bom Retiro",
        postalCode: "89223005",
        webhooks: [{
          name: "asaas_webhook",
          url: "https://meusite.com.br/webhook",
          email: `teste${Date.now()}@teste.com`,
          enabled: true,
          interrupted: false,
          apiVersion: 3,
          authToken: "00000000-0000-0000-0000-000000000000", // Será substituído pelo backend
          sendType: "SEQUENTIALLY",
          events: ["PAYMENT_CREATED", "PAYMENT_UPDATED", "PAYMENT_CONFIRMED", "PAYMENT_RECEIVED", "PAYMENT_OVERDUE"]
        }]
      }

      const response = await fetch('/api/asaas/accounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(testData)
      })

      const data = await response.json()
      console.log('=== RESPOSTA DA API ===')
      console.log(JSON.stringify(data, null, 2))
      setResponse(data)
    } catch (error) {
      console.error('Erro ao criar subconta:', error)
      setError(`Erro ao criar subconta: ${error}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teste de Subcontas Asaas</h1>
      <p className="mb-4 text-gray-600">
        Teste a criação de subcontas no ambiente sandbox do Asaas.
      </p>

      {/* Card de Criação */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-2">Criar Nova Subconta</h2>
        <button
          onClick={criarSubconta}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Criando...' : 'Criar Subconta de Teste'}
        </button>

        {error && (
          <div className="mt-4 p-2 bg-red-100 border border-red-300 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {response && (
          <div className="mt-4">
            <h3 className="font-semibold mb-2">Resposta da API:</h3>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {JSON.stringify(response, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
