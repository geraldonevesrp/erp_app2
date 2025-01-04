"use client";

import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import { useNfe } from '@/contexts/nfe-context';
import type { NfePedidoEmissao } from '@/lib/nuvemfiscal/api/nfe/types';

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

export function EmissaoNfe() {
  const { loading, emitirNota } = useNfe();
  const { toast } = useToast();

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
    <Card>
      <CardHeader>
        <CardTitle>Emissão de NFe Avulsa</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="dados-gerais">
          <TabsList>
            <TabsTrigger value="dados-gerais">Dados Gerais</TabsTrigger>
            <TabsTrigger value="destinatario">Destinatário</TabsTrigger>
            <TabsTrigger value="produtos">Produtos</TabsTrigger>
            <TabsTrigger value="pagamento">Pagamento</TabsTrigger>
            <TabsTrigger value="transporte">Transporte</TabsTrigger>
          </TabsList>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <TabsContent value="dados-gerais" className="space-y-4">
                <FormField
                  control={form.control}
                  name="ambiente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ambiente</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o ambiente" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="homologacao">Homologação</SelectItem>
                          <SelectItem value="producao">Produção</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Ambiente de emissão da NFe
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="finalidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Finalidade</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="complementar">Complementar</SelectItem>
                          <SelectItem value="ajuste">Ajuste</SelectItem>
                          <SelectItem value="devolucao">Devolução</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Finalidade de emissão da NFe
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="tipo_operacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Operação</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione o tipo de operação" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="entrada">Entrada</SelectItem>
                          <SelectItem value="saida">Saída</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Tipo de operação da NFe
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </TabsContent>
              
              <TabsContent value="destinatario" className="space-y-4">
                <FormField
                  control={form.control}
                  name="destinatario.cpf_cnpj"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CPF/CNPJ</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        CPF ou CNPJ do destinatário
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinatario.nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome/Razão Social</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="destinatario.email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        Email para envio da NFe (opcional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.logradouro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Logradouro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.numero"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.bairro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bairro</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.cep"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CEP</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.uf"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>UF</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="destinatario.endereco.codigo_municipio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código do Município</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>
              
              {/* TODO: Implementar as outras abas */}
              <TabsContent value="produtos">
                Em breve...
              </TabsContent>
              
              <TabsContent value="pagamento">
                Em breve...
              </TabsContent>
              
              <TabsContent value="transporte">
                Em breve...
              </TabsContent>
              
              <div className="flex justify-end">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Emitindo...' : 'Emitir NFe'}
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
