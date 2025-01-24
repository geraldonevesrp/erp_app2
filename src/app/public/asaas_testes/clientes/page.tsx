'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { ReloadIcon } from '@radix-ui/react-icons'

interface Customer {
  object: string
  id: string
  name: string
  cpfCnpj: string
  email: string
  phone: string
  mobilePhone: string
  address: string
  addressNumber: string
  complement: string
  province: string
  postalCode: string
  dateCreated: string
  deleted: boolean
  additionalEmails: string
  externalReference: string
  notificationDisabled: boolean
  city: number
  state: string
  country: string
  observations: string
}

interface CustomerResponse {
  success: boolean
  data: {
    object: string
    hasMore: boolean
    totalCount: number
    limit: number
    offset: number
    data: Customer[]
  }
}

export default function ClientesAsaas() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function loadCustomers() {
    try {
      setLoading(true)
      const response = await fetch('/api/asaas/test')
      const data: CustomerResponse = await response.json()

      if (!data.success) {
        throw new Error('Erro ao carregar clientes')
      }

      setCustomers(data.data.data)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar clientes')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  return (
    <div className="container mx-auto">
      <Card className="border-0 shadow-none">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Clientes ({customers.length})</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadCustomers()}
              disabled={loading}
            >
              {loading ? (
                <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <ReloadIcon className="mr-2 h-4 w-4" />
              )}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="rounded-md bg-destructive/15 p-4">
              <div className="flex">
                <div className="flex-shrink-0"></div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-destructive">
                    Erro ao carregar clientes
                  </h3>
                  <div className="mt-2 text-sm text-destructive">
                    <p>{error}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative">
              {loading && (
                <div className="absolute inset-0 z-10 bg-background/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>CPF/CNPJ</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Endereço</TableHead>
                    <TableHead>Data de Criação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id}>
                      <TableCell className="font-mono">{customer.id}</TableCell>
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.cpfCnpj}</TableCell>
                      <TableCell>{customer.email}</TableCell>
                      <TableCell>{customer.phone || customer.mobilePhone}</TableCell>
                      <TableCell>
                        {customer.address && (
                          <>
                            {customer.address}, {customer.addressNumber}
                            {customer.complement && ` - ${customer.complement}`}
                            <br />
                            {customer.province} - {customer.city} / {customer.state}
                            <br />
                            CEP: {customer.postalCode}
                          </>
                        )}
                      </TableCell>
                      <TableCell>
                        {format(new Date(customer.dateCreated), 'dd/MM/yyyy')}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
