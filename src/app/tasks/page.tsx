"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  
  const [projectId, setProjectId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/tasks", {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (res.ok) setTasks(await res.json());
  };

  const fetchInitialData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const headers = { Authorization: `Bearer ${session.access_token}` };
    const [tasksRes, projectsRes, usersRes] = await Promise.all([
      fetch("/api/tasks", { headers }),
      fetch("/api/projects", { headers }),
      fetch("/api/users", { headers })
    ]);

    if (tasksRes.ok) setTasks(await tasksRes.json());
    if (projectsRes.ok) setProjects(await projectsRes.json());
    if (usersRes.ok) setUsers(await usersRes.json());
    
    setLoading(false);
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ 
        project_id: projectId, 
        title, 
        description, 
        assigned_to: assignedTo || null,
        due_date: dueDate || null
      })
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setDueDate("");
      fetchTasks();
    }
  };

  const updateStatus = async (id: string, status: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/tasks", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ id, status })
    });

    if (res.ok) fetchTasks();
  };

  if (loading) return <div className="container mt-5">Loading tasks...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Tasks Management</h2>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Create New Task</h5>
              <form onSubmit={handleCreateTask}>
                <div className="mb-3">
                  <label className="form-label">Project</label>
                  <select className="form-select" value={projectId} onChange={(e) => setProjectId(e.target.value)} required>
                    <option value="">Select a project...</option>
                    {projects.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Task Title</label>
                  <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea className="form-control" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <select className="form-select" value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
                    <option value="">Unassigned</option>
                    {users.map((u: any) => <option key={u.id} value={u.id}>{u.full_name || u.email}</option>)}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Due Date</label>
                  <input type="datetime-local" className="form-control" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Create Task</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row g-3">
            {tasks.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info">No tasks found.</div>
              </div>
            ) : (
              tasks.map((task: any) => (
                <div className="col-12" key={task.id}>
                  <div className="card shadow-sm">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 className="card-title mb-1">{task.title}</h5>
                          <h6 className="card-subtitle mb-2 text-muted">{task.projects?.name}</h6>
                          <p className="card-text mb-1">{task.description}</p>
                          <small className="text-muted d-block">Assigned to: {task.profiles?.full_name || task.profiles?.email || 'Unassigned'}</small>
                          {task.due_date && <small className="text-danger">Due: {new Date(task.due_date).toLocaleString()}</small>}
                        </div>
                        <div className="ms-3">
                          <select 
                            className={`form-select form-select-sm fw-bold ${
                              task.status === 'DONE' ? 'text-success' : task.status === 'IN_PROGRESS' ? 'text-warning' : 'text-primary'
                            }`}
                            value={task.status} 
                            onChange={(e) => updateStatus(task.id, e.target.value)}
                          >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
