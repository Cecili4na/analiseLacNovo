import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaFileAlt, FaChartLine } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Benefícios da Plataforma */}
      <div className="bg-[#F5F5F0] py-16 w-full">
        <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-12">
          Benefícios da Plataforma
        </h2>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto px-4">
          <div className="bg-white p-6 rounded shadow">
            <div className="w-14 h-14 bg-[#C75D3C] rounded flex items-center justify-center text-white mb-4">
              <FaCheckCircle className="text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Dados Confiáveis</h3>
            <p className="text-[#666] text-sm leading-relaxed">
              Coleta padronizada de dados com validação automática, garantindo a integridade das informações para análises precisas.
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <div className="w-14 h-14 bg-[#8BA989] rounded flex items-center justify-center text-white mb-4">
              <FaFileAlt className="text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#2C5530] mb-2">Análise Rápida</h3>
            <p className="text-[#666] text-sm leading-relaxed">
              Processamento automático e geração de relatórios instantâneos, economizando tempo e recursos no desenvolvimento de produtos.
            </p>
          </div>

          <div className="bg-white p-6 rounded shadow">
            <div className="w-14 h-14 bg-[#B8997D] rounded flex items-center justify-center text-white mb-4">
              <FaChartLine className="text-xl" />
            </div>
            <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Visualização Clara</h3>
            <p className="text-[#666] text-sm leading-relaxed">
              Gráficos e estatísticas para melhor compreensão dos resultados, facilitando a tomada de decisões baseada em dados concretos.
            </p>
          </div>
        </div>
      </div>

      {/* Como funciona? */}
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-[#8B4513] mb-16">
            Como funciona?
          </h2>
          <div className="max-w-4xl mx-auto space-y-16">
            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[#8BA989] rounded-lg flex items-center justify-center text-white shadow">
                <span className="text-2xl font-bold">1</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Criação do Teste</h3>
                <p className="text-[#666] text-base">
                  O analista cria um teste sensorial definindo os atributos a serem avaliados, configurando escalas e estabelecendo parâmetros específicos para cada produto lácteo caprino.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[#C75D3C] rounded-lg flex items-center justify-center text-white shadow">
                <span className="text-2xl font-bold">2</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Coleta de Dados</h3>
                <p className="text-[#666] text-base">
                  Os julgadores avaliam os produtos através de um formulário digital intuitivo, garantindo padronização e precisão nas análises sensoriais.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[#B8997D] rounded-lg flex items-center justify-center text-white shadow">
                <span className="text-2xl font-bold">3</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#8B4513] mb-2">Análise dos Resultados</h3>
                <p className="text-[#666] text-base">
                  O sistema processa os dados e gera relatórios estatísticos detalhados, oferecendo visualizações claras e insights sobre as propriedades sensoriais dos produtos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 