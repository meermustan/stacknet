import React, {useEffect, useState} from 'react'
import PostIntro from './PostIntro'
import axios from 'axios';
import { useParams } from "react-router-dom";


function ApprovePosts() {
  const [posts, setPosts] = useState("")
  const [changes, setChanges] = useState(0);
  const param = useParams();

  const getPosts = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_pendingPosts?categ=${param.categ}`);
      setPosts(res.data);
    } catch (error) {
      // alert(error);
    }
  };
  useEffect(() => {
    getPosts();
  }, [param.categ, changes])


  return (
    <>
      <h2>{param.categ} pending for approval ({posts.length}) </h2>

      <div className='AllPosts'>
        <ul>
          {posts && posts.map((post) => {
            return (
                <li key={post.id}>
                  <PostIntro post={post} type={param.categ} changes={changes} setChanges={setChanges}/>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  )
}

export default ApprovePosts