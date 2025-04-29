import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { FaEdit, FaArrowLeft } from 'react-icons/fa';

interface AnalystProfile {
  name: string;
  gender: string;
  birthDate: string;
  email: string;
  phone: string;
  education: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
  };
  role: string;
  createdAt: string;
  userId: string;
}

export default function Perfil() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [profile, setProfile] = useState<AnalystProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const analystDoc = await getDoc(doc(db, 'analists', user.uid));
        if (analystDoc.exists()) {
          setProfile(analystDoc.data() as AnalystProfile);
        }
      } catch (err) {
        setError('Erro ao carregar perfil');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
        <header className="bg-[#8BA989] text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold">Perfil</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar
            </button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8BA989] mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando perfil...</p>
            </div>
          </div>
        </main>

        <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
          <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </footer>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
        <header className="bg-[#8BA989] text-white py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img src="/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
              <h1 className="text-2xl font-bold">Perfil</h1>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar
            </button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center">
              <p className="text-red-600">Perfil não encontrado</p>
            </div>
          </div>
        </main>

        <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
          <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold">Perfil</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/perfil/editar')}
              className="flex items-center gap-2 px-4 py-2 bg-white text-[#8BA989] rounded-lg hover:bg-gray-100 transition"
            >
              <FaEdit />
              Editar
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Informações Pessoais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <p className="text-gray-900">{profile.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">{profile.email}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <p className="text-gray-900">{profile.gender}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <p className="text-gray-900">{profile.birthDate}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <p className="text-gray-900">{profile.phone}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escolaridade
                  </label>
                  <p className="text-gray-900">{profile.education}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Endereço</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rua
                  </label>
                  <p className="text-gray-900">{profile.address.street}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <p className="text-gray-900">{profile.address.number}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <p className="text-gray-900">{profile.address.neighborhood}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <p className="text-gray-900">{profile.address.city}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <p className="text-gray-900">{profile.address.state}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <p className="text-gray-900">{profile.address.zipCode}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
} 