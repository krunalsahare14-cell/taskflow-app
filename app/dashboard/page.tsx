import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import TaskStatusSelect from "@/components/TaskStatusSelect";

export default async function DashboardPage() {
  // 1. Check if the user is logged in
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const user = session.user;

  // 2. Fetch data based on their role
  const projects = user.role === "ADMIN"
    ? await prisma.project.findMany({ where: { ownerId: user.id } })
    : [];

  const tasks = await prisma.task.findMany({
    where: user.role === "ADMIN" ? { project: { ownerId: user.id } } : { assigneeId: user.id },
    include: { project: true }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        
        {/* Header Section - Buttons belong up here! */}
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">
              Welcome back, {user.name || user.email} 
              <span className="ml-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-800">
                {user.role}
              </span>
            </p>
          </div>
          {user.role === "ADMIN" && (
            <div className="flex gap-4">
              <Link href="/team" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                Manage Team
              </Link>
              <Link href="/projects/new" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                + New Project
              </Link>
              <Link href="/tasks/new" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500">
                + New Task
              </Link>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          
          {/* Projects Section (Admins Only) */}
          {user.role === "ADMIN" && (
            <div className="rounded-lg bg-white p-6 shadow-sm border border-gray-100">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Projects</h2>
              {projects.length === 0 ? (
                <p className="text-sm text-gray-500">No projects yet. Create one to get started!</p>
              ) : (
                <ul className="space-y-3">
                  {projects.map(project => (
                    <li key={project.id} className="rounded-md border border-gray-200 p-4 hover:border-blue-500 transition-colors">
                      <h3 className="font-medium text-gray-900">{project.name}</h3>
                      {project.description && <p className="text-sm text-gray-500">{project.description}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Tasks Section (Everyone) */}
          <div className={`rounded-lg bg-white p-6 shadow-sm border border-gray-100 ${user.role !== "ADMIN" ? "md:col-span-2" : ""}`}>
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              {user.role === "ADMIN" ? "Team Tasks" : "Your Assigned Tasks"}
            </h2>
            {tasks.length === 0 ? (
              <p className="text-sm text-gray-500">No tasks found. You are all caught up!</p>
            ) : (
              <ul className="space-y-3">
                {tasks.map(task => (
                  <li key={task.id} className="flex items-center justify-between rounded-md border border-gray-200 p-4">
                    <div>
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-xs text-gray-500">Project: {task.project.name}</p>
                    </div>
                    
                    {/* The Interactive Status Dropdown */}
                    <TaskStatusSelect task={task} />
                  </li>
                ))}
              </ul>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}