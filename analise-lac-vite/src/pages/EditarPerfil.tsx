import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

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

export default function EditarPerfil() {
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
        } else {
          const newProfile: AnalystProfile = {
            name: user.displayName || '',
            gender: '',
            birthDate: '',
            email: user.email || '',
            phone: '',
            education: '',
            address: {
              street: '',
              number: '',
              neighborhood: '',
              city: '',
              state: '',
              zipCode: '',
            },
            role: 'analista',
            createdAt: new Date().toISOString(),
            userId: user.uid,
          };
          await setDoc(doc(db, 'analists', user.uid), newProfile);
          setProfile(newProfile);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setLoading(true);
      const profileData = {
        ...profile,
        updatedAt: new Date().toISOString()
      };
      await updateDoc(doc(db, 'analists', user.uid), profileData);
      navigate('/perfil');
    } catch (err) {
      setError('Erro ao atualizar perfil');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Perfil não encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F0E5]">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <img src="/logo-panc.png" alt="PANC Logo" className="h-12 w-auto" />
            <h1 className="text-2xl font-bold">Editar Perfil</h1>
          </div>
          <button
            onClick={() => navigate('/perfil')}
            className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
          >
            <FaArrowLeft />
            Voltar
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-[#8BA989] mb-4">Informações Pessoais</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sexo
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  >
                    <option value="masculino">Masculino</option>
                    <option value="feminino">Feminino</option>
                    <option value="outro">Outro</option>
                    <option value="prefiro_nao_informar">Prefiro não informar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Nascimento
                  </label>
                  <input
                    type="date"
                    value={profile.birthDate}
                    onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Escolaridade
                  </label>
                  <select
                    value={profile.education}
                    onChange={(e) => setProfile({ ...profile, education: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  >
                    <option value="medio">Ensino Médio</option>
                    <option value="superior">Ensino Superior</option>
                    <option value="pos">Pós-graduação</option>
                    <option value="mestrado">Mestrado</option>
                    <option value="doutorado">Doutorado</option>
                  </select>
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
                  <input
                    type="text"
                    value={profile.address.street}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, street: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Número
                  </label>
                  <input
                    type="text"
                    value={profile.address.number}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, number: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bairro
                  </label>
                  <input
                    type="text"
                    value={profile.address.neighborhood}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, neighborhood: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={profile.address.city}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, city: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    value={profile.address.state}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, state: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    value={profile.address.zipCode}
                    onChange={(e) => setProfile({
                      ...profile,
                      address: { ...profile.address, zipCode: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989]"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-[#8BA989] text-white px-6 py-2 rounded-md hover:bg-[#6E8F6E] focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Salvando...' : 'Salvar Alterações'}
              </button>
            </div>
          </form>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <p>© 2025 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
} 