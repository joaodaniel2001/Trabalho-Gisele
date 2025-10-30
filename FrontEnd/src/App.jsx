import React, { useState } from 'react'
import { Route, Routes } from 'react-router-dom'

/* Páginas */
import Home from './pages/Home/Home'
import Leftbar from './components/Leftbar/Leftbar'

function App() {

  const [ menu, setMenu ] = useState("menu")

  return (
    <div>
      <Leftbar menu={menu} setMenu={setMenu} />
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App
