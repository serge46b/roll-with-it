import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pfyegblgpzomiahuskil.supabase.co",
      },
    ],
  },
}

export default nextConfig
