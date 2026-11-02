# SS23's Workshop (`my-class`)

<p align="center">
  <strong>A modern, centralized class management and productivity Progressive Web App (PWA) built for the SS23 cohort.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/React-19-blue?style=flat&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?style=flat&logo=tailwind-css" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Drizzle_ORM-PostgreSQL-C5F74F?style=flat&logo=drizzle" alt="Drizzle ORM" />
  <img src="https://img.shields.io/badge/Auth-Better_Auth-blueviolet?style=flat" alt="Better Auth" />
  <img src="https://img.shields.io/badge/Runtime-Bun-fbf0df?style=flat&logo=bun" alt="Bun" />
  <img src="https://img.shields.io/badge/PWA-Ready-10b981?style=flat" alt="PWA Ready" />
</p>

---

## 📖 Overview

**SS23's Workshop** is a tailored academic dashboard and management portal designed to streamline day-to-day student life for the **SS23** class cohort. It provides student-tailored workflows: tracking course assignments, checking daily class and lab schedules in real-time, accessing important class links, and managing cohort accounts.

Built with **Next.js 16 App Router**, **React 19**, **Drizzle ORM** with **Neon PostgreSQL**, and **Better Auth**, the app is fully responsive, dark-mode ready, and installable as a Progressive Web App (PWA) on mobile and desktop devices.

---

## ✨ Features

### 1. 📊 Interactive Dashboard
- **Daily Schedule (Jadwal Hari Ini)**: Automatically displays scheduled classes for the current day (Asia/Jakarta timezone), distinguishing lecture (`K`) from lab practicum (`R`) with classroom locations.
- **Personal Progress Metrics**: Live counts of pending tasks, completed tasks, and personal completion percentages.
- **Urgent Deadlines**: Highlights the closest upcoming deadlines so students never miss a submission.

### 2. 📝 Assignment Tracker (Tumpukan Tugas)
- **Course & Task Categorization**: Assignments categorized by course with distinct tags for Individual (`individual`) and Group (`group`) tasks.
- **Personal Task Checklist**: Each student can toggle assignments as completed or pending without affecting other classmates.
- **Direct Resource Links**: One-click access to assignment guidelines (`guide`) and submission portals (`submission`).
- **Deadline Indicators**: Real-time relative deadline calculations (e.g., remaining days/hours, overdue alerts).
- **Management for PJs & Admins**: Course Representatives (PJ) and Admins can create, edit, and delete assignments.

### 3. 🔗 Link Hub (Pusat Link)
- **Centralized Class Repository**: Store and organize important links (Google Drives, WhatsApp groups, shared documents, lecture slides) by course.
- **Fast Access**: Clean card views with direct redirect links.
- **Curated by PJs & Admins**: Add, update, and organize links per academic subject.

### 4. 👥 Role-Based Access Control (RBAC) & User Management
- **Role Hierarchy**:
  - `user` (Student / Mahasiswa): View schedules, track personal task progress, browse links.
  - `pj` (Penanggung Jawab / Course Rep): All student features + manage assignments and links for courses.
  - `admin` (Administrator): Full system access, including student account administration.
- **Admin Management Console (`/admin/user`)**:
  - View registered students with their last active session timestamps.
  - Create individual accounts (NIM-based login with role assignment).
  - Bulk import students via CSV upload with automated validation.

