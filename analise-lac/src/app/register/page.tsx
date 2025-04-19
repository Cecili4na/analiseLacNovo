'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PersonalFields, AddressFields } from '@/components/ui/Form';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';

export default function AnalystRegistration() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

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

      setError(`Por favor, preencha os seguintes campos: ${missingFields.map(field => fieldNames[field] || field).join(", ")}`);
      return;
    }

    if (formValues.password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
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

      router.push("/login?role=analista");
    } catch (error: any) {
      let errorMessage = "Erro ao cadastrar analista";
      
      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este e-mail já está cadastrado em nossa plataforma. Por favor, use outro e-mail ou faça login se já possuir uma conta.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha deve ter pelo menos 6 caracteres para garantir a segurança da sua conta.";
            break;
          case "auth/invalid-email":
            errorMessage = "O e-mail informado não é válido. Por favor, verifique e tente novamente.";
            break;
          case "auth/operation-not-allowed":
            errorMessage = "O cadastro de novos usuários está temporariamente desativado. Por favor, tente novamente mais tarde.";
            break;
          case "auth/network-request-failed":
            errorMessage = "Erro de conexão. Por favor, verifique sua internet e tente novamente.";
            break;
          default:
            errorMessage = "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.";
        }
      }

      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0E5] p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-[#8BA989] mb-6">
          Cadastro de Analista
        </h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Dados Pessoais
            </h2>
            <PersonalFields />
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-4">
              Endereço
            </h2>
            <AddressFields />
          </div>

          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="px-6 py-3 text-[#8BA989] border border-[#8BA989] rounded-lg 
                hover:bg-[#8BA989] hover:text-white transition"
            >
              Voltar
            </button>

            <button
              type="submit"
              className="flex-1 bg-[#8BA989] text-white px-6 py-3 rounded-lg 
                hover:bg-[#6E8F6E] transition"
            >
              Cadastrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 