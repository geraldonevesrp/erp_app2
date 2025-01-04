"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import { useNfe } from '@/contexts/nfe-context';
import type { NfePedidoEmissao } from '@/lib/nuvemfiscal/api/nfe/types';

// Seções
import { DadosGerais } from './sections/dados-gerais';
import { Destinatario } from './sections/destinatario';

const formSchema = z.object({
  ambiente: z.enum(['homologacao', 'producao']),
  finalidade: z.enum(['normal', 'complementar', 'ajuste', 'devolucao']),
  tipo_operacao: z.enum(['entrada', 'saida']),
  destinatario: z.object({
    cpf_cnpj: z.string().min(11).max(14),
    nome: z.string().min(2),
    email: z.string().email().optional(),
    endereco: z.object({
      logradouro: z.string(),
      numero: z.string(),
      bairro: z.string(),
      cep: z.string().length(8),
      uf: z.string().length(2),
      codigo_municipio: z.string().length(7),
    }),
  }),
});

export function NfeEdit() {
  const { loading, emitirNota } = useNfe();
  const { toast } = useToast();
  const [openSections, setOpenSections] = useState({
    dadosGerais: true,
    destinatario: true,
    produtos: false,
    pagamento: false,
    transporte: false,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ambiente: 'homologacao',
      finalidade: 'normal',
      tipo_operacao: 'saida',
      destinatario: {
        endereco: {
          uf: 'SP',
        },
      },
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const pedido: NfePedidoEmissao = {
        ...values,
        modelo: '55',
        itens: [],
        pagamento: {
          formas_pagamento: [],
        },
        totais: {
          base_calculo_icms: 0,
          valor_icms: 0,
          valor_produtos: 0,
          valor_total: 0,
        },
      };
      
      const nfe = await emitirNota(pedido);
      
      toast({
        title: 'NFe emitida com sucesso',
        description: `Chave: ${nfe.chave}`,
      });
    } catch (error: any) {
      console.error('Erro ao emitir NFe:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao emitir NFe',
        description: error.message,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <DadosGerais 
          form={form} 
          isOpen={openSections.dadosGerais} 
        />
        
        <Destinatario 
          form={form} 
          isOpen={openSections.destinatario} 
        />
        
        {/* TODO: Implementar as outras seções */}
        
        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            {loading ? 'Emitindo...' : 'Emitir NFe'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
