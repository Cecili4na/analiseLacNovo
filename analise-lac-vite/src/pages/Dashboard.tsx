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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-[#F0F0E5] to-[#E0E0D5]">
      <header className="bg-[#8BA989] text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/images/logo-panc.png" alt="PANC Logo" className="h-12 w-auto transform hover:scale-110 transition-transform duration-300" />
            <h1 className="text-2xl font-bold">Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="bg-[#D4C5A9] text-black px-4 py-2 rounded-lg hover:bg-[#C5B699] transition-all duration-200"
            >
              Sair
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform duration-300 border-l-4 border-[#9E5D45]">
            <h2 className="text-xl font-semibold text-[#5A6B2F] mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Perfil
            </h2>
            <p className="text-[#666666] mb-4">Gerencie suas informações pessoais.</p>
            <button
              onClick={() => navigate('/perfil')}
              className="w-full bg-[#D4C5A9] text-black py-2 rounded-lg hover:bg-[#C5B699] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span className="text-xl">🔍</span> Acessar Perfil
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform duration-300 border-l-4 border-[#9E5D45]">
            <h2 className="text-xl font-semibold text-[#5A6B2F] mb-4 flex items-center gap-2">
              <span>🧪</span> Testes
            </h2>
            <p className="text-[#666666] mb-4">Crie e gerencie testes sensoriais.</p>
            <button
              onClick={() => navigate('/testes')}
              className="w-full bg-[#D4C5A9] text-black py-2 rounded-lg hover:bg-[#C5B699] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>⚙️</span> Gerenciar Testes
            </button>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-[1.01] transition-transform duration-300 border-l-4 border-[#9E5D45]">
            <h2 className="text-xl font-semibold text-[#5A6B2F] mb-4 flex items-center gap-2">
              <span>📚</span> Teoria
            </h2>
            <p className="text-[#666666] mb-4">Acesse materiais teóricos.</p>
            <button
              onClick={() => navigate('/teoria')}
              className="w-full bg-[#D4C5A9] text-black py-2 rounded-lg hover:bg-[#C5B699] transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>📖</span> Acessar Material
            </button>
          </div>
        </div>
      </main>
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm shadow-lg">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
};

export default Dashboard; 