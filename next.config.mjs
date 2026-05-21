/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  sassOptions: {
    additionalData: '@use "@/styles/vars" as *;',
  },
};

export default nextConfig;
