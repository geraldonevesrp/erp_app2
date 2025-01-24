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
          tipo_usuario: 'revenda',
          email: formData.email,
          email_verified: false
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
        revenda_status: 1, // Aguardando ativação
        nascimento: formData.nascimento, // Data de fundação (PJ) ou nascimento (PF)
        faturamento: formData.faturamento // Faturamento mensal
      })
      .select()
      .single()

    if (perfilError) throw new Error(perfilError.message)

    // 2.1 Atualizar metadados do usuário com o perfil_id
    console.log('2.1 Atualizando metadados do usuário...')
    const { error: updateUserError } = await supabase.auth.updateUser({
      data: {
        perfil_id: perfilData.id
      }
    })

    if (updateUserError) throw new Error(updateUserError.message)

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

    // 4.1 Atualizar metadados do usuário após o login
    console.log('4.1 Atualizando metadados do usuário...')
    const { error: updateError } = await supabase.auth.updateUser({
      data: {
        perfil_id: perfilData.id,
        tipo_usuario: 'revenda'
      }
    })

    if (updateError) throw new Error(updateError.message)

    // 4.2 Verificar se os metadados foram atualizados
    const { data: { user }, error: getUserError } = await supabase.auth.getUser()
    if (getUserError) throw new Error(getUserError.message)

    console.log('Metadados atualizados:', user?.user_metadata)
    if (!user?.user_metadata?.perfil_id) {
      throw new Error('Erro ao atualizar metadados do usuário')
    }

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
