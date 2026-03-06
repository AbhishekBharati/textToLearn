import { useState } from 'react';

export const SampleDarkMode = () => {
const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleDarkMode = () => {
    const nextDarkMode = !isDarkMode
    setIsDarkMode(nextDarkMode)
    if (nextDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white text-black dark:bg-gray-900 dark:text-white transition-colors duration-300">
      <h1 className="text-3xl font-bold mb-8 text-blue-500">
        Tailwind v4 Dark Mode
      </h1>
      
      <button 
        onClick={toggleDarkMode}
        className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
      >
        Switch to {isDarkMode ? 'Light' : 'Dark'} Mode
      </button>

      <div className="mt-8 p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-lg">
        <p>This card changes color in dark mode!</p>
      </div>
    </div>
  )
}
