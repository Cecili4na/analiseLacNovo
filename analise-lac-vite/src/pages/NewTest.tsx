import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import QRCode from 'qrcode';
import { app } from '../firebaseConfig';

const NewTest = () => {
  const navigate = useNavigate();
  const [testCreated, setTestCreated] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [error, setError] = useState('');
  const [selectedAttributes, setSelectedAttributes] = useState({
    aroma: false,
    cor: false,
    textura: false,
    sabor: false,
    aparenciaGlobal: false,
  });
  const [customAttributes, setCustomAttributes] = useState<string[]>([]);
  const [newAttribute, setNewAttribute] = useState('');

  useEffect(() => {
    const auth = getAuth(app);
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        navigate('/login');
        return;
      }
      const idTokenResult = await user.getIdTokenResult();
      if (idTokenResult.claims.role !== 'analista') {
        auth.signOut();
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const formData = new FormData(e.currentTarget);
    const testData = {
      produto: formData.get('produto'),
      fabricante: formData.get('fabricante'),
      tipoEmbalagem: formData.get('embalagem'),
      pesoProduto: formData.get('peso'),
      dataFabricacao: formData.get('dataFabricacao'),
      dataValidade: formData.get('dataValidade'),
      dataTeste: formData.get('dataTeste'),
      horarioTeste: formData.get('horarioTeste'),
      localTeste: formData.get('localTeste'),
      tipoTeste: formData.get('tipoTeste'),
      quantidadeAvaliadores: Number(formData.get('quantidadeAvaliadores')),
      atributosAvaliados: [
        ...Object.keys(selectedAttributes).filter((key) => selectedAttributes[key as keyof typeof selectedAttributes]),
        ...customAttributes,
      ],
      status: 'pendente',
      dataCriacao: new Date().toISOString(),
      analistaId: getAuth(app).currentUser?.uid,
      respostas: [],
      totalRespostas: 0,
    };

    try {
      const db = getFirestore(app);
      const docRef = await addDoc(collection(db, 'testes_pendentes'), testData);
      const url = `${window.location.origin}/responder-teste/${docRef.id}`;
      setTestUrl(url);
      setTestCreated(true);
      const qrCodeDataUrl = await QRCode.toDataURL(url, { width: 200, margin: 1 });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (err) {
      setError('Erro ao criar teste');
      console.error(err);
    }
  };

  const handleAddAttribute = () => {
    if (newAttribute.trim() && !customAttributes.includes(newAttribute.trim())) {
      setCustomAttributes([...customAttributes, newAttribute.trim()]);
      setNewAttribute('');
    }
  };

  const handleRemoveAttribute = (attribute: string) => {
    setCustomAttributes(customAttributes.filter((attr) => attr !== attribute));
  };

  if (testCreated) {
    return (
      <div className="min-h-screen bg-[#F0F0E5] flex flex-col">
        <header className="bg-[#8BA989] text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <h1 className="text-xl font-bold">Teste Criado!</h1>
            <button
              onClick={() => navigate('/testes')}
              className="bg-[#6a7a6a] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E]"
            >
              Voltar
            </button>
          </div>
        </header>
        <main className="flex-grow p-8">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-[#8BA989] mb-4">Link do Teste</h2>
            <input
              type="text"
              value={testUrl}
              readOnly
              className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg"
            />
            <button
              onClick={() => navigator.clipboard.writeText(testUrl)}
              className="mt-2 bg-[#8BA989] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E]"
            >
              Copiar Link
            </button>
            <h2 className="text-2xl font-bold text-[#8BA989] mt-6 mb-4">QR Code</h2>
            {qrCodeUrl && <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48 mx-auto" />}
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
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Novo Teste</h1>
          <button
            onClick={() => navigate('/testes')}
            className="bg-[#6a7a6a] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E]"
          >
            Voltar
          </button>
        </div>
      </header>
      <main className="flex-grow p-8">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6 space-y-6">
          {error && (
            <div className="bg-[#FEE2E2] text-[#DC2626] p-4 rounded-lg">{error}</div>
          )}
          <div>
            <h2 className="text-lg font-medium text-[#8BA989] mb-4">Informações do Produto</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="produto" className="block text-sm font-medium text-[#666666] mb-1">
                  Nome do Produto*
                </label>
                <input
                  type="text"
                  id="produto"
                  name="produto"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="fabricante" className="block text-sm font-medium text-[#666666] mb-1">
                  Fabricante*
                </label>
                <input
                  type="text"
                  id="fabricante"
                  name="fabricante"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="embalagem" className="block text-sm font-medium text-[#666666] mb-1">
                  Tipo de Embalagem*
                </label>
                <input
                  type="text"
                  id="embalagem"
                  name="embalagem"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="peso" className="block text-sm font-medium text-[#666666] mb-1">
                  Peso do Produto*
                </label>
                <input
                  type="text"
                  id="peso"
                  name="peso"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="dataFabricacao" className="block text-sm font-medium text-[#666666] mb-1">
                  Data de Fabricação*
                </label>
                <input
                  type="date"
                  id="dataFabricacao"
                  name="dataFabricacao"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="dataValidade" className="block text-sm font-medium text-[#666666] mb-1">
                  Data de Validade*
                </label>
                <input
                  type="date"
                  id="dataValidade"
                  name="dataValidade"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#8BA989] mb-4">Informações do Teste</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="dataTeste" className="block text-sm font-medium text-[#666666] mb-1">
                  Data do Teste*
                </label>
                <input
                  type="date"
                  id="dataTeste"
                  name="dataTeste"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="horarioTeste" className="block text-sm font-medium text-[#666666] mb-1">
                  Horário do Teste*
                </label>
                <input
                  type="time"
                  id="horarioTeste"
                  name="horarioTeste"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="localTeste" className="block text-sm font-medium text-[#666666] mb-1">
                  Local do Teste*
                </label>
                <input
                  type="text"
                  id="localTeste"
                  name="localTeste"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
              <div>
                <label htmlFor="tipoTeste" className="block text-sm font-medium text-[#666666] mb-1">
                  Tipo de Teste*
                </label>
                <select
                  id="tipoTeste"
                  name="tipoTeste"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                >
                  <option value="">Selecione...</option>
                  <option value="descritivo">Descritivo</option>
                  <option value="afetivo">Afetivo</option>
                  <option value="discriminativo">Discriminativo</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantidadeAvaliadores" className="block text-sm font-medium text-[#666666] mb-1">
                  Quantidade de Avaliadores*
                </label>
                <input
                  type="number"
                  id="quantidadeAvaliadores"
                  name="quantidadeAvaliadores"
                  min="1"
                  required
                  className="w-full px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-medium text-[#8BA989] mb-4">Atributos Sensoriais</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {Object.entries(selectedAttributes).map(([key, value]) => (
                  <label key={key} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) =>
                        setSelectedAttributes({ ...selectedAttributes, [key]: e.target.checked })
                      }
                      className="rounded border-[#D1D5DB] text-[#8BA989] focus:ring-[#8BA989]"
                    />
                    <span className="text-[#666666]">
                      {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newAttribute}
                  onChange={(e) => setNewAttribute(e.target.value)}
                  placeholder="Novo atributo"
                  className="flex-1 px-4 py-2 border border-[#D1D5DB] rounded-lg focus:ring-[#8BA989] focus:border-[#8BA989]"
                />
                <button
                  type="button"
                  onClick={handleAddAttribute}
                  className="bg-[#8BA989] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E]"
                >
                  Adicionar
                </button>
              </div>

              {customAttributes.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {customAttributes.map((attribute) => (
                    <div
                      key={attribute}
                      className="flex items-center space-x-2 bg-[#F0F0E5] px-3 py-1 rounded-lg"
                    >
                      <span className="text-[#666666]">{attribute}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttribute(attribute)}
                        className="text-[#DC2626] hover:text-[#B91C1C]"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-[#8BA989] text-white px-6 py-2 rounded-lg hover:bg-[#6E8F6E]"
            >
              Criar Teste
            </button>
          </div>
        </form>
      </main>
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
};

export default NewTest; 