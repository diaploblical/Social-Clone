import axios from 'axios'
import React, {useState, useEffect, useContext} from 'react'
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import M from 'materialize-css'

const Feed = () => {
  const [data, setData] = useState([])
  const {state, dispatch} = useContext(UserContext)
  useEffect(() => {
    const getFollowedPosts = async () => {
      try {
        let response = await axios.get("/followedposts", {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        })
        await setData(response.data)
      } catch(error) {
        M.toast({html: error, classes: "red"})
      }
    }
    getFollowedPosts() 
  },[])
  const likePost = async (id) => {
    let response = await axios.put("/like", {postId: id}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(newData)
    } catch(error) {
      console.log(error)
    }
  }
  const unlikePost = async (id) => {
    let response = await axios.put("/unlike", {postId: id}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(newData)
    } catch(error) {
      console.log(error)
    }
  }
  const makeComment = async (text, postId) => {
    let response = await axios.put("/comment", {text, postId}, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(newData)
    } catch(error) {
      console.log(error)
    }
  }
  const deleteComment = async (postId, commentId) => {
    let response = await axios.put("/deletecomment", {postId, commentId}, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("jwt")
      }
    })
    try {
      const newData = data.map(item => {
        if (item._id === response.data._id) {
          return response.data
        } else {
          return item
        }
      })
      setData(newData)
    } catch(error) {
      console.log(error)
    }
  }
  return(
    <div className="custom-container">
      {
        data ? data.map(item => {
          return(
            <div className="card home-card">         
              <div className="card-image">
                <h4><Link to={item.postedBy._id !== state._id ? `/profile/${item.postedBy._id}` : '/profile'}>{item.postedBy.username}</Link>
                </h4>
                <img src={`http://localhost:5000/api/image/${item.photo}`} alt="NIGAGHONE"/>
              </div>
              <div className="card-content">
                <i className="material-icons mi-margins">favorite</i>
                {
                  item.likes.includes(state._id) ? 
                  <i className="material-icons mi-margins" onClick={() => {unlikePost(item._id)}}>thumb_down</i> : 
                  <i className="material-icons mi-margins" onClick={() => {likePost(item._id)}}>thumb_up</i>
                }         
                <h6>{item.likes.length} likes</h6>
                <h5>{item.title}</h5>
                <p>{item.body}</p>
                {
                  item.comments.map(record=> {
                    return(
                      <h6 key={record._id}>
                        <span style={{fontWeight: "500"}}>{record.postedBy.username} </span>{record.text}
                        {record.postedBy._id === state._id && 
                          <i className="material-icons" style={{float: "right"}} onClick={() => {deleteComment(item._id, record._id)}}>delete</i>
                        }                
                      </h6>
                    )
                  })
                }
                <form onSubmit={(e) => {
                  e.preventDefault()
                  makeComment(e.target[0].value, item._id)
                }}>
                  <input type="text" placeholder="Add a comment"/>
                </form>          
              </div>
            </div>
          )
        }) : 'no'        
      }
    </div>
  )
}

export default Feed