import React from 'react';

export const PersonalFields = () => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite seu nome completo"
        />
      </div>

      <div>
        <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
          Sexo
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="O">Outro</option>
        </select>
      </div>

      <div>
        <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="seu@email.com"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Senha
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label htmlFor="education" className="block text-sm font-medium text-gray-700 mb-1">
          Escolaridade
        </label>
        <select
          id="education"
          name="education"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
        >
          <option value="">Selecione</option>
          <option value="fundamental">Ensino Fundamental</option>
          <option value="medio">Ensino Médio</option>
          <option value="superior">Ensino Superior</option>
          <option value="pos">Pós-graduação</option>
          <option value="mestrado">Mestrado</option>
          <option value="doutorado">Doutorado</option>
        </select>
      </div>
    </div>
  );
};

export const AddressFields = () => {
  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
          Rua
        </label>
        <input
          type="text"
          id="street"
          name="street"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite o nome da rua"
        />
      </div>

      <div>
        <label htmlFor="number" className="block text-sm font-medium text-gray-700 mb-1">
          Número
        </label>
        <input
          type="text"
          id="number"
          name="number"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite o número"
        />
      </div>

      <div>
        <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
          Bairro
        </label>
        <input
          type="text"
          id="neighborhood"
          name="neighborhood"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite o bairro"
        />
      </div>

      <div>
        <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
          CEP
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="00000-000"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          Cidade
        </label>
        <input
          type="text"
          id="city"
          name="city"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite a cidade"
        />
      </div>

      <div>
        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
          Estado
        </label>
        <input
          type="text"
          id="state"
          name="state"
          required
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8BA989] focus:border-transparent transition-colors"
          placeholder="Digite a sigla do estado (ex: SP)"
        />
      </div>
    </div>
  );
}; 