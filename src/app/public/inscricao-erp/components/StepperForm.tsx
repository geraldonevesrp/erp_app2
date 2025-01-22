'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useToast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSearchParams } from 'next/navigation'
import { useRevendaPerfil } from '@/contexts/revendas/perfil'
import TermosModal from './TermosModal'

// Tipos
interface FormData {
  email: string
  dominio: string
  tipo_pessoa: 'F' | 'J'
  nome_empresa: string
  nome_completo: string
  apelido: string
  telefone: string
  celular: string
  whatsapp: string
  cpf_cnpj: string
  cep: string
  logradouro: string
  numero: string
  complemento: string
  bairro: string
  municipio: string
  uf: string
  senha: string
  confirmar_senha: string
  aceite_termos: boolean
}

// Componente StepIndicator para mostrar o progresso
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {Array.from({ length: totalSteps }).map((_, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={index} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200 ${
                isActive
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : isCompleted
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-gray-300 text-gray-500'
              }`}
            >
              {isCompleted ? (
                <svg
                  className="w-4 h-4 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                stepNumber
              )}
            </div>
            {index < totalSteps - 1 && (
              <div
                className={`w-12 h-0.5 mx-2 ${
                  stepNumber < currentStep ? 'bg-indigo-600' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default function StepperForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const planoSelecionado = searchParams.get('plano')
  const { perfil: revendaPerfil } = useRevendaPerfil()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    content: string
  }>({
    isOpen: false,
    title: '',
    content: ''
  })

  const [formData, setFormData] = useState<FormData>({
    email: '',
    dominio: '',
    tipo_pessoa: 'J', // Pessoa Jurídica apenas
    nome_empresa: '',
    nome_completo: '',
    apelido: '',
    telefone: '',
    celular: '',
    whatsapp: '',
    cpf_cnpj: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    senha: '',
    confirmar_senha: '',
    aceite_termos: false
  })

  const [errors, setErrors] = useState({
    email: '',
    dominio: '',
    cpf_cnpj: ''
  })

  // Conteúdo dos termos
  const termosContent = `
TERMOS DE SERVIÇO

1. Aceitação dos Termos
Ao acessar e usar nossos serviços, você concorda em cumprir estes Termos de Serviço.

2. Descrição do Serviço
Fornecemos uma plataforma para gerenciamento empresarial que inclui diversos módulos e funcionalidades.

3. Conta de Usuário
3.1. Você é responsável por manter a confidencialidade de sua conta.
3.2. Você é responsável por todas as atividades que ocorrem em sua conta.

4. Uso Aceitável
4.1. Você concorda em usar o serviço apenas para fins legais.
4.2. Você não deve usar o serviço para atividades fraudulentas.

5. Privacidade
Nosso uso de suas informações é regido por nossa Política de Privacidade.

6. Modificações do Serviço
Reservamo-nos o direito de modificar ou descontinuar o serviço a qualquer momento.

7. Limitação de Responsabilidade
Não nos responsabilizamos por danos indiretos, incidentais ou consequentes.

8. Lei Aplicável
Estes termos são regidos pelas leis do Brasil.
`

  const privacidadeContent = `
POLÍTICA DE PRIVACIDADE

1. Coleta de Informações
1.1. Coletamos informações que você nos fornece diretamente.
1.2. Também coletamos dados automaticamente através do uso do serviço.

2. Uso das Informações
2.1. Usamos suas informações para fornecer e melhorar nossos serviços.
2.2. Suas informações são usadas para comunicações relacionadas ao serviço.

3. Compartilhamento de Informações
3.1. Não vendemos suas informações pessoais.
3.2. Podemos compartilhar informações com prestadores de serviços.

4. Segurança
4.1. Implementamos medidas de segurança para proteger suas informações.
4.2. Nenhum método de transmissão pela Internet é 100% seguro.

5. Seus Direitos
5.1. Você tem direito de acessar suas informações.
5.2. Você pode solicitar a correção ou exclusão de seus dados.

6. Alterações
Podemos atualizar esta política periodicamente.

7. Contato
Entre em contato conosco se tiver dúvidas sobre esta política.
`

  // Função para validar domínio
  const validateDomain = (domain: string) => {
    // Regex para validar domínio: apenas letras minúsculas, números e hífen
    const domainRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/
    return domainRegex.test(domain)
  }

  // Função para tratar mudança no campo de domínio
  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase() // Força letras minúsculas
    
    // Remove caracteres inválidos em tempo real
    const cleanValue = value.replace(/[^a-z0-9-]/g, '')
    
    setFormData(prev => ({ ...prev, dominio: cleanValue }))
    
    // Valida o formato do domínio
    if (cleanValue && !validateDomain(cleanValue)) {
      setErrors(prev => ({ 
        ...prev, 
        dominio: 'Domínio inválido. Use apenas letras minúsculas, números e hífen. Não pode começar ou terminar com hífen.' 
      }))
    } else {
      setErrors(prev => ({ ...prev, dominio: '' }))
    }
  }

  // Função para verificar disponibilidade de email e domínio
  const verificarDisponibilidade = async () => {
    setError(null)
    setIsLoading(true)

    try {
      // Verifica se o email já existe
      const { data: emailExiste, error: emailError } = await supabase
        .rpc('verificar_usuario_existe', {
          email_input: formData.email
        })

      if (emailError) {
        throw new Error('Erro ao verificar email')
      }

      if (emailExiste) {
        setErrors(prev => ({ ...prev, email: 'Este email já está cadastrado' }))
        setIsLoading(false)
        return false
      }

      // Verifica se o domínio já existe
      const { data: dominioExiste, error: dominioError } = await supabase
        .from('perfis')
        .select('id')
        .eq('dominio', formData.dominio)
        .single()

      if (dominioError && dominioError.code !== 'PGRST116') {
        throw new Error('Erro ao verificar domínio')
      }

      if (dominioExiste) {
        setErrors(prev => ({ ...prev, dominio: 'Este domínio já está em uso' }))
        setIsLoading(false)
        return false
      }

      return true
    } catch (error: any) {
      console.error('Erro ao verificar disponibilidade:', error)
      setError(error.message)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar CEP
  const buscarCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/[^\d]/g, '')
      if (cepLimpo.length !== 8) return

      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      const data = await response.json()

      if (data.erro) {
        toast({
          variant: "destructive",
          title: "CEP não encontrado",
          description: "Verifique o CEP informado"
        })
        return
      }

      setFormData(prev => ({
        ...prev,
        logradouro: data.logradouro || '',
        bairro: data.bairro || '',
        municipio: data.localidade || '',
        uf: data.uf || ''
      }))

    } catch (error) {
      console.error('Erro ao buscar CEP:', error)
      toast({
        variant: "destructive",
        title: "Erro ao buscar CEP",
        description: "Não foi possível buscar o endereço. Tente novamente mais tarde."
      })
    }
  }

  // Função para buscar CNPJ
  const buscarCNPJ = async (cnpj: string) => {
    setIsLoading(true)
    try {
      const cnpjLimpo = cnpj.replace(/[^\d]/g, '')
      
      console.log('Buscando CNPJ:', cnpjLimpo)
      const response = await fetch(`/api/cnpj/${cnpjLimpo}`)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Erro ao buscar CNPJ:', errorText)
        toast({
          variant: "destructive",
          title: "Erro ao buscar CNPJ",
          description: "Não foi possível buscar os dados do CNPJ. Tente novamente mais tarde."
        })
        return false
      }

      const data = await response.json()
      console.log('Dados recebidos:', data)
      
      // Monta o telefone completo se disponível
      const telefone = data.telefones?.[0] 
        ? `${data.telefones[0].ddd}${data.telefones[0].numero}` 
        : ''

      // Atualiza o formulário com todos os campos
      setFormData(prev => ({
        ...prev,
        tipo_pessoa: 'J',
        nome_empresa: data.razao_social || '',
        nome_completo: data.razao_social || '',
        apelido: data.nome_fantasia || data.razao_social || '',
        cpf_cnpj: cnpjLimpo || '',
        email: data.email || prev.email || '',
        telefone: telefone || '',
        celular: prev.celular || '',
        whatsapp: prev.whatsapp || '',
        cep: data.endereco?.cep?.replace(/[^\d]/g, '') || '',
        logradouro: data.endereco?.tipo_logradouro ? `${data.endereco.tipo_logradouro} ${data.endereco.logradouro}` : data.endereco?.logradouro || '',
        numero: data.endereco?.numero || '',
        complemento: data.endereco?.complemento || '',
        bairro: data.endereco?.bairro || '',
        municipio: data.endereco?.municipio?.descricao || '',
        uf: data.endereco?.uf || '',
        senha: prev.senha || '',
        confirmar_senha: prev.confirmar_senha || '',
        aceite_termos: prev.aceite_termos || false,
        dominio: prev.dominio || ''
      }))

      return true
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error)
      toast({
        variant: "destructive",
        title: "Erro ao buscar CNPJ",
        description: error instanceof Error ? error.message : "Erro desconhecido"
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const handleNext = async () => {
    // Validações específicas para cada passo
    if (currentStep === 1) {
      // Validar email e domínio
      if (!formData.email || !formData.dominio) {
        setError('Preencha todos os campos')
        return
      }

      if (errors.email || errors.dominio) {
        setError('Corrija os erros antes de continuar')
        return
      }

      setIsLoading(true)
      const disponivel = await verificarDisponibilidade()
      setIsLoading(false)
      if (!disponivel) return
    }

    if (currentStep === 2) {
      // Validar CNPJ primeiro
      if (!formData.cpf_cnpj) {
        setError('Preencha o CNPJ')
        return
      }

      // Buscar dados do CNPJ e aguardar o preenchimento
      setIsLoading(true)
      const cnpjEncontrado = await buscarCNPJ(formData.cpf_cnpj)
      if (!cnpjEncontrado) {
        setIsLoading(false)
        setError('CNPJ não encontrado ou inválido')
        return
      }

      // Avançar para o próximo passo após buscar o CNPJ
      setCurrentStep(prev => prev + 1)
      setError(null)
      setIsLoading(false)
      return
    }

    if (currentStep === 3) {
      // Validar dados cadastrais
      if (!formData.nome_empresa || !formData.apelido || !formData.nome_completo || !formData.celular) {
        setError('Preencha todos os campos')
        return
      }

      setCurrentStep(prev => prev + 1)
      setError(null)
      return
    }

    if (currentStep === 4) {
      // Validar endereço
      if (!formData.cep || !formData.logradouro || !formData.numero || !formData.bairro || !formData.municipio || !formData.uf) {
        setError('Preencha todos os campos')
        return
      }

      setCurrentStep(prev => prev + 1)
      setError(null)
      return
    }

    if (currentStep === 5) {
      // Validar senha e termos
      if (!formData.senha || !formData.confirmar_senha) {
        setError('Preencha todos os campos')
        return
      }

      if (formData.senha !== formData.confirmar_senha) {
        setError('As senhas não conferem')
        return
      }

      if (!formData.aceite_termos) {
        setError('Você precisa aceitar os termos de serviço')
        return
      }

      // Criar conta
      await handleSubmit()
      return
    }

    setCurrentStep(prev => prev + 1)
    setError(null)
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. Criar usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.senha,
      })

      if (authError) throw authError

      // 2. Criar perfil do tipo ERP
      const { data: perfilData, error: perfilError } = await supabase
        .from('perfis')
        .insert([
          {
            nome_completo: formData.nome_completo,
            email: formData.email,
            cpf_cnpj: formData.cpf_cnpj,
            celular: formData.celular,
            tipo: 3, // Tipo ERP
            revenda_id: revendaPerfil?.id,
            user_id: authData.user?.id,
            dominio: formData.dominio,
            apelido: formData.apelido || formData.nome_completo,
            telefone: formData.telefone,
            whatsapp: formData.whatsapp,
            cep: formData.cep,
            logradouro: formData.logradouro,
            numero: formData.numero,
            complemento: formData.complemento,
            bairro: formData.bairro,
            municipio: formData.municipio,
            uf: formData.uf
          }
        ])
        .select()
        .single()

      if (perfilError) throw perfilError

      toast({
        title: "Sucesso!",
        description: "Seu cadastro foi realizado. Verifique seu email para confirmar sua conta."
      })

      // Limpar formulário e voltar ao início
      setFormData({
        email: '',
        dominio: '',
        tipo_pessoa: 'J',
        nome_empresa: '',
        nome_completo: '',
        apelido: '',
        telefone: '',
        celular: '',
        whatsapp: '',
        cpf_cnpj: '',
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        municipio: '',
        uf: '',
        senha: '',
        confirmar_senha: '',
        aceite_termos: false
      })
      setCurrentStep(1)

    } catch (error: any) {
      console.error('Erro ao criar conta:', error)
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOpenTermos = (tipo: 'termos' | 'privacidade') => {
    setModalConfig({
      isOpen: true,
      title: tipo === 'termos' ? 'Termos de Serviço' : 'Política de Privacidade',
      content: tipo === 'termos' ? termosContent : privacidadeContent
    })
  }

  const handleCloseModal = () => {
    setModalConfig({ ...modalConfig, isOpen: false })
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Digite seu email corporativo"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label htmlFor="dominio">Domínio</Label>
              <div className="flex items-center space-x-2">
                <Input
                  id="dominio"
                  value={formData.dominio}
                  onChange={handleDomainChange}
                  placeholder="Digite o domínio desejado"
                  className={errors.dominio ? 'border-red-500' : ''}
                />
                <span>.erp.app</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Este será o endereço do seu ERP, exemplo: minhaempresa.erp.app</p>
              {errors.dominio && <p className="text-sm text-red-500 mt-1">{errors.dominio}</p>}
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !formData.email || !formData.dominio || errors.email || errors.dominio}
              >
                {isLoading ? 'Verificando...' : 'Próximo'}
              </Button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="cpf_cnpj">CNPJ da Empresa</Label>
              <Input
                id="cpf_cnpj"
                value={formData.cpf_cnpj}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, cpf_cnpj: e.target.value }))
                  setErrors(prev => ({ ...prev, cpf_cnpj: '' }))
                }}
                placeholder="Digite o CNPJ"
                className={errors.cpf_cnpj ? 'border-red-500' : ''}
              />
              {errors.cpf_cnpj && (
                <p className="text-red-500 text-sm mt-1">{errors.cpf_cnpj}</p>
              )}
              <p className="text-sm text-gray-500 mt-1">Buscaremos automaticamente os dados da sua empresa</p>
            </div>

            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !formData.cpf_cnpj}
              >
                {isLoading ? 'Buscando dados...' : 'Próximo'}
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Dados Cadastrais</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="nome_empresa">Razão Social</Label>
              <Input
                id="nome_empresa"
                value={formData.nome_empresa}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_empresa: e.target.value }))}
                placeholder="Razão Social da empresa"
                required
              />
            </div>

            <div>
              <Label htmlFor="apelido">Nome Fantasia</Label>
              <Input
                id="apelido"
                value={formData.apelido}
                onChange={(e) => setFormData(prev => ({ ...prev, apelido: e.target.value }))}
                placeholder="Nome Fantasia da empresa"
                required
              />
            </div>

            <div>
              <Label htmlFor="nome_completo">Nome do Responsável</Label>
              <Input
                id="nome_completo"
                value={formData.nome_completo}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                placeholder="Nome completo do responsável"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="telefone">Telefone Fixo</Label>
                <Input
                  id="telefone"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  placeholder="Telefone fixo"
                />
              </div>

              <div>
                <Label htmlFor="celular">Celular</Label>
                <Input
                  id="celular"
                  value={formData.celular}
                  onChange={(e) => setFormData(prev => ({ ...prev, celular: e.target.value }))}
                  placeholder="Celular"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="WhatsApp (opcional)"
              />
              <p className="text-sm text-gray-500 mt-1">Opcional, preencha se for diferente do celular</p>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!formData.nome_completo || !formData.celular || !formData.nome_empresa || !formData.apelido}
              >
                Próximo
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Endereço</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="cep">CEP</Label>
              <Input
                id="cep"
                value={formData.cep}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({ ...prev, cep: value }))
                  if (value.replace(/\D/g, '').length === 8) {
                    buscarCEP(value)
                  }
                }}
                placeholder="Digite o CEP"
                required
              />
            </div>

            <div>
              <Label htmlFor="logradouro">Logradouro</Label>
              <Input
                id="logradouro"
                value={formData.logradouro}
                onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                placeholder="Rua, Avenida, etc"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="numero">Número</Label>
                <div className="flex gap-2">
                  <Input
                    id="numero"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    placeholder="Número"
                    required
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setFormData(prev => ({ ...prev, numero: 'S/N' }))}
                  >
                    S/N
                  </Button>
                </div>
              </div>

              <div>
                <Label htmlFor="complemento">Complemento</Label>
                <Input
                  id="complemento"
                  value={formData.complemento}
                  onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                  placeholder="Complemento (opcional)"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bairro">Bairro</Label>
              <Input
                id="bairro"
                value={formData.bairro}
                onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                placeholder="Bairro"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="municipio">Município</Label>
                <Input
                  id="municipio"
                  value={formData.municipio}
                  onChange={(e) => setFormData(prev => ({ ...prev, municipio: e.target.value }))}
                  placeholder="Município"
                  required
                />
              </div>

              <div>
                <Label htmlFor="uf">UF</Label>
                <Input
                  id="uf"
                  value={formData.uf}
                  onChange={(e) => setFormData(prev => ({ ...prev, uf: e.target.value }))}
                  placeholder="UF"
                  required
                />
              </div>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!formData.cep || !formData.logradouro || !formData.numero || !formData.bairro || !formData.municipio || !formData.uf}
              >
                Próximo
              </Button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="senha">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                placeholder="Digite sua senha"
                minLength={6}
              />
              <p className="text-sm text-gray-500 mt-1">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <Label htmlFor="confirmar_senha">Confirmar Senha</Label>
              <Input
                id="confirmar_senha"
                type="password"
                value={formData.confirmar_senha}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmar_senha: e.target.value }))}
                placeholder="Confirme sua senha"
                minLength={6}
              />
            </div>

            <div className="flex items-center space-x-2 mt-4">
              <input
                type="checkbox"
                id="aceite_termos"
                checked={formData.aceite_termos}
                onChange={(e) => setFormData(prev => ({ ...prev, aceite_termos: e.target.checked }))}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              <label htmlFor="aceite_termos" className="text-sm">
                Li e aceito os{' '}
                <button
                  type="button"
                  onClick={() => handleOpenTermos('termos')}
                  className="text-indigo-600 hover:underline"
                >
                  termos de serviço
                </button>{' '}
                e a{' '}
                <button
                  type="button"
                  onClick={() => handleOpenTermos('privacidade')}
                  className="text-indigo-600 hover:underline"
                >
                  política de privacidade
                </button>
              </label>
            </div>

            <div className="flex justify-between pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={isLoading}
              >
                Voltar
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={
                  isLoading || 
                  !formData.senha || 
                  !formData.confirmar_senha || 
                  formData.senha !== formData.confirmar_senha ||
                  !formData.aceite_termos
                }
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Criando conta...</span>
                  </div>
                ) : (
                  'Criar Conta'
                )}
              </Button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="p-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">Criar Conta ERP</h1>
            <p className="text-gray-600 mt-2">
              Revenda: {revendaPerfil?.nome_completo}
            </p>
            {planoSelecionado && (
              <p className="text-indigo-600 font-semibold mt-2">
                Plano selecionado: {planoSelecionado.charAt(0).toUpperCase() + planoSelecionado.slice(1)}
              </p>
            )}
          </div>

          <StepIndicator currentStep={currentStep} totalSteps={5} />

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {renderStep()}

            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mt-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>

      <TermosModal
        isOpen={modalConfig.isOpen}
        onClose={handleCloseModal}
        title={modalConfig.title}
        content={modalConfig.content}
      />
    </div>
  )
}