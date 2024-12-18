"use client"

import * as React from "react"
import { ExpandableCard } from "@/components/ui/expandable-card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { Camera } from "lucide-react"
import { EmpresaLogo } from "./empresa-logo"
import { EmpresaLogoUpload } from "./empresa-logo-upload"
import { PhotoModal } from "@/components/ui/photo-modal"

interface EmpresaDadosProps {
  data: any
  onChange: (field: string, value: any) => void
  loading?: boolean
}

const SectionCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm p-6",
      className
    )}
    {...props}
  />
))
SectionCard.displayName = "SectionCard"

export function EmpresaDados({ data, onChange, loading = false }: EmpresaDadosProps) {
  const [isUploadingLogo, setIsUploadingLogo] = React.useState(false)
  const [isLogoModalOpen, setIsLogoModalOpen] = React.useState(false)
  const [isViewLogoOpen, setIsViewLogoOpen] = React.useState(false)

  return (
    <ExpandableCard title="Dados da Empresa" defaultExpanded>
      <div className="grid gap-6">
        <SectionCard>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Coluna da Logo */}
            <div className="flex-shrink-0 mx-auto sm:mx-0 space-y-2 px-8">
              <div className="relative">
                <div 
                  onClick={() => data?.logo_url && setIsViewLogoOpen(true)} 
                  className={cn(
                    "transition-transform",
                    data?.logo_url && "cursor-pointer hover:scale-105"
                  )}
                >
                  <EmpresaLogo
                    empresaId={data?.id}
                    perfilId={data?.perfis_id}
                    logoUrl={data?.logo_url}
                    onLogoUpdated={(url) => onChange("logo_url", url)}
                    disabled={loading}
                  />
                </div>
              </div>
              
              <label 
                htmlFor="logo-upload"
                className={cn(
                  "inline-flex w-full items-center justify-center gap-2 px-4 py-2 rounded-md",
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                  "transition-colors cursor-pointer",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <Camera className="h-4 w-4" />
                {isUploadingLogo ? "Processando..." : "Alterar logo"}
              </label>

              <EmpresaLogoUpload
                open={isLogoModalOpen}
                onOpenChange={setIsLogoModalOpen}
                onLogoUpdated={(url) => {
                  onChange("logo_url", url)
                  setIsLogoModalOpen(false)
                }}
                onLoadingChange={setIsUploadingLogo}
                empresaId={data?.id}
                perfilId={data?.perfis_id}
                logoUrl={data?.logo_url}
              />

              {/* Modal de Visualização da Logo */}
              <PhotoModal
                isOpen={isViewLogoOpen}
                onClose={() => setIsViewLogoOpen(false)}
                photoUrl={data?.logo_url || ""}
                alt="Logo da empresa em tamanho grande"
              />
            </div>

            {/* Campos principais */}
            <div className="flex-1 grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1">
                  <Label htmlFor="razao_social">Razão Social*</Label>
                  <Input
                    id="razao_social"
                    value={data?.razao_social || ""}
                    onChange={(e) => onChange("razao_social", e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="fantasia">Fantasia*</Label>
                  <Input
                    id="fantasia"
                    value={data?.fantasia || ""}
                    onChange={(e) => onChange("fantasia", e.target.value)}
                  />
                </div>
                <div className="col-span-1">
                  <Label htmlFor="cnpj">CNPJ*</Label>
                  <Input
                    id="cnpj"
                    value={data?.cnpj || ""}
                    onChange={(e) => onChange("cnpj", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="ie">Insc. Estadual</Label>
                  <Input
                    id="ie"
                    value={data?.ie || ""}
                    onChange={(e) => onChange("ie", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="ie_st">Insc. Estadual Substituto tributário</Label>
                  <Input
                    id="ie_st"
                    value={data?.ie_st || ""}
                    onChange={(e) => onChange("ie_st", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="im">Insc. Municipal*</Label>
                  <Input
                    id="im"
                    value={data?.im || ""}
                    onChange={(e) => onChange("im", e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="cnae">CNAE</Label>
                  <Input
                    id="cnae"
                    value={data?.cnae || ""}
                    onChange={(e) => onChange("cnae", e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="fis_regimes_tributarios_id">Regime de Apuração</Label>
                  <Select 
                    value={data?.fis_regimes_tributarios_id?.toString() || ""} 
                    onValueChange={(value) => onChange("fis_regimes_tributarios_id", parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Simples Nacional</SelectItem>
                      <SelectItem value="2">Lucro Presumido</SelectItem>
                      <SelectItem value="3">Lucro Real</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={data?.email || ""}
                onChange={(e) => onChange("email", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="fone">Telefone</Label>
              <Input
                id="fone"
                value={data?.fone || ""}
                onChange={(e) => onChange("fone", e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={data?.whatsapp || ""}
                onChange={(e) => onChange("whatsapp", e.target.value)}
              />
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="grid gap-4">
            <Label>Endereço</Label>
            <div className="grid grid-cols-6 gap-4">
              <div>
                <Label htmlFor="cep">CEP*</Label>
                <Input
                  id="cep"
                  value={data?.cep || ""}
                  onChange={(e) => onChange("cep", e.target.value)}
                />
              </div>
              <div className="col-span-3">
                <Label htmlFor="logradouro">Logradouro*</Label>
                <Input
                  id="logradouro"
                  value={data?.logradouro || ""}
                  onChange={(e) => onChange("logradouro", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="numero">Número*</Label>
                <Input
                  id="numero"
                  value={data?.numero || ""}
                  onChange={(e) => onChange("numero", e.target.value)}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="sem_numero"
                  checked={!data?.numero}
                  onCheckedChange={(checked) => onChange("numero", checked ? null : "")}
                />
                <Label htmlFor="sem_numero">Sem Número</Label>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={data?.complemento || ""}
                  onChange={(e) => onChange("complemento", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="bairro">Bairro*</Label>
                <Input
                  id="bairro"
                  value={data?.bairro || ""}
                  onChange={(e) => onChange("bairro", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="municipio">Município*</Label>
                <Input
                  id="municipio"
                  value={data?.municipio || ""}
                  onChange={(e) => onChange("municipio", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="uf">UF*</Label>
              <Select 
                value={data?.uf || ""} 
                onValueChange={(value) => onChange("uf", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SP">SP</SelectItem>
                  <SelectItem value="RJ">RJ</SelectItem>
                  <SelectItem value="MG">MG</SelectItem>
                  {/* Adicionar outros estados conforme necessário */}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="grid gap-4">
            <Label>E-mails Padrões de Envio</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email_nfe">E-mail NFe</Label>
                <Input
                  id="email_nfe"
                  value={data?.email_nfe || ""}
                  onChange={(e) => onChange("email_nfe", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nome_email_nfe">Nome no E-mail NFe</Label>
                <Input
                  id="nome_email_nfe"
                  value={data?.nome_email_nfe || ""}
                  onChange={(e) => onChange("nome_email_nfe", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email_boletos">E-mail Boletos</Label>
                <Input
                  id="email_boletos"
                  value={data?.email_boletos || ""}
                  onChange={(e) => onChange("email_boletos", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nome_email_boletos">Nome no E-mail Boletos</Label>
                <Input
                  id="nome_email_boletos"
                  value={data?.nome_email_boletos || ""}
                  onChange={(e) => onChange("nome_email_boletos", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email_vendas">E-mail Vendas</Label>
                <Input
                  id="email_vendas"
                  value={data?.email_vendas || ""}
                  onChange={(e) => onChange("email_vendas", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nome_email_vendas">Nome no E-mail Vendas</Label>
                <Input
                  id="nome_email_vendas"
                  value={data?.nome_email_vendas || ""}
                  onChange={(e) => onChange("nome_email_vendas", e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email_compras">E-mail Compras</Label>
                <Input
                  id="email_compras"
                  value={data?.email_compras || ""}
                  onChange={(e) => onChange("email_compras", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="nome_email_compras">Nome no E-mail Compras</Label>
                <Input
                  id="nome_email_compras"
                  value={data?.nome_email_compras || ""}
                  onChange={(e) => onChange("nome_email_compras", e.target.value)}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="grid gap-4">
            <Label>Configuração para Emissão de Boletos</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="boletos_juros_mensais">Juros Mensais Padrão (%)</Label>
                <Input
                  id="boletos_juros_mensais"
                  type="number"
                  value={data?.boletos_juros_mensais || "0.00"}
                  onChange={(e) => onChange("boletos_juros_mensais", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="boleto_multa_padrao">Multa Padrão (%)</Label>
                <Input
                  id="boleto_multa_padrao"
                  type="number"
                  value={data?.boleto_multa_padrao || "0.00"}
                  onChange={(e) => onChange("boleto_multa_padrao", parseFloat(e.target.value))}
                />
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="grid gap-4">
            <Label>Configurações para Cobrança de Juro por atraso no Pagamento</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cob_juros_mensais">Juros Mensais (%)</Label>
                <Input
                  id="cob_juros_mensais"
                  type="number"
                  value={data?.cob_juros_mensais || "0.00"}
                  onChange={(e) => onChange("cob_juros_mensais", parseFloat(e.target.value))}
                />
              </div>
              <div>
                <Label htmlFor="cob_juros_modo">Modo de cobrança do Juro</Label>
                <Select 
                  value={data?.cob_juros_modo?.toString() || ""} 
                  onValueChange={(value) => onChange("cob_juros_modo", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Diário</SelectItem>
                    <SelectItem value="2">Mensal</SelectItem>
                    <SelectItem value="3">Anual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </ExpandableCard>
  )
}
