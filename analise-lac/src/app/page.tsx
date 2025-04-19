"use client";

import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <Link href="/" className="flex items-center">
            <Image
              src="/images/logo-panc.png"
              alt="PANC - Plataforma de Análise Sensorial"
              width={64}
              height={64}
              className="h-16 w-auto"
            />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-white">
        {/* Hero Section */}
        <section className="py-20 px-4 bg-[#F0F0E5]">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Plataforma de Análise Sensorial de Laticínios Caprinos
            </h1>
            <p className="text-lg text-gray-700 mb-10 max-w-2xl mx-auto leading-relaxed">
              Ferramenta especializada para análise sensorial de produtos lácteos caprinos, 
              facilitando a avaliação e coleta de dados para pesquisas e desenvolvimento de produtos.
            </p>
            <Link 
              href="/login"
              className="inline-block bg-[#8BA989] text-white px-10 py-4 rounded-lg text-lg font-medium 
                hover:bg-[#6B8E6B] transition-all duration-300"
            >
              Acessar Plataforma
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Como funciona?</h2>
            <div className="max-w-3xl mx-auto">
              <div className="space-y-8">
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#8BA989] text-white text-lg font-medium rounded-lg flex items-center justify-center">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">Criação do Teste</h3>
                    <p className="text-gray-700">O analista cria um teste sensorial definindo os atributos a serem avaliados.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#8BA989] text-white text-lg font-medium rounded-lg flex items-center justify-center">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">Avaliação</h3>
                    <p className="text-gray-700">Os avaliadores realizam a análise sensorial dos produtos.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-[#8BA989] text-white text-lg font-medium rounded-lg flex items-center justify-center">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl mb-2 text-gray-900">Resultados</h3>
                    <p className="text-gray-700">Geração de relatórios e análises estatísticas dos dados coletados.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-[#F0F0E5]">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Benefícios da Plataforma</h2>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="p-6 bg-white rounded-lg">
                <div className="w-12 h-12 bg-[#8BA989] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Dados Confiáveis</h3>
                <p className="text-gray-700">Coleta padronizada de dados com validação automática.</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <div className="w-12 h-12 bg-[#8BA989] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Análise Rápida</h3>
                <p className="text-gray-700">Processamento eficiente e geração rápida de resultados.</p>
              </div>
              <div className="p-6 bg-white rounded-lg">
                <div className="w-12 h-12 bg-[#8BA989] text-white rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-gray-900">Relatórios Detalhados</h3>
                <p className="text-gray-700">Visualização clara e detalhada dos resultados obtidos.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#8BA989] text-white py-6 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
} 