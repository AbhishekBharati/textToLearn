import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage.tsx';
import { Layout } from './components/Layout.tsx';
import './App.css'

function App() { 
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* Add more pages here as needed */}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
