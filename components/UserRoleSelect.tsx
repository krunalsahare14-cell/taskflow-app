"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UserRoleSelect({ user }: { user: { id: string; role: string; name: string | null } }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleRoleChange = async (newRole: string) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!res.ok) {
        const error = await res.json();
        alert(error.message); // Show a quick alert if they try to demote themselves
      }
      
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={user.role}
      disabled={isUpdating}
      onChange={(e) => handleRoleChange(e.target.value)}
      className={`cursor-pointer rounded-md px-3 py-1 text-sm font-semibold border focus:outline-none focus:ring-2 focus:ring-blue-500
        ${user.role === "ADMIN" ? "bg-purple-50 text-purple-700 border-purple-200" : "bg-gray-50 text-gray-700 border-gray-200"} 
        ${isUpdating ? "opacity-50" : "opacity-100"}`}
    >
      <option value="MEMBER" className="bg-white text-gray-900">MEMBER</option>
      <option value="ADMIN" className="bg-white text-gray-900">ADMIN</option>
    </select>
  );
}