import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";
import PostBox from "../components/PostBox";
import "../styling/Post.css";
import LoginSignupPopupContext from "../contexts/LoginSignupPopupContext";
import IsLoggedInContext from "../contexts/IsLoggedInContext";
import icon4 from '../icons/icon4.png'
import { useParams } from "react-router-dom";
import TextEditor from "../components/TextEditor"
import axios from "axios";
import { useUser } from "../contexts/UserContext";

function Post(props) {
  const popupsState = useContext(LoginSignupPopupContext);
  const loginContext = useContext(IsLoggedInContext);
  const [enableEditor, setEnableEditor] = useState(false);
  const [post, setPost] = useState("");
  const [comments, setComments] = useState("");
  const config = { buttons: ["bold", "italic", "underline"] }
  const {user} = useUser();
  const param_id = useParams();
  
  
  const fetchPost = async () => {
    const res = await axios.get(`http://127.0.0.1:5000/post/${param_id.id}`);
    setPost(res.data[0]);
    setComments(res.data[1]);
    document.title = "StackNET - " + res.data[0].title
  };

  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchPost();
  }, [param_id.id]);


  return (
    <>
      <div className="post_Title">
        <div className="sectionName">
          <i
            className="fa-regular fa-comments"
            style={{ color: "rgb(113, 143, 151)", marginRight: "5px" }}
          ></i>
          <Link to={`/discussions/${post.categ}`}>
          {post.categ}
          </Link>
        </div>
        {post.title && (
          <h1>{post.title}</h1>
        )}
      </div>
      <div className="postBody">
        <div className="postContainer">
          <div className="PostsAndSide">
            <div className="posts">
              <PostBox  desc={post.content} authorName={post.fullname} postedOn={post.date} uimg={post.uimg} />
              {/* title={post.title} */}
              {!loginContext.IsLoggedIn ? (
                <div className="notloggedinbox">
                  <div>
                    <i
                      className="fa-regular fa-comments"
                      style={{ marginRight: "5px" }}
                    ></i>
                    Contribute to this discussion?{" "}
                    <button
                      className="btnBlue"
                      onClick={() => popupsState.setOpenTheLoginPopup(true)}
                    >
                      <i
                        className="fa-sharp fa-solid fa-arrow-right-to-bracket"
                        style={{
                          color: "var(--bgdark)",
                          marginRight: "5px",
                          paddingTop: "2px",
                        }}
                      ></i>
                      Sign in
                    </button>
                    or
                    <button
                      className="btnBlue"
                      onClick={() => popupsState.setOpenTheSignupPopup(true)}
                    >
                      <i
                        className="fas fa-user-plus Button-icon"
                        style={{
                          color: "var(--bgdark)",
                          marginRight: "5px",
                          paddingTop: "2px",
                        }}
                      ></i>
                      Create an account
                    </button>
                  </div>
                </div>
              ) :
                <div className="replytopostdiv postBoxContainer" onClick={() => { setEnableEditor(true) }}>
                  <div className="postUserImg">
                    <img src={user.uimg ? ("data:image/jpg;base64," + user.uimg) : icon4} alt="" />
                  </div>
                  {/* <i className="fas fa-user"></i> */}
                  <div className="WriteComment">Write a comment...</div>
                </div>
              }
              {comments && comments.map((comment) => {
                return (
                  <PostBox key={comment.id} desc={comment.content} authorName={comment.fullname} postedOn={comment.date} uimg={comment.uimg}/>
                );
              })}

            </div>
            <div className="sideOptions">
              <button className="postReply" onClick={() => { loginContext.IsLoggedIn ? setEnableEditor(true) : popupsState.setOpenTheLoginPopup(true) }}>
                <i
                  className="fa-solid fa-reply"
                  style={{
                    color: "white",
                    marginRight: "5px",
                    paddingTop: "2px",
                  }}
                ></i>
                {loginContext.IsLoggedIn ? "Reply" : "Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="commentBox">
      <TextEditor title={post.title} post={post} config={config} trigger={enableEditor} setTrigger={setEnableEditor} type="comment" />
      </div>
    </>
  );
}

export default Post;
