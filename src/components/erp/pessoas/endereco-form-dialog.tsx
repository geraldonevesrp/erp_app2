"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { useEnderecoOperations } from "@/hooks/use-endereco-operations"
import { PessoaEndereco } from "@/types/pessoa"

const enderecoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  cep: z.string().min(1, "CEP é obrigatório"),
  logradouro: z.string().min(1, "Logradouro é obrigatório"),
  numero: z.string().min(1, "Número é obrigatório"),
  complemento: z.string().optional(),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  localidade: z.string().min(1, "Cidade é obrigatória"),
  uf: z.string().min(1, "UF é obrigatória"),
  ibge: z.string().optional(),
  gia: z.string().optional(),
  ddd: z.string().optional(),
  siafi: z.string().optional(),
  principal: z.boolean().optional()
})

type EnderecoFormData = z.infer<typeof enderecoSchema>

interface EnderecoFormDialogProps {
  open: boolean
  onOpenChange: (saved?: boolean) => void
  endereco?: Partial<PessoaEndereco> | null
}

export function EnderecoFormDialog({
  open,
  onOpenChange,
  endereco
}: EnderecoFormDialogProps) {
  const [loading, setLoading] = useState(false)
  const { createEndereco, updateEndereco, searchCep } = useEnderecoOperations()

  const form = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema),
    defaultValues: {
      titulo: "",
      cep: "",
      logradouro: "",
      numero: "",
      complemento: "",
      bairro: "",
      localidade: "",
      uf: "",
      ibge: "",
      gia: "",
      ddd: "",
      siafi: "",
      principal: false
    }
  })

  useEffect(() => {
    if (endereco) {
      form.reset({
        titulo: endereco.titulo || "",
        cep: endereco.cep || "",
        logradouro: endereco.logradouro || "",
        numero: endereco.numero || "",
        complemento: endereco.complemento || "",
        bairro: endereco.bairro || "",
        localidade: endereco.localidade || "",
        uf: endereco.uf || "",
        ibge: endereco.ibge || "",
        gia: endereco.gia || "",
        ddd: endereco.ddd || "",
        siafi: endereco.siafi || "",
        principal: endereco.principal || false
      })
    } else {
      form.reset({
        titulo: "",
        cep: "",
        logradouro: "",
        numero: "",
        complemento: "",
        bairro: "",
        localidade: "",
        uf: "",
        ibge: "",
        gia: "",
        ddd: "",
        siafi: "",
        principal: false
      })
    }
  }, [endereco])

  const handleCepBlur = async (cep: string) => {
    if (!cep || cep.length !== 8) return

    try {
      setLoading(true)
      const data = await searchCep(cep)
      if (data) {
        form.setValue("logradouro", data.logradouro || "")
        form.setValue("bairro", data.bairro || "")
        form.setValue("localidade", data.localidade || "")
        form.setValue("uf", data.uf || "")
        form.setValue("ibge", data.ibge || "")
        form.setValue("gia", data.gia || "")
        form.setValue("ddd", data.ddd || "")
        form.setValue("siafi", data.siafi || "")
      }
    } catch (error: any) {
      toast.error(`Erro ao buscar CEP: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: EnderecoFormData) => {
    try {
      setLoading(true)

      if (endereco?.id) {
        await updateEndereco(endereco.id, {
          ...data,
          pessoa_id: endereco.pessoa_id
        })
        toast.success("Endereço atualizado com sucesso!")
      } else if (endereco?.pessoa_id) {
        await createEndereco({
          ...data,
          pessoa_id: endereco.pessoa_id
        })
        toast.success("Endereço criado com sucesso!")
      }

      onOpenChange(true)
    } catch (error: any) {
      toast.error(`Erro ao salvar endereço: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {endereco?.id ? "Editar Endereço" : "Novo Endereço"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Casa, Trabalho..." />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>CEP</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00000000"
                          onBlur={(e) => {
                            field.onBlur()
                            handleCepBlur(e.target.value.replace(/\D/g, ""))
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
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
                  name="numero"
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

              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="bairro"
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
                  name="localidade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cidade</FormLabel>
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
                  name="uf"
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
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange()}
                  disabled={loading}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {endereco?.id ? "Atualizar" : "Criar"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
