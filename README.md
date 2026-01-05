# Portafolio Personal

Este repositorio contiene el código fuente de mi portafolio personal, estructurado como un monorepo utilizando **PNPM Workspaces**.

El proyecto está diseñado para ser moderno, rápido y escalable, separando el frontend, el backend y los tipos compartidos.

## 🚀 Stack Tecnológico

### Frontend (`apps/frontend`)

- **Framework:** [Astro](https://astro.build/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Deployment:** Vercel

### Backend (`apps/backend`)

- **Runtime:** Node.js
- **Framework:** [Express](https://expressjs.com/)
- **Database:** [Turso](https://turso.tech/) (LibSQL)
- **Architecture:** Serverless Function (adaptado para Vercel)
- **Deployment:** Vercel Serverless Functions

### Shared (`packages/shared-types`)

- Librería de tipos TypeScript compartida entre frontend y backend para mantener consistencia en las interfaces de datos.

## 📂 Estructura del Proyecto

```bash
.
├── apps
│   ├── frontend/          # Aplicación web Astro
│   └── backend/           # API Express (Serverless)
├── packages
│   └── shared-types/      # Definiciones de TypeScript compartidas
├── package.json           # Scripts raíz y configuración del workspace
└── pnpm-workspace.yaml    # Configuración de PNPM
```

## 🛠️ Instalación y Configuración

### Prerrequisitos

- Node.js (v18 o superior)
- PNPM (`npm i -g pnpm`)

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Portafolio
```

### 2. Instalar dependencias

Desde la raíz del proyecto:

```bash
pnpm install
```

### 3. Configurar Variables de Entorno

**Backend (`apps/backend/.env`):**
Crea un archivo `.env` basado en `.env.example`:

```env
TURSO_DATABASE_URL="libsql://tu-base-de-datos.turso.io"
TURSO_AUTH_TOKEN="tu-token-de-turso"
PORT=3000
```

**Frontend (`apps/frontend/.env`):**
Crea un archivo `.env` basado en `.env.example`:

```env
PUBLIC_BACKEND_URL="http://localhost:3000" # Para desarrollo local
# En producción usar la URL de Vercel
```

Desarrollado con <333
