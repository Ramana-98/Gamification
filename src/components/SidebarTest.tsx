import React from "react";
import SidebarDemo from "@/components/ui/sidebar-demo";

export default function SidebarTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Sidebar Component Test
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Interactive sidebar with hover animations and responsive design
          </p>
        </div>

        <SidebarDemo />

        <div className="mt-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
            Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Hover Animation</h3>
              <p>Sidebar expands on hover with smooth animations</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Responsive Design</h3>
              <p>Mobile-friendly with collapsible menu</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="font-semibold mb-2">Dark Mode</h3>
              <p>Fully compatible with dark/light themes</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 