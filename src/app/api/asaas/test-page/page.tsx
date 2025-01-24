'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'

export default function TestAsaasPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [customerId, setCustomerId] = useState<string | null>(null)
  const [paymentId, setPaymentId] = useState<string | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null)

  const testCreateCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      setQrCodeUrl(null)
      
      console.log('Testando criação de cliente...')
      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: '/customers',
          data: {
            name: "Cliente Teste",
            cpfCnpj: "19540550000121",
            mobilePhone: "4799376637",
            email: "teste@teste.com",
            postalCode: "01001000",
            addressNumber: "123"
          }
        })
      })

      const data = await response.json()
      console.log('Resposta:', data)
      setResult(data)

      // Guarda o ID do cliente para usar depois
      if (data.success && data.data.id) {
        setCustomerId(data.data.id)
      }

    } catch (err) {
      console.error('Erro:', err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const testCreatePayment = async () => {
    if (!customerId) {
      setError('Primeiro crie um cliente!')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setQrCodeUrl(null)
      
      console.log('Testando criação de cobrança...')
      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: '/payments',
          data: {
            customer: customerId,
            billingType: 'PIX',
            value: 297.00,
            dueDate: '2025-01-25',
            description: 'Ativação de Revenda - Teste'
          }
        })
      })

      const data = await response.json()
      console.log('Resposta:', data)
      setResult(data)

      // Guarda o ID do pagamento para usar depois
      if (data.success && data.data.id) {
        setPaymentId(data.data.id)
      }

    } catch (err) {
      console.error('Erro:', err)
      setError(String(err))
    } finally {
      setLoading(false)
    }
  }

  const testGetPixQrCode = async () => {
    if (!paymentId) {
      setError('Primeiro crie uma cobrança!')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setResult(null)
      
      console.log('Buscando QR Code PIX...')
      const response = await fetch('/api/asaas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          endpoint: `/payments/${paymentId}/pixQrCode`
        })
      })

      // Verifica o content-type
      const contentType = response.headers.get('content-type')
      console.log('Content-Type:', contentType)

      // Se não for ok, pega o erro
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro na resposta:', errorText)
        throw new Error(errorText)
      }

      // Se chegou aqui, a resposta está ok
      const data = await response.json()
      
      // A resposta contém a imagem em base64
      if (data.success && data.data.encodedImage) {
        const imageUrl = `data:image/png;base64,${data.data.encodedImage}`
        setQrCodeUrl(imageUrl)
        setResult({
          ...data.data,
          encodedImage: '(imagem em base64 omitida)'
        })
      } else {
        throw new Error('QR Code não encontrado na resposta')
      }

    } catch (err) {
      console.error('Erro:', err)
      setError(String(err))
      setQrCodeUrl(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4">Teste do Asaas</h1>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Button 
              onClick={testCreateCustomer}
              disabled={loading}
            >
              {loading ? 'Testando...' : '1. Criar Cliente'}
            </Button>

            <Button 
              onClick={testCreatePayment}
              disabled={loading || !customerId}
            >
              {loading ? 'Testando...' : '2. Criar Cobrança PIX'}
            </Button>

            <Button 
              onClick={testGetPixQrCode}
              disabled={loading || !paymentId}
            >
              {loading ? 'Testando...' : '3. Gerar QR Code'}
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            {customerId && <p>ID do Cliente: {customerId}</p>}
            {paymentId && <p>ID do Pagamento: {paymentId}</p>}
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {qrCodeUrl && (
            <div className="mt-4 flex flex-col items-center">
              <h2 className="text-lg font-semibold mb-2">QR Code PIX:</h2>
              {/* eslint-disable-next-line */}
              <img 
                src={qrCodeUrl} 
                alt="QR Code PIX" 
                className="w-64 h-64 object-contain"
              />
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h2 className="text-lg font-semibold mb-2">Resultado:</h2>
              <pre className="bg-gray-100 p-4 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
