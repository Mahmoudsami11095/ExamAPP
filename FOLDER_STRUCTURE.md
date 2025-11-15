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
├── node_modules/             # Installed npm packages
├── public/                   # Public assets
│   └── favicon.ico           # Site favicon
└── src/                      # Source code directory
```

## Source Directory (`src/`)

```
src/
├── index.html                # Main HTML entry point
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
├── app.config.ts             # Application configuration
├── app.routes.ts             # Application routing configuration
├── app.spec.ts               # Root component test file
├── core/                     # Core module (singleton services, guards, interceptors)
│   ├── guards/               # Route guards (authentication, authorization)
│   ├── interceptors/         # HTTP interceptors
│   ├── layouts/              # Layout components
│   ├── pages/                # Core pages (login, error pages, etc.)
│   └── services/             # Core services (singleton services)
├── features/                 # Feature modules (domain-specific functionality)
│   ├── components/           # Feature-specific components
│   ├── interfaces/           # TypeScript interfaces/models
│   ├── pages/                # Feature pages
│   └── services/             # Feature-specific services
└── shared/                   # Shared module (reusable components, directives, pipes)
    ├── components/           # Shared components
    │   ├── business/         # Business logic components
    │   └── UI/               # UI components (buttons, cards, etc.)
    ├── directives/           # Custom directives
    ├── pipes/                # Custom pipes
    └── services/             # Shared services
```

## Directory Descriptions

### Core Module (`core/`)
Contains application-wide singleton services, guards, interceptors, and core pages that are used across the entire application.

- **guards/**: Route guards for authentication and authorization
- **interceptors/**: HTTP interceptors for request/response handling
- **layouts/**: Main layout components (header, footer, sidebar, etc.)
- **pages/**: Core pages like login, error pages, not found pages
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
- **directives/**: Custom Angular directives
- **pipes/**: Custom Angular pipes for data transformation
- **services/**: Shared utility services

## Architecture Notes

This project follows a **feature-based architecture** with clear separation of concerns:

1. **Core**: Application-wide functionality (singletons, guards, interceptors)
2. **Features**: Domain-specific modules (self-contained features)
3. **Shared**: Reusable components and utilities

This structure promotes:
- **Modularity**: Features are self-contained
- **Reusability**: Shared components can be used across features
- **Maintainability**: Clear separation makes code easier to maintain
- **Scalability**: Easy to add new features without affecting existing code

