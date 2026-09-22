import type { NextConfig } from "next"

// ponytail: connect-src allows any https: origin because uploads go
// straight from the browser to a presigned URL on AWS_ENDPOINT_URL_S3,
// which is env-configured and not knowable at build time. Narrow this to
// the exact storage + Cloudinary hosts if that endpoint is ever pinned to
// a fixed provider.
const CSP = [
  "default-src 'self'",
  // 'unsafe-inline' is needed because next-themes injects a small inline
  // script (sets the dark/light class before paint, to avoid a flash of
  // the wrong theme) whose content varies with ThemeProvider's own props,
  // so a fixed hash would break on any theme config change. A per-request
  // nonce via proxy.ts would be the stricter fix, but that middleware
  // currently only runs on /admin/** (see its own comment) and widening
  // it to every route is a separate, larger change than this CSP fix.
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' https: data:",
  "font-src 'self'",
  "connect-src 'self' https:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ")

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    qualities: [75, 90],
  },
  // Console calls (other than console.error) only get stripped from
  // production builds, dev keeps them - built into this Next option, no
  // NODE_ENV check needed here.
  compiler: {
    removeConsole: { exclude: ["error"] },
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "@base-ui/react", "drizzle-orm"],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          { key: "Content-Security-Policy", value: CSP },
        ],
      },
      {
        source: "/ffmpeg/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ]
  },
}

export default nextConfig
