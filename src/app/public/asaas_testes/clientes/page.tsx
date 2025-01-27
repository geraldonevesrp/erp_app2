'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'

interface TestResponse {
  success: boolean
  message?: string
  error?: string
  status?: number
  data?: any
  config?: any
}

export default function AsaasTestPage() {
  const [loginResponse, setLoginResponse] = useState<TestResponse | null>(null)
  const [clientsResponse, setClientsResponse] = useState<TestResponse | null>(null)
  const [isTestingLogin, setIsTestingLogin] = useState(false)
  const [isTestingClients, setIsTestingClients] = useState(false)

  const testLogin = async () => {
    try {
      setIsTestingLogin(true)
      setLoginResponse(null)
      
      const response = await fetch('/api/asaas/test')
      const data = await response.json()
      
      setLoginResponse(data)
    } catch (error) {
      setLoginResponse({
        success: false,
        error: String(error)
      })
    } finally {
      setIsTestingLogin(false)
    }
  }

  const testClients = async () => {
    try {
      setIsTestingClients(true)
      setClientsResponse(null)
      
      const response = await fetch('/api/asaas/test/clients')
      const data = await response.json()
      
      setClientsResponse(data)
    } catch (error) {
      setClientsResponse({
        success: false,
        error: String(error)
      })
    } finally {
      setIsTestingClients(false)
    }
  }

  const renderResponse = (response: TestResponse | null) => {
    if (!response) return null

    return (
      <div className="mt-4 space-y-4">
        <div className="rounded-lg bg-slate-50 p-4">
          <h4 className="font-medium text-sm mb-2">Status</h4>
          <div className={`text-sm ${response.success ? 'text-green-600' : 'text-red-600'}`}>
            {response.success ? 'Sucesso' : 'Erro'}
          </div>
        </div>

        {response.status && (
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-sm mb-2">Código de Status</h4>
            <div className="text-sm">{response.status}</div>
          </div>
        )}

        {response.message && (
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-sm mb-2">Mensagem</h4>
            <div className="text-sm">{response.message}</div>
          </div>
        )}

        {response.error && (
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-sm mb-2">Erro</h4>
            <div className="text-sm text-red-600">{response.error}</div>
          </div>
        )}

        {response.data && (
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-sm mb-2">Dados da Resposta</h4>
            <pre className="text-xs overflow-auto max-h-96">
              {typeof response.data === 'string' 
                ? response.data 
                : JSON.stringify(response.data, null, 2)}
            </pre>
          </div>
        )}

        {response.config && (
          <div className="rounded-lg bg-slate-50 p-4">
            <h4 className="font-medium text-sm mb-2">Configurações Usadas na API</h4>
            <pre className="text-xs overflow-auto max-h-96 whitespace-pre-wrap">
              {JSON.stringify(response.config, null, 2)}
            </pre>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Testes da API do Asaas</h1>

      <Card className="w-full">
        <CardHeader>
          <CardTitle>Variáveis de Ambiente</CardTitle>
          <CardDescription>Mostra as variáveis de ambiente configuradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div>
              <strong>NODE_ENV:</strong> {process.env.NODE_ENV}
            </div>
            <div>
              <strong>ASAAS_ENV:</strong> {process.env.ASAAS_ENV}
            </div>
            <div>
              <strong>ASAAS_API_KEY:</strong> {process.env.ASAAS_API_KEY?.substring(0, 10)}...
            </div>
            <div>
              <strong>ASAAS_WALLET_ID:</strong> {process.env.ASAAS_WALLET_ID}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Autenticação</CardTitle>
          <CardDescription>
            Verifica se as credenciais do Asaas estão configuradas corretamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loginResponse && (
              <>
                <div>
                  <p className="font-medium">Status</p>
                  <pre className="bg-gray-100 p-2 rounded mt-1">
                    {loginResponse.success ? 'Sucesso' : 'Erro'}
                  </pre>
                </div>

                {loginResponse.config && (
                  <div>
                    <p className="font-medium">Configurações Usadas na API</p>
                    <pre className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                      {JSON.stringify(loginResponse.config, null, 2)}
                    </pre>
                  </div>
                )}

                {!loginResponse.success && (
                  <>
                    <div>
                      <p className="font-medium">Código de Status</p>
                      <pre className="bg-gray-100 p-2 rounded mt-1">
                        {loginResponse.status}
                      </pre>
                    </div>
                    <div>
                      <p className="font-medium">Erro</p>
                      <pre className="bg-gray-100 p-2 rounded mt-1 whitespace-pre-wrap">
                        {loginResponse.error}
                      </pre>
                    </div>
                  </>
                )}
              </>
            )}

            <Button 
              onClick={testLogin}
              disabled={isTestingLogin}
            >
              {isTestingLogin ? 'Testando...' : 'Testar Autenticação'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teste de Listagem de Clientes</CardTitle>
          <CardDescription>
            Tenta buscar a lista de clientes do Asaas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            onClick={testClients}
            disabled={isTestingClients}
          >
            {isTestingClients ? 'Testando...' : 'Buscar Clientes'}
          </Button>
          {renderResponse(clientsResponse)}
        </CardContent>
      </Card>
    </div>
  )
}