### 5. 📱 PWA & Modern UX
- **Installable PWA**: Standalone display mode, custom icons, theme color meta tags, and an in-app installation prompt (`InstallPrompt`).
- **NIM Authentication**: Simple student login using university Student ID Numbers (NIM).
- **Theme Customization**: Built-in Light and Dark mode switching powered by `next-themes`.
- **Accessible & Responsive Design**: Crafted with Tailwind CSS v4 and shadcn/ui primitives (`@base-ui/react`).

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router, Turbopack) |
| **Frontend Library** | [React 19](https://react.dev/) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **Runtime & Package Manager** | [Bun](https://bun.sh/) |
| **Styling & Components** | [Tailwind CSS v4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (`@base-ui/react`), [Lucide React](https://lucide.dev/) |
| **State & Forms** | [TanStack React Form](https://tanstack.com/form) + [Zod](https://zod.dev/) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **ORM & Migrations** | [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| **Authentication** | [Better Auth](https://www.better-auth.com/) (Drizzle adapter, Admin & NextCookies plugins) |
| **Notifications** | [Sonner](https://sonner.emilkowal.ski/) |

---

## 📁 Project Structure

```text
my-class/
├── public/                 # Static assets (PWA manifest icons, logos, SVGs)
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── (app)/          # Authenticated app shell
│   │   │   ├── (dashboard)/# Dashboard with schedules & task overview
│   │   │   ├── admin/      # Admin console (user management, CSV import)
│   │   │   ├── pusatlink/  # Link hub page & components
│   │   │   ├── tugas/      # Assignment tracker & management
│   │   │   ├── layout.tsx  # Sidebar and main navigation wrapper
│   │   │   └── actions.ts  # Session logout server action
│   │   ├── login/          # NIM login page & authentication action
│   │   ├── globals.css     # Tailwind CSS styles and theme variables
│   │   ├── layout.tsx      # Root HTML layout with providers (Theme, Toast)
│   │   └── manifest.ts     # Web App Manifest generator
│   ├── components/         # Reusable UI components
│   │   ├── sidebar/        # Main navigation sidebar and user profile badge
│   │   ├── ui/             # shadcn/ui component primitives (button, dialog, card, etc.)
│   │   ├── install-prompt  # PWA installation banner/dialog
│   │   └── theme-provider  # Next-themes client provider
│   ├── db/                 # Database schema and relations
│   │   ├── schema.ts       # Drizzle schema (user, session, course, assignment, link, schedule)
│   │   └── relations.ts    # Drizzle relational definitions
│   ├── hooks/              # Custom React hooks (e.g. useMobile)
│   ├── lib/                # Shared utilities & configurations
│   │   ├── auth.ts         # Better Auth client configuration
│   │   ├── db.ts           # Drizzle database client instance
│   │   └── utils.ts        # Formatting helpers (dates, class names)
│   └── proxy.ts            # Route protection & role-based middleware
├── drizzle.config.ts       # Drizzle Kit configuration
├── package.json            # Project dependencies & scripts
└── tsconfig.json           # TypeScript configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Bun](https://bun.sh/) (version `^1.3` recommended)
- A [Neon](https://neon.tech/) PostgreSQL database (or any PostgreSQL instance)

### 1. Clone Repository

```bash
git clone https://github.com/your-username/my-class.git
cd my-class
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Create a `.env` file in the root directory:

```env
# Neon / PostgreSQL connection string
DATABASE_URL=postgresql://user:password@ep-sample-pooler.region.neon.tech/neondb?sslmode=require

# Better Auth Secret (generate a random 32+ character string)
BETTER_AUTH_SECRET=your-random-generated-secret-key

# Base URL of the application
BETTER_AUTH_URL=http://localhost:3000
```

> [!TIP]
> You can generate a secure secret for `BETTER_AUTH_SECRET` using:
> ```bash
> openssl rand -base64 32
> ```

### 4. Push Database Schema

Push the Drizzle ORM schema to your PostgreSQL database:

```bash
bunx drizzle-kit push
```

### 5. Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `bun dev` | Starts the Next.js development server with Turbopack |
| `bun run build` | Pushes schema migrations (`drizzle-kit push`) and builds the production bundle |
| `bun start` | Starts the production server |
| `bun run lint` | Runs ESLint checks across the codebase |

---

## 🗄️ Database Architecture

The database schema is defined in [`src/db/schema.ts`](src/db/schema.ts) using Drizzle ORM:

- **Authentication (`Better Auth`)**:
  - `user`: Account profile, NIM-based email, role (`user`, `pj`, `admin`), ban status.
  - `session`: Active authentication sessions and login metadata.
  - `account`: Auth provider credentials.
  - `verification`: Auth tokens and verification requests.
- **Academic Core**:
  - `course`: Course / subject names (e.g. Mata Kuliah).
  - `schedule`: Class schedule items (`dayOfWeek`, `timeStart`, `timeEnd`, `courseId`, `practicum`, `room`).
  - `assignment`: Course assignments with deadlines, assignment type (`individual` / `group`), guide/submission URLs, and an array of student IDs who completed the task (`userDone`).
  - `link`: Curated bookmarks and resource links categorized by course.

---

## 🔒 Roles & Permissions

| Capability | Student (`user`) | Course Rep (`pj`) | Admin (`admin`) |
|---|:---:|:---:|:---:|
| View Dashboard & Schedule | ✅ | ✅ | ✅ |
| Track Personal Task Completion | ✅ | ✅ | ✅ |
| Access Pusat Link | ✅ | ✅ | ✅ |
| Create & Edit Assignments | ❌ | ✅ | ✅ |
| Delete Assignments | ❌ | ✅ | ✅ |
| Create, Edit & Delete Links | ❌ | ✅ | ✅ |
| Access Admin Panel (`/admin/user`) | ❌ | ❌ | ✅ |
| Create Single Users | ❌ | ❌ | ✅ |
| Bulk Import Users (CSV) | ❌ | ❌ | ✅ |
| Assign User Roles | ❌ | ❌ | ✅ |

---

## 📄 License

This project is maintained privately for the **SS23** class cohort.
