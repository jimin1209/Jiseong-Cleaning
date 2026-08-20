# Repository Guidelines

## Project Structure & Module Organization

The Git repository is currently under `Jiseong-Cleaning/`; run Git commands from that directory. The tracked project is documentation-first: `Jiseong-Cleaning/Document/명세서.md` defines product requirements, and `Jiseong-Cleaning/Document/개발 설계서.md` records the proposed architecture, APIs, and data model. `App/` and `Web/` are placeholders for the Android client and administrator interface. Keep implementation code within the nested repository, and avoid adding new copies to the outer `Document/` or `Documents/` folders.

The planned stack is Kotlin/Jetpack Compose for Android, React or Next.js with TypeScript for the admin UI, and Spring Boot with Kotlin or Java for the API. Organize each application as an independently buildable module and keep tests beside the owning module's conventional test tree.

## Build, Test, and Development Commands

No build system or executable source is committed yet. Do not document or depend on commands until their wrapper/configuration files are added. When bootstrapping modules, commit the standard wrappers and expose predictable commands, for example:

- `./gradlew test` — run JVM/Android unit tests.
- `npm test` — run web tests through the checked-in package scripts.
- `npm run lint` — check TypeScript and React style.

Run the equivalent `gradlew.bat` commands on Windows.

## Coding Style & Naming Conventions

Use four spaces for Kotlin/Java and two spaces for TypeScript, JSON, and YAML. Follow Kotlin/Java `PascalCase` types and `camelCase` members; use `PascalCase` React components, `camelCase` functions, and `kebab-case` route or asset names. Prefer feature-oriented packages such as `orders`, `payments`, and `assignments`. Format and lint with module-local tooling once configured; do not hand-format generated files.

## Testing Guidelines

Add tests with every behavior change. Name JVM tests `*Test` and web tests `*.test.ts` or `*.test.tsx`. Prioritize order-state transitions, authorization, idempotent payment handling, pricing, and refund paths. Integration tests should cover API/database boundaries without using production credentials.

## Commit & Pull Request Guidelines

Existing history uses short Korean, task-focused subjects. Continue with concise imperative summaries, optionally scoped (for example, `주문: 상태 전이 검증 추가`). Keep commits focused. Pull requests should explain the change, affected module, verification performed, and linked issue; include screenshots for UI changes and call out API, schema, configuration, or security impacts.

## Security & Configuration

Never commit secrets, customer data, payment details, or service credentials. Provide sanitized `.env.example` files and keep environment-specific values outside source control.
