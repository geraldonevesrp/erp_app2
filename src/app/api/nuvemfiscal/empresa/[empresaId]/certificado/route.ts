import { NextRequest, NextResponse } from 'next/server';
import { consultarCertificado, uploadCertificado, excluirCertificado } from '@/lib/nuvemfiscal/api/certificado';
import { cadastrarEmpresa, consultarEmpresaCadastrada } from '@/lib/nuvemfiscal/api/empresa';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// GET - Consulta certificado atual
export async function GET(
  request: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  try {
    console.log('GET /api/nuvemfiscal/empresa/[empresaId]/certificado - Iniciando consulta');
    console.log('empresaId:', params.empresaId);

    // Primeiro, buscar o CNPJ da empresa no Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('cnpj, razao_social')
      .eq('id', params.empresaId)
      .single();

    if (empresaError) {
      console.error('Erro ao buscar empresa:', empresaError);
      return NextResponse.json(
        { error: 'Erro ao buscar dados da empresa' },
        { status: 500 }
      );
    }

    if (!empresa || !empresa.cnpj) {
      console.error('Empresa não encontrada ou sem CNPJ');
      return NextResponse.json(
        { error: 'Empresa não encontrada ou sem CNPJ' },
        { status: 404 }
      );
    }

    // Verifica se a empresa já está cadastrada na Nuvem Fiscal
    try {
      await consultarEmpresaCadastrada(empresa.cnpj);
    } catch (error: any) {
      // Se não estiver cadastrada (404), cadastra
      if (error.status === 404) {
        console.log('Empresa não cadastrada na Nuvem Fiscal. Cadastrando...');
        await cadastrarEmpresa(empresa.cnpj);
      } else {
        throw error;
      }
    }

    // Agora sim, consultar o certificado usando o CNPJ
    const data = await consultarCertificado(empresa.cnpj);
    console.log('Dados do certificado:', data);
    
    // Se não houver certificado, retorna null
    if (!data) {
      console.log('Nenhum certificado encontrado');
      return NextResponse.json(null);
    }

    // Adiciona os dados da empresa do Supabase
    const certificadoComDados = {
      ...data,
      empresa: {
        ...data.empresa,
        razao_social: empresa.razao_social
      }
    };

    return NextResponse.json(certificadoComDados);
  } catch (error: any) {
    console.error('Erro ao consultar certificado:', error);
    
    // Se for erro 404, retorna null
    if (error.status === 404 || error.response?.status === 404) {
      console.log('Certificado não encontrado (404)');
      return NextResponse.json(null);
    }
    
    // Para outros erros, retorna o erro com status apropriado
    const status = error.status || error.response?.status || 500;
    const message = error.message || 'Erro interno do servidor';
    
    console.error(`Retornando erro ${status}:`, message);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

// POST - Upload de novo certificado
export async function POST(
  request: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  try {
    console.log('POST /api/nuvemfiscal/empresa/[empresaId]/certificado - Iniciando upload');
    console.log('empresaId:', params.empresaId);

    // Primeiro, buscar o CNPJ da empresa no Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('cnpj')
      .eq('id', params.empresaId)
      .single();

    if (empresaError) {
      console.error('Erro ao buscar empresa:', empresaError);
      return NextResponse.json(
        { error: 'Erro ao buscar dados da empresa' },
        { status: 500 }
      );
    }

    if (!empresa || !empresa.cnpj) {
      console.error('Empresa não encontrada ou sem CNPJ');
      return NextResponse.json(
        { error: 'Empresa não encontrada ou sem CNPJ' },
        { status: 404 }
      );
    }

    // Verifica se a empresa já está cadastrada na Nuvem Fiscal
    try {
      await consultarEmpresaCadastrada(empresa.cnpj);
    } catch (error: any) {
      // Se não estiver cadastrada (404), cadastra
      if (error.status === 404) {
        console.log('Empresa não cadastrada na Nuvem Fiscal. Cadastrando...');
        await cadastrarEmpresa(empresa.cnpj);
      } else {
        throw error;
      }
    }

    const certificado = await request.json();
    console.log('Dados recebidos:', { ...certificado, arquivo: '[REDACTED]' });

    const data = await uploadCertificado(empresa.cnpj, certificado);
    
    console.log('Upload realizado com sucesso');
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erro ao fazer upload do certificado:', error);
    
    const status = error.status || error.response?.status || 500;
    const message = error.message || 'Erro interno do servidor';
    
    console.error(`Retornando erro ${status}:`, message);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}

// DELETE - Remove certificado atual
export async function DELETE(
  request: NextRequest,
  { params }: { params: { empresaId: string } }
) {
  try {
    console.log('DELETE /api/nuvemfiscal/empresa/[empresaId]/certificado - Iniciando exclusão');
    console.log('empresaId:', params.empresaId);

    // Primeiro, buscar o CNPJ da empresa no Supabase
    const supabase = createRouteHandlerClient({ cookies });
    const { data: empresa, error: empresaError } = await supabase
      .from('empresas')
      .select('cnpj')
      .eq('id', params.empresaId)
      .single();

    if (empresaError) {
      console.error('Erro ao buscar empresa:', empresaError);
      return NextResponse.json(
        { error: 'Erro ao buscar dados da empresa' },
        { status: 500 }
      );
    }

    if (!empresa || !empresa.cnpj) {
      console.error('Empresa não encontrada ou sem CNPJ');
      return NextResponse.json(
        { error: 'Empresa não encontrada ou sem CNPJ' },
        { status: 404 }
      );
    }

    // Verifica se a empresa já está cadastrada na Nuvem Fiscal
    try {
      await consultarEmpresaCadastrada(empresa.cnpj);
    } catch (error: any) {
      // Se não estiver cadastrada, não há certificado para excluir
      if (error.status === 404) {
        console.log('Empresa não cadastrada na Nuvem Fiscal. Nada a excluir.');
        return NextResponse.json({ success: true });
      }
      throw error;
    }

    await excluirCertificado(empresa.cnpj);
    
    console.log('Certificado excluído com sucesso');
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erro ao excluir certificado:', error);
    
    // Se for erro 404, consideramos sucesso pois o certificado já não existe
    if (error.status === 404 || error.response?.status === 404) {
      console.log('Certificado não encontrado (404) - considerando sucesso');
      return NextResponse.json({ success: true });
    }
    
    const status = error.status || error.response?.status || 500;
    const message = error.message || 'Erro interno do servidor';
    
    console.error(`Retornando erro ${status}:`, message);
    
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
