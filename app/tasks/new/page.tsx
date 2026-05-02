"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewTaskPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [projects, setProjects] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch projects when the page loads to populate the dropdown
  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setProjects(data);
          if (data.length > 0) setProjectId(data[0].id); // Auto-select the first project
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, projectId }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to create task");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg rounded-xl bg-white p-8 shadow-sm border border-gray-100">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Create New Task</h2>
        
        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-500 border border-red-200">
            {error}
          </div>
        )}

        {projects.length === 0 ? (
          <div className="text-center">
            <p className="mb-4 text-gray-600">You need to create a Project before you can assign tasks.</p>
            <Link href="/projects/new" className="text-blue-600 font-semibold hover:underline">
              Go create a project
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Task Title</label>
              <input
  type="text"
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  placeholder="e.g., Update database schema"
  required
/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assign to Project</label>
              <select
  value={projectId}
  onChange={(e) => setProjectId(e.target.value)}
  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 bg-white focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
  required
>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Link
                href="/dashboard"
                className="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-blue-400"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}