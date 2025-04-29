import { Link } from 'react-router-dom';
import { FaFlask, FaClipboardCheck, FaChartBar, FaCheckCircle } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <img
            src="/images/logo-panc.png"
            alt="Logo"
            className="h-20 w-20 object-contain"
          />
          <Link
            to="/login"
            className="bg-white text-primary px-6 py-2 rounded-lg hover:bg-brand-salmon transition-colors font-medium"
          >
            Acessar Plataforma
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 bg-background">
        {/* Seção de Boas-vindas */}
        <section className="py-16 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl font-bold text-brand-brown mb-6">
              Plataforma de Análise Sensorial
            </h1>
            <p className="text-xl text-brand-orange mb-12">
              Simplifique e padronize seus testes sensoriais de produtos lácteos caprinos
            </p>
          </div>
        </section>

        {/* Seção de Recursos */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
              {/* Card 1 */}
              <div className="bg-background rounded-lg p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaFlask className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-brand-brown mb-4">
                  Crie seu Teste
                </h3>
                <p className="text-gray-600">
                  Configure facilmente os parâmetros e critérios de avaliação para seu teste sensorial.
                </p>
              </div>

              {/* Card 2 */}
              <div className="bg-background rounded-lg p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaClipboardCheck className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-brand-brown mb-4">
                  Padronização
                </h3>
                <p className="text-gray-600">
                  Garanta que todos os testes sejam avaliados usando os mesmos critérios e padrões.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-background rounded-lg p-8 text-center shadow-lg transform hover:scale-105 transition-transform">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaChartBar className="text-white text-2xl" />
                </div>
                <h3 className="text-2xl font-bold text-brand-brown mb-4">
                  Análise de Dados
                </h3>
                <p className="text-gray-600">
                  Visualize e analise os resultados dos testes de forma clara e objetiva.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Benefícios */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-3xl font-bold text-brand-brown text-center mb-12">
              Benefícios da Plataforma
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-brown mb-2">
                    Eficiência
                  </h3>
                  <p className="text-gray-600">
                    Reduza o tempo de configuração e execução dos testes sensoriais.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-brown mb-2">
                    Consistência
                  </h3>
                  <p className="text-gray-600">
                    Mantenha a padronização em todos os processos de avaliação.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-brown mb-2">
                    Organização
                  </h3>
                  <p className="text-gray-600">
                    Centralize todos os dados e resultados em um único lugar.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaCheckCircle className="text-primary text-2xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-brand-brown mb-2">
                    Confiabilidade
                  </h3>
                  <p className="text-gray-600">
                    Obtenha resultados precisos e confiáveis para suas análises.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-base">
            &copy; {new Date().getFullYear()} PANC - PLATAFORMA DE ANÁLISE SENSORIAL DE PRODUTOS LÁCTEOS CAPRINOS<br />
            Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
} 