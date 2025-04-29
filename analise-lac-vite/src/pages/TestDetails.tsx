import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { FaArrowLeft, FaFileExcel } from 'react-icons/fa';

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
  totalRespostas: number;
  status: string;
  atributosAvaliados: string[];
  amostras: string[];
  respostas: Array<{
    nomeJulgador: string;
    idadeJulgador: string;
    generoJulgador: string;
    notas: { [atributo: string]: { [amostra: string]: number } };
    intencaoCompra: string;
    comentarios: string;
    dataAvaliacao: string;
    termoAceito: boolean;
  }>;
}

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarTeste = async () => {
      if (!id) return;
      try {
        const db = getFirestore(app);
        const testeDoc = await getDoc(doc(db, 'testes_pendentes', id));
        if (!testeDoc.exists()) {
          const concluidoDoc = await getDoc(doc(db, 'testes', id));
          if (!concluidoDoc.exists()) {
            setError('Teste não encontrado');
            return;
          }
          setTeste({ id: concluidoDoc.id, ...concluidoDoc.data() } as Teste);
        } else {
          setTeste({ id: testeDoc.id, ...testeDoc.data() } as Teste);
        }
      } catch (err) {
        setError('Erro ao carregar teste');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarTeste();
  }, [id]);

  const exportarParaExcel = () => {
    if (!teste) return;
    
    // Preparar dados para exportação
    const dadosExportacao = [];
    
    // Cabeçalho com informações do teste
    dadosExportacao.push(['INFORMAÇÕES DO TESTE']);
    dadosExportacao.push(['Produto', teste.produto]);
    dadosExportacao.push(['Fabricante', teste.fabricante]);
    dadosExportacao.push(['Data do Teste', new Date(teste.dataTeste).toLocaleDateString()]);
    dadosExportacao.push(['Total de Respostas', teste.totalRespostas]);
    dadosExportacao.push([]);
    
    // Cabeçalho da tabela de notas
    const cabecalhoNotas = ['Julgador', 'Idade', 'Gênero'];
    teste.amostras.forEach(amostra => {
      teste.atributosAvaliados.forEach(atributo => {
        cabecalhoNotas.push(`A${amostra} - ${atributo}`);
      });
    });
    cabecalhoNotas.push('Intenção de Compra');
    dadosExportacao.push(cabecalhoNotas);
    
    // Dados de cada julgador
    teste.respostas.forEach(resposta => {
      const linhaDados = [
        resposta.nomeJulgador,
        resposta.idadeJulgador,
        resposta.generoJulgador
      ];
      
      // Adicionar notas por amostra e atributo
      teste.amostras.forEach(amostra => {
        teste.atributosAvaliados.forEach(atributo => {
          const nota = resposta.notas[atributo]?.[amostra] || '';
          linhaDados.push(nota.toString());
        });
      });
      
      // Adicionar intenção de compra
      linhaDados.push(resposta.intencaoCompra.replace(/_/g, ' '));
      
      dadosExportacao.push(linhaDados);
    });
    
    // Adicionar médias
    dadosExportacao.push([]);
    dadosExportacao.push(['MÉDIAS POR ATRIBUTO E AMOSTRA']);
    
    const cabecalhoMedias = ['Atributo'];
    teste.amostras.forEach(amostra => {
      cabecalhoMedias.push(`Amostra ${amostra}`);
    });
    dadosExportacao.push(cabecalhoMedias);
    
    teste.atributosAvaliados.forEach(atributo => {
      const linhaMedias = [atributo];
      teste.amostras.forEach(amostra => {
        const notas = teste.respostas
          .map(resposta => resposta.notas[atributo]?.[amostra])
          .filter(nota => nota !== undefined && nota !== null);
        
        if (notas.length === 0) {
          linhaMedias.push('');
        } else {
          const media = notas.reduce((acc, nota) => acc + nota, 0) / notas.length;
          linhaMedias.push(media.toFixed(2));
        }
      });
      dadosExportacao.push(linhaMedias);
    });
    
    // Converter para CSV
    let csvContent = "data:text/csv;charset=utf-8,";
    
    dadosExportacao.forEach(row => {
      const rowString = row.map(cell => {
        if (cell === null || cell === undefined) return '';
        return `"${cell.toString().replace(/"/g, '""')}"`;
      }).join(',');
      csvContent += rowString + "\r\n";
    });
    
    // Criar link para download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `teste_${teste.id}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
        <header className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
              </Link>
              <h1 className="text-2xl font-bold">Detalhes do Teste</h1>
            </div>
            <button
              onClick={() => navigate('/testes')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar aos Testes
            </button>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">Informações do Teste</h2>
            <p className="text-[#666666]">Visualize os detalhes e respostas do teste sensorial.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA989] mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando detalhes do teste...</p>
            </div>
          </div>
        </main>

        <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
          <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </footer>
      </div>
    );
  }

  if (error || !teste) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
        <header className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/dashboard" className="mr-4">
                <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
              </Link>
              <h1 className="text-2xl font-bold">Detalhes do Teste</h1>
            </div>
            <button
              onClick={() => navigate('/testes')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar aos Testes
            </button>
          </div>
        </header>

        <main className="container mx-auto p-4">
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">Informações do Teste</h2>
            <p className="text-[#666666]">Visualize os detalhes e respostas do teste sensorial.</p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">{error || 'Teste não encontrado'}</p>
            </div>
          </div>
        </main>

        <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
          <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold">Detalhes do Teste</h1>
          </div>
          <button
            onClick={() => navigate('/testes')}
            className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
          >
            <FaArrowLeft />
            Voltar aos Testes
          </button>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-[#8BA989] mb-4">Informações do Teste</h2>
          <p className="text-[#666666]">Visualize os detalhes e respostas do teste sensorial.</p>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#8BA989] mb-4">{teste.produto}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Fabricante</label>
                <p className="text-[#333333]">{teste.fabricante}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Status</label>
                <p className="text-[#333333] capitalize">{teste.status}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Tipo de Embalagem</label>
                <p className="text-[#333333]">{teste.tipoEmbalagem}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Peso do Produto</label>
                <p className="text-[#333333]">{teste.pesoProduto}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Data de Fabricação</label>
                <p className="text-[#333333]">{new Date(teste.dataFabricacao).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Data de Validade</label>
                <p className="text-[#333333]">{new Date(teste.dataValidade).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Data do Teste</label>
                <p className="text-[#333333]">{new Date(teste.dataTeste).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Horário do Teste</label>
                <p className="text-[#333333]">{teste.horarioTeste}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Local do Teste</label>
                <p className="text-[#333333]">{teste.localTeste}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">Tipo de Teste</label>
                <p className="text-[#333333] capitalize">{teste.tipoTeste}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#666666] mb-1">
                  Avaliadores ({teste.totalRespostas}/{teste.quantidadeAvaliadores})
                </label>
                <div className="w-full bg-[#F0F0E5] rounded-full h-2.5">
                  <div
                    className="bg-[#8BA989] h-2.5 rounded-full"
                    style={{
                      width: `${(teste.totalRespostas / teste.quantidadeAvaliadores) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#666666] mb-1">Link do Teste</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={`${window.location.origin}/responderTeste/${teste.id}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${window.location.origin}/responderTeste/${teste.id}`);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="bg-[#8BA989] text-white px-4 py-2 rounded-md hover:opacity-90"
                  >
                    Copiar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">Atributos Avaliados</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {teste.atributosAvaliados.map((atributo) => (
                <div
                  key={atributo}
                  className="bg-[#F0F0E5] p-3 rounded-lg text-center text-[#666666]"
                >
                  {atributo.charAt(0).toUpperCase() + atributo.slice(1).replace(/([A-Z])/g, ' $1')}
                </div>
              ))}
            </div>
          </div>

          {teste.respostas && teste.respostas.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#8BA989] mb-4">Respostas</h2>
              <div className="space-y-4">
                {teste.respostas.map((resposta, index) => (
                  <div key={index} className="border border-[#D1D5DB] rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-[#333333]">{resposta.nomeJulgador}</h3>
                        <p className="text-sm text-[#666666]">
                          Idade: {resposta.idadeJulgador} | Gênero: {resposta.generoJulgador}
                        </p>
                      </div>
                      <span className="text-sm text-[#666666]">
                        {new Date(resposta.dataAvaliacao).toLocaleString()}
                      </span>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[#666666] mb-2">Notas por Amostra</h4>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Atributo
                              </th>
                              {teste.amostras.map((amostra) => (
                                <th key={amostra} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Amostra {amostra}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {teste.atributosAvaliados.map((atributo) => (
                              <tr key={atributo}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                  {atributo.charAt(0).toUpperCase() + atributo.slice(1).replace(/([A-Z])/g, ' $1')}
                                </td>
                                {teste.amostras.map((amostra) => (
                                  <td key={amostra} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                                    {resposta.notas[atributo] && resposta.notas[atributo][amostra] !== undefined
                                      ? resposta.notas[atributo][amostra]
                                      : '-'}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-[#666666] mb-2">Intenção de Compra</h4>
                      <p className="text-[#333333] capitalize">
                        {resposta.intencaoCompra.replace(/_/g, ' ')}
                      </p>
                      {resposta.comentarios && (
                        <>
                          <h4 className="text-sm font-medium text-[#666666] mt-4 mb-2">Comentários</h4>
                          <p className="text-[#333333]">{resposta.comentarios}</p>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Seção de Análises Estatísticas */}
          {teste.respostas && teste.respostas.length > 0 && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#8BA989] mb-4">Análises Estatísticas</h2>
              
              {/* Médias por Atributo e Amostra */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Médias por Atributo e Amostra</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Atributo
                        </th>
                        {teste.amostras.map((amostra) => (
                          <th key={amostra} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amostra {amostra}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {teste.atributosAvaliados.map((atributo) => {
                        // Calcular médias para cada atributo e amostra
                        const mediasPorAmostra = teste.amostras.map(amostra => {
                          const notas = teste.respostas
                            .map(resposta => resposta.notas[atributo]?.[amostra])
                            .filter(nota => nota !== undefined && nota !== null);
                          
                          if (notas.length === 0) return 0;
                          const soma = notas.reduce((acc, nota) => acc + nota, 0);
                          return (soma / notas.length).toFixed(2);
                        });
                        
                        return (
                          <tr key={atributo}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                              {atributo.charAt(0).toUpperCase() + atributo.slice(1).replace(/([A-Z])/g, ' $1')}
                            </td>
                            {mediasPorAmostra.map((media, idx) => (
                              <td key={idx} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center font-medium">
                                {media}
                              </td>
                            ))}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Análise de Intenção de Compra */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Análise de Intenção de Compra</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-[#F0F0E5] p-4 rounded-lg">
                    <h4 className="text-md font-medium text-[#666666] mb-2">Distribuição por Intenção</h4>
                    <div className="space-y-3">
                      {[
                        { value: 'definitivamente_compraria', label: 'Compraria definitivamente' },
                        { value: 'provavelmente_compraria', label: 'Compraria provavelmente' },
                        { value: 'talvez_compraria', label: 'Talvez compraria' },
                        { value: 'provavelmente_nao_compraria', label: 'Provavelmente não compraria' },
                        { value: 'definitivamente_nao_compraria', label: 'Definitivamente não compraria' }
                      ].map(({ value, label }) => {
                        const count = teste.respostas.filter(resposta => 
                          resposta.intencaoCompra && 
                          resposta.intencaoCompra.toLowerCase() === value.toLowerCase()
                        ).length;
                        
                        const porcentagem = ((count / teste.respostas.length) * 100).toFixed(1);
                        
                        return (
                          <div key={value}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-[#666666]">{label}</span>
                              <span className="text-sm font-medium text-[#333333]">{porcentagem}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[#8BA989] h-2.5 rounded-full"
                                style={{ width: `${porcentagem}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Análise Demográfica */}
              <div>
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Análise Demográfica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F0F0E5] p-4 rounded-lg">
                    <h4 className="text-md font-medium text-[#666666] mb-2">Distribuição por Gênero</h4>
                    <div className="space-y-3">
                      {['Masculino', 'Feminino', 'Outro'].map(genero => {
                        const count = teste.respostas.filter(resposta => 
                          resposta.generoJulgador && 
                          resposta.generoJulgador.toLowerCase() === genero.toLowerCase()
                        ).length;
                        
                        const porcentagem = ((count / teste.respostas.length) * 100).toFixed(1);
                        
                        return (
                          <div key={genero}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-[#666666]">{genero}</span>
                              <span className="text-sm font-medium text-[#333333]">{porcentagem}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[#8BA989] h-2.5 rounded-full"
                                style={{ width: `${porcentagem}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  <div className="bg-[#F0F0E5] p-4 rounded-lg">
                    <h4 className="text-md font-medium text-[#666666] mb-2">Distribuição por Faixa Etária</h4>
                    <div className="space-y-3">
                      {['18-25', '26-35', '36-45', '46-55', '56+'].map(faixa => {
                        const count = teste.respostas.filter(resposta => {
                          if (!resposta.idadeJulgador) return false;
                          
                          const idade = parseInt(resposta.idadeJulgador);
                          if (isNaN(idade)) return false;
                          
                          if (faixa === '56+') return idade >= 56;
                          const [min, max] = faixa.split('-').map(Number);
                          return idade >= min && idade <= max;
                        }).length;
                        
                        const porcentagem = ((count / teste.respostas.length) * 100).toFixed(1);
                        
                        return (
                          <div key={faixa}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-[#666666]">{faixa} anos</span>
                              <span className="text-sm font-medium text-[#333333]">{porcentagem}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div
                                className="bg-[#8BA989] h-2.5 rounded-full"
                                style={{ width: `${porcentagem}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
};

export default TestDetails; 