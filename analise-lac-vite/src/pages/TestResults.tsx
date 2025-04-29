import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface Teste {
  id: string;
  atributos: {
    aparência: number;
    aroma: number;
    sabor: number;
    textura: number;
    geral: number;
  };
  intencaoCompra: number;
  comentarios: string;
  avaliador: string;
  data: string;
}

const TestResults: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testes, setTestes] = useState<Teste[]>([]);

  useEffect(() => {
    const fetchTestes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testes'));
        const testesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teste[];
        setTestes(testesData);
      } catch (err) {
        setError('Erro ao carregar os resultados dos testes');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTestes();
  }, []);

  const calcularMediaAtributos = () => {
    if (testes.length === 0) return null;

    const somaAtributos = testes.reduce((acc, teste) => ({
      aparência: acc.aparência + teste.atributos.aparência,
      aroma: acc.aroma + teste.atributos.aroma,
      sabor: acc.sabor + teste.atributos.sabor,
      textura: acc.textura + teste.atributos.textura,
      geral: acc.geral + teste.atributos.geral,
    }), {
      aparência: 0,
      aroma: 0,
      sabor: 0,
      textura: 0,
      geral: 0,
    });

    return {
      aparência: somaAtributos.aparência / testes.length,
      aroma: somaAtributos.aroma / testes.length,
      sabor: somaAtributos.sabor / testes.length,
      textura: somaAtributos.textura / testes.length,
      geral: somaAtributos.geral / testes.length,
    };
  };

  const calcularMediaIntencaoCompra = () => {
    if (testes.length === 0) return 0;
    const soma = testes.reduce((acc, teste) => acc + teste.intencaoCompra, 0);
    return soma / testes.length;
  };

  const mediaAtributos = calcularMediaAtributos();
  const mediaIntencaoCompra = calcularMediaIntencaoCompra();

  const barChartData = {
    labels: ['Aparência', 'Aroma', 'Sabor', 'Textura', 'Geral'],
    datasets: [
      {
        label: 'Média dos Atributos',
        data: mediaAtributos ? [
          mediaAtributos.aparência,
          mediaAtributos.aroma,
          mediaAtributos.sabor,
          mediaAtributos.textura,
          mediaAtributos.geral,
        ] : [],
        backgroundColor: 'rgba(139, 169, 137, 0.8)',
        borderColor: 'rgba(139, 169, 137, 1)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['1 - Não compraria', '2', '3', '4', '5 - Compraria'],
    datasets: [
      {
        data: [
          testes.filter(t => t.intencaoCompra === 1).length,
          testes.filter(t => t.intencaoCompra === 2).length,
          testes.filter(t => t.intencaoCompra === 3).length,
          testes.filter(t => t.intencaoCompra === 4).length,
          testes.filter(t => t.intencaoCompra === 5).length,
        ],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 205, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(139, 169, 137, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 159, 64, 1)',
          'rgba(255, 205, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(139, 169, 137, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Resultados dos Testes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Média dos Atributos</h2>
          <Bar data={barChartData} options={{
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
                max: 5,
              },
            },
          }} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Intenção de Compra</h2>
          <Pie data={pieChartData} options={{
            responsive: true,
          }} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Comentários dos Avaliadores</h2>
        <div className="space-y-4">
          {testes.map((teste) => (
            <div key={teste.id} className="border-b pb-4">
              <p className="font-medium">{teste.avaliador}</p>
              <p className="text-gray-600">{teste.comentarios}</p>
              <p className="text-sm text-gray-500">{new Date(teste.data).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestResults; 