import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import UserRoleSelect from "@/components/UserRoleSelect";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);

  // SECURITY: If they aren't an admin, redirect them back to the dashboard immediately
  if (!session || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  // Fetch all users from the database, sorted by name
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        
        <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Team Management</h1>
            <p className="text-gray-500">Manage your users and assign administrative roles.</p>
          </div>
          <Link href="/dashboard" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            Back to Dashboard
          </Link>
        </div>

        <div className="rounded-lg bg-white shadow-sm border border-gray-100 overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {users.map(user => (
              <li key={user.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                <div>
                  <h3 className="font-medium text-gray-900">{user.name || "Unknown User"}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                
                {/* Here is our interactive dropdown! */}
                <UserRoleSelect user={user} />
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
}