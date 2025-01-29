import React from 'react'
import Login from '../components/Login'
import Register from '../components/Register'
import { useState,useEffect} from 'react'
const AuthPage = () => {
    const[login,setLogin]=useState(true);
    const[signup,setSignup]=useState(false);


    const LoginHandler=()=>{
        setLogin(true);
        setSignup(false);
    }
    const SignupHandler=()=>{
      setLogin(false)
      setSignup(true)
    }
  return (
    <div>
        {login &&< Login  SignupHandler={SignupHandler}/>}
        {signup && <Register LoginHandler={LoginHandler}/>}
    </div>
  )
}

export default AuthPage