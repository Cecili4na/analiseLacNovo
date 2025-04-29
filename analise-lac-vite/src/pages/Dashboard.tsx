import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    if (user) {
      setUserName(user.displayName || user.email || 'Analista');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-primary text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold ml-4">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-[#6a7a6a] text-white px-4 py-2 rounded-lg hover:bg-[#6E8F6E]"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Perfil</h2>
            <p className="text-[#666666] mb-4">Gerencie suas informações pessoais.</p>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg hover:bg-[#6E8F6E] transition"
            >
              Acessar Perfil
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Testes</h2>
            <p className="text-[#666666] mb-4">Crie e gerencie testes sensoriais.</p>
            <button
              onClick={() => navigate('/testes')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg hover:bg-[#6E8F6E] transition"
            >
              Gerenciar Testes
            </button>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Teoria</h2>
            <p className="text-[#666666] mb-4">Acesse materiais teóricos.</p>
            <button
              onClick={() => navigate('/teoria')}
              className="w-full bg-[#8BA989] text-white py-2 rounded-lg hover:bg-[#6E8F6E] transition"
            >
              Acessar Material
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
};

export default Dashboard; 