import React from 'react';
import PostForm from '../components/PostForm';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../context/ToastContext';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const { push } = useToast();

  const handleSuccess = () => {
    push('Post created successfully!', { type: 'success' });
    navigate('/');
  };

  const handleError = (error) => {
    push(error.message || 'Failed to create post', { type: 'error' });
  };

  return (
    <>
      <Helmet>
        <title>Create New Post - MERN Blog</title>
        <meta name="description" content="Create a new blog post" />
      </Helmet>
      <div className="container form-container animate-fade-in">
        <h1 className="page-title">Create New Post</h1>
        <PostForm onSuccess={handleSuccess} onError={handleError} />
      </div>
    </>
  );
}