import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - allowedDevOrigins is valid in newer Next.js versions but types might lag
  allowedDevOrigins: ["groundlessly-noncataclysmal-treasa.ngrok-free.dev"],
};

export default nextConfig;
