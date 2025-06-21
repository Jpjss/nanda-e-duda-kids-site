/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 's3.amazonaws.com',
        port: '',
        pathname: '/my-bucket/**',
      },
      // Adicione outros domínios de imagem remota aqui se necessário
    ],
    unoptimized: true, // Keep this if you're having issues with image optimization in development
  },
};

export default nextConfig;
