import type { NextConfig } from "next";

const YEAR = 31536000;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // A stray package-lock.json in the home directory makes Turbopack infer the
  // wrong workspace root. Pin it to this project.
  turbopack: { root: import.meta.dirname },
  images: {
    // Every file is local in public/. No remotePatterns, nothing to allowlist.
    // AVIF first: worth the encode cost for a small fixed set with a long cache.
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: YEAR,
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
      {
        /*
         * Raw files under public/ were served with max-age=0, so anything
         * linking them directly refetched every time. The JSON-LD image is the
         * live case: crawlers were pulling a 390 KB photograph on every visit.
         * These are content-addressed by hand, so a year is safe.
         */
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: `public, max-age=${YEAR}, immutable` }],
      },
    ];
  },
};

export default nextConfig;
