import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { Link } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboardAnalista');
    } catch {
      setError('Email ou senha inválidos');
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white py-6">
        <div className="container mx-auto px-4 flex items-center justify-center">
          <img
            src="/images/logo-panc.png"
            alt="Logo"
            className="h-20 w-20 object-contain"
          />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center px-4 py-12 bg-background">
        <div className="w-full max-w-md">
          <div className="bg-primary text-white py-5 px-6 rounded-t-lg text-center">
            <h1 className="text-2xl font-bold">Login</h1>
          </div>
          <div className="bg-white px-8 py-10 rounded-b-lg shadow-md">
            <form onSubmit={handleLogin} className="space-y-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-brand-brown">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-brand-brown">
                  Senha
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
                />
              </div>
              <div className="flex flex-col items-center space-y-6">
                <button
                  type="submit"
                  className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                >
                  Entrar
                </button>
                <Link
                  to="/"
                  className="w-full py-3 px-4 border-2 border-primary rounded-md shadow-sm text-sm font-medium text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Voltar
                </Link>
                <div className="w-full flex flex-col items-center space-y-4 pt-6 border-t border-gray-200">
                  <Link
                    to="/recuperar-senha"
                    className="text-sm text-brand-orange hover:text-brand-brown transition-colors"
                  >
                    Esqueceu sua senha?
                  </Link>
                  <div className="text-sm text-brand-brown">
                    Não tem uma conta?{' '}
                    <Link
                      to="/cadastro"
                      className="font-medium text-brand-orange hover:text-brand-brown transition-colors"
                    >
                      Cadastre-se
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 