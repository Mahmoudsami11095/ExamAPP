# Project Folder Structure

This document outlines the complete folder structure of the ExamAPP Angular project.

## Root Directory

```
ExamAPP/
├── angular.json              # Angular CLI configuration
├── package.json              # Node.js dependencies and scripts
├── package-lock.json         # Locked dependency versions
├── tsconfig.json             # TypeScript compiler configuration
├── tsconfig.app.json         # TypeScript config for application
├── tsconfig.spec.json        # TypeScript config for tests
├── .postcssrc.json           # PostCSS configuration
├── README.md                 # Project documentation
├── FOLDER_STRUCTURE.md       # This file - project structure documentation
├── node_modules/             # Installed npm packages
├── public/                   # Public assets
│   └── favicon.ico           # Site favicon
├── dist/                     # Build output directory
│   ├── auth/                 # Built auth library
│   └── ExamAPP/              # Built application
├── out-tsc/                  # TypeScript compilation output
│   └── lib/                  # Library TypeScript output
├── projects/                 # Angular library projects
│   └── auth/                 # Auth library project
└── src/                      # Source code directory
```

## Source Directory (`src/`)

```
src/
├── index.html                # Main HTML entry point (includes Font Awesome CDN)
├── main.ts                   # Application bootstrap file
├── styles.css                # Global styles
└── app/                      # Application root module
```

## Application Directory (`src/app/`)

```
app/
├── app.ts                    # Root component TypeScript file
├── app.html                  # Root component template
├── app.css                   # Root component styles
├── app.config.ts             # Application configuration (providers, etc.)
├── app.routes.ts             # Application routing configuration
├── app.spec.ts               # Root component test file
├── core/                     # Core module (singleton services, guards, interceptors)
│   ├── guards/               # Route guards (authentication, authorization)
│   │   └── .gitkeep
│   ├── interceptors/         # HTTP interceptors
│   │   └── .gitkeep
│   ├── layouts/              # Layout components
│   │   └── .gitkeep
│   ├── pages/                # Core pages (login, error pages, etc.)
│   │   └── login/            # Login page component
│   │       ├── login.ts      # Login component logic
│   │       ├── login.html    # Login component template
│   │       ├── login.css     # Login component styles
│   │       └── login.spec.ts # Login component tests
│   └── services/             # Core services (singleton services)
│       └── .gitkeep
├── features/                 # Feature modules (domain-specific functionality)
│   ├── components/           # Feature-specific components
│   │   └── .gitkeep
│   ├── interfaces/           # TypeScript interfaces/models
│   │   └── .gitkeep
│   ├── pages/                # Feature pages
│   │   └── .gitkeep
│   └── services/             # Feature-specific services
│       └── .gitkeep
└── shared/                   # Shared module (reusable components, directives, pipes)
    ├── components/           # Shared components
    │   ├── business/         # Business logic components
    │   │   └── .gitkeep
    │   └── UI/               # UI components (buttons, cards, etc.)
    │       └── auth-promo/   # Auth promotional component
    │           ├── auth-promo.ts      # Component logic
    │           ├── auth-promo.html    # Component template
    │           ├── auth-promo.css     # Component styles
    │           └── auth-promo.spec.ts # Component tests
    ├── directives/           # Custom directives
    │   └── .gitkeep
    ├── pipes/                # Custom pipes
    │   └── .gitkeep
    └── services/             # Shared services
        └── .gitkeep
```

## Library Project (`projects/auth/`)

