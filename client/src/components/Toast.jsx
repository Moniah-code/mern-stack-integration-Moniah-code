import React from 'react'
import { useToast } from '../context/ToastContext'
import './Toast.css'

export default function Toast() {
  const { toasts, remove } = useToast()

  return (
    <div className="toast-container">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`toast toast-${toast.type || 'info'}`}
        >
          <div className="toast-content">
            <div className="toast-message">
              {toast.message}
            </div>
            <button
              onClick={() => remove(toast.id)}
              className="toast-close"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                <path d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
