'use client';
import { useState } from "react";

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={darkMode ? "bg-gray-900 text-gray-100 min-h-screen p-6" : "bg-gray-100 text-gray-900 min-h-screen p-6"}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard Demo</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-300 dark:bg-gray-700 dark:text-white px-4 py-2 rounded"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>
      <p>Aici poți adăuga grafice, stats și componente admin.</p>
    </div>
  );
}
