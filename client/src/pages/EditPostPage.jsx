import React from 'react';
import PostForm from '../components/PostForm';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

export default function EditPostPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { push } = useToast();

  const handleSuccess = () => {
    push('Post updated successfully!', { type: 'success' });
    navigate(`/posts/${id}`);
  };

  const handleError = (error) => {
    push(error.message || 'Failed to update post', { type: 'error' });
  };

  return (
    <>
      <Helmet>
        <title>Edit Post - MERN Blog</title>
        <meta name="description" content="Edit your blog post" />
      </Helmet>
      <div className="container form-container animate-fade-in">
        <h1 className="page-title">Edit Post</h1>
        <PostForm id={id} onSuccess={handleSuccess} onError={handleError} />
      </div>
    </>
  );
}