import React, { useState } from 'react'
import { API_URL } from '../data/apiData'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'

const Register = ({LoginHandler}) => {
  const navigate = useNavigate()
  const [username, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async(e)=>{
    e.preventDefault()
    try {
      const response = await fetch(`${API_URL}/student/register`,{
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({username,email,password})     
       })
       const data = await response.json()
       if(response.ok){
        console.log(data)
        setEmail("")
        setName("")
        setPassword("")
        alert("Student registered sucessfully")
        navigate('/home')
       }
    } catch (error) {
       console.log("registration failed",error)
       alert("Registration failed")
    }
  }

  const handleGoogleSignupSuccess = async (response) => {
    console.log('Google signup success:', response)
    const { credential } = response

    try {
      const serverResponse = await fetch(`${API_URL}/student/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credential }),
      })

      const data = await serverResponse.json()
      if (serverResponse.ok) {
        console.log('Server response:', data)
        alert('Signup successful')
        navigate('/home')
      } else {
        console.error('Server error:', data)
        alert(data.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Network error:', error)
      alert('Signup failed')
    }
  }

  const handleGoogleSignupFailure = (error) => {
    console.error('Google signup failed:', error)
    alert('Google signup failed')
  }

  return (
    <div
    className="body-container"
  >
    <form className="form" onSubmit={handleSubmit}>
    <div className="flex-column">
      <label>Name</label>
    </div>
    <div className="inputForm">
      <input
        placeholder="Enter your Name"
        className="input"
        type="text"
        onChange={(e) => setName(e.target.value)}
        required
      />
    </div>
    <div className="flex-column">
      <label>Email</label>
    </div>
    <div className="inputForm">
      <input
        placeholder="Enter your Email"
        className="input"
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
    </div>

    <div className="flex-column">
      <label>Password</label>
    </div>
    <div className="inputForm">
      <input
        placeholder="Enter your Password"
        className="input"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
    </div>
    <button className="button-submit">Sign Up</button>
    <p className="p">
      Already have an account? <span className="span" onClick={LoginHandler}>Login</span>
    </p>
    <p className="p line">Or With</p>

    <div className="flex-row">
        <GoogleLogin
          onSuccess={handleGoogleSignupSuccess}
          onError={handleGoogleSignupFailure}
        />
    </div>
  </form>
  </div>
  )
}

export default Register