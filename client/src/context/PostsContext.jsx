import React, { createContext, useState, useEffect } from 'react'
import { postService, categoryService } from '../services/api'

export const PostsContext = createContext()

export function PostsProvider({ children }){
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [meta, setMeta] = useState({ page:1, limit:10, total:0 })

  // Create a new post and update the posts list
  const createPost = async (postData) => {
    setLoading(true)
    try {
      const post = await postService.createPost(postData)
      setPosts(prev => [post, ...prev])
      return post
    } catch (err) {
      console.error('Error creating post:', err)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const fetchPosts = async (page = 1, limit = 10, category=null, q=null) => {
    setLoading(true)
    try{
      const resp = await postService.getAllPosts(page, limit, category, q)
      // backend returns { data, meta }
      if (resp.data) {
        setPosts(resp.data)
        setMeta(resp.meta || { page, limit, total: resp.data.length })
      } else {
        setPosts(resp)
      }
    }catch(err){
      console.error(err)
    }finally{ setLoading(false) }
  }

  const fetchCategories = async () => {
    try{
      const resp = await categoryService.getAllCategories()
      setCategories(resp)
    }catch(err){ console.error(err) }
  }

  useEffect(()=>{ fetchCategories(); fetchPosts(); }, [])

  return (
    <PostsContext.Provider value={{ 
        posts, 
        setPosts, 
        categories, 
        fetchPosts, 
        fetchCategories,
        createPost,
        loading, 
        meta 
      }}>
      {children}
    </PostsContext.Provider>
  )
}
