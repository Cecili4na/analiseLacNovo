import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

interface Teste {
  id: string;
  produto: string;
  fabricante: string;
  dataTeste: string;
  tipoTeste: string;
  status: string;
  respostas: {
    avaliador: string;
    atributos: {
      [key: string]: number;
    };
    intencaoCompra: number;
    comentarios: string;
  }[];
}

export default function DetalhesTeste() {
  const { id } = useParams();
  const { user } = useAuth();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function carregarTeste() {
      if (!id || !user) return;

      try {
        const docRef = doc(db, 'testes_pendentes', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setTeste({ id: docSnap.id, ...docSnap.data() } as Teste);
        } else {
          setError('Teste não encontrado');
        }
      } catch (err) {
        setError('Erro ao carregar o teste');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    carregarTeste();
  }, [id, user]);

  function formatarData(data: string) {
    return new Date(data).toLocaleDateString('pt-BR');
  }

  function traduzirTipoTeste(tipo: string) {
    const tipos: { [key: string]: string } = {
      'hedonica': 'Escala Hedônica',
      'preferencia': 'Teste de Preferência',
      'descritiva': 'Análise Descritiva',
      'discriminativa': 'Teste Discriminativo'
    };
    return tipos[tipo] || tipo;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !teste) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-red-500 text-xl mb-4">{error || 'Teste não encontrado'}</div>
        <Link to="/testes" className="text-primary hover:text-primary-dark">
          Voltar para lista de testes
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/testes" className="text-primary hover:text-primary-dark">
            ← Voltar para lista de testes
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-2xl font-bold text-brand-brown mb-6">Detalhes do Teste</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-orange">Informações do Produto</h2>
              <div>
                <p className="text-gray-600">Produto:</p>
                <p className="font-medium">{teste.produto}</p>
              </div>
              <div>
                <p className="text-gray-600">Fabricante:</p>
                <p className="font-medium">{teste.fabricante}</p>
              </div>
              <div>
                <p className="text-gray-600">Data do Teste:</p>
                <p className="font-medium">{formatarData(teste.dataTeste)}</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-brand-orange">Configurações do Teste</h2>
              <div>
                <p className="text-gray-600">Tipo de Teste:</p>
                <p className="font-medium">{traduzirTipoTeste(teste.tipoTeste)}</p>
              </div>
              <div>
                <p className="text-gray-600">Status:</p>
                <p className="font-medium">{teste.status}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h2 className="text-xl font-semibold text-brand-orange mb-4">Respostas dos Avaliadores</h2>
            <div className="space-y-6">
              {teste.respostas.map((resposta, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <p className="font-medium mb-2">Avaliador: {resposta.avaliador}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {Object.entries(resposta.atributos).map(([atributo, nota]) => (
                      <div key={atributo}>
                        <p className="text-gray-600">{atributo}:</p>
                        <p className="font-medium">{nota}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mb-2">
                    <p className="text-gray-600">Intenção de Compra:</p>
                    <p className="font-medium">{resposta.intencaoCompra}</p>
                  </div>

                  {resposta.comentarios && (
                    <div>
                      <p className="text-gray-600">Comentários:</p>
                      <p className="font-medium">{resposta.comentarios}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 