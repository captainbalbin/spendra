import { useState, useEffect } from 'react'

export const useDarkMode = () => {
  const savedMode = localStorage.getItem('darkMode')
  const [darkMode, setDarkMode] = useState<boolean>(savedMode ? JSON.parse(savedMode) : false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    const htmlClassList = document.documentElement.classList
    if (darkMode) {
      htmlClassList.add('dark')

      localStorage.setItem('darkMode', JSON.stringify(true))
    } else {
      htmlClassList.remove('dark')

      localStorage.setItem('darkMode', JSON.stringify(false))
    }
  }, [darkMode])

  return { darkMode, toggleDarkMode }
}
