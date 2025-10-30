import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import { PostsContext } from '../context/PostsContext'

export default function PostList(){
  const { posts, loading, fetchPosts, meta } = useContext(PostsContext)
  const [page, setPage] = useState(1)
  const [q, setQ] = useState('')

  const onSearch = async (e) =>{
    e.preventDefault()
    await fetchPosts(1, meta.limit, null, q)
  }

  return (
    <div>
      <div style={{display:'flex',gap:8,marginBottom:12}}>
        <form onSubmit={onSearch} style={{display:'flex',gap:8}}>
          <input placeholder="Search posts" value={q} onChange={e=>setQ(e.target.value)} />
          <button className="btn">Search</button>
        </form>
      </div>

      {loading && <div className="card">Loading...</div>}

      {posts && posts.length===0 && !loading && <div className="card">No posts yet</div>}

      {posts && posts.map(p=> (
        <div className="card" key={p._id}>
          <h3><Link to={`/posts/${p._id}`}>{p.title}</Link></h3>
          <p className="muted">{p.excerpt || (p.content && p.content.substring(0,140)+'...')}</p>
        </div>
      ))}

      <div style={{display:'flex',gap:8,alignItems:'center'}}>
        <button className="btn" disabled={page<=1} onClick={()=>{setPage(p=>p-1); fetchPosts(page-1)}}>Prev</button>
        <div className="muted">Page {meta.page || page}</div>
        <button className="btn" onClick={()=>{setPage(p=>p+1); fetchPosts(page+1)}}>Next</button>
      </div>
    </div>
  )
}
