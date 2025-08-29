import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header'
import SearchResults from './components/Searchresults'
import Bill from './pages/Bill'
import Chatbot from './components/Chatbot'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path='/bill'element={<Bill/>}/>
        <Route path='/' element={<Home/>} />
        <Route path="/search" element={<SearchResults />} />
      </Routes>
        <Chatbot/>
    </div>
  )
}

export default App