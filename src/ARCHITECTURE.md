# Project architecture (scaffold)

This folder contains the scaffold for the Next.js app architecture requested by the team. It is intentionally minimal — add components, features, and implementation details as needed.

Tree overview (created):

src/
├── app/                     # Next.js App Router
│   ├── (marketing)/         # Public website routes
│   ├── (platform)/          # Future authenticated experiences
│   ├── api/                 # Route handlers
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   └── page.tsx
├── components/              # Reusable UI (ui, layout, navigation, ...)
├── features/                # Feature modules (homepage, artists, ...)
├── content/                 # Static content/configuration
├── config/                  # Application configuration
├── constants/               # Application constants
├── hooks/                   # Custom React hooks
├── lib/                     # External library wrappers
├── providers/               # React providers
├── services/                # Business services
├── store/                   # Global state
├── styles/                  # Global styles and design tokens
├── types/                   # Shared TypeScript types
├── utils/                   # Pure utility functions
├── validations/             # Zod schemas and validation
└── assets/                  # Local SVGs and static assets

Notes:
- This scaffold intentionally contains minimal starter files so it is safe to commit and iterate on.
- Add feature-specific readmes or index files inside each feature when implementing functionality.
