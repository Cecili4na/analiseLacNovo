import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

export default function Teoria() {
  const navigate = useNavigate();
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="bg-[#F0F0E5] min-h-screen flex flex-col">
      <header className="bg-[#8BA989] text-white py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Teoria da Análise Sensorial</h1>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="bg-[#6a7a6a] hover:opacity-90 text-white px-4 py-2 rounded-lg"
            >
              {showOriginal ? 'Ver em Português' : 'Ver Original'}
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-white rounded-lg hover:bg-[#6E8F6E] transition"
            >
              <FaArrowLeft />
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow p-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Introdução */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">
              {showOriginal ? 'Introduction to Sensory Analysis' : 'Introdução à Análise Sensorial'}
            </h2>
            {showOriginal ? (
              <>
                <p className="text-gray-700 mb-4">
                  Sensory analysis is a scientific methodology used to evoke, measure, analyze and interpret 
                  reactions to the characteristics of foods and materials as they are perceived by the senses 
                  of sight, smell, taste, touch and hearing.
                </p>
                <p className="text-gray-700">
                  In the context of goat dairy products, sensory analysis is fundamental for evaluating product 
                  quality, developing new products, and understanding consumer acceptance.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-700 mb-4">
                  A análise sensorial é uma metodologia científica utilizada para evocar, medir, analisar e interpretar 
                  reações às características dos alimentos e materiais como são percebidas pelos sentidos da visão, 
                  olfato, gosto, tato e audição.
                </p>
                <p className="text-gray-700">
                  No contexto dos laticínios caprinos, a análise sensorial é fundamental para avaliar a qualidade dos 
                  produtos, desenvolver novos produtos, e entender a aceitação do consumidor.
                </p>
              </>
            )}
          </section>

          {/* Métodos de Análise */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">
              {showOriginal ? 'Sensory Analysis Methods' : 'Métodos de Análise Sensorial'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? '1. Hedonic Scale Test' : '1. Teste de Escala Hedônica'}
                </h3>
                {showOriginal ? (
                  <>
                    <p className="text-gray-700 mb-4">
                      Affective tests are responsible for the subjective expressions of tasters when they reveal whether 
                      the judged food is pleasing, accepted, or preferred in relation to another. Their objective is to 
                      indicate the level of consumer acceptance of one or more products.
                    </p>
                    <p className="text-gray-700">
                      The Hedonic Scale, one of them, is the most used test by new food developers regarding their 
                      acceptability. During its application, tasters indicate the intensity of how much they liked/disliked 
                      each received sample. The evaluation form has a scale with maximum and minimum impression of a certain 
                      attribute, with n positions, as determined by the test development team.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="text-gray-700 mb-4">
                      Os testes afetivos são responsáveis pelas expressões subjetivas dos provadores, quando revelam se o 
                      alimento julgado agrada, se é aceito, ou se é preferido com relação a outro. Têm como objetivo apontar 
                      o nível de aceitação pelos consumidores de um ou de mais produtos.
                    </p>
                    <p className="text-gray-700">
                      A Escala Hedônica, um deles, é o teste mais usado pelos desenvolvedores de novos alimentos, com relação 
                      a sua aceitabilidade. Durante sua aplicação, os provadores indicam a intensidade do quanto 
                      gostaram/desgostaram de cada amostra recebida. Na ficha de avaliação há uma escala com o máximo e mínimo 
                      de impressão de determinado atributo, com n posições, de acordo com determinado pela equipe elaboradora 
                      do teste.
                    </p>
                  </>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? '2. Paired Comparison Test' : '2. Teste de Comparação Pareada'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Compares two samples with each other, evaluating preference or specific difference in some 
                    sensory attribute. It is a simple and easy-to-apply method.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Compara duas amostras entre si, avaliando a preferência ou diferença específica em algum atributo 
                    sensorial. É um método simples e de fácil aplicação.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? '3. Ranking Test' : '3. Teste de Ordenação'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Samples are ordered in ascending or descending order of some specific attribute. 
                    Useful for product development and quality control.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    As amostras são ordenadas em ordem crescente ou decrescente de algum atributo específico. 
                    Útil para desenvolvimento de produtos e controle de qualidade.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? '4. Acceptance Test' : '4. Teste de Aceitação'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Evaluates how much a consumer likes or dislikes a product. May include evaluation of 
                    specific attributes or overall impression.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Avalia o quanto um consumidor gosta ou desgosta de um produto. Pode incluir avaliação de 
                    atributos específicos ou impressão global.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Atributos Sensoriais */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">
              {showOriginal ? 'Sensory Attributes' : 'Atributos Sensoriais'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'Appearance' : 'Aparência'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Includes color, brightness, shape and size. It is the consumer's first contact with the 
                    product and significantly influences acceptance.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Inclui cor, brilho, forma e tamanho. É o primeiro contato do consumidor com o produto e 
                    influencia significativamente a aceitação.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'Aroma' : 'Aroma'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Set of smell sensations. In cheeses, it can indicate maturation, deterioration or 
                    specific characteristics of the product.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Conjunto de sensações do olfato. Em queijos, pode indicar maturação, deterioração ou 
                    características específicas do produto.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'Texture' : 'Textura'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Mechanical, geometric and surface properties, perceptible by mechanical, tactile and 
                    visual receptors.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Propriedades mecânicas, geométricas e de superfície, perceptíveis por receptores mecânicos, 
                    táteis e visuais.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'Flavor' : 'Sabor'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Complex combination of gustatory and olfactory sensations. Fundamental in product 
                    characterization and acceptance.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Combinação complexa de sensações gustativas e olfativas. Fundamental na caracterização e 
                    aceitação do produto.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Análise Estatística */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">
              {showOriginal ? 'Statistical Analysis' : 'Análise Estatística'}
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'ANOVA (Analysis of Variance)' : 'ANOVA (Análise de Variância)'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Used to compare means of different groups and determine if there are significant differences 
                    between them. Fundamental in tests with multiple samples.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Utilizada para comparar médias de diferentes grupos e determinar se existem diferenças 
                    significativas entre eles. Fundamental em testes com múltiplas amostras.
                  </p>
                )}
              </div>

              <div>
                <h3 className="text-lg font-medium text-[#8BA989] mb-2">
                  {showOriginal ? 'Mean Tests' : 'Teste de Médias'}
                </h3>
                {showOriginal ? (
                  <p className="text-gray-700">
                    Compares sample means to determine if there is a significant difference between them. 
                    Includes tests such as Tukey, Duncan and Fisher.
                  </p>
                ) : (
                  <p className="text-gray-700">
                    Compara as médias das amostras para determinar se há diferença significativa entre elas. 
                    Inclui testes como Tukey, Duncan e Fisher.
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Boas Práticas */}
          <section className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-xl font-bold text-[#8BA989] mb-4">
              {showOriginal ? 'Best Practices in Sensory Analysis' : 'Boas Práticas em Análise Sensorial'}
            </h2>
            
            <div className="space-y-4">
              {showOriginal ? (
                <>
                  <p className="text-gray-700">
                    1. Sample standardization (temperature, quantity, presentation)
                  </p>
                  <p className="text-gray-700">
                    2. Controlled environment (lighting, temperature, absence of odors)
                  </p>
                  <p className="text-gray-700">
                    3. Proper training of judges
                  </p>
                  <p className="text-gray-700">
                    4. Complete and accurate documentation
                  </p>
                  <p className="text-gray-700">
                    5. Appropriate statistical analysis of results
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-700">
                    1. Padronização das amostras (temperatura, quantidade, apresentação)
                  </p>
                  <p className="text-gray-700">
                    2. Ambiente controlado (iluminação, temperatura, ausência de odores)
                  </p>
                  <p className="text-gray-700">
                    3. Treinamento adequado dos julgadores
                  </p>
                  <p className="text-gray-700">
                    4. Documentação completa e precisa
                  </p>
                  <p className="text-gray-700">
                    5. Análise estatística apropriada dos resultados
                  </p>
                </>
              )}
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-[#8BA989] text-white py-4 text-center text-sm">
        <div className="container mx-auto">
          <p>© 2024 Plataforma de Análise Sensorial de Laticínios Caprinos</p>
        </div>
      </footer>
    </div>
  );
} 