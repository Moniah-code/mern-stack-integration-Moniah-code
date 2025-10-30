import React, { createContext, useState, useCallback, useContext } from 'react'

const ToastContext = createContext()

export function ToastProvider({ children }){
  const [toasts, setToasts] = useState([])

  const push = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t, { id, message, type: opts.type || 'info' }])
    if (!opts.persistent) {
      setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), opts.duration || 3500)
    }
    return id
  }, [])

  const remove = useCallback((id) => setToasts(t => t.filter(x => x.id !== id)), [])

  return (
    <ToastContext.Provider value={{ push, remove, toasts }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast(){
  return useContext(ToastContext)
}
