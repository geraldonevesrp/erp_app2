/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ASAAS_SANDBOX_API_KEY: process.env.ASAAS_SANDBOX_API_KEY,
    ASAAS_SANDBOX_WALLET_ID: process.env.ASAAS_SANDBOX_WALLET_ID
  },
  images: {
    domains: ['fwmxtjrxilkrirvrxlxb.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fwmxtjrxilkrirvrxlxb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
    unoptimized: true
  },
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          }
        ]
      }
    ]
  },
  async rewrites() {
    return {
      beforeFiles: [
        // Subdomínios personalizados
        {
          source: '/:path*',
          has: [
            {
              type: 'host',
              value: '(?<subdomain>[^.]+).erp1.app.br',
            },
          ],
          destination: '/:path*',
        }
      ]
    }
  }
}

module.exports = nextConfig
