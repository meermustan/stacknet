import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styling/Profile.css";
import icon4 from "../icons/icon4.png";
import PostIntro from '../components/PostIntro'
import Badge from "../components/Badge";
import ChangeEmail from "../components/ChangeEmail";
import ChangePassword from "../components/ChangePassword";
import httpClient from "../httpClient";
import { useUser } from "../contexts/UserContext";


function Profile() {

  const [changeEmail, setChangeEmail] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const { user, setUser } = useUser();
  const [userPosts, setUserPosts] = useState("");
  const [changes, setChanges] = useState(0);


  const uploadPicture = async (id, image) => {

    try {
      const formData = new FormData();
      formData.append('file-input', image);
      const res = await httpClient.post(`//localhost:5000/upload_pic/${id}`, formData);
      console.log(res.data);

    } catch (error) {
      console.log(error);
    }

  };

  const getPosts = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_posts?id=${user.id}`);
      setUserPosts(res.data);
    } catch (error) {
      // alert(error);
    }
  };

  const updateBio = async () => {

    let id = user.id
    let bio = user.bio
    try {
      const res = await httpClient.put(`//localhost:5000/updateBio`, { id, bio });
      console.log(res.data);

    } catch (error) {
      console.log(error);
    }

  };


  useEffect(() => {
    getPosts()
    document.title = "StackNET - Profile"
    return () => {
      window.scrollTo(0, 0);
    }
  }, [changes]);


  function handleChange(e) {
    uploadPicture(user.id, e.target.files[0]);
    window.location.reload(false);

  }

  return (
    <div className="ProfileBody">
      <div className="ProfileContainer">
        <div className="ProfileBox">
          <div className="Avatar">
            <input
              type="file"
              name="file-input"
              id="file-input"
              accept=".jpeg, .png, .jpg"
              className="file-input__input"
              onChange={handleChange} />
            <div className="file-input">
              <label className="file-input__label" htmlFor="file-input">
                <div className="image">
                  <div className="asd">
                    <i className="fa-solid fa-pencil " style={{ color: "white" }}></i>
                  </div>
                  <div className="userImg" style={{ backgroundImage: `url(${user.uimg ? ("data:image/jpg;base64," + user.uimg) : icon4})` }}></div>
                </div>
              </label>
            </div>
          </div>
          <div className="ProfileBoxContent">
            <h1>{user.fullname && user.fullname}</h1>
            <div className="info">
              <span>
                <i className="fa-solid fa-envelope" style={{ color: "white" }}></i>{" "}
                {user.email && user.email}
              </span>
              <span>
                <i
                  className="fa-solid fa-person-half-dress"
                  style={{ color: "white" }}
                ></i>{" "}
                {user.gender && user.gender}
              </span>
              <span>
                <i
                  className="fa-solid fa-clipboard-check"
                  style={{ color: "white", marginRight: "3px" }}
                ></i>
                {user.date_joined && user.date_joined.slice(0, 10)}
              </span>
            </div>
            <div className="Badges">
              <Badge badgeName="New member" />
              <Badge badgeName="View a discussion" />
              <Badge badgeName="First comment" />
            </div>
            <textarea
              className="bio"
              placeholder="Write something about yourself ..."
              maxLength="250"
              onChange={(e) => setUser({ ...user, bio: e.target.value })}
              onBlur={updateBio}
              value={user.bio}
            />
          </div>
        </div>

        <div className="profileOptions">
          <div className="content">
            <input type="radio" name="slider" id="home" />
            <input type="radio" name="slider" id="blog" />
            <div className="list">
              <label htmlFor="home" className="home">
                <i className="far fa-comment"></i>
                <span className="title">Posts ({user.total_posts})</span>
              </label>
              <label htmlFor="blog" className="blog">
                <i className="fas fa-sliders"></i>
                <span className="title">Settings</span>
              </label>
            </div>
            <div className="text-content">
              <div className="home text">
                <ul className="postsList">
                  {userPosts && userPosts.map((post) => {
                    return (
                      <li key={post.id}>
                        <PostIntro post={post} changes={changes} setChanges={setChanges} />
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="blog text">
                <div className="profileSettings">
                  <h2>Account</h2>
                  <div className="settingsBtns">
                    <button className="settingBtn loginBtn" onClick={() => { setChangeEmail(true) }}>Change email</button>
                    <button className="settingBtn loginBtn" onClick={() => { setChangePassword(true) }}>Change password</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ChangeEmail trigger={changeEmail} setTrigger={setChangeEmail} />
      <ChangePassword trigger={changePassword} setTrigger={setChangePassword} />
    </div>
  );
};

export default Profile;
