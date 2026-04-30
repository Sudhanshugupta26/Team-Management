"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/projects", {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setProjects(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`
      },
      body: JSON.stringify({ name, description })
    });

    if (res.ok) {
      setName("");
      setDescription("");
      fetchProjects();
    } else {
      const data = await res.json();
      setError(data.error || "Failed to create project");
    }
  };

  if (loading) return <div className="container mt-5">Loading projects...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Projects</h2>
      
      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3">Create New Project</h5>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleCreate}>
                <div className="mb-3">
                  <label className="form-label">Project Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary w-100">Create Project</button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="row g-3">
            {projects.length === 0 ? (
              <div className="col-12">
                <div className="alert alert-info">No projects found. Create one to get started!</div>
              </div>
            ) : (
              projects.map((project: any) => (
                <div className="col-md-6" key={project.id}>
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{project.name}</h5>
                      <p className="card-text text-muted">{project.description}</p>
                      <small className="text-muted">Created at {new Date(project.created_at).toLocaleDateString()}</small>
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
