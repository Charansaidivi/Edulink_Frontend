import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import HomePage from './pages/HomePage'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import CreateClass from './pages/CreateClass'
import ProfilePage from './pages/ProfilePage'
import ResetPassword from './pages/ResetPassword'
import RequestPasswordReset from './pages/RequestPasswordReset'
import AboutUs from './pages/AboutUs'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
const App = () => {
  return (
    <GoogleOAuthProvider clientId="625626669431-c2p74fbeko7t33f236vooiu3sn3d9nvq.apps.googleusercontent.com">
      <div>
        <Routes>
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<HomePage/>}/>
          <Route path='/create-class' element={<CreateClass/>}/>
          <Route path='/profile' element={<ProfilePage/>}/>
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/reset-password/:token/:email' element={<ResetPassword />} />
          <Route path='/request-password-reset' element={<RequestPasswordReset />} />
          <Route path='/about-us' element={<AboutUs/>} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App