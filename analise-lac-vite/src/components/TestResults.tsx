import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { Teste, MediaAtributos } from '../types/test';
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

export function TestResults() {
  const [testes, setTestes] = useState<Teste[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mediaAtributos, setMediaAtributos] = useState<MediaAtributos>({
    aparência: 0,
    aroma: 0,
    sabor: 0,
    textura: 0,
    geral: 0,
  });

  useEffect(() => {
    const fetchTestes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'testes'));
        const testesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Teste[];
        
        setTestes(testesData);
        
        // Calcular média dos atributos
        const media = testesData.reduce((acc, teste) => ({
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

        const totalTestes = testesData.length;
        setMediaAtributos({
          aparência: media.aparência / totalTestes,
          aroma: media.aroma / totalTestes,
          sabor: media.sabor / totalTestes,
          textura: media.textura / totalTestes,
          geral: media.geral / totalTestes,
        });

        setLoading(false);
      } catch (err) {
        setError('Erro ao carregar os testes');
        setLoading(false);
      }
    };

    fetchTestes();
  }, []);

  const barChartData = {
    labels: ['Aparência', 'Aroma', 'Sabor', 'Textura', 'Geral'],
    datasets: [
      {
        label: 'Média dos Atributos',
        data: [
          mediaAtributos.aparência,
          mediaAtributos.aroma,
          mediaAtributos.sabor,
          mediaAtributos.textura,
          mediaAtributos.geral,
        ],
        backgroundColor: 'rgba(139, 169, 137, 0.5)',
        borderColor: 'rgb(139, 169, 137)',
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ['Definitivamente compraria', 'Provavelmente compraria', 'Talvez compraria', 'Provavelmente não compraria', 'Definitivamente não compraria'],
    datasets: [
      {
        data: [
          testes.filter(t => t.intencaoCompra === 5).length,
          testes.filter(t => t.intencaoCompra === 4).length,
          testes.filter(t => t.intencaoCompra === 3).length,
          testes.filter(t => t.intencaoCompra === 2).length,
          testes.filter(t => t.intencaoCompra === 1).length,
        ],
        backgroundColor: [
          'rgba(139, 169, 137, 0.5)',
          'rgba(139, 169, 137, 0.4)',
          'rgba(139, 169, 137, 0.3)',
          'rgba(139, 169, 137, 0.2)',
          'rgba(139, 169, 137, 0.1)',
        ],
        borderColor: 'rgb(139, 169, 137)',
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
          <Bar data={barChartData} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Intenção de Compra</h2>
          <Pie data={pieChartData} />
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
} 