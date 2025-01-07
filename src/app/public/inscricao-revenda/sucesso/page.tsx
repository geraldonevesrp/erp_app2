'use client'

import Link from 'next/link'

export default function InscricaoRevendaSucesso() {
  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="relative px-4 py-10 bg-white mx-8 md:mx-0 shadow rounded-3xl sm:p-10">
          <div className="max-w-md mx-auto">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div className="text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                  <h2 className="mt-4 text-2xl font-bold text-gray-900">
                    Cadastro Realizado com Sucesso!
                  </h2>
                  <p className="mt-2 text-gray-600">
                    Seu cadastro foi recebido e está em análise. Em breve, você receberá um email com as instruções para acessar sua conta.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/auth/login"
                      className="text-indigo-600 hover:text-indigo-500"
                    >
                      Voltar para o Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
