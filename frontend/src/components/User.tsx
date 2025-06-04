import { useState } from 'react'
import { UserRegister } from './UserRegister'
import { UserLogin } from './UserLogin'

export function User() {
  const [activeTab, setActiveTab] = useState<'register' | 'login'>('register')

  return (
    <div className="w-full max-w-xs mx-auto">
      <div className="flex border-b border-gray-300 dark:border-gray-600 mb-6">
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'register'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('register')}
        >
          Register
        </button>
        <button
          className={`flex-1 py-2 text-sm font-medium transition-colors ${
            activeTab === 'login'
              ? 'border-b-2 border-blue-600 text-blue-600 dark:text-blue-400'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
          onClick={() => setActiveTab('login')}
        >
          Login
        </button>
      </div>

      <div>
        {activeTab === 'register' && <UserRegister />}
        {activeTab === 'login' && <UserLogin />}
      </div>
    </div>
  )
}
