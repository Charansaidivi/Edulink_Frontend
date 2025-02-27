import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/HomePage'
import CreateClass from './pages/CreateClass'
import ProfilePage from './pages/ProfilePage'
import ResetPassword from './pages/ResetPassword'
import RequestPasswordReset from './pages/RequestPasswordReset'
import AboutUs from './pages/AboutUs'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Register from './pages/Register'
import SessionDetails from './pages/SessionDetails'

const App = () => {
  return (
    <GoogleOAuthProvider clientId="625626669431-c2p74fbeko7t33f236vooiu3sn3d9nvq.apps.googleusercontent.com">
      <div>
        <Routes>
          {/* Public Routes */}
          <Route path='/' element={<LandingPage/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/about-us' element={<AboutUs/>}/>
          <Route path='/reset-password/:token' element={<ResetPassword />} />
          <Route path='/reset-password/:token/:email' element={<ResetPassword />} />
          <Route path='/request-password-reset' element={<RequestPasswordReset />} />

          {/* Protected Routes */}
          <Route 
            path='/home' 
            element={
              <ProtectedRoute>
                <HomePage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/create-class' 
            element={
              <ProtectedRoute>
                <CreateClass/>
              </ProtectedRoute>
            }
          />
          <Route 
            path='/profile' 
            element={
              <ProtectedRoute>
                <ProfilePage/>
              </ProtectedRoute>
            }
          />
          <Route 
            path="/session-details/:sessionId" 
            element={
              <ProtectedRoute>
                <SessionDetails />
              </ProtectedRoute>
            }
          />

          {/* Catch all route for 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </GoogleOAuthProvider>
  )
}

export default App