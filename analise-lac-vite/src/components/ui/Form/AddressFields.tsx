export default function AddressFields() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="md:col-span-2 space-y-2">
        <label htmlFor="street" className="block text-sm font-medium text-brand-brown">
          Rua
        </label>
        <input
          type="text"
          id="street"
          name="street"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="number" className="block text-sm font-medium text-brand-brown">
          Número
        </label>
        <input
          type="text"
          id="number"
          name="number"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="neighborhood" className="block text-sm font-medium text-brand-brown">
          Bairro
        </label>
        <input
          type="text"
          id="neighborhood"
          name="neighborhood"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="zipCode" className="block text-sm font-medium text-brand-brown">
          CEP
        </label>
        <input
          type="text"
          id="zipCode"
          name="zipCode"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="city" className="block text-sm font-medium text-brand-brown">
          Cidade
        </label>
        <input
          type="text"
          id="city"
          name="city"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="state" className="block text-sm font-medium text-brand-brown">
          Estado
        </label>
        <input
          type="text"
          id="state"
          name="state"
          required
          className="mt-1 block w-full px-3 py-2.5 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-brand-orange"
        />
      </div>
    </div>
  );
} 