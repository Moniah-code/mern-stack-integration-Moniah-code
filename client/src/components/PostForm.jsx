import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { postService } from '../services/api'
import api from '../services/api'
import { PostsContext } from '../context/PostsContext'
import CategoryManager from './CategoryManager'
import '../styles/ImageUpload.css'

export default function PostForm({ onSuccess, onError }){
  const { id } = useParams()
  const navigate = useNavigate()
  const { categories, fetchPosts, createPost } = useContext(PostsContext)
  const [form, setForm] = useState({ title:'', content:'', category:'', excerpt:'', tags:[] })
  const [submitting, setSubmitting] = useState(false)

  useEffect(()=>{
    if(id){
      (async()=>{
        try{
          const res = await postService.getPost(id)
          setForm({ title: res.title, content: res.content, category: res.category?._id || '', excerpt: res.excerpt || '', tags: res.tags || [] })
        }catch(err){console.error(err)}
      })()
    }
  },[id])

  const onChange = (e)=> setForm({...form, [e.target.name]: e.target.value })

  const [file, setFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [currentImage, setCurrentImage] = useState(null)

  useEffect(() => {
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }, [file])

  // Load current image when editing
  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await postService.getPost(id)
          if (res.featuredImage) {
            setCurrentImage(res.featuredImage)
          }
        } catch (err) {
          console.error(err)
        }
      })()
    }
  }, [id])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      // Check file type
      if (!selectedFile.type.startsWith('image/')) {
        onError?.({ message: 'Please select an image file' })
        return
      }
      // Check file size (5MB limit)
      if (selectedFile.size > 5 * 1024 * 1024) {
        onError?.({ message: 'Image size should be less than 5MB' })
        return
      }
      setFile(selectedFile)
    }
  }

  const removeImage = () => {
    setFile(null)
    setImagePreview(null)
    setCurrentImage(null)
    // If we're editing, add a flag to remove the image
    if (id) {
      setForm(prev => ({ ...prev, removeImage: true }))
    }
  }

  const onSubmit = async (e)=>{
    e.preventDefault()
    if (!form.title || !form.content || !form.category) {
      onError?.({ message: 'Please fill in all required fields' })
      return
    }
    setSubmitting(true)
    try {
      // If there's a file, use FormData
      if (file) {
        const fd = new FormData()
        fd.append('title', form.title)
        fd.append('content', form.content)
        fd.append('category', form.category)
        fd.append('excerpt', form.excerpt)
        fd.append('tags', JSON.stringify(form.tags || []))
        fd.append('featuredImage', file)
        
        if (id) {
          await api.put(`/posts/${id}`, fd)
        } else {
          const post = await api.post('/posts', fd)
          if (onSuccess) onSuccess(post)
        }
      } else {
        if(id){
          const post = await postService.updatePost(id, form)
          if (onSuccess) onSuccess(post)
        } else {
          const post = await createPost(form)
          if (onSuccess) onSuccess(post)
        }
      }
    } catch(err) {
      console.error('Error saving post:', err)
      if (onError) onError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="card">
      <h3>{id? 'Edit Post' : 'Create Post'}</h3>
      <form onSubmit={onSubmit}>
        <div className="form-row">
          <label>Title</label>
          <input name="title" value={form.title} onChange={onChange} />
        </div>

        <div className="form-row">
          <label>Category</label>
          <select name="category" value={form.category} onChange={onChange}>
            <option value="">Select</option>
            {categories.map(c=> <option key={c._id} value={c._id}>{c.name}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Content (HTML allowed)</label>
          <textarea name="content" value={form.content} onChange={onChange} rows={8} />
        </div>

        <div className="form-row">
          <label>Featured image</label>
          <div className="image-upload-container">
            <input 
              type="file" 
              onChange={handleFileChange}
              accept="image/*"
              style={{ marginBottom: '10px' }}
            />
            {(imagePreview || currentImage) && (
              <div className="image-preview">
                <img 
                  src={imagePreview || `http://localhost:5000${currentImage}`} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '300px', 
                    maxHeight: '200px',
                    marginBottom: '10px'
                  }}
                />
                <button 
                  type="button" 
                  onClick={removeImage}
                  className="btn btn-danger"
                  style={{ marginLeft: '10px' }}
                >
                  Remove Image
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{display:'flex',gap:8}}>
          <button className="btn" disabled={submitting}>
            {submitting ? 'Saving...' : 'Save'}
          </button>
        </div>
        <CategoryManager />
      </form>
    </div>
  )
}
