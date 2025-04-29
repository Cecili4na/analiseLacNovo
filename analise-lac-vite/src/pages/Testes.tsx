import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

interface Teste {
  id: string;
  produto: string;
  fabricante: string;
  tipoEmbalagem: string;
  pesoProduto: string;
  dataFabricacao: string;
  dataValidade: string;
  dataTeste: string;
  horarioTeste: string;
  localTeste: string;
  tipoTeste: string;
  quantidadeAvaliadores: number;
  atributosAvaliados: string[];
  tipoAnaliseEstatistica: string;
  dataCriacao: string;
  analistaId: string;
  criadoPor: string;
  atualizadoEm: string;
  respostas?: {
    julgadorId: string;
    nomeJulgador: string;
    notas: { [atributo: string]: number };
    comentarios?: string;
    intencaoCompra?: string;
    dataAvaliacao: string;
  }[];
  totalRespostas?: number;
  amostras: string[];
}

export default function Testes() {
  const [loading, setLoading] = useState(true);
  const [testes, setTestes] = useState<Teste[]>([]);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const carregarTestes = async () => {
      if (!user) return;

      try {
        const testesRef = collection(db, 'testes_pendentes');
        const q = query(testesRef, where('analistaId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        
        const testesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teste[];

        setTestes(testesData);
      } catch (err) {
        setError('Erro ao carregar os testes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    carregarTestes();
  }, [user]);

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  const traduzirTipoTeste = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'hedonica': 'Escala Hedônica',
      'preferencia': 'Teste de Preferência',
      'descritiva': 'Análise Descritiva',
      'discriminativa': 'Teste Discriminativo'
    };
    return tipos[tipo] || tipo;
  };

  const traduzirTipoAnalise = (tipo: string) => {
    const tipos: { [key: string]: string } = {
      'anova': 'ANOVA',
      'tukey': 'Tukey',
      'friedman': 'Friedman',
      'duncan': 'Duncan'
    };
    return tipos[tipo] || tipo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold">Meus Testes</h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
          >
            <FaArrowLeft />
            Voltar ao Dashboard
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-[#8BA989] mb-4">Gerenciamento de Testes</h2>
          <p className="text-[#666666]">Aqui você pode gerenciar seus testes sensoriais.</p>
        </div>

        <div className="mb-4">
          <Link 
            to="/novoTesteAnalista" 
            className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
          >
            Criar Novo Teste
          </Link>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {testes.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Você ainda não criou nenhum teste.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {testes.map((teste) => (
              <Link 
                key={teste.id} 
                to={`/testes/${teste.id}`}
                className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-brand-brown">{teste.produto}</h2>
                      <p className="text-gray-600">{teste.fabricante}</p>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Respostas:</span> {teste.totalRespostas || 0}/{teste.quantidadeAvaliadores}
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Data:</span> {formatarData(teste.dataTeste)}
                    </div>
                    <div>
                      <span className="font-medium">Tipo:</span> {traduzirTipoTeste(teste.tipoTeste)}
                    </div>
                    <div>
                      <span className="font-medium">Análise:</span> {traduzirTipoAnalise(teste.tipoAnaliseEstatistica)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-primary text-white p-4 mt-8">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Análise LAC. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
} 