import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import QRCode from 'qrcode';
import { FaArrowLeft } from 'react-icons/fa';
import ErrorMessage from '../components/ui/ErrorMessage';

interface FormData {
  produto: string;
  fabricante: string;
  pesoProduto: string;
  dataFabricacao: string;
  dataValidade: string;
  dataTeste: string;
  horarioTeste: string;
  localTeste: string;
  tipoTeste: string;
  quantidadeAvaliadores: number;
  quantidadeAmostras: number;
  amostras: string[];
  atributosAvaliados: string[];
  escalaHedonica: '5' | '7' | '9';
}

const atributosPadrao = [
  'aparência',
  'aroma',
  'sabor',
  'textura',
  'impressão global'
];

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

export default function NovoTesteAnalista() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [testCreated, setTestCreated] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [atributosSelecionados, setAtributosSelecionados] = useState<{ [key: string]: boolean }>(
    atributosPadrao.reduce((acc, atributo) => ({ ...acc, [atributo]: true }), {})
  );
  const [novoAtributo, setNovoAtributo] = useState('');
  const [atributosPersonalizados, setAtributosPersonalizados] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    produto: '',
    fabricante: '',
    pesoProduto: '',
    dataFabricacao: '',
    dataValidade: '',
    dataTeste: '',
    horarioTeste: '',
    localTeste: '',
    tipoTeste: 'escalaHedonica',
    quantidadeAvaliadores: 10,
    quantidadeAmostras: 2,
    amostras: ['', ''],
    atributosAvaliados: atributosPadrao,
    escalaHedonica: '9'
  });

  useEffect(() => {
    // Verificar se o usuário está logado e é um analista
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <ErrorMessage
        title="Acesso Negado"
        message="Você precisa estar logado como analista para acessar esta página."
        backUrl="/login"
        backText="Ir para Login"
      />
    );
  }

  useEffect(() => {
    // Atualizar atributos avaliados quando houver mudanças nas seleções
    const atributosSelecionadosArray = [
      ...Object.entries(atributosSelecionados)
        .filter(([_, selecionado]) => selecionado)
        .map(([atributo]) => atributo),
      ...atributosPersonalizados
    ];

    setFormData(prev => ({
      ...prev,
      atributosAvaliados: atributosSelecionadosArray
    }));
  }, [atributosSelecionados, atributosPersonalizados]);

  useEffect(() => {
    // Atualizar amostras quando a quantidade mudar
    const novasAmostras = Array(formData.quantidadeAmostras).fill('');
    setFormData(prev => ({
      ...prev,
      amostras: novasAmostras
    }));
  }, [formData.quantidadeAmostras]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'quantidadeAvaliadores' || name === 'quantidadeAmostras') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleAtributoChange = (atributo: string) => {
    setAtributosSelecionados(prev => ({
      ...prev,
      [atributo]: !prev[atributo]
    }));
  };

  const handleAdicionarAtributo = () => {
    if (novoAtributo.trim() && !atributosPersonalizados.includes(novoAtributo.trim())) {
      setAtributosPersonalizados(prev => [...prev, novoAtributo.trim()]);
      setNovoAtributo('');
    }
  };

  const handleRemoverAtributo = (atributo: string) => {
    setAtributosPersonalizados(prev => prev.filter(a => a !== atributo));
  };

  const handleAmostraChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      amostras: prev.amostras.map((amostra, i) => i === index ? value : amostra)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Você precisa estar logado para criar um teste');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Verificar se há atributos selecionados
      if (formData.atributosAvaliados.length === 0) {
        throw new Error('Selecione pelo menos um atributo para avaliação');
      }

      // Preparar dados do teste
      const testeData = {
        ...formData,
        analistaId: user.uid,
        criadoPor: user.displayName || user.email,
        status: 'pendente',
        dataCriacao: new Date().toISOString(),
        atualizadoEm: new Date().toISOString(),
        respostas: [],
        totalRespostas: 0
      };

      // Criar documento na coleção de testes_pendentes
      const docRef = await addDoc(collection(db, 'testes_pendentes'), testeData);

      console.log('Teste criado com ID:', docRef.id);
      
      // Gerar URL do teste
      const baseUrl = window.location.origin;
      const testUrl = `${baseUrl}/responderTeste/${docRef.id}`;
      setTestUrl(testUrl);
      
      // Gerar QR Code
      try {
        const qrCodeDataUrl = await QRCode.toDataURL(testUrl);
        setQrCodeUrl(qrCodeDataUrl);
      } catch (err) {
        console.error('Erro ao gerar QR Code:', err);
      }
      
      setTestCreated(true);
    } catch (error) {
      console.error('Erro ao criar teste:', error);
      if (error instanceof Error) {
        if (error.message.includes('permission-denied')) {
          setError('Você não tem permissão para criar testes. Por favor, verifique se você está logado como analista.');
        } else {
          setError(error.message);
        }
      } else {
        setError('Erro ao criar teste. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    navigate('/testes');
  };

  if (error && !testCreated) {
    return (
      <ErrorMessage
        title="Erro ao Criar Teste"
        message={error}
        backUrl="/testes"
        backText="Voltar para Lista de Testes"
      />
    );
  }

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/dashboard" className="mr-4">
              <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            </Link>
            <h1 className="text-2xl font-bold">Novo Teste Sensorial</h1>
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
          <h2 className="text-xl font-bold text-[#8BA989] mb-4">Criar Novo Teste</h2>
          <p className="text-[#666666]">Preencha os dados do teste sensorial abaixo.</p>
        </div>
        {testCreated ? (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#8BA989] mb-6">Teste Criado com Sucesso!</h2>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                O teste foi criado com sucesso. Compartilhe o link ou o QR Code abaixo com os avaliadores.
              </p>
              
              <div className="mb-4">
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">Link do Teste:</h3>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={testUrl}
                    readOnly
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(testUrl);
                      alert('Link copiado para a área de transferência!');
                    }}
                    className="bg-[#8BA989] text-white px-4 py-2 rounded-r-md hover:opacity-90"
                  >
                    Copiar
                  </button>
                </div>
              </div>
              
              {qrCodeUrl && (
                <div className="mb-4">
                  <h3 className="text-lg font-medium text-[#8BA989] mb-2">QR Code:</h3>
                  <div className="flex justify-center">
                    <img src={qrCodeUrl} alt="QR Code do teste" className="border border-gray-300 p-2" />
                  </div>
                  <div className="flex justify-center mt-2">
                    <a
                      href={qrCodeUrl}
                      download="qrcode-teste.png"
                      className="text-[#8BA989] hover:underline"
                    >
                      Baixar QR Code
                    </a>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <button
                onClick={handleContinue}
                className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:opacity-90"
              >
                Continuar para Lista de Testes
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-[#8BA989] mb-6">Cadastro de Novo Teste</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dados do Produto */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-[#8BA989] mb-4">Dados do Produto</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nome do Produto
                    </label>
                    <input
                      type="text"
                      name="produto"
                      value={formData.produto}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fabricante
                    </label>
                    <input
                      type="text"
                      name="fabricante"
                      value={formData.fabricante}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Peso do Produto
                    </label>
                    <input
                      type="text"
                      name="pesoProduto"
                      value={formData.pesoProduto}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Fabricação
                    </label>
                    <input
                      type="date"
                      name="dataFabricacao"
                      value={formData.dataFabricacao}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data de Validade
                    </label>
                    <input
                      type="date"
                      name="dataValidade"
                      value={formData.dataValidade}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                </div>
              </div>
              
              {/* Dados do Teste */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-[#8BA989] mb-4">Dados do Teste</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data do Teste
                    </label>
                    <input
                      type="date"
                      name="dataTeste"
                      value={formData.dataTeste}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Horário do Teste
                    </label>
                    <input
                      type="time"
                      name="horarioTeste"
                      value={formData.horarioTeste}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Local do Teste
                    </label>
                    <input
                      type="text"
                      name="localTeste"
                      value={formData.localTeste}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo de Teste
                    </label>
                    <select
                      name="tipoTeste"
                      value={formData.tipoTeste}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    >
                      <option value="escalaHedonica">Escala Hedônica</option>
                      <option value="comparacaoPareada" disabled>Comparação Pareada</option>
                      <option value="ordenacao" disabled>Ordenação</option>
                      <option value="aceitacao" disabled>Aceitação</option>
                    </select>
                  </div>
                  
                  {formData.tipoTeste === 'escalaHedonica' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Escala Hedônica
                      </label>
                      <select
                        name="escalaHedonica"
                        value={formData.escalaHedonica}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                      >
                        <option value="5">Escala de 5 pontos</option>
                        <option value="7">Escala de 7 pontos</option>
                        <option value="9">Escala de 9 pontos</option>
                      </select>
                      <div className="mt-2 text-sm text-gray-600">
                        <p className="font-medium mb-1">Descrição da escala:</p>
                        <ul className="list-disc list-inside">
                          {escalasHedonicas[formData.escalaHedonica].map(({ valor, descricao }) => (
                            <li key={valor}>{valor} - {descricao}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade de Avaliadores
                    </label>
                    <input
                      type="number"
                      name="quantidadeAvaliadores"
                      value={formData.quantidadeAvaliadores}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantidade de Amostras
                    </label>
                    <input
                      type="number"
                      name="quantidadeAmostras"
                      value={formData.quantidadeAmostras}
                      onChange={handleInputChange}
                      min="1"
                      max="10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    />
                  </div>
                  
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Códigos das Amostras
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {formData.amostras.map((amostra, index) => (
                        <div key={index}>
                          <label className="block text-sm text-gray-600 mb-1">
                            Amostra {index + 1}
                          </label>
                          <input
                            type="text"
                            value={amostra}
                            onChange={(e) => handleAmostraChange(index, e.target.value)}
                            placeholder={`Código ${index + 1}`}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Atributos Avaliados */}
              <div className="border-b border-gray-200 pb-6">
                <h3 className="text-lg font-medium text-[#8BA989] mb-4">Atributos Avaliados</h3>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {atributosPadrao.map(atributo => (
                      <div key={atributo} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`atributo-${atributo}`}
                          checked={atributosSelecionados[atributo]}
                          onChange={() => handleAtributoChange(atributo)}
                          className="w-4 h-4 text-[#8BA989] border-gray-300 rounded focus:ring-[#8BA989]"
                        />
                        <label
                          htmlFor={`atributo-${atributo}`}
                          className="ml-2 text-sm font-medium text-gray-700"
                        >
                          {atributo}
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Adicionar Novo Atributo</h4>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={novoAtributo}
                        onChange={(e) => setNovoAtributo(e.target.value)}
                        placeholder="Digite o novo atributo"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                      />
                      <button
                        type="button"
                        onClick={handleAdicionarAtributo}
                        className="bg-[#8BA989] text-white px-4 py-2 rounded-md hover:opacity-90"
                      >
                        Adicionar
                      </button>
                    </div>
                  </div>

                  {atributosPersonalizados.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Atributos Personalizados</h4>
                      <div className="space-y-2">
                        {atributosPersonalizados.map(atributo => (
                          <div key={atributo} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                            <span className="text-sm text-gray-700">{atributo}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoverAtributo(atributo)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:opacity-90 disabled:opacity-50"
                >
                  {loading ? 'Criando...' : 'Criar Teste'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
} 