export default function PersonalFields() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-brand-brown">
          Nome Completo
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="gender" className="block text-sm font-medium text-brand-brown">
          Sexo
        </label>
        <select
          id="gender"
          name="gender"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        >
          <option value="">Selecione...</option>
          <option value="masculino">Masculino</option>
          <option value="feminino">Feminino</option>
          <option value="outro">Outro</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="birthDate" className="block text-sm font-medium text-brand-brown">
          Data de Nascimento
        </label>
        <input
          type="date"
          id="birthDate"
          name="birthDate"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-brand-brown">
          Telefone
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-brand-brown">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="education" className="block text-sm font-medium text-brand-brown">
          Escolaridade
        </label>
        <select
          id="education"
          name="education"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        >
          <option value="">Selecione...</option>
          <option value="medio">Ensino Médio</option>
          <option value="superior">Ensino Superior</option>
          <option value="pos">Pós-graduação</option>
          <option value="mestrado">Mestrado</option>
          <option value="doutorado">Doutorado</option>
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-brand-brown">
          Senha
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-brand-brown">
          Confirmar Senha
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          minLength={6}
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>
    </div>
  );
} 