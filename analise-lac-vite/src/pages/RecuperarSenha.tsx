import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { FaArrowLeft } from 'react-icons/fa';

export default function RecuperarSenha() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setError('');
    } catch (error) {
      setError('Não foi possível enviar o email de recuperação. Verifique se o email está correto.');
      setSuccess(false);
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
            <h1 className="text-2xl font-bold">Recuperar Senha</h1>
          </div>
          <div className="bg-white px-8 py-10 rounded-b-lg shadow-md">
            {success ? (
              <div className="text-center space-y-6">
                <div className="bg-green-100 text-green-700 p-4 rounded-lg">
                  Email de recuperação enviado com sucesso! Verifique sua caixa de entrada.
                </div>
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 border-2 border-primary rounded-md shadow-sm text-sm font-medium text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Voltar para o Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8">
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
                    placeholder="Digite seu email cadastrado"
                  />
                </div>
                <div className="pt-4 space-y-4">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
                  >
                    Enviar Email de Recuperação
                  </button>
                  <Link
                    to="/login"
                    className="w-full py-3 px-4 border-2 border-primary rounded-md shadow-sm text-sm font-medium text-primary hover:bg-primary hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors flex items-center justify-center"
                  >
                    <FaArrowLeft className="mr-2" />
                    Voltar
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 