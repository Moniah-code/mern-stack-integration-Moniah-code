import React, { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

export default function Register({ onSuccess, onError }){
  const [form, setForm] = useState({ name:'', email:'', password:'', confirmPassword: '' })
  const [error, setError] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const onChange = (e)=> setForm({...form, [e.target.name]: e.target.value })

  const { register } = useContext(AuthContext)

  const onSubmit = async (e)=>{
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirmPassword) {
      const msg = 'Passwords do not match'
      setError(msg)
      if (onError) onError({ message: msg })
      return
    }

    try{
      await register({ name: form.name, email: form.email, password: form.password })
      if (onSuccess) onSuccess()
      // after register, navigate to login so user can sign in
      navigate('/login')
    }catch(err){
      const msg = err.response?.data?.message || 'Registration failed'
      setError(msg)
      if (onError) onError({ message: msg })
    }
  }

  return (
    <div className="card">
      <h3>Register</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Name</label>
          <input name="name" value={form.name} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={onChange} required />
        </div>
        <div className="form-row">
          <label>Password</label>
          <div style={{display:'flex', alignItems:'center'}}>
            <input
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={onChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(s => !s)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{marginLeft:8}}
            >{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </div>
        <div className="form-row">
          <label>Confirm Password</label>
          <input
            name="confirmPassword"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={onChange}
            required
          />
        </div>
        <button className="btn">Register</button>
      </form>
    </div>
  )
}
