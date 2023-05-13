import React, { useContext, useState } from "react";
import icon4 from "../icons/icon4.png";
import "../styling/PostIntro.css";
import IsLoggedInContext from '../contexts/IsLoggedInContext'
import axios from 'axios'
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { useUser } from "../contexts/UserContext";

function PostIntro(props) {

  const loginContext = useContext(IsLoggedInContext);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const [dropDown, setDropDown] = useState(false);

  const post = props.post
  const date = new Date(post.date)
  const { user } = useUser();

  const toggleDropDown = () => {
    if (dropDown === true) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  };

  const approvePost = async event => {

    event.preventDefault();
    const id = post.id
    if (window.confirm("Are you sure you want to approve this post?") === true) {

      try {
        await axios.put(`http://127.0.0.1:5000/approve_post/${id}/`);

        toast.success('Post approved successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        props.setChanges(props.changes + 1)


      } catch (e) {
        alert(e.response.data.error);
      }
    }
  }

  const deletePost = async event => {

    event.preventDefault();
    const id = post.id

    if (window.confirm("Are you sure you want to delete this post?") === true) {

      try {
        await axios.delete(`http://127.0.0.1:5000/delete_post/${id}/`);

        toast.success('Post deleted successfully!', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        props.setChanges(props.changes + 1)


      } catch (e) {
        alert(e.response.data.error);
      }
    }
  }

  return (
    <>
      {props.postImg &&
        <Link to={`/discussions/d/${post.id}`}>
          <div className="postImg" style={{ backgroundImage: `url(${post.postImg})` }} ></div>
        </Link>
      }
      <div className="post">
        <Link to={`/discussions/d/${post.id}`}>
          <div className="postContent">
            <div className="userImg">
              <img src={post.uimg ? ("data:image/jpg;base64," + post.uimg) : icon4} alt="" />
            </div>
            <div className="postTextBox">
              <div className="postTitle">
                <h4>{post.title}</h4>

              </div>
              <div className="postDesc" dangerouslySetInnerHTML={{ __html: post.content }}></div>
              <div className="postedBy">Posted by {post.fullname} on {`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</div>
            </div>

          </div>
        </Link>
        {props.type === "Projects" || props.type === "Tutorials"?
          <div className='approveIcons'>
            <div onClick={approvePost}>
              Approve
            </div>
            <div onClick={deletePost}>
              Reject
            </div>
          </div> 
          
          :

          <div className="RepliesNIcon">

            {(loginContext.adminLoggedIn || user.id === post.user_id) && (
              <div className="PanelBtnNProfile toggle">
                <div className="profile" onClick={toggleDropDown}>
                  <p>
                    <i
                      className="fa-solid fa-ellipsis"
                      style={{ color: "var(--clrlight)", marginBottom: "10px" }}
                    ></i>
                  </p>

                </div>
              </div>)}

            {dropDown && (
              <div className="dropdown delete">
                <div className="sub-item" onClick={deletePost}>
                  <i
                    className="fa-solid fa-trash"
                    style={{ color: "var(--clrprimary)" }}
                  ></i>
                  Delete
                </div>

              </div>
            )}

            <div className="repliesDiv">
              <div className="replies">
                <i
                  className="fa-solid fa-eye"
                  style={{ color: "var(--clrlight)", marginRight: "10px" }}
                ></i>
                {post.views} Views
              </div>
              <div className="replies">
                <i
                  className="fa-solid fa-comment-dots"
                  style={{ color: "var(--clrlight)", marginRight: "10px" }}
                ></i>
                {post.replies} Replies
              </div>
            </div>

          </div>}

      </div>
    </>
  );
}

PostIntro.defaultProps = {
  title: "This is the post title",
  userImg: icon4,
  replies: 3,
  postDesc:
    "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Laudantium praesentium nam voluptas sed ipsum illum omnis unde, excepturi iste quaerat iusto cum aut temporibus reprehenderit aliquid repellat rem laboriosam? Unde, mollitia? Fugit repellendus magni voluptatem iusto numquam quae sequi ratione voluptate sint odit. Id aperiam asperiores earum quaerat enim dolorem.",
  postedBy: "User",
  postedOn: "Date"
};

export default PostIntro;
