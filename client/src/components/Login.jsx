import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Login(){
  const [form, setForm] = useState({ email:'', password:'' })
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const onChange = (e)=> setForm({...form, [e.target.name]: e.target.value })

  const { login } = useContext(AuthContext)

  const onSubmit = async (e)=>{
    e.preventDefault()
    try{
      await login(form)
      navigate('/')
    }catch(err){
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
    <div className="card">
      <h3>Login</h3>
      {error && <div style={{color:'red'}}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Email</label>
          <input name="email" value={form.email} onChange={onChange} />
        </div>
        <div className="form-row">
          <label>Password</label>
          <input name="password" type="password" value={form.password} onChange={onChange} />
        </div>
        <button className="btn">Login</button>
      </form>
    </div>
  )
}
