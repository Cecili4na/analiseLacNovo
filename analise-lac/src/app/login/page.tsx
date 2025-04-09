"use client";

import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/dashboardAnalista');
    } catch {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
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
      <main className="flex-grow flex items-center justify-center px-4 py-8 bg-[#F0F0E5]">
        <div className="w-full max-w-md">
          <div className="bg-[#8BA989] text-white p-6 rounded-t-lg text-center">
            <h1 className="text-2xl font-bold">Login</h1>
          </div>
          <form onSubmit={handleLogin} className="bg-white p-8 rounded-b-lg shadow-lg space-y-6">
            {error && <div className="p-3 bg-red-100 text-red-600 rounded text-sm">{error}</div>}
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] transition-colors" 
                  required 
                  placeholder="seu@email.com" 
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                <input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] transition-colors" 
                  required 
                  placeholder="••••••••" 
                />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button 
                type="submit" 
                className="bg-[#8BA989] text-white px-6 py-3 rounded-lg hover:bg-[#6B8E6B] transition w-full font-medium"
              >
                Entrar
              </button>
              <Link 
                href="/"
                className="px-6 py-3 border border-[#8BA989] text-[#8BA989] rounded-lg hover:bg-[#8BA989] hover:text-white transition w-full text-center font-medium"
              >
                Voltar
              </Link>
            </div>
            <div className="text-center text-sm text-gray-600">
              <span>Não tem uma conta? </span>
              <Link href="/cadastroAnalista" className="text-[#8BA989] hover:text-[#6B8E6B] hover:underline font-medium">
                Cadastre-se
              </Link>
            </div>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm mt-8">
        <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
      </footer>
    </div>
  );
} 