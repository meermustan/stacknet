import React from "react";
import PostIntro from "../components/PostIntro";
import { useState, useEffect, useContext } from "react";
import Spinner from "../components/Spinner";
import "../styling/Template.css";
import SideLinksBox from "../components/SideLinksBox";
import LoginSignupPopupContext from "../contexts/LoginSignupPopupContext";
import IsLoggedInContext from "../contexts/IsLoggedInContext";
import TextEditor from "./TextEditor";
import axios from 'axios';

export default function Template(props) {

  const [currentSort, setCurrentSort] = useState("Top");

  const [isVisible, setIsVisible] = useState(true);
  const [enableEditor, setEnableEditor] = useState(false);
  const popupsState = useContext(LoginSignupPopupContext);
  const loginContext = useContext(IsLoggedInContext);
  const [loading, setLoading] = useState(false);
  const [allPosts, setAllPosts] = useState([]);
  const [sideLinks, setSideLinks] = useState([]);
  const [changes, setChanges] = useState(0);
  const config = {buttons: ["bold", "italic", "underline"]}
  let sectionName = props.sectionName
  if(sectionName == "Projects Showcase") sectionName = "projects"
  
  const addClass = (name) => {
    
    window.scrollTo(0, 0);
    document.getElementById("Top").classList.remove("currentSort");
    document.getElementById("Latest").classList.remove("currentSort");
    document.getElementById("Oldest").classList.remove("currentSort");
    document.getElementById("Popular").classList.remove("currentSort");
    if (name === "Top") {
      document.getElementById("Top").classList.add("currentSort");
    } else if (name === "Latest") {
      document.getElementById("Latest").classList.add("currentSort");
    } else if (name === "Oldest") {
      document.getElementById("Oldest").classList.add("currentSort");
    } else if (name === "Popular") {
      document.getElementById("Popular").classList.add("currentSort");
    }
  };
  let intro;
  if (props.sectionName === "Tutorials") {
    intro =
      "Explaining something is not always easy, tutorials are very useful for this. Are you good at it? Then teach our community new things!";
  } else if (props.sectionName === "Projects Showcase") {
    intro =
      "Would you like to share the progress of your project? Create a showcase and collect feedback, but above all: share your project activity!";
  } else if (props.sectionName === "Announcements") {
    intro =
      "StackNET management did some announcements, hear what they have to say for the community!";
  } else {
    intro =
      "Do you have a question that you can't solve yourself? Engage our community to find help with this. Be as clear as possible!";
  }


  const listenToScroll = () => {
    let heightToHideFrom = 180;
    const winScroll = document.body.scrollTop ||
      document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      isVisible && setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };


  const getAllPosts = async (sort) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://127.0.0.1:5000/discussions/${sectionName}?sort=${sort}`);
      setAllPosts(res.data);
    } catch (error) {
      // alert(error);
    }
    setLoading(false);
  };

  const getSideLinks = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/get_sideLinks");
      setSideLinks(res.data)
    } catch (error) {
      // alert(error);
    }
  };

  useEffect(() => {
    getAllPosts(currentSort);
    getSideLinks();
    document.title = "StackNET - " + props.sectionName;
    window.addEventListener("scroll", listenToScroll);
  }, [currentSort, changes]);


  return (
    <div className="DiscussionBody">
      <div className="DiscussionContainer">
        <div className="DiscussionHeading">{props.sectionName}</div>
        <div className="intro">{intro}</div>
        <div className="menuBar">
          <div className="sortBarAndRefresh">
            <div className="SortBarContainer">
              <button
                id="Top"
                onClick={() => {
                  addClass("Top");
                  setCurrentSort("Top");
                }}
                className="sortBtn currentSort"
              >
                Top
              </button>
              <button
                id="Latest"
                onClick={() => {
                  addClass("Latest");
                  setCurrentSort("Latest");
                }}
                className="sortBtn"
              >
                Latest
              </button>
              <button
                id="Oldest"
                onClick={() => {
                  addClass("Oldest");
                  setCurrentSort("Oldest");
                }}
                className="sortBtn"
              >
                Oldest
              </button>
              <button
                id="Popular"
                onClick={() => {
                  addClass("Popular");
                  setCurrentSort("Popular");
                }}
                className="sortBtn"
              >
                Popular
              </button>
            </div>
            {isVisible
              && <div id="hide" className="refreshBtn" title="Refresh feed" onClick={()=>getAllPosts(currentSort)}><i className="fas fa-arrows-rotate"></i></div>}
          </div>
          <button
            className="StartDiscussionBtn"
            onClick={loginContext.IsLoggedIn ? ()=>{setEnableEditor(true)} : ()=>{ popupsState.setOpenTheLoginPopup(true)}}
          >
            <i
              className="fa-regular fa-edit"
              style={{ color: "white", marginRight: "5px" }}
            ></i>
            {props.buttonTitle}
          </button>
        </div>
          <div className="PostsAndSideLinks">
            {loading ? (
          <Spinner />
        ) : (<div className="postsBox">
              <ul className="postsList">
              {/* allPosts */}
                {[1,2,3,].map((post) => {
                  return (
                    <li key={post.id}>
                        <PostIntro post={post} changes={changes} setChanges={setChanges}/>
                    </li>
                  );
                })}
                {/* <li>
                  <PostIntro postImg="https://i.imgur.com/EPpT0zL.png" />
                </li>
                <li>
                  <PostIntro postImg="https://i.imgur.com/EPpT0zL.png" />
                </li> */}
              </ul>
              <button className="loadMore">
                <i
                  className="fa-solid fa-chevron-down"
                  style={{ color: "var(--clrdark)", marginRight: "8px" }}
                ></i>
                Load more
              </button>
            </div>
              )}

            <div className="SideLinkContainer">
              <SideLinksBox title="Top Discussions" data={sideLinks[1]} type="replies"/>
              <SideLinksBox title="Popular Discussions" data={sideLinks[0]} type="views"/>
            </div>
          </div>
        <TextEditor trigger={enableEditor} setTrigger={setEnableEditor} changes={changes} setChanges={setChanges} config={config} type="post"/>
      </div>
    </div>
  );
}
