import React from 'react';
import Login from '../components/Login';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const { push } = useToast();

  const handleSuccess = () => {
    push('Successfully logged in!', { type: 'success' });
  };

  const handleError = (error) => {
    push(error.message || 'Login failed', { type: 'error' });
  };

  return (
    <>
      <Helmet>
        <title>Login - MERN Blog</title>
        <meta name="description" content="Log in to your account" />
      </Helmet>
      <div className="container form-container animate-fade-in">
        <h1 className="page-title">Login</h1>
        <Login onSuccess={handleSuccess} onError={handleError} />
      </div>
    </>
  );
}