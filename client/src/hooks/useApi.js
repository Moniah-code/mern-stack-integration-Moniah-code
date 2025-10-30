import { useState } from 'react'

export default function useApi(fn){
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const call = async (...args) => {
    setLoading(true)
    setError(null)
    try{
      const res = await fn(...args)
      setLoading(false)
      return res
    }catch(err){
      setError(err)
      setLoading(false)
      throw err
    }
  }

  return { call, loading, error }
}
