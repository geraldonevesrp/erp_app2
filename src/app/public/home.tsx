import React from 'react';

const Home = () => {
  return (
    <div className="bg-gray-50">
      {/* Cabeçalho */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ERP White Label</h1>
              </div>
            </div>
            <div className="hidden md:flex md:space-x-8">
              <a href="#" className="text-gray-500 hover:text-gray-900">Home</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Recursos</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Preços</a>
              <a href="#" className="text-gray-500 hover:text-gray-900">Contato</a>
            </div>
          </nav>
        </div>
      </header>

      {/* Seção de Apresentação */}
      <main>
        <section className="bg-indigo-600 text-white py-20">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-4xl font-extrabold mb-4">Transforme seu Negócio com Nosso ERP</h2>
            <p className="text-lg mb-8">Soluções personalizadas para gerenciar sua empresa de forma eficiente.</p>
            <a href="#" className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded">Experimente Grátis</a>
          </div>
        </section>

        {/* Seção de Recursos */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-extrabold mb-10">Recursos Principais</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Gestão de Projetos</h4>
                <p>Organize e acompanhe o progresso de seus projetos com facilidade.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Relatórios Avançados</h4>
                <p>Gere relatórios detalhados para tomar decisões informadas.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Suporte 24/7</h4>
                <p>Estamos aqui para ajudar sempre que você precisar.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Depoimentos */}
        <section className="bg-gray-100 py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-extrabold mb-10">O que nossos clientes dizem</h3>
            <div className="flex flex-col space-y-6">
              <blockquote className="bg-white p-6 rounded-lg shadow">
                <p className="text-lg italic">"O ERP transformou a maneira como gerenciamos nosso negócio!"</p>
                <footer className="mt-4 font-semibold">- Cliente A</footer>
              </blockquote>
              <blockquote className="bg-white p-6 rounded-lg shadow">
                <p className="text-lg italic">"Excelente suporte e funcionalidades incríveis!"</p>
                <footer className="mt-4 font-semibold">- Cliente B</footer>
              </blockquote>
            </div>
          </div>
        </section>

        {/* Seção de Preços */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto text-center">
            <h3 className="text-3xl font-extrabold mb-10">Planos de Preços</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Plano Básico</h4>
                <p className="text-lg font-bold">R$ 49/mês</p>
                <p>Acesso a recursos básicos.</p>
                <a href="#" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded">Escolher</a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Plano Profissional</h4>
                <p className="text-lg font-bold">R$ 99/mês</p>
                <p>Acesso a todos os recursos.</p>
                <a href="#" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded">Escolher</a>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h4 className="text-xl font-semibold mb-2">Plano Premium</h4>
                <p className="text-lg font-bold">R$ 199/mês</p>
                <p>Suporte prioritário e recursos avançados.</p>
                <a href="#" className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded">Escolher</a>
              </div>
            </div>
          </div>
        </section>

        {/* Seção de Chamada para Ação */}
        <section className="bg-indigo-600 text-white py-20 text-center">
          <h2 className="text-3xl font-extrabold mb-4">Pronto para começar?</h2>
          <p className="mb-8">Experimente nosso ERP gratuitamente e veja a diferença!</p>
          <a href="#" className="bg-white text-indigo-600 font-semibold py-2 px-4 rounded">Comece Agora</a>
        </section>
      </main>

      {/* Rodapé */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="max-w-7xl mx-auto text-center">
          <p>&copy; 2025 ERP White Label. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
