import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import type { CertificadoInfo } from '@/lib/nuvemfiscal/api/certificado';

interface EmpresaCertificadoProps {
  empresaId: string;
}

export function EmpresaCertificado({ empresaId }: EmpresaCertificadoProps) {
  const [certificado, setCertificado] = useState<CertificadoInfo | null>(null);
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function loadCertificado() {
      try {
        const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`);
        const data = await response.json();

        // Se a resposta não for ok, verifica se é 404
        if (!response.ok) {
          if (response.status === 404) {
            setCertificado(null);
            return;
          }
          throw new Error(data.error || 'Erro ao carregar certificado');
        }

        // Se data for null, significa que não há certificado
        if (data === null) {
          setCertificado(null);
          return;
        }

        setCertificado(data);
      } catch (error: any) {
        console.error('Erro ao carregar certificado:', error);
        // Só mostra o toast se não for erro 404
        if (error.status !== 404) {
          toast({
            title: 'Erro',
            description: error.message || 'Erro ao carregar certificado',
            variant: 'destructive'
          });
        }
      }
    }
    
    if (empresaId) {
      loadCertificado();
    }
  }, [empresaId, toast]);

  const handleUpload = async () => {
    if (!arquivo || !senha) {
      toast({
        title: 'Erro',
        description: 'Selecione um arquivo e informe a senha do certificado',
        variant: 'destructive'
      });
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(',')[1];
        
        const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            nome: arquivo.name,
            arquivo: base64,
            senha
          })
        });

        if (!response.ok) {
          throw new Error('Erro ao enviar certificado');
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        // Recarrega os dados do certificado
        const certResponse = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`);
        if (!certResponse.ok) {
          throw new Error('Erro ao recarregar certificado');
        }
        const certData = await certResponse.json();
        if (certData.error) {
          throw new Error(certData.error);
        }
        
        setCertificado(certData);
        toast({
          title: 'Sucesso',
          description: 'Certificado digital enviado com sucesso'
        });
        
        setArquivo(null);
        setSenha('');
      };
      reader.readAsDataURL(arquivo);
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao enviar certificado digital',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!confirm('Tem certeza que deseja remover o certificado digital?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/nuvemfiscal/empresa/${empresaId}/certificado`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Erro ao remover certificado');
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setCertificado(null);
      toast({
        title: 'Sucesso',
        description: 'Certificado digital removido com sucesso'
      });
    } catch (error: any) {
      toast({
        title: 'Erro',
        description: error.message || 'Erro ao remover certificado digital',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Certificado Nuvem Fiscal</CardTitle>
      </CardHeader>
      <CardContent>
        {certificado ? (
          <div className="space-y-4">
            <div className="grid gap-4">
              <div>
                <Label>Empresa</Label>
                <p className="text-sm">
                  {certificado.nome_razao_social} 
                  {certificado.cpf_cnpj && ` - CNPJ: ${certificado.cpf_cnpj}`}
                </p>
              </div>
              
              <div>
                <Label>Número de Série</Label>
                <p className="text-sm">{certificado.serial_number}</p>
              </div>

              <div>
                <Label>Período de Validade</Label>
                <div className="text-sm space-y-1">
                  <p>De: {format(new Date(certificado.not_valid_before), 'dd/MM/yyyy HH:mm')}</p>
                  <p>Até: {format(new Date(certificado.not_valid_after), 'dd/MM/yyyy HH:mm')}</p>
                </div>
              </div>
              
              <div>
                <Label>Emissor</Label>
                <div className="text-sm">
                  <p>{certificado.issuer_name}</p>
                </div>
              </div>
              
              <div>
                <Label>Destinatário</Label>
                <div className="text-sm">
                  <p>{certificado.subject_name}</p>
                </div>
              </div>

              <div>
                <Label>Impressão Digital (Thumbprint)</Label>
                <p className="text-sm font-mono">{certificado.thumbprint}</p>
              </div>
            </div>
            
            <Button 
              variant="destructive" 
              onClick={handleRemove}
              disabled={loading}
              className="mt-4"
            >
              Remover Certificado
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <Label htmlFor="arquivo">Arquivo do Certificado (.pfx)</Label>
              <Input
                id="arquivo"
                type="file"
                accept=".pfx"
                onChange={(e) => setArquivo(e.target.files?.[0] || null)}
              />
            </div>
            <div>
              <Label htmlFor="senha">Senha do Certificado</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
            <Button 
              onClick={handleUpload}
              disabled={loading}
            >
              Enviar Certificado
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
