// Fallback for the rare case where app/[locale]/layout.tsx itself calls
// notFound() (an invalid locale segment) before it can render <html>/<body>.
// In normal use, proxy.ts redirects any unrecognised locale to the default
// one, so this should rarely render. Next.js still requires a root-level
// not-found.tsx to supply its own html/body since there is no layout above
// app/[locale]/layout.tsx to provide one.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body
        style={{
          display: "flex",
          minHeight: "100svh",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          fontFamily: "system-ui, sans-serif",
          textAlign: "center",
          padding: "1.5rem",
        }}
      >
        <p style={{ fontSize: "3rem", fontWeight: 600, margin: 0 }}>404</p>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 600, margin: 0 }}>
          Page not found
        </h1>
        <a href="/en" style={{ textDecoration: "underline" }}>
          Back to Homepage
        </a>
      </body>
    </html>
  )
}
