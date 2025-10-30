import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

/* Páginas */
import Home from './pages/Home/Home'
import Dashboard from './pages/Dashboard/Dashboard'
import Questionario from './pages/Questionario/Questionario'

/* Componentes */
import Leftbar from './components/Leftbar/Leftbar'
import Header from './components/Header/Header'

function App() {

  const [menu, setMenu] = useState('Home')

  return (
    <div>
      <div className="leftbar-content">
        <Leftbar menu={menu} setMenu={setMenu} />
      </div>
      <div className="content">
        <Header menu={menu}/>
        <Routes>
          {/* Rotas Leftbar */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/questionario" element={<Questionario />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
