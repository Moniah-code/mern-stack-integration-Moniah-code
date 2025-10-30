import React from 'react';
import Register from '../components/Register';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

export default function RegisterPage() {
  const { push } = useToast();

  const handleSuccess = () => {
    push('Successfully registered! Please log in.', { type: 'success' });
  };

  const handleError = (error) => {
    push(error.message || 'Registration failed', { type: 'error' });
  };

  return (
    <>
      <Helmet>
        <title>Register - MERN Blog</title>
        <meta name="description" content="Create a new account" />
      </Helmet>
      <div className="container form-container animate-fade-in">
        <h1 className="page-title">Register</h1>
        <Register onSuccess={handleSuccess} onError={handleError} />
      </div>
    </>
  );
}