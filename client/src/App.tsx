import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SampleDarkMode } from "./components/SampleDarkMode.tsx"
import './App.css'

function App() { 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SampleDarkMode />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
