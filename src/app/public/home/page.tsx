import React from 'react';

export default function HomePage() {
  return (
    <div className="bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between items-center py-4">
            <div className="flex-shrink-0">
              <img
                src="/imagens/Logo_Final2.png"
                alt="ERP Logo"
                className="h-16 w-auto"
              />
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Recursos</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Preços</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">Contato</a>
              <a href="/public/login" className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-lg font-medium transition-colors">
                Login
              </a>
            </div>
          </nav>
        </div>
      </header>

      {/* Hero Section com gradiente moderno */}
      <section className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-24">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Tenha seu Próprio ERP<br/>com sua Marca
          </h2>
          <p className="text-xl mb-10 max-w-3xl mx-auto text-gray-100">
            Seja um revendedor de sucesso com nossa solução White Label. 
            Ofereça um ERP completo e personalizado com a sua identidade visual.
          </p>
          <a href="/public/inscricao-revenda" 
             className="bg-white text-indigo-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg inline-block">
            Seja um Revendedor
          </a>
        </div>
      </section>

      {/* Seção de Recursos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold mb-10">Vantagens para Revendedores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Sua Própria Marca</h4>
              <p className="text-gray-600">Personalize o ERP com sua identidade visual e conquiste seus clientes.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Alta Rentabilidade</h4>
              <p className="text-gray-600">Margens atrativas e modelo de receita recorrente para seu negócio.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <div className="text-indigo-600 mb-4">
                <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold mb-2">Rápido Setup</h4>
              <p className="text-gray-600">Comece a vender imediatamente com nossa plataforma pronta para uso.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Diferenciais */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold mb-10 text-center">Por que ser nosso Revendedor?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-4">Suporte Técnico Dedicado</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Equipe especializada para ajudar você
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Treinamento completo do produto
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Documentação detalhada
                </li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h4 className="text-xl font-semibold mb-4">Material de Marketing</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Templates personalizáveis
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Material de vendas pronto
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Estratégias de captação de clientes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Planos */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-extrabold mb-10">Planos para Revendedores</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-4">Plano Inicial</h4>
              <p className="text-4xl font-bold mb-6">R$ 299<span className="text-lg font-normal">/mês</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Até 10 clientes
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Personalização básica
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte por email
                </li>
              </ul>
              <a href="/public/inscricao-revenda" className="block w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Começar Agora
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow border-2 border-indigo-600 transform scale-105">
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <span className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-semibold">Mais Popular</span>
              </div>
              <h4 className="text-xl font-semibold mb-4">Plano Business</h4>
              <p className="text-4xl font-bold mb-6">R$ 599<span className="text-lg font-normal">/mês</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Até 50 clientes
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Personalização completa
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte prioritário
                </li>
              </ul>
              <a href="/public/inscricao-revenda" className="block w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Começar Agora
              </a>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              <h4 className="text-xl font-semibold mb-4">Plano Enterprise</h4>
              <p className="text-4xl font-bold mb-6">R$ 999<span className="text-lg font-normal">/mês</span></p>
              <ul className="text-left space-y-3 mb-8">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Clientes ilimitados
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Personalização total
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Suporte 24/7 dedicado
                </li>
              </ul>
              <a href="/public/inscricao-revenda" className="block w-full bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-indigo-700 transition-colors">
                Começar Agora
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Chamada para Ação */}
      <section className="bg-indigo-600 text-white py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold mb-4">Comece sua Jornada como Revendedor</h2>
          <p className="text-xl mb-8">Transforme seu negócio em uma potência de vendas de ERP</p>
          <a href="/public/inscricao-revenda" className="bg-white text-indigo-600 font-semibold py-4 px-8 rounded-lg hover:bg-gray-100 transition-colors text-lg inline-block">
            Seja um Revendedor
          </a>
        </div>
      </section>
      {/* Rodapé */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-lg font-semibold mb-4">Sobre Nós</h5>
              <p className="text-gray-400">Fornecendo soluções ERP de qualidade para empresas de todos os tamanhos.</p>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Links Rápidos</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Recursos</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Preços</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contato</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Termos de Uso</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacidade</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Cookies</a></li>
              </ul>
            </div>
            <div>
              <h5 className="text-lg font-semibold mb-4">Contato</h5>
              <ul className="space-y-2">
                <li className="text-gray-400">contato@erp.com.br</li>
                <li className="text-gray-400">(11) 1234-5678</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2025 ERP White Label. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
