import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { AsaasWebhookEvent } from '@/lib/asaas/types'

export async function POST(request: Request) {
  try {
    const event: AsaasWebhookEvent = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    // Verifica se é um evento de pagamento
    if (!event.payment) {
      return NextResponse.json({ error: 'Evento não suportado' }, { status: 400 })
    }

    // Busca o cliente pelo asaas_id
    const { data: cliente } = await supabase
      .from('asaas_clientes')
      .select('perfis_id')
      .eq('asaas_id', event.payment.customer)
      .single()

    if (!cliente) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
    }

    // Atualiza o status do pagamento
    const { error: updateError } = await supabase
      .from('asaas_payments')
      .update({
        status: event.payment.status,
        data_pagamento: event.payment.paymentDate || event.payment.clientPaymentDate
      })
      .eq('asaas_id', event.payment.id)

    if (updateError) {
      console.error('Erro ao atualizar pagamento:', updateError)
      return NextResponse.json({ error: 'Erro ao atualizar pagamento' }, { status: 500 })
    }

    // Se o pagamento foi confirmado, ativa a revenda
    if (event.payment.status === 'RECEIVED' || event.payment.status === 'CONFIRMED') {
      const { error: perfilError } = await supabase
        .from('perfis')
        .update({
          revenda_status: 2, // Ativo
          updated_at: new Date().toISOString()
        })
        .eq('id', cliente.perfis_id)

      if (perfilError) {
        console.error('Erro ao ativar revenda:', perfilError)
        return NextResponse.json({ error: 'Erro ao ativar revenda' }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}
