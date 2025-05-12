import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { app } from '../firebaseConfig';
import { FaArrowLeft } from 'react-icons/fa';
import ErrorMessage from '../components/ui/ErrorMessage';

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
  status: string;
  dataCriacao: string;
  analistaId: string;
  criadoPor: string;
  atualizadoEm: string;
  respostas: any[];
  totalRespostas: number;
  amostras: string[]; // Array com os números das amostras
  escalaHedonica: '5' | '7' | '9';
}

const TERMO_CONSENTIMENTO = `TERMO DE CONSENTIMENTO LIVRE E ESCLARECIDO
As pesquisas envolvendo seres humanos são norteadas pela Resolução CNS n.º 466/2012.
Prezado(a) Senhor(a),
Esta pesquisa é sobre Avaliação Sensorial de produtos lácteos derivados caprinos.
O objetivo do estudo é obter respostas acerca das características sensoriais percebidas pelos usuários/julgadores, buscando um produto que mantenha as melhores características sensoriais e melhor conteúdo nutricional.
Para essa avaliação, o Teste de aceitação utilizado será o de escala hedônica. Também poderá ser realizado Teste de intenção de compra e Teste para avaliar qual(is) do(s) parâmetro(s) julgados no Teste de aceitação são mais importantes na escolha da compra do produto.
Solicitamos a sua colaboração para a realização das análises sensoriais, como também sua autorização para apresentar os resultados deste estudo em eventos da área de alimentos e publicar em revista científica. Por ocasião da publicação dos resultados, seu nome será mantido em sigilo.
A produção dos itens testados será realizada seguindo as normas de boas práticas de fabricação (BPF).
Os riscos dessa pesquisa são reações alérgicas e/ou engasgamento por parte dos participantes após a ingestão do produto. O pesquisador prestará assistência integral ao participante da pesquisa no que se refere às complicações, reações adversas à saúde e possíveis danos referentes à mesma.
Esclarecemos que sua participação no estudo é voluntária e, portanto, o(a) senhor(a) não é obrigado(a) a fornecer as informações e/ou colaborar com as atividades solicitadas pelo pesquisador(a). Caso decida não participar do estudo, ou resolver a qualquer momento desistir do mesmo, não sofrerá nenhum dano. O pesquisador(a) estará à sua disposição para qualquer esclarecimento que considere necessário em qualquer etapa da pesquisa.
Diante do exposto, declaro que fui devidamente esclarecido(a) e dou o meu consentimento para participar da pesquisa e para publicação dos resultados. Estou ciente que receberei uma via desse documento.`;

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

