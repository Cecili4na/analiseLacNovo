import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { PersonalFields, AddressFields } from '../components/ui/Form';
import { FaArrowLeft } from 'react-icons/fa';

export default function Cadastro() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validação dos campos obrigatórios
    const requiredFields = [
      "name", "gender", "birthDate", "email", "password", "phone", "education",
      "street", "number", "neighborhood", "zipCode", "city", "state"
    ];

    const formValues: Record<string, string> = {};
    const missingFields: string[] = [];

    requiredFields.forEach(field => {
      const value = formData.get(field)?.toString().trim();
      formValues[field] = value || "";
      if (!value) {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      const fieldNames: Record<string, string> = {
        name: "Nome",
        gender: "Sexo",
        birthDate: "Data de Nascimento",
        email: "E-mail",
        password: "Senha",
        phone: "Telefone",
        education: "Escolaridade",
        street: "Rua",
        number: "Número",
        neighborhood: "Bairro",
        zipCode: "CEP",
        city: "Cidade",
        state: "Estado"
      };
      
      setError(`Por favor, preencha os seguintes campos: ${missingFields.map(field => 
        fieldNames[field] || field).join(", ")}`);
      return;
    }

    if (formValues.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      return;
    }

    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      return;
    }

    try {
      // Criar usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );

      // Criar documento do analista no Firestore
      const analystData = {
        name: formValues.name,
        gender: formValues.gender,
        birthDate: formValues.birthDate,
        email: formValues.email,
        phone: formValues.phone,
        education: formValues.education,
        address: {
          street: formValues.street,
          number: formValues.number,
          neighborhood: formValues.neighborhood,
          city: formValues.city,
          state: formValues.state,
          zipCode: formValues.zipCode,
        },
        role: "analista",
        createdAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "analists", userCredential.user.uid), analystData);
      navigate('/login');

    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Este email já está cadastrado');
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
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
        <div className="w-full max-w-4xl">
          <div className="bg-primary text-white py-5 px-6 rounded-t-lg text-center">
            <h1 className="text-2xl font-bold">Cadastro de Analista</h1>
          </div>
          <div className="bg-white px-8 py-10 rounded-b-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <h2 className="text-lg font-semibold text-brand-brown mb-4">
                  Dados Pessoais
                </h2>
                <PersonalFields />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-brand-brown mb-4">
                  Endereço
                </h2>
                <AddressFields />
              </div>

              <div className="flex items-center justify-between gap-4 pt-6">
                <Link
                  to="/login"
                  className="px-6 py-3 text-primary border-2 border-primary rounded-lg 
                    hover:bg-primary hover:text-white transition flex items-center justify-center"
                >
                  <FaArrowLeft className="mr-2" />
                  Voltar
                </Link>

                <button
                  type="submit"
                  className="flex-1 bg-primary text-white px-6 py-3 rounded-lg 
                    hover:bg-primary-dark transition"
                >
                  Cadastrar
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
} 