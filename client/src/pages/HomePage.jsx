import React from 'react';
import PostList from '../components/PostList';
import { Helmet } from 'react-helmet-async';

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>MERN Blog - All Posts</title>
        <meta name="description" content="Read the latest blog posts on various topics" />
      </Helmet>
      <div className="container animate-fade-in">
        <h1 className="page-title">Latest Posts</h1>
        <PostList />
      </div>
    </>
  );
}