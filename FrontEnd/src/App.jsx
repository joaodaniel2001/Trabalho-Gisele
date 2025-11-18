import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

/* Páginas */
import Home from './pages/Home/Home'
import Questionario from './pages/Questionario/Questionario'
import FormMasc from './pages/Planilha/FormMasc/FormMasc'
import FormFem from './pages/Planilha/FormFem/FormFem'
import Dashboard from './pages/Dashboard/Dashboard'
import Planilha from './pages/Planilha/Planilha'

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
        <Header menu={menu} />
        <Routes>
          {/* Rotas Leftbar */}
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/planilha" element={<Planilha />} />
          <Route path="/dashboard/formulario-masculino" element={<FormMasc />} />
          <Route path="/dashboard/formulario-feminino" element={<FormFem />} />
          <Route path="/questionario" element={<Questionario />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
