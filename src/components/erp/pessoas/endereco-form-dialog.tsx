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
import { Switch } from "@/components/ui/switch"

const enderecoSchema = z.object({
  titulo: z.string().min(1, "Título"),
  cep: z.string()
    .min(8, "CEP")
    .max(9, "CEP")
    .regex(/^[0-9]{5}-?[0-9]{3}$/, "CEP"),
  logradouro: z.string().min(1, "Logradouro").trim(),
  numero: z.string().refine((val) => {
    if (val === "S/N") return true
    return val && val.length > 0
  }, "Número"),
  complemento: z.string().optional().nullable(),
  bairro: z.string().min(1, "Bairro").trim(),
  localidade: z.string().min(1, "Cidade").trim(),
  uf: z.string().length(2, "UF").trim(),
  ibge: z.string().optional().nullable(),
  gia: z.string().optional().nullable(),
  ddd: z.string().optional().nullable(),
  siafi: z.string().optional().nullable(),
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
  const [semNumero, setSemNumero] = useState(false)
  const { saveEndereco, searchCep } = useEnderecoOperations()

  const form = useForm<EnderecoFormData>({
    resolver: zodResolver(enderecoSchema),
    mode: "onChange",
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
      setSemNumero(!!endereco.sem_numero)
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
      setSemNumero(false)
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

  const handleSemNumeroChange = (checked: boolean) => {
    setSemNumero(checked)
    if (checked) {
      form.setValue("numero", "S/N", { shouldValidate: true })
    } else {
      form.setValue("numero", "", { shouldValidate: true })
    }
  }

  const formatCep = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 5) return numbers
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`
  }

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>, field: any) => {
    const value = e.target.value
    const numbers = value.replace(/\D/g, '')
    field.onChange(formatCep(value))
    
    if (numbers.length === 8) {
      try {
        setLoading(true)
        const data = await searchCep(numbers)
        if (data) {
          form.setValue("logradouro", data.logradouro || "", { shouldValidate: true })
          form.setValue("bairro", data.bairro || "", { shouldValidate: true })
          form.setValue("localidade", data.localidade || "", { shouldValidate: true })
          form.setValue("uf", data.uf || "", { shouldValidate: true })
          form.setValue("ibge", data.ibge || "")
          form.setValue("gia", data.gia || "")
          form.setValue("ddd", data.ddd || "")
          form.setValue("siafi", data.siafi || "")
          
          // Dispara validação do formulário
          await form.trigger(["logradouro", "bairro", "localidade", "uf"])
        }
      } catch (error: any) {
        toast.error(`Erro ao buscar CEP: ${error.message}`)
      } finally {
        setLoading(false)
      }
    }
  }

  const onSubmit = async (data: EnderecoFormData) => {
    try {
      setLoading(true)

      if (!endereco?.pessoa_id) {
        throw new Error("ID da pessoa não informado")
      }

      await saveEndereco({
        ...data,
        id: endereco.id,
        pessoa_id: endereco.pessoa_id,
        sem_numero: semNumero
      })
      toast.success(endereco.id ? "Endereço atualizado com sucesso!" : "Endereço criado com sucesso!")

      onOpenChange(true)
    } catch (error: any) {
      toast.error(`Erro ao salvar endereço: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={() => onOpenChange()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {endereco?.id ? "Editar Endereço" : "Novo Endereço"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "Título"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: Casa, Trabalho..." />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="cep"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "CEP"}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="00000-000"
                          maxLength={9}
                          onChange={(e) => handleCepChange(e, field)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="logradouro"
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-4">
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "Logradouro"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="col-span-2 space-y-4">
                  <FormField
                    control={form.control}
                    name="numero"
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                          {fieldState.error ? `${fieldState.error.message} *` : "Número"}
                        </FormLabel>
                        <FormControl>
                          <Input {...field} disabled={semNumero} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="sem-numero"
                      checked={semNumero}
                      onCheckedChange={handleSemNumeroChange}
                    />
                    <label
                      htmlFor="sem-numero"
                      className="text-sm text-muted-foreground cursor-pointer"
                    >
                      Sem número
                    </label>
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="complemento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Complemento</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Ex: Apto 101, Bloco B..." />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-6 gap-4">
                <FormField
                  control={form.control}
                  name="bairro"
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-3">
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "Bairro"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localidade"
                  render={({ field, fieldState }) => (
                    <FormItem className="col-span-2">
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "Cidade"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} readOnly className="bg-muted" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="uf"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className={fieldState.error ? "text-destructive" : ""}>
                        {fieldState.error ? `${fieldState.error.message} *` : "UF"}
                      </FormLabel>
                      <FormControl>
                        <Input {...field} maxLength={2} readOnly className="bg-muted" />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
