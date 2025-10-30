import React, { createContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

export const AuthContext = createContext()

export function AuthProvider({ children }){
  const [user, setUser] = useState(null)

  useEffect(()=>{
    const u = authService.getCurrentUser()
    setUser(u)
  }, [])

  const login = async (credentials) => {
    const res = await authService.login(credentials)
    setUser(res.user)
    return res
  }

  const register = async (data) => {
    const res = await authService.register(data)
    return res
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
