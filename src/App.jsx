import React from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { Routes, Route, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import ProtectedRoute from './components/ProtectedRoute'
import HomePage from './pages/studentSession/HomePage.jsx'
import CreateClass from './pages/studentSession/CreateClass'
import ProfilePage from './pages/profile/ProfilePage'
import ResetPassword from './pages/authentication/ResetPassword'
import RequestPasswordReset from './pages/authentication/RequestPasswordReset'
import AboutUs from './pages/studentSession/AboutUs'
import LandingPage from './pages/authentication/LandingPage'
import Login from './pages/authentication/Login'
import Register from './pages/authentication/Register'
import SessionDetails from './pages/profile/SessionDetails'
import Leader from './pages/projectCollaboration/Leader'
import Member from './pages/projectCollaboration/Member'
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
          <Route
            path="/leader"
            element={
              <ProtectedRoute>
                <Leader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/member"
            element={
              <ProtectedRoute>
                <Member />
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