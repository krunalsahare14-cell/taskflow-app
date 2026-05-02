import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  // Check if the user is already logged in
  const session = await getServerSession(authOptions);
  
  // If they are logged in, automatically send them to the dashboard
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          Welcome to <span className="text-blue-600">TaskFlow</span>
        </h1>
        <p className="mx-auto mb-8 max-w-lg text-lg text-gray-600">
          A secure, role-based project management tool built to help teams organize tasks, track progress, and hit deadlines.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/login"
            className="rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all"
          >
            Get Started
          </Link>
          <a
            href="https://github.com/your-username/taskflow-app" // Update this link to your repo!
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 transition-all"
          >
            View GitHub
          </a>
        </div>
      </div>
    </div>
  );
}