'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import TermosModal from './TermosModal'

// Tipos
interface FormData {
  email: string
  dominio: string
  cnpj: string
  tipo_pessoa: 'F' | 'J'
  nome_empresa: string
  nome_completo: string
  apelido: string
  telefone: string
  celular: string
  whatsapp: string
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
  cpf_cnpj: string
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
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    content: string
  }>({
    isOpen: false,
    title: '',
    content: ''
  })

  const supabase = createClient()

  const [formData, setFormData] = useState<FormData>({
    email: '',
    dominio: '',
    cnpj: '',
    tipo_pessoa: 'J',
    nome_empresa: '',
    nome_completo: '',
    apelido: '',
    telefone: '',
    celular: '',
    whatsapp: '',
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    municipio: '',
    uf: '',
    senha: '',
    confirmar_senha: '',
    aceite_termos: false,
    cpf_cnpj: ''
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
  const validarDominio = (dominio: string) => {
    // Apenas letras e números
    return /^[a-zA-Z0-9]+$/.test(dominio)
  }

  // Função para validar o domínio
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

      // Se chegou aqui, email e domínio estão disponíveis
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Erro ao verificar disponibilidade:', error)
      setError('Erro ao verificar disponibilidade. Tente novamente.')
      setIsLoading(false)
      return false
    }
  }

  // Função para avançar para o próximo passo
  const handleNext = async () => {
    if (currentStep === 1) {
      const disponivel = await verificarDisponibilidade()
      if (!disponivel) {
        return
      }
    }
    setCurrentStep(prev => prev + 1)
  }

  // Função para buscar dados do CNPJ
  const buscarCNPJ = async (cnpj: string) => {
    try {
      setIsLoading(true)
      setError(null)
      
      const cnpjLimpo = cnpj.replace(/\D/g, '')
      if (cnpjLimpo.length !== 14) {
        throw new Error('CNPJ inválido')
      }

      // Usa a função de consulta pública de CNPJ
      const response = await fetch(`/api/cnpj/${cnpjLimpo}`)
      const data = await response.json()

      if (!data || data.error) {
        console.error("Erro da API:", data)
        throw new Error('Erro ao consultar CNPJ. Tente novamente.')
      }

      // Log para debug
      console.log('Dados recebidos da API:', {
        razao_social: data.razao_social,
        nome_fantasia: data.nome_fantasia,
        socios: data.socios,
        primeiro_socio: data.socios?.[0]
      })

      // Atualiza os dados do formulário com os dados da empresa
      const novosDados = {
        ...formData,
        nome_empresa: data.razao_social || data.nome_fantasia,
        nome_completo: data.razao_social,
        apelido: data.nome_fantasia || data.razao_social,
        cpf_cnpj: cnpjLimpo, // Garante que o cpf_cnpj está preenchido
        cep: data.endereco?.cep?.replace(/\D/g, '') || '',
        logradouro: `${data.endereco?.tipo_logradouro || ''} ${data.endereco?.logradouro || ''}`.trim(),
        numero: data.endereco?.numero || '',
        complemento: data.endereco?.complemento || '',
        bairro: data.endereco?.bairro || '',
        municipio: data.endereco?.municipio?.descricao || '',
        uf: data.endereco?.uf || ''
      }

      console.log('Novos dados do formulário:', novosDados)
      
      setFormData(novosDados)

      // Busca dados complementares do CEP
      if (data.endereco?.cep) {
        await buscarCEP(data.endereco.cep)
      }

      // Avança para o próximo passo
      setCurrentStep(prev => prev + 1)
    } catch (error: any) {
      console.error('Erro ao buscar CNPJ:', error)
      setError(error.message || 'Erro ao buscar dados do CNPJ')
    } finally {
      setIsLoading(false)
    }
  }

  // Função para buscar CEP
  const buscarCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '')
      if (cepLimpo.length !== 8) return

      setIsLoading(true)
      
      const response = await fetch(`/api/cep/${cepLimpo}`)
      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      // Atualiza apenas campos vazios com dados do ViaCEP
      setFormData(prev => ({
        ...prev,
        logradouro: prev.logradouro || data.logradouro || '',
        bairro: prev.bairro || data.bairro || '',
        municipio: prev.municipio || data.localidade || '',
        uf: prev.uf || data.uf || ''
      }))
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error)
      // Não mostra erro para o usuário, já que os dados do CNPJ foram mantidos
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    try {
      setIsLoading(true)
      setError(null)

      // Validações
      if (formData.senha !== formData.confirmar_senha) {
        throw new Error('As senhas não conferem')
      }

      if (formData.senha.length < 6) {
        throw new Error('A senha deve ter no mínimo 6 caracteres')
      }

      if (!formData.aceite_termos) {
        throw new Error('Você deve aceitar os termos de uso')
      }

      // Enviar dados para a API
      const response = await fetch('/api/revenda/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao finalizar cadastro')
      }

      // Redirecionar para o subdomínio da revenda
      const protocol = window.location.protocol
      const hostname = window.location.hostname
      
      // Em desenvolvimento (localhost), não usa subdomínio
      const isDevelopment = hostname === 'localhost' || hostname === '127.0.0.1'
      const redirectUrl = isDevelopment
        ? `${protocol}//${hostname}:${window.location.port}/revendas/ativar_revenda`
        : `${protocol}//${data.dominio}.${hostname.split('.').slice(1).join('.')}/revendas/ativar_revenda`

      window.location.href = redirectUrl
    } catch (error: any) {
      console.error('Erro ao finalizar cadastro:', error)
      setError(error.message || 'Erro ao finalizar cadastro')
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
    setModalConfig(prev => ({ ...prev, isOpen: false }))
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Dados de Acesso</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, email: e.target.value }))
                  setErrors(prev => ({ ...prev, email: '' }))
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Domínio Desejado
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={formData.dominio}
                  onChange={handleDomainChange}
                  className="block w-full rounded-none rounded-l-md border border-gray-300 bg-gray-50 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                  placeholder="seudominio"
                  pattern="[a-z0-9]+(-[a-z0-9]+)*"
                  required
                />
                <span className="inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-100 px-4 py-2 text-gray-500 sm:text-sm">
                  .erp1.com.br
                </span>
              </div>
              {errors.dominio && (
                <p className="mt-1 text-sm text-red-600">{errors.dominio}</p>
              )}
              <p className="mt-1 text-sm text-gray-500">
                Use apenas letras e números, sem espaços ou caracteres especiais
              </p>
            </div>

            <div className="pt-4">
              <button
                type="button"
                onClick={handleNext}
                disabled={isLoading || !formData.email || !formData.dominio}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (isLoading || !formData.email || !formData.dominio) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Verificando...' : 'Continuar'}
              </button>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Identificação</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Tipo de Pessoa
              </label>
              <select
                value={formData.tipo_pessoa}
                onChange={(e) => setFormData(prev => ({ ...prev, tipo_pessoa: e.target.value as 'F' | 'J' }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              >
                <option value="J">Pessoa Jurídica</option>
                <option value="F">Pessoa Física</option>
              </select>
            </div>

            <div>
              <label htmlFor="cnpj" className="block text-sm font-medium text-gray-700">
                {formData.tipo_pessoa === 'J' ? 'CNPJ' : 'CPF'}
              </label>
              <input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={(e) => {
                  const value = e.target.value;
                  setFormData(prev => ({ 
                    ...prev, 
                    cnpj: value,
                    cpf_cnpj: value.replace(/\D/g, '') // Adiciona ao cpf_cnpj também
                  }));
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
              {error && (
                <p className="mt-1 text-sm text-red-600">{error}</p>
              )}
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() => {
                  if (formData.tipo_pessoa === 'J') {
                    buscarCNPJ(formData.cnpj)
                  } else {
                    setCurrentStep(prev => prev + 1)
                  }
                }}
                disabled={isLoading || !formData.cnpj}
                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (isLoading || !formData.cnpj) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? 'Carregando...' : 'Próximo'}
              </button>
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

            {formData.tipo_pessoa === 'J' && (
              <>
                <div>
                  <label htmlFor="nome_empresa" className="block text-sm font-medium text-gray-700">
                    Razão Social
                  </label>
                  <input
                    id="nome_empresa"
                    type="text"
                    value={formData.nome_empresa}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome_empresa: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="apelido" className="block text-sm font-medium text-gray-700">
                    Nome Fantasia
                  </label>
                  <input
                    id="apelido"
                    type="text"
                    value={formData.apelido}
                    onChange={(e) => setFormData(prev => ({ ...prev, apelido: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label htmlFor="nome_completo" className="block text-sm font-medium text-gray-700">
                {formData.tipo_pessoa === 'J' ? 'Nome do Responsável' : 'Nome Completo'}
              </label>
              <input
                id="nome_completo"
                type="text"
                value={formData.nome_completo}
                onChange={(e) => setFormData(prev => ({ ...prev, nome_completo: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="telefone" className="block text-sm font-medium text-gray-700">
                  Telefone Fixo
                </label>
                <input
                  id="telefone"
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefone: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>

              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
                  Celular
                </label>
                <input
                  id="celular"
                  type="tel"
                  value={formData.celular}
                  onChange={(e) => setFormData(prev => ({ ...prev, celular: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                type="tel"
                value={formData.whatsapp}
                onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
              />
              <p className="mt-1 text-sm text-gray-500">
                Opcional, preencha se for diferente do celular
              </p>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(2)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!formData.nome_completo || !formData.celular || (formData.tipo_pessoa === 'J' && (!formData.nome_empresa || !formData.apelido))}
                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (!formData.nome_completo || !formData.celular || (formData.tipo_pessoa === 'J' && (!formData.nome_empresa || !formData.apelido))) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Próximo
              </button>
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
              <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                CEP
              </label>
              <input
                id="cep"
                type="text"
                value={formData.cep}
                onChange={(e) => {
                  const value = e.target.value
                  setFormData(prev => ({ ...prev, cep: value }))
                  // Busca CEP quando tiver 8 dígitos
                  if (value.replace(/\D/g, '').length === 8) {
                    buscarCEP(value)
                  }
                }}
                onBlur={(e) => {
                  // Busca CEP quando o campo perde o foco
                  if (e.target.value.replace(/\D/g, '').length === 8) {
                    buscarCEP(e.target.value)
                  }
                }}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
            </div>

            <div>
              <label htmlFor="logradouro" className="block text-sm font-medium text-gray-700">
                Logradouro
              </label>
              <input
                id="logradouro"
                type="text"
                value={formData.logradouro}
                onChange={(e) => setFormData(prev => ({ ...prev, logradouro: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="relative">
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                  Número
                </label>
                <div className="flex gap-2">
                  <input
                    id="numero"
                    type="text"
                    value={formData.numero}
                    onChange={(e) => setFormData(prev => ({ ...prev, numero: e.target.value }))}
                    className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, numero: 'S/N' }))}
                    className="mt-1 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    S/N
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                  Complemento
                </label>
                <input
                  id="complemento"
                  type="text"
                  value={formData.complemento}
                  onChange={(e) => setFormData(prev => ({ ...prev, complemento: e.target.value }))}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
                <p className="mt-1 text-sm text-gray-500">Opcional</p>
              </div>
            </div>

            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-gray-700">
                Bairro
              </label>
              <input
                id="bairro"
                type="text"
                value={formData.bairro}
                onChange={(e) => setFormData(prev => ({ ...prev, bairro: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="municipio" className="block text-sm font-medium text-gray-700">
                  Município
                </label>
                <input
                  id="municipio"
                  type="text"
                  value={formData.municipio}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 cursor-not-allowed"
                  required
                />
              </div>

              <div>
                <label htmlFor="uf" className="block text-sm font-medium text-gray-700">
                  UF
                </label>
                <input
                  id="uf"
                  type="text"
                  value={formData.uf}
                  readOnly
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-100 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2 cursor-not-allowed"
                  required
                />
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(3)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar
              </button>

              <button
                type="button"
                onClick={() => setCurrentStep(prev => prev + 1)}
                disabled={!formData.cep || !formData.logradouro || !formData.numero || !formData.bairro || !formData.municipio || !formData.uf}
                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (!formData.cep || !formData.logradouro || !formData.numero || !formData.bairro || !formData.municipio || !formData.uf) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Próximo
              </button>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Senha e Termos de Uso</h2>
            
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <p className="text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label htmlFor="senha" className="block text-sm font-medium text-gray-700">
                Senha
              </label>
              <input
                id="senha"
                type="password"
                value={formData.senha}
                onChange={(e) => setFormData(prev => ({ ...prev, senha: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
                minLength={6}
              />
              <p className="mt-1 text-sm text-gray-500">Mínimo de 6 caracteres</p>
            </div>

            <div>
              <label htmlFor="confirmar_senha" className="block text-sm font-medium text-gray-700">
                Confirmar Senha
              </label>
              <input
                id="confirmar_senha"
                type="password"
                value={formData.confirmar_senha}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmar_senha: e.target.value }))}
                className="mt-1 block w-full rounded-md border border-gray-300 bg-gray-50 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                required
                minLength={6}
              />
            </div>

            <div className="mt-4">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="aceite_termos"
                    type="checkbox"
                    checked={formData.aceite_termos}
                    onChange={(e) => setFormData(prev => ({ ...prev, aceite_termos: e.target.checked }))}
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="aceite_termos" className="font-medium text-gray-700">
                    Aceito os termos de uso
                  </label>
                  <p className="text-gray-500">
                    Ao marcar esta caixa, você concorda com nossos{' '}
                    <button
                      type="button"
                      onClick={() => handleOpenTermos('termos')}
                      className="text-indigo-600 hover:text-indigo-500 underline"
                    >
                      Termos de Serviço
                    </button>{' '}
                    e{' '}
                    <button
                      type="button"
                      onClick={() => handleOpenTermos('privacidade')}
                      className="text-indigo-600 hover:text-indigo-500 underline"
                    >
                      Política de Privacidade
                    </button>
                    .
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep(4)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Voltar
              </button>

              <button
                type="submit"
                disabled={!formData.senha || !formData.confirmar_senha || formData.senha !== formData.confirmar_senha || !formData.aceite_termos || isLoading}
                className={`inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  (!formData.senha || !formData.confirmar_senha || formData.senha !== formData.confirmar_senha || !formData.aceite_termos || isLoading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </>
                ) : (
                  'Finalizar Cadastro'
                )}
              </button>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      
      // No passo 2, ENTER só executa a busca do CNPJ
      if (currentStep === 2) {
        if (formData.cpf_cnpj) {
          handleBuscarCNPJ()
        }
        return
      }
      
      // Nos outros passos, avança normalmente
      if (currentStep < 4 && currentStep !== 2) {
        handleNext()
      }
    }
  }

  const handleBuscarCNPJ = async () => {
    if (!formData.cpf_cnpj) {
      setError('Por favor, informe o CNPJ')
      return
    }

    try {
      setIsLoading(true)
      const cnpj = formData.cpf_cnpj.replace(/\D/g, '')
      const response = await fetch(`https://publica.cnpj.ws/cnpj/${cnpj}`)
      
      if (!response.ok) {
        throw new Error('CNPJ não encontrado')
      }

      const data = await response.json()

      // Atualiza o formulário com os dados da empresa
      setFormData(prev => ({
        ...prev,
        nome_completo: data.razao_social,
        apelido: data.estabelecimento.nome_fantasia || data.razao_social,
        cep: data.estabelecimento.cep,
        logradouro: `${data.estabelecimento.tipo_logradouro || ''} ${data.estabelecimento.logradouro || ''}`.trim(),
        numero: data.estabelecimento.numero,
        complemento: data.estabelecimento.complemento || '',
        bairro: data.estabelecimento.bairro,
        municipio: data.estabelecimento.cidade.nome,
        uf: data.estabelecimento.estado.sigla,
        telefone: data.estabelecimento.ddd1 + data.estabelecimento.telefone1,
      }))

      // Busca dados complementares do CEP
      await handleBuscarCEP(data.estabelecimento.cep)

      setError('')
    } catch (error: any) {
      console.error('Erro ao buscar CNPJ:', error)
      setError(error.message || 'Erro ao buscar dados do CNPJ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleBuscarCEP = async (cep: string) => {
    try {
      const cepLimpo = cep.replace(/\D/g, '')
      const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`)
      
      if (!response.ok) {
        throw new Error('CEP não encontrado')
      }

      const data = await response.json()

      if (data.erro) {
        throw new Error('CEP não encontrado')
      }

      // Atualiza o formulário com os dados complementares do CEP
      setFormData(prev => ({
        ...prev,
        ibge: data.ibge,
        gia: data.gia,
        ddd: data.ddd,
        siafi: data.siafi
      }))
    } catch (error: any) {
      console.error('Erro ao buscar CEP:', error)
      // Não exibimos erro para o usuário pois são apenas dados complementares
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600/10 via-white to-indigo-600/10 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <StepIndicator currentStep={currentStep} totalSteps={5} />
        
        {/* Título do passo atual */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">
            {currentStep === 1 && "Dados de Acesso"}
            {currentStep === 2 && "Informações da Empresa"}
            {currentStep === 3 && "Dados Complementares"}
            {currentStep === 4 && "Endereço"}
            {currentStep === 5 && "Senha e Termos de Uso"}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {currentStep === 1 && "Configure seu acesso ao sistema"}
            {currentStep === 2 && "Preencha os dados da sua empresa"}
            {currentStep === 3 && "Complete seu cadastro"}
            {currentStep === 4 && "Preencha seu endereço"}
            {currentStep === 5 && "Configure sua senha e aceite os termos de uso"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" onKeyDown={handleKeyDown}>
          {renderStep()}
        </form>
      </div>
    </div>
  )
}
