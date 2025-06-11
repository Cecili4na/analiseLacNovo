import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { FaArrowLeft, FaFileExcel } from 'react-icons/fa';
import ErrorMessage from '../components/ui/ErrorMessage';
import * as XLSX from 'xlsx';

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
    intencaoCompra: { [amostra: string]: string };
    comentarios: string;
    dataAvaliacao: string;
    termoAceito: boolean;
  }>;
  tipoAnaliseEstatistica: string;
  dataCriacao: string;
  analistaId: string;
  criadoPor: string;
  atualizadoEm: string;
  escalaHedonica: '5' | '7' | '9';
}

const escalasHedonicas = {
  '5': [
    { valor: 5, descricao: 'Gostei muito' },
    { valor: 4, descricao: 'Gostei' },
    { valor: 3, descricao: 'Indiferente' },
    { valor: 2, descricao: 'Não gostei' },
    { valor: 1, descricao: 'Não gostei muito' }
  ],
  '7': [
    { valor: 7, descricao: 'Gostei muitíssimo' },
    { valor: 6, descricao: 'Gostei muito' },
    { valor: 5, descricao: 'Gostei moderadamente' },
    { valor: 4, descricao: 'Nem gostei, nem desgostei' },
    { valor: 3, descricao: 'Não gostei moderadamente' },
    { valor: 2, descricao: 'Não gostei muito' },
    { valor: 1, descricao: 'Não gostei de jeito nenhum' }
  ],
  '9': [
    { valor: 9, descricao: 'Gostei muitíssimo' },
    { valor: 8, descricao: 'Gostei muito' },
    { valor: 7, descricao: 'Gostei moderadamente' },
    { valor: 6, descricao: 'Gostei ligeiramente' },
    { valor: 5, descricao: 'Nem gostei, nem desgostei' },
    { valor: 4, descricao: 'Não gostei ligeiramente' },
    { valor: 3, descricao: 'Não gostei moderadamente' },
    { valor: 2, descricao: 'Não gostei muito' },
    { valor: 1, descricao: 'Desgostei muitíssimo' }
  ]
};

const TestDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mostrarRespostas, setMostrarRespostas] = useState(false);

  const validarDadosTeste = (dados: any): boolean => {
    if (!dados) return false;
    const camposMinimos = [
      'produto',
      'fabricante'
    ];
    const camposMinimosValidos = camposMinimos.every(campo => {
      const valor = dados[campo];
      return valor !== undefined && valor !== null && valor !== '';
    });
    return camposMinimosValidos;
  };

  useEffect(() => {
    const carregarTeste = async () => {
      if (!id) {
        setError('ID do teste não fornecido');
        setLoading(false);
        return;
      }
      try {
        const db = getFirestore(app);
        const testeDoc = await getDoc(doc(db, 'testes_pendentes', id));
        if (!testeDoc.exists()) {
          const concluidoDoc = await getDoc(doc(db, 'testes', id));
          if (!concluidoDoc.exists()) {
            setError('Teste não encontrado');
            setLoading(false);
            return;
          }
          const dados = concluidoDoc.data();
          if (!validarDadosTeste(dados)) {
            setError('Dados do teste incompletos ou inválidos');
            setLoading(false);
            return;
          }
          const dadosCompletos = {
            produto: dados.produto || '',
            fabricante: dados.fabricante || '',
            tipoEmbalagem: '',
            pesoProduto: '',
            dataFabricacao: '',
            dataValidade: '',
            dataTeste: '',
            horarioTeste: '',
            localTeste: '',
            tipoTeste: 'escalaHedonica',
            quantidadeAvaliadores: 0,
            totalRespostas: 0,
            status: 'concluido',
            atributosAvaliados: [],
            amostras: [],
            respostas: [],
            tipoAnaliseEstatistica: 'anova',
            dataCriacao: new Date().toISOString(),
            analistaId: '',
            criadoPor: '',
            atualizadoEm: new Date().toISOString(),
            escalaHedonica: '9',
            ...dados
          };
          setTeste({ id: concluidoDoc.id, ...dadosCompletos } as Teste);
        } else {
          const dados = testeDoc.data();
          if (!validarDadosTeste(dados)) {
            setError('Dados do teste incompletos ou inválidos');
            setLoading(false);
            return;
          }
          const dadosCompletos = {
            produto: dados.produto || '',
            fabricante: dados.fabricante || '',
            tipoEmbalagem: '',
            pesoProduto: '',
            dataFabricacao: '',
            dataValidade: '',
            dataTeste: '',
            horarioTeste: '',
            localTeste: '',
            tipoTeste: 'escalaHedonica',
            quantidadeAvaliadores: 0,
            totalRespostas: 0,
            status: 'pendente',
            atributosAvaliados: [],
            amostras: [],
            respostas: [],
            tipoAnaliseEstatistica: 'anova',
            dataCriacao: new Date().toISOString(),
            analistaId: '',
            criadoPor: '',
            atualizadoEm: new Date().toISOString(),
            escalaHedonica: '9',
            ...dados
          };
          setTeste({ id: testeDoc.id, ...dadosCompletos } as Teste);
        }
      } catch (err) {
        console.error('Erro ao carregar teste:', err);
        setError('Erro ao carregar teste. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };
    carregarTeste();
  }, [id]);

  const exportarParaExcel = async () => {
    if (!teste) return;
    const dadosExportacao: any[] = [];
    dadosExportacao.push(['INFORMAÇÕES DO TESTE']);
    dadosExportacao.push(['Produto:', teste.produto]);
    dadosExportacao.push(['Fabricante:', teste.fabricante]);
    dadosExportacao.push(['Data do Teste:', new Date(teste.dataTeste).toLocaleDateString()]);
    dadosExportacao.push(['Total de Respostas:', teste.totalRespostas]);
    dadosExportacao.push([]);
    dadosExportacao.push(['----------------------------------------------']);
    dadosExportacao.push([]);
    dadosExportacao.push(['TABELA DE NOTAS']);
    const cabecalhoNotas = ['Julgador', 'Idade', 'Gênero'];
    teste.amostras.forEach(amostra => {
      teste.atributosAvaliados.forEach(atributo => {
        cabecalhoNotas.push(`A${amostra} - ${atributo}`);
      });
      cabecalhoNotas.push(`A${amostra} - Intenção de Compra`);
    });
    dadosExportacao.push(cabecalhoNotas);
    teste.respostas.forEach(resposta => {
      const linhaDados = [
        resposta.nomeJulgador,
        resposta.idadeJulgador,
        resposta.generoJulgador
      ];
      teste.amostras.forEach(amostra => {
        teste.atributosAvaliados.forEach(atributo => {
          const nota = resposta.notas[atributo]?.[amostra] || '';
          linhaDados.push(nota.toString());
        });
        const intencao = resposta.intencaoCompra?.[amostra]?.replace(/_/g, ' ') || '';
        linhaDados.push(intencao);
      });
      dadosExportacao.push(linhaDados);
    });
    dadosExportacao.push([]);
    dadosExportacao.push(['----------------------------------------------']);
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
    dadosExportacao.push([]);
    dadosExportacao.push(['----------------------------------------------']);
    dadosExportacao.push([]);
    dadosExportacao.push(['COMENTÁRIOS DOS AVALIADORES']);
    dadosExportacao.push(['Nome', 'Comentário', 'Data']);
    teste.respostas.forEach(resposta => {
      if (resposta.comentarios) {
        dadosExportacao.push([
          resposta.nomeJulgador,
          resposta.comentarios,
          new Date(resposta.dataAvaliacao).toLocaleDateString()
        ]);
      }
    });
    const ws = XLSX.utils.aoa_to_sheet(dadosExportacao);
    // Ajuste de largura: primeira coluna larga, demais médias
    ws['!cols'] = ws['!cols'] || [];
    ws['!cols'][0] = { wch: 30 };
    for (let i = 1; i < (dadosExportacao[0]?.length || 40); i++) {
      ws['!cols'][i] = { wch: 40 };
    }
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');
    XLSX.writeFile(wb, `teste_${teste.id}_${new Date().toISOString().split('T')[0]}.xlsx`);
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center p-8">
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
      <ErrorMessage
        title="Erro ao Carregar Teste"
        message={error || 'Não foi possível encontrar os dados deste teste. Verifique se o ID está correto ou se o teste ainda existe.'}
        backUrl="/testes"
        backText="Voltar para Lista de Testes"
      />
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
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-[#8BA989] mb-4">Informações do Teste</h2>
              <p className="text-[#666666]">Visualize os detalhes e respostas do teste sensorial.</p>
            </div>
            <button
              onClick={exportarParaExcel}
              className="flex items-center gap-2 bg-[#8BA989] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaFileExcel />
              Exportar Dados
            </button>
          </div>
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
                <label className="block text-sm font-medium text-[#666666] mb-1">Escala Hedônica</label>
                <p className="text-[#333333]">
                  {teste.escalaHedonica} pontos - {
                    teste.escalaHedonica === '5' ? '5 (Gostei muito) a 1 (Não gostei muito)' :
                    teste.escalaHedonica === '7' ? '7 (Gostei muitíssimo) a 1 (Não gostei de jeito nenhum)' :
                    '9 (Gostei muitíssimo) a 1 (Desgostei muitíssimo)'
                  }
                </p>
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
              {(teste.atributosAvaliados || []).map((atributo) => (
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
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#8BA989]">Respostas</h2>
                <button
                  onClick={() => setMostrarRespostas(!mostrarRespostas)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#8BA989] text-white rounded-lg hover:bg-[#6E8F6E] transition"
                >
                  {mostrarRespostas ? 'Ocultar Respostas' : 'Mostrar Respostas'}
                </button>
              </div>
              {mostrarRespostas && (
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
                                {(teste.amostras || []).map((amostra) => (
                                  <th key={amostra} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amostra {amostra}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {(teste.atributosAvaliados || []).map((atributo) => (
                                <tr key={atributo}>
                                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                                    {atributo.charAt(0).toUpperCase() + atributo.slice(1).replace(/([A-Z])/g, ' $1')}
                                  </td>
                                  {(teste.amostras || []).map((amostra) => (
                                    <td key={amostra} className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 text-center">
                                      {resposta.notas?.[atributo]?.[amostra] !== undefined
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
                        <div className="space-y-2">
                          {teste.amostras.map((amostra) => (
                            <div key={amostra}>
                              <p className="text-sm text-[#666666]">Amostra {amostra}:</p>
                              <p className="text-[#333333] capitalize">
                                {resposta.intencaoCompra?.[amostra]?.replace(/_/g, ' ') || '-'}
                              </p>
                            </div>
                          ))}
                        </div>
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
              )}
            </div>
          )}
          {teste.respostas && teste.respostas.length > 0 && teste.amostras && teste.atributosAvaliados && (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold text-[#8BA989] mb-4">Análises Estatísticas</h2>
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Médias por Atributo e Amostra</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Atributo
                        </th>
                        {(teste.amostras || []).map((amostra) => (
                          <th key={amostra} className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Amostra {amostra}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(teste.atributosAvaliados || []).map((atributo) => {
                        const mediasPorAmostra = (teste.amostras || []).map(amostra => {
                          const notas = (teste.respostas || [])
                            .map(resposta => resposta.notas?.[atributo]?.[amostra])
                            .filter(nota => nota !== undefined && nota !== null);
                          if (notas.length === 0) return '-';
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
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Análise de Intenção de Compra</h3>
                <div className="grid grid-cols-1 gap-4">
                  {teste.amostras.map((amostra) => (
                    <div key={amostra} className="bg-[#F0F0E5] p-4 rounded-lg">
                      <h4 className="text-md font-medium text-[#666666] mb-2">Amostra {amostra}</h4>
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
                            resposta.intencaoCompra[amostra] === value
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
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#8BA989] mb-3">Análise Demográfica</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#F0F0E5] p-4 rounded-lg">
                    <h4 className="text-md font-medium text-[#666666] mb-2">Distribuição por Gênero</h4>
                    <div className="space-y-3">
                      {['Masculino', 'Feminino', 'Outro', 'Prefiro não informar'].map(genero => {
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