import React from 'react';
import { useParams } from 'react-router-dom';
import PostView from '../components/PostView';
import { Helmet } from 'react-helmet-async';
import { useToast } from '../context/ToastContext';

export default function PostDetailPage() {
  const { id } = useParams();
  const { push } = useToast();

  const handleError = (error) => {
    push(error.message || 'Failed to load post', { type: 'error' });
  };

  return (
    <>
      <Helmet>
        <title>Blog Post - MERN Blog</title>
        <meta name="description" content="Read this blog post" />
      </Helmet>
      <div className="container animate-fade-in">
        <PostView id={id} onError={handleError} />
      </div>
    </>
  );
}