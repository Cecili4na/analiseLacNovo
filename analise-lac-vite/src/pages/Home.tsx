import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#FDF7E8] to-[#FFF8E6] font-sans">
      <div
        className="w-full px-6 py-16 text-center bg-[#F5E6D3] bg-cover bg-center"
        style={{
          backgroundImage: `url('/images/dairy-bg.jpg')`,
          backgroundColor: 'rgba(245, 230, 211, 0.9)',
          backgroundBlendMode: 'overlay',
        }}
      >
        <img
          src="/images/logo-panc.png"
          alt="PANC Logo"
          className="w-72 h-auto mx-auto mb-10 animate-pulse"
        />
        <p className="text-xl md:text-2xl font-semibold text-[#5A6B2F] mb-10 max-w-3xl mx-auto">
          Plataforma especializada para avaliação e análise sensorial de produtos lácteos caprinos
        </p>
        <div className="flex justify-center gap-5">
          <Link
            to="/login"
            className="bg-[#8BA989] hover:bg-[#6E8F6E] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Acessar Plataforma
          </Link>
          <Link
            to="/cadastro"
            className="bg-[#D95B43] hover:bg-[#6B3A0A] text-white px-10 py-4 rounded-full text-lg font-semibold transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Criar Conta
          </Link>
        </div>
      </div>

      <div className="bg-[#FDF7E8] py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-[#6B3A0A] mb-16 tracking-wide">
            Como funciona?
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#7A9B5E]">
              <div className="absolute -top-5 left-5 w-10 h-10 bg-[#8BA989] text-white rounded-full flex items-center justify-center text-xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-semibold text-[#6B3A0A] mb-4 mt-4">Criação do Teste</h3>
              <p className="text-[#555555] leading-relaxed">
                O analista cria um teste sensorial, definindo os atributos a serem avaliados, configurando escalas e estabelecendo parâmetros específicos para cada produto lácteo caprino.
              </p>
            </div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#D95B43]">
              <div className="absolute -top-5 left-5 w-10 h-10 bg-[#D95B43] text-white rounded-full flex items-center justify-center text-xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-semibold text-[#6B3A0A] mb-4 mt-4">Coleta de Dados</h3>
              <p className="text-[#555555] leading-relaxed">
                Os julgadores avaliam os produtos através de um formulário digital intuitivo, garantindo padronização e precisão nas análises sensoriais.
              </p>
            </div>
            <div className="relative bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-[#A68B5E]">
              <div className="absolute -top-5 left-5 w-10 h-10 bg-[#A68B5E] text-white rounded-full flex items-center justify-center text-xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-semibold text-[#6B3A0A] mb-4 mt-4">Análise dos Resultados</h3>
              <p className="text-[#555555] leading-relaxed">
                O sistema processa os dados e gera relatórios estatísticos detalhados, oferecendo visualizações claras e insights sobre as propriedades sensoriais dos produtos.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-20">
        <h2 className="text-4xl font-bold text-center text-[#6B3A0A] mb-16 tracking-wide">
          Por que usar nossa plataforma?
        </h2>
        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0 w-14 h-14 bg-[#8BA989] rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6B3A0A] mb-3">Facilidade de Uso</h3>
              <p className="text-[#555555] leading-relaxed">
                Interface intuitiva e amigável para todos os usuários.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0 w-14 h-14 bg-[#D95B43] rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6B3A0A] mb-3">Resultados Precisos</h3>
              <p className="text-[#555555] leading-relaxed">
                Análises estatísticas confiáveis e detalhadas.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0 w-14 h-14 bg-[#A68B5E] rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6B3A0A] mb-3">Economia de Tempo</h3>
              <p className="text-[#555555] leading-relaxed">
                Automatização de processos e geração de relatórios.
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-5">
            <div className="flex-shrink-0 w-14 h-14 bg-[#DEB887] rounded-full flex items-center justify-center text-white text-2xl">
              ✓
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#6B3A0A] mb-3">Suporte Especializado</h3>
              <p className="text-[#555555] leading-relaxed">
                Equipe técnica pronta para ajudar quando necessário.
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-[#6B3A0A] text-white py-8 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm">© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
}