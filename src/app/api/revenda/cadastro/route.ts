import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.json()
    const supabase = createRouteHandlerClient({ cookies })

    console.log('=== Iniciando cadastro de revenda ===')

    // 1. Criar usuário no Supabase Auth
    console.log('1. Criando usuário no Supabase Auth...')
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.senha,
      options: {
        data: {
          tipo_usuario: 'revenda'
        }
      }
    })

    if (authError) throw new Error(authError.message)

    // 2. Criar perfil da revenda
    console.log('2. Criando perfil da revenda...')
    const { data: perfilData, error: perfilError } = await supabase
      .from('perfis')
      .insert({
        user_id: authData.user?.id,
        apelido: formData.apelido,
        nome_completo: formData.nome_completo,
        email: formData.email,
        fone: formData.telefone,
        celular: formData.celular,
        wathsapp: formData.whatsapp,
        cpf_cnpj: formData.cpf_cnpj,
        tipo: 2, // Tipo revenda
        dominio: formData.dominio,
        revenda_status: 1 // Aguardando ativação
      })
      .select()
      .single()

    if (perfilError) throw new Error(perfilError.message)

    // 3. Criar endereço principal
    console.log('3. Criando endereço principal...')
    const { error: enderecoError } = await supabase
      .from('perfis_enderecos')
      .insert({
        perfis_id: perfilData.id,
        titulo: 'Principal',
        cep: formData.cep,
        logradouro: formData.logradouro,
        numero: formData.numero,
        complemento: formData.complemento,
        bairro: formData.bairro,
        localidade: formData.municipio,
        uf: formData.uf,
        principal: true,
        ibge: formData.ibge,
        gia: formData.gia,
        ddd: formData.ddd,
        siafi: formData.siafi
      })

    if (enderecoError) throw new Error(enderecoError.message)

    // 4. Fazer login automático
    console.log('4. Realizando login automático...')
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.senha
    })

    if (signInError) throw new Error(signInError.message)

    // 5. Retornar sucesso
    console.log('=== Cadastro finalizado com sucesso ===')
    return NextResponse.json({ success: true })

  } catch (error: any) {
    console.error('Erro no cadastro de revenda:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar cadastro' },
      { status: 500 }
    )
  }
}
