import React from 'react'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateClass from './pages/CreateClass'
const App = () => {
  return (
    <div>
       <Routes>
          <Route path='/' element={<AuthPage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/create-class' element={<CreateClass/>}/>
       </Routes>
    </div>
  )
}
export default App