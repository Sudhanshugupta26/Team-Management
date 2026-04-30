"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function DashboardPage() {
  const [stats, setStats] = useState({ totalTasks: 0, todo: 0, inProgress: 0, done: 0, totalProjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const token = session.access_token;
      
      const [tasksRes, projectsRes] = await Promise.all([
        fetch("/api/tasks", { headers: { Authorization: `Bearer ${token}` } }),
        fetch("/api/projects", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      if (tasksRes.ok && projectsRes.ok) {
        const tasks = await tasksRes.json();
        const projects = await projectsRes.json();

        setStats({
          totalTasks: tasks.length,
          todo: tasks.filter((t: any) => t.status === 'TODO').length,
          inProgress: tasks.filter((t: any) => t.status === 'IN_PROGRESS').length,
          done: tasks.filter((t: any) => t.status === 'DONE').length,
          totalProjects: projects.length
        });
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) return <div className="container mt-5">Loading dashboard...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Dashboard Overview</h2>
      
      <div className="row g-4">
        <div className="col-md-3">
          <div className="card text-white bg-primary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Projects</h5>
              <p className="display-4">{stats.totalProjects}</p>
              <Link href="/projects" className="text-white">View Projects →</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-secondary h-100">
            <div className="card-body">
              <h5 className="card-title">Total Tasks</h5>
              <p className="display-4">{stats.totalTasks}</p>
              <Link href="/tasks" className="text-white">View Tasks →</Link>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-warning h-100">
            <div className="card-body">
              <h5 className="card-title">In Progress</h5>
              <p className="display-4">{stats.inProgress}</p>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card text-white bg-success h-100">
            <div className="card-body">
              <h5 className="card-title">Completed</h5>
              <p className="display-4">{stats.done}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
