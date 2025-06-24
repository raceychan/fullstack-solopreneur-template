import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b bg-white dark:bg-gray-900">
        <div className="flex items-center justify-center">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Next.js Solopreneur Template</h1>
        </div>
      </header>
      
      <main className="flex-1 p-4 lg:p-6 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</h3>
                <span className="text-gray-500">💰</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">$45,231.89</div>
              <p className="text-xs text-green-600">+20.1% from last month</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</h3>
                <span className="text-gray-500">👥</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">+2,350</div>
              <p className="text-xs text-green-600">+180.1% from last month</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Tasks Completed</h3>
                <span className="text-gray-500">✅</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
              <p className="text-xs text-green-600">+19% from last month</p>
            </div>
            
            <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Now</h3>
                <span className="text-gray-500">📊</span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">+573</div>
              <p className="text-xs text-green-600">+201 since last hour</p>
            </div>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <div className="col-span-4 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Welcome to Your Next.js Solopreneur Template</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                This is your Next.js full-stack solopreneur template with authentication, 
                database, and modern UI components.
              </p>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">Next.js 15 with App Router</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">Prisma ORM with PostgreSQL</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">NextAuth.js Authentication</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">Tailwind CSS Styling</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-green-500">✅</span>
                  <span className="text-gray-700 dark:text-gray-300">TypeScript Support</span>
                </div>
              </div>
              <div className="mt-6">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors">
                  Get Started
                </button>
              </div>
            </div>
            
            <div className="col-span-3 bg-white dark:bg-gray-900 p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  📝 Create New Task
                </button>
                <button className="w-full text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  📊 View Analytics
                </button>
                <button className="w-full text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  👥 Manage Users
                </button>
                <button className="w-full text-left bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
