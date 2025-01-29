import React from 'react'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import './App.css'
import { Routes,Route } from 'react-router-dom'
const App = () => {
  return (
    <div>
       <Routes>
          <Route path='/' element={<AuthPage/>}/>
          <Route path='/home' element={<HomePage/>}/>
       </Routes>
    </div>
  )
}
export default App