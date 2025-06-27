import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import Bill from './pages/Bill'
import Done from './pages/done'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>  
        <Route path='/menu' element={<Home/>} />
        <Route path='/bill' element={<Bill/>} />
        <Route path='/done' element={<Done/>} />
      </Routes>
    </div>
  )
}

export default App