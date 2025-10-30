import React, { useEffect, useState, useContext } from 'react'
import { useParams, Link } from 'react-router-dom'
import api, { postService } from '../services/api'
import { PostsContext } from '../context/PostsContext'

export default function PostView(){
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comment, setComment] = useState('')
  const { fetchPosts } = useContext(PostsContext)

  useEffect(()=>{
    const load = async ()=>{
      try{
        const res = await postService.getPost(id)
        setPost(res)
      }catch(err){ console.error(err) }
    }
    load()
  },[id])

  const submitComment = async (e) =>{
    e.preventDefault()
    try{
      await postService.addComment(id, { content: comment })
      setComment('')
      // refresh
      const res = await postService.getPost(id)
      setPost(res)
      fetchPosts()
    }catch(err){ console.error(err) }
  }

  if(!post) return <div className="card">Loading...</div>

  return (
    <div>
      <div className="card">
        <h2>{post.title}</h2>
        <p className="muted">By {post.author?.name} · {new Date(post.createdAt).toLocaleString()}</p>
        <div dangerouslySetInnerHTML={{__html: post.content}} />
      </div>

      <div className="card">
        <h4>Comments</h4>
        {post.comments && post.comments.length===0 && <div className="muted">No comments yet</div>}
        {post.comments && post.comments.map((c, i)=>(
          <div key={i} style={{borderTop:'1px solid #eee',paddingTop:8}}>
            <div className="muted">{c.user ? c.user.name : 'Anonymous'} · {new Date(c.createdAt).toLocaleString()}</div>
            <div>{c.content}</div>
          </div>
        ))}

        <form onSubmit={submitComment} style={{marginTop:12}}>
          <div className="form-row">
            <textarea value={comment} onChange={e=>setComment(e.target.value)} placeholder="Write a comment" />
          </div>
          <button className="btn">Add comment</button>
        </form>
      </div>

      <div style={{marginTop:12}}>
        <Link to="/">← Back to posts</Link>
      </div>
    </div>
  )
}
