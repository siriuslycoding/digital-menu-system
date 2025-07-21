import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import SearchResults from './components/Searchresults'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path="/search/:query" element={<SearchResults />} />
      </Routes>
    </div>
  )
}

export default App