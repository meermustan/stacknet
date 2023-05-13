import React, { useState, useContext, useEffect } from "react";
import "../styling/Navbar.css";
import { Link, NavLink } from "react-router-dom";
import LoginSignupPopupContext from "../contexts/LoginSignupPopupContext";
import icon4 from "../icons/icon4.png";
import IsLoggedInContext from '../contexts/IsLoggedInContext'
import httpClient from '../httpClient';
import { useUser } from "../contexts/UserContext";
import axios from "axios";

export default function Navbar() {
  const [searchBar, setSearchBar] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const popupsState = useContext(LoginSignupPopupContext);
  const loginContext = useContext(IsLoggedInContext);
  const { user, setUser } = useUser();
  const [searches, setSearches] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const isLoggedIn = window.localStorage.getItem("isLoggedIn");
  const [NavbarForLargeDevices,setNavbarForLargeDevices] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const getUser = async () => {
    if (isLoggedIn) {
      try {
        const res = await httpClient.get('//localhost:5000/u/profile/');
        if (res.status === 200) {
          setUser(res.data) && setUser(res.data);
          if (res.data.role === "admin") {
            loginContext.setAdminLoggedIn(true);
          }
        }
        else {
          console.log("Not authenticated, 401")
        }

      } catch (error) {
        console.log(error);
      }
    }
  };

  const search_posts = async () => {
    if (searchInput) {
      try {
        const res = await axios.get(`http://127.0.0.1:5000/search_post?search=${searchInput}`);
        setSearches(res.data);
      } catch (error) {
        // alert(error);
      }
    }
    else {
      setSearches("");
    }
  };

  const handleResize = ()=>{
    if(window.innerWidth > 520){
      setNavbarForLargeDevices(true);
      if(window.innerWidth > 950){
        setOpenMenu(true);
      }
    }
  }

  const handleClickOpenMenu = () =>{
    setOpenMenu(!openMenu)
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      search_posts()
    }, 1000)
    return () => clearTimeout(delayDebounceFn)
  }, [searchInput])


  useEffect(() => {
    getUser();
    initf();
    return () => {
      window.scrollTo(0, 0);
    }
  }, []);


  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize, false);
  }, []);



  const initf = async () => {
    try {
      if (isLoggedIn && isLoggedIn === "true") {
        loginContext.setIsLoggedIn(true);
      }
      else {
        loginContext.setIsLoggedIn(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSearch = () => {
    if (searchBar === true) {
      setSearchBar(false);
      setSearchInput("");
      setSearches("");
    } else {
      setSearchBar(true);
    }
  };

  const toggleDropDown = () => {
    if (dropDown === true) {
      setDropDown(false);
    } else {
      setDropDown(true);
    }
  };

  const logoutUser = async () => {
    await httpClient.post("//localhost:5000/logout");
    window.localStorage.removeItem("isLoggedIn");
    // window.location.href = "/";
    window.location.reload();

  };

  return (
    <>
      <nav>
        <div className="NavbarContainer">
          <div className="Navbar">
            <div className="brandAndLinks">
              <div className="navBranding">
                <div className="navLogo">
                  <i className="faRed fa1 fa fa-thin fa-chevron-up"></i>
                  <i className="fa fa2 fa-thin fa-chevron-up"></i>
                  <i className="faRed fa3 fa fa-thin fa-chevron-up"></i>
                  <Link className="bgNone" to="/">
                    <div className="navTitle">StackNET</div>
                  </Link>
                </div>
              </div>
              <ul className="navLinks" style={openMenu?{transform:'translateY(5%)'}:{transform:'translateY(-100%)'}}>
                <li>
                  <NavLink to="/">
                    Home
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/discussions">
                    Discussions
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/tutorials">
                    Tutorials
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/projects">
                    Projects
                  </NavLink>
                </li>
                <li className="bgNone">
                  <button onClick={toggleSearch} className="searchBtn">
                    <i className="fa-solid fa-magnifying-glass"></i>
                  </button>
                </li>
                {(!NavbarForLargeDevices && !loginContext.IsLoggedIn) && <div className="authBtnOuters">
                <button
                  className="loginBtn"
                  onClick={() => popupsState.setOpenTheLoginPopup(true)}
                >
                  Login
                </button>
                <button
                  className="Btn"
                  onClick={() => popupsState.setOpenTheSignupPopup(true)}
                >
                  Register
                </button>
                </div>}
              </ul>
            </div>
            {loginContext.IsLoggedIn ? (
              <div style={{display:'flex',alignItems:'center'}}>
                <div className="PanelBtnNProfile">
                  <div className="profile" onClick={toggleDropDown}>
                    <img src={user.uimg ? ("data:image/jpg;base64," + user.uimg) : icon4} alt="" />
                    {dropDown && (
                      <div className="dropdown">
                        <Link to="/u/profile">
                          <div className="sub-item">
                            <i
                              className="fa-regular fa-user"
                              style={{ color: "var(--clrdark)", marginLeft: "1px" }}
                            ></i>
                            Profile
                          </div>
                        </Link>
                        {loginContext.adminLoggedIn &&
                          <Link to="/admin">
                            <div className="sub-item">
                              <i
                                className="fa-sharp fa-solid fa-screwdriver-wrench"
                                style={{ color: "var(--clrdark)", marginLeft: "1px" }}
                              ></i>
                              Dashboard
                            </div>
                          </Link>
                        }
                        <div className="sub-item" onClick={logoutUser}>
                          <i className="fa-sharp fa-solid fa-arrow-right-from-bracket"></i>
                          Logout
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hamburger" style={{marginTop: "27px"}} onClick={()=>handleClickOpenMenu()}>
                  <span className="hamburger-stripes"></span>
                  <span className="hamburger-stripes"></span>
                  <span className="hamburger-stripes"></span>
                </div>
              </div>
            ) : (
              <div className="navBtns">
                {NavbarForLargeDevices && <><button
                  className="loginBtn"
                  onClick={() => popupsState.setOpenTheLoginPopup(true)}
                >
                  Login
                </button>
                <button
                  className="Btn"
                  onClick={() => popupsState.setOpenTheSignupPopup(true)}
                >
                  Register
                </button></>}
                <div className="hamburger" onClick={()=>handleClickOpenMenu()}>
                  <span className="hamburger-stripes"></span>
                  <span className="hamburger-stripes"></span>
                  <span className="hamburger-stripes"></span>
                </div>
              </div>
            )}
            
          </div>
        </div>
        {searchBar && (
          <>
            <div className="SearchBar">
              <div className="searchIcon"><i className="fa-solid fa-magnifying-glass"></i></div>
              <input type="search" placeholder="Search" value={searchInput} onChange={e => { setSearchInput(e.target.value) }} />
            </div>
            {searches && (
              <div className="Searches">
                {searches.map((post) => {
                  return (
                    <Link to={`/discussions/d/${post.id}`} key={post.id} onClick={toggleSearch} >
                      {post.title}
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </nav>
    </>
  );
}
