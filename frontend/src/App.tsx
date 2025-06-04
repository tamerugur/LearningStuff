import { User } from './components/User'

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
      <div className="p-8 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 w-full max-w-xl">
        <User />
      </div>
    </div>
  )
}

export default App