const ResponderTeste = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teste, setTeste] = useState<Teste | null>(null);
  const [loading, setLoading] = useState(true);
  const [termosAceitos, setTermosAceitos] = useState(false);
  const [respostas, setRespostas] = useState<{ [key: string]: { [key: string]: number } }>({});
  const [nomeJulgador, setNomeJulgador] = useState('');
  const [idadeJulgador, setIdadeJulgador] = useState('');
  const [generoJulgador, setGeneroJulgador] = useState('');
  const [intencaoCompra, setIntencaoCompra] = useState<{ [key: string]: string }>({});
  const [comentarios, setComentarios] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const carregarTeste = async () => {
      if (!id) return;
      try {
        const db = getFirestore(app);
        const testeRef = doc(db, 'testes_pendentes', id);
        const testeDoc = await getDoc(testeRef);
        if (!testeDoc.exists()) {
          setError('Teste não encontrado');
          setLoading(false);
          return;
        }
        const dados = testeDoc.data();
        setTeste({ id: testeDoc.id, ...dados } as Teste);
        const respostasIniciais: { [key: string]: { [key: string]: number } } = {};
        dados.atributosAvaliados.forEach((atributo: string) => {
          respostasIniciais[atributo] = {};
          dados.amostras.forEach((amostra: string) => {
            respostasIniciais[atributo][amostra] = 0;
          });
        });
        setRespostas(respostasIniciais);
        
        // Inicializar intenção de compra para cada amostra
        const intencaoCompraInicial: { [key: string]: string } = {};
        dados.amostras.forEach((amostra: string) => {
          intencaoCompraInicial[amostra] = '';
        });
        setIntencaoCompra(intencaoCompraInicial);
      } catch (err) {
        setError('Erro ao carregar teste');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    carregarTeste();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!teste || !nomeJulgador.trim() || !idadeJulgador.trim() || !generoJulgador.trim()) {
      setError('Preencha todos os campos obrigatórios');
      return;
    }
    try {
      const db = getFirestore(app);
      const testeRef = doc(db, 'testes_pendentes', teste.id);
      const novaResposta = {
        nomeJulgador,
        idadeJulgador,
        generoJulgador,
        notas: respostas,
        intencaoCompra,
        comentarios,
        dataAvaliacao: new Date().toISOString(),
        termoAceito: true,
      };
      await updateDoc(testeRef, {
        respostas: arrayUnion(novaResposta),
        totalRespostas: increment(1),
        atualizadoEm: new Date().toISOString()
      });
      setEnviado(true);
    } catch (err) {
      setError('Erro ao enviar resposta');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA989] mx-auto"></div>
          <p className="mt-4 text-[#666666]">Carregando teste...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Erro ao Carregar Teste"
        message={error}
        backUrl="/"
        backText="Voltar para Página Inicial"
      />
    );
  }

  if (!teste) {
    return (
      <ErrorMessage
        title="Teste Não Encontrado"
        message="O teste solicitado não foi encontrado ou não está mais disponível."
        backUrl="/"
        backText="Voltar para Página Inicial"
      />
    );
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
        <header className="bg-primary text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center">
              <Link to="/" className="mr-4">
                <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
              </Link>
              <h1 className="text-2xl font-bold">Avaliação Sensorial</h1>
            </div>
          </div>
        </header>
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-2xl font-bold text-[#8BA989] mb-4">Obrigado!</h2>
            <p className="text-[#666666] mb-6">
              Sua resposta foi enviada com sucesso. Agradecemos sua participação na avaliação sensorial.
            </p>
          </div>
        </main>
        <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
          <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
      {!termosAceitos && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">Termo de Consentimento</h2>
            <div className="prose prose-sm max-w-none text-[#666666] mb-4 whitespace-pre-line">
              {TERMO_CONSENTIMENTO}
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 text-[#666666] hover:text-[#333333]"
              >
                Não aceito
              </button>
              <button
                onClick={() => setTermosAceitos(true)}
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#6E8F6E]"
              >
                Aceito
              </button>
            </div>
          </div>
        </div>
      )}
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="mr-4">
              <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold">Avaliação Sensorial</h1>
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-bold text-[#8BA989] mb-4">Avaliação Sensorial</h2>
          <p className="text-[#666666]">Preencha o formulário para avaliar os produtos.</p>
        </div>
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-[#FEE2E2] text-[#DC2626] p-4 rounded-lg">{error}</div>
          )}
          {teste && (
            <>
              <div>
                <h2 className="text-xl font-bold text-[#8BA989] mb-4">Informações do Produto</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Produto</label>
                    <p className="text-[#333333]">{teste.produto}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Fabricante</label>
                    <p className="text-[#333333]">{teste.fabricante}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Tipo de Embalagem</label>
                    <p className="text-[#333333]">{teste.tipoEmbalagem}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Peso do Produto</label>
                    <p className="text-[#333333]">{teste.pesoProduto}</p>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#8BA989] mb-4">Suas Informações</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Seu Nome*</label>
                    <input
                      type="text"
                      value={nomeJulgador}
                      onChange={(e) => setNomeJulgador(e.target.value)}
                      className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Sua Idade*</label>
                    <input
                      type="number"
                      value={idadeJulgador}
                      onChange={(e) => setIdadeJulgador(e.target.value)}
                      className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989]"
                      required
                      min="18"
                      max="120"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">Seu Gênero*</label>
                    <select
                      value={generoJulgador}
                      onChange={(e) => setGeneroJulgador(e.target.value)}
                      className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989]"
                      required
                    >
                      <option value="">Selecione...</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                      <option value="prefiro_nao_informar">Prefiro não informar</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#8BA989] mb-4">Avaliação das Amostras</h2>
                <div className="space-y-6">
                  {teste.atributosAvaliados.map((atributo) => (
                    <div key={atributo} className="bg-white rounded-lg shadow p-4">
                      <h3 className="text-xl font-semibold text-[#8BA989] mb-3">
                        {atributo.charAt(0).toUpperCase() + atributo.slice(1).replace(/([A-Z])/g, ' $1')}:
                      </h3>
                      <div className="space-y-4">
                        {teste.amostras.map((amostra) => (
                          <div key={amostra} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium text-gray-700 mb-2">Amostra {amostra}</h4>
                            <div className="grid grid-cols-1 gap-1">
                              {escalasHedonicas[teste.escalaHedonica].slice().reverse().map(({ valor, descricao }) => (
                                <label
                                  key={valor}
                                  className="flex items-center p-1.5 rounded-lg hover:bg-gray-50 cursor-pointer"
                                >
                                  <input
                                    type="radio"
                                    name={`${atributo}-${amostra}`}
                                    value={valor}
                                    checked={respostas[atributo]?.[amostra] === valor}
                                    onChange={() => setRespostas({
                                      ...respostas,
                                      [atributo]: {
                                        ...respostas[atributo],
                                        [amostra]: valor
                                      }
                                    })}
                                    className="w-4 h-4 text-[#8BA989] focus:ring-[#8BA989]"
                                    required
                                  />
                                  <div className="ml-3">
                                    <span className="text-sm font-medium text-gray-900">{valor}</span>
                                    <span className="ml-2 text-sm text-gray-600">{descricao}</span>
                                  </div>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-xl font-bold text-[#8BA989] mb-4">Intenção de Compra</h2>
                <div className="space-y-4">
                  {teste.amostras.map((amostra) => (
                    <div key={amostra}>
                      <label className="block text-sm font-medium text-[#666666] mb-1">
                        Para a Amostra {amostra}, se eu visse esse produto no mercado eu*
                      </label>
                      <select
                        value={intencaoCompra[amostra] || ''}
                        onChange={(e) => setIntencaoCompra({
                          ...intencaoCompra,
                          [amostra]: e.target.value
                        })}
                        className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989]"
                        required
                      >
                        <option value="">Selecione...</option>
                        <option value="definitivamente_compraria">Definitivamente compraria</option>
                        <option value="provavelmente_compraria">Provavelmente compraria</option>
                        <option value="talvez_compraria">Talvez compraria</option>
                        <option value="provavelmente_nao_compraria">Provavelmente não compraria</option>
                        <option value="definitivamente_nao_compraria">Definitivamente não compraria</option>
                      </select>
                    </div>
                  ))}

                  <div>
                    <label className="block text-sm font-medium text-[#666666] mb-1">
                      Comentários (opcional)
                    </label>
                    <textarea
                      value={comentarios}
                      onChange={(e) => setComentarios(e.target.value)}
                      className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989]"
                      rows={4}
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#6E8F6E]"
                >
                  Enviar Avaliação
                </button>
              </div>
            </>
          )}
        </form>
      </main>
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
};

export default ResponderTeste; 