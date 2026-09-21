# Security Policy

## Supported Versions

We actively maintain security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 0.0.x   | Yes, active development |
| < 0.0.1 | No                 |

As this project is currently in active development before a stable 1.0 release, only the latest commit on the `main` branch receives security fixes. We recommend always deploying from the latest `main` or the latest tagged release once versioning is introduced.

## Reporting a Vulnerability

We take the security of this project and the data of the Saint Vincent Pallotti School Masaka community seriously. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **Do not open a public GitHub issue** for security vulnerabilities.
2. Use GitHub's **Private vulnerability reporting** for this repository: `Security` tab > `Report a vulnerability`. This is the preferred method.
3. Alternatively, contact the maintainer directly by email. You can find the contact through the maintainer profile at https://github.com/Icyubahiro-Jay-P . Include `[SECURITY]` in the subject line.
4. If the issue involves student, parent, or staff personal data, mark the report as urgent.

### What to Include

Please include as much of the following as possible:

* Type of vulnerability and estimated impact
* Affected URL, component, or file path, for example `app/admin` or `lib/auth`
* Steps to reproduce, including proof of concept if available
* Any logs, screenshots, or HTTP requests that demonstrate the issue without exposing real user data
* Your suggested mitigation if you have one

### What to Expect

* Acknowledgment within **48 hours** of your report
* An initial assessment and plan within **7 days**
* Regular updates as we work on a fix
* A coordinated disclosure timeline. We ask that you give us reasonable time to fix the issue before any public disclosure, typically **90 days** or until a fix is released, whichever comes first
* Credit in the release notes if you wish to be acknowledged

## Scope

The following are considered in scope:

* Authentication and authorization bypass in the admin area (`app/admin`, `lib/auth`, Better Auth configuration)
* Injection vulnerabilities, for example SQL injection via Drizzle ORM, cross site scripting (XSS) in rendered content, or cross site request forgery (CSRF)
* Insecure handling of environment secrets, database credentials, or API keys for Resend, Cloudinary, DeepL, Neon, or Vercel Blob and S3 storage
* Exposure of personal data from admissions inquiries, newsletter subscriptions, or admin accounts
* Rate limiting bypass on forms and unauthenticated entry points (`app/admissions`, `app/contact`, `app/newsletter`)
* Open redirects, sensitive data in logs, or misconfigured security headers

Out of scope examples that are typically not considered vulnerabilities unless they demonstrate clear impact:

* Social engineering, physical access, or denial of service without a demonstrated application flaw
* Reports from automated scanners without a validated proof of concept
* Issues in third party dependencies without a working exploit against this application. For dependency issues, please ensure `npm audit` output is verified manually

## Secure Development Practices

This repository follows these practices and expects contributors to do the same:

* Secrets are never committed. `.env`, `.env.local`, and `*.pem` files are gitignored. Use environment variables in Vercel or your hosting provider.
* All user input is validated with Zod schemas, see `lib/validations` and route level validation.
* Database access is performed only through Drizzle ORM with parameterized queries. Do not use raw SQL with string interpolation.
* User generated content, such as newsletter excerpts and program descriptions, is escaped or sanitized before rendering to prevent markup injection.
* Authentication uses `better-auth` with secure cookie handling. Protect admin routes with the proxy and middleware in `proxy.ts`.
* File uploads are handled through Cloudinary or Vercel Blob with type and size validation. Do not accept arbitrary file types.
* Automated security review runs on every pull request via `.github/workflows/security.yml`.

## Handling Sensitive Data

* Admissions and contact submissions may contain personal data. Treat this data as confidential.
* Do not log personal data such as emails, phone numbers, or message contents in production logs.
* Do not share personal data in issues, pull requests, or screenshots. Redact or use synthetic examples.

## Disclosure Policy

Once a vulnerability is fixed, we will publish a GitHub Security Advisory describing the issue, the affected versions, and the fix. If the vulnerability was reported privately, we will coordinate the disclosure date with the reporter and provide credit if desired.

Thank you for helping keep the Pallotti Masaka community safe.