```
projects/auth/
├── ng-package.json          # ng-packagr configuration
├── package.json             # Library package configuration
├── README.md                # Library documentation
├── tsconfig.lib.json        # TypeScript config for library
├── tsconfig.lib.prod.json   # TypeScript config for production build
├── tsconfig.spec.json       # TypeScript config for tests
└── src/
    ├── public-api.ts        # Public API exports
    └── lib/                 # Library source code
        ├── adaptor/         # Data adaptors
        │   └── auth-api.adaptor.ts
        ├── base/            # Base classes/interfaces
        │   └── AuthAPI.ts
        ├── enums/           # Enumerations
        │   └── AuthEndPoint.ts
        ├── interfaces/      # TypeScript interfaces
        │   └── adaptor.ts
        ├── auth.service.ts  # Main auth service
        └── auth.service.spec.ts  # Service tests
```

## Build Output (`dist/`)

```
dist/
├── auth/                    # Built auth library
│   ├── fesm2022/           # ES module format
│   │   ├── auth.mjs        # Compiled JavaScript
│   │   └── auth.mjs.map    # Source map
│   ├── index.d.ts          # TypeScript declarations
│   ├── package.json        # Package manifest
│   └── README.md           # Library README
└── ExamAPP/                # Built application
    └── browser/            # Browser build output
        ├── index.html
        ├── main.js
        ├── styles.css
        └── ...
```

## Directory Descriptions

### Core Module (`core/`)
Contains application-wide singleton services, guards, interceptors, and core pages that are used across the entire application.

- **guards/**: Route guards for authentication and authorization
- **interceptors/**: HTTP interceptors for request/response handling
- **layouts/**: Main layout components (header, footer, sidebar, etc.)
- **pages/**: Core pages like login, error pages, not found pages
  - **login/**: Login page component with form handling and authentication
- **services/**: Singleton services (authentication, API, configuration)

### Features Module (`features/`)
Contains feature-specific modules organized by domain/functionality. Each feature is self-contained with its own components, services, and pages.

- **components/**: Feature-specific components
- **interfaces/**: TypeScript interfaces and models for the feature
- **pages/**: Feature pages/routes
- **services/**: Feature-specific services

### Shared Module (`shared/`)
Contains reusable components, directives, pipes, and services that can be used across multiple features.

- **components/**: 
  - **business/**: Components with business logic
  - **UI/**: Pure UI components (buttons, cards, modals, etc.)
    - **auth-promo/**: Promotional component for authentication pages
- **directives/**: Custom Angular directives
- **pipes/**: Custom Angular pipes for data transformation
- **services/**: Shared utility services

### Auth Library (`projects/auth/`)
A reusable Angular library for authentication functionality.

- **adaptor/**: Data transformation adaptors (converts API responses)
- **base/**: Base classes and abstract interfaces
- **enums/**: Enumeration constants (API endpoints)
- **interfaces/**: TypeScript type definitions
- **auth.service.ts**: Main authentication service with login functionality

## Key Files

### Application Files
- `src/index.html`: Main HTML entry point (includes Font Awesome CDN)
- `src/main.ts`: Application bootstrap
- `src/app/app.config.ts`: Application configuration (providers: HttpClient, Router, etc.)
- `src/app/app.routes.ts`: Route definitions

### Library Files
- `projects/auth/src/public-api.ts`: Public API exports for the library
- `projects/auth/ng-package.json`: Library build configuration

## Architecture Notes

This project follows a **feature-based architecture** with clear separation of concerns:

1. **Core**: Application-wide functionality (singletons, guards, interceptors)
2. **Features**: Domain-specific modules (self-contained features)
3. **Shared**: Reusable components and utilities
4. **Libraries**: Reusable Angular libraries (auth library)

This structure promotes:
- **Modularity**: Features are self-contained
- **Reusability**: Shared components and libraries can be used across features
- **Maintainability**: Clear separation makes code easier to maintain
- **Scalability**: Easy to add new features without affecting existing code
- **Type Safety**: TypeScript interfaces and types throughout

## Technology Stack

- **Framework**: Angular 20
- **Styling**: Tailwind CSS 4
- **Icons**: Font Awesome 6.5.1 (via CDN)
- **Build Tool**: Angular CLI with ng-packagr for libraries
- **Language**: TypeScript 5.9
