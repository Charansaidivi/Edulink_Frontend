import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateClass from './pages/CreateClass'
import ProfilePage from './pages/ProfilePage'
const App = () => {
  return (
    <GoogleOAuthProvider clientId="625626669431-c2p74fbeko7t33f236vooiu3sn3d9nvq.apps.googleusercontent.com">
      <div>
        <Routes>
          <Route path='/' element={<AuthPage/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/create-class' element={<CreateClass/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App