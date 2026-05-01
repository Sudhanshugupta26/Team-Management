# Team Management Application

A full-stack, robust Team and Project Management application built with Next.js, Bootstrap 5, and Supabase.

**Live Demo (Railway):** [https://team-management-production-a896.up.railway.app/](https://team-management-production-a896.up.railway.app/)

## 🚀 Features

- **Authentication System:** Secure email & password authentication powered by Supabase Auth. Includes automatic redirect handling and an auto-logout safety feature on the login page.
- **Dashboard Overview:** Get a quick birds-eye view of your total projects, tasks, and completion metrics at a glance.
- **Project Management:** Create new projects and automatically become the Project Admin.
- **Task Assignment:** Create tasks within a project and assign them to team members. When a task is assigned to a user, they are automatically added as a member of the project.
- **Role-Based Access Control (RBAC):** Built-in roles (`ADMIN` and `MEMBER`). Admins have full control over the project and its tasks, while Members can view project details and update the status of tasks assigned to them.
- **Row Level Security (RLS):** Data privacy is enforced directly at the database level. Users can only see projects they are members of, and tasks assigned to their specific projects or to them directly.

## 🛠️ Technology Stack

- **Frontend:** [Next.js](https://nextjs.org/) (React 19, App Router)
- **Styling:** [Bootstrap 5](https://getbootstrap.com/)
- **Backend & Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication:** Supabase Auth (`@supabase/supabase-js`)
- **Hosting:** [Railway](https://railway.app/)

## ⚙️ Local Development Setup

1. **Clone the repository and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Environment Variables:**
   Create a `.env.local` file in the root directory and add your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Database Setup:**
   Copy the contents of `supabase_schema.sql` and run it in your Supabase project's SQL Editor. This will automatically create all necessary tables, Enums, Functions, Triggers, and Row Level Security (RLS) policies.

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🗄️ Database Schema & Triggers

The application uses PostgreSQL with the following core tables:
- `profiles`: Stores extended user data (linked securely to `auth.users`).
- `projects`: Stores project metadata.
- `project_members`: Junction table handling Roles (`ADMIN`, `MEMBER`).
- `tasks`: Stores tasks, statuses (`TODO`, `IN_PROGRESS`, `DONE`), and assignee data.

**Key Database Triggers:**
- **Auto-Profile Creation:** Whenever a user signs up, a trigger automatically creates a corresponding row in the `profiles` table.
- **Auto-Project Assignment:** Whenever a task is assigned to a user (or updated to a new user), a trigger automatically adds that user to the `project_members` table so they have full context of the project.

## 🌐 Deployment (Railway)

When deploying this project to Railway (or Vercel), ensure you:
1. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to your deployment environment variables before building. Next.js requires these at build time for static prerendering.
2. In your Supabase Dashboard, go to **Authentication -> URL Configuration** and add your production URL (e.g., `https://team-management-production-a896.up.railway.app/auth/callback`) to the **Redirect URLs** list to ensure email authentication works securely in production.
