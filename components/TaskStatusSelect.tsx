"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskStatusSelect({ task }: { task: { id: string; status: string } }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      
      // Refresh the page data so the dashboard stays in sync
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <select
      value={task.status}
      disabled={isUpdating}
      onChange={(e) => handleStatusChange(e.target.value)}
      className={`cursor-pointer appearance-none rounded-full px-3 py-1 text-xs font-semibold text-center border-none focus:outline-none focus:ring-2 focus:ring-blue-500
        ${task.status === "TODO" ? "bg-gray-100 text-gray-800" : 
          task.status === "IN_PROGRESS" ? "bg-yellow-100 text-yellow-800" : 
          "bg-green-100 text-green-800"} ${isUpdating ? "opacity-50" : "opacity-100"}`}
    >
      <option value="TODO" className="bg-white text-gray-900">TODO</option>
      <option value="IN_PROGRESS" className="bg-white text-gray-900">IN PROGRESS</option>
      <option value="DONE" className="bg-white text-gray-900">DONE</option>
    </select>
  );
}