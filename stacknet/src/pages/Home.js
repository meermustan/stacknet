import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "../styling/Home.css";
import anime1 from "../icons/anime1.gif";
import icon1 from "../icons/icon1.png";
import icon2 from "../icons/icon2.png";
import icon3 from "../icons/icon3.png";
import icon4 from "../icons/icon4.png";
import axios from "axios";

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';



const responsive = {
  tablet: {
    breakpoint: { max: 1024, min: 660 },
    items: 2
  },
  mobile: {
    breakpoint: { max: 660, min: 0 },
    items: 1
  }
};

export default function Home() {
  const [posts, setPosts] = useState("");
  const [showCarousel, setShowCarousel] = useState(true);
  const [isDesktopView, setIsDesktopView] = useState(false);
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];


  const getPosts = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/get_posts`);
      setPosts(res.data);
    } catch (error) {
      // alert(error);
    }
  };
  useEffect(() => {
    getPosts()
    document.title = "StackNET"
    return () => {
      window.scrollTo(0, 0);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktopView(window.innerWidth >= 768);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const items = [
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Item 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
    },
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Item 2',
      description: 'Nulla facilisi. Curabitur nec diam ut dolor lobortis finibus.'
    },
    {
      image: 'https://via.placeholder.com/300x200',
      title: 'Item 3',
      description: 'Maecenas sed urna ut velit suscipit consequat.'
    }
  ];



  const toggleCarousel = () => {
    setShowCarousel(!showCarousel);
  };

  return (
    <>
      <div className="HomeBody">
        <div className="HomeContainer">
          <div className="WelcomeContainer ">
            <div className="WelcomeTextAndImgOuter">
              <div className="WelcomeTextBox">
                <h1>👋 Welcome to StackNET</h1>
                <p>
                  We are a Pakistan based community built for students and academic practicioners. A young community full of ideas, creativity and effort. StackNET offers its members the opportunity to ask their queries, write tutorials or keep showcases about their projects for other members.
                </p>
                <p>
                  We highly encourage the use of Roman Urdu language for the ease of fellow Pakistanis.
                </p>
              </div>
              <div className="WelcomeImageBox">
                <img className="WelcomeImg" src={anime1} alt="" />
              </div>
            </div>
            <div className="WelcomeOptionSection">
                <div className="Options">
                  <div className="Option">
                    <Link to="/projects" >
                      <div className="OptContent">
                        <div className="OptionImg">
                          <img src={icon1} alt="" />
                        </div>
                        <div className="OptionTextBox">
                          <div className="OptionTitle">
                            <h4>Projects showcase</h4>
                          </div>
                          <div className="OptionDesc">Inspire and iterate.</div>
                          <div className="OptionBtn">View all projects</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                  <div className="Option">
                    <Link to="/tutorials" >
                      <div className="OptContent">
                        <div className="OptionImg">
                          <img src={icon2} alt="" />
                        </div>
                        <div className="OptionTextBox">
                          <div className="OptionTitle">
                            <h4>Tutorials</h4>
                          </div>
                          <div className="OptionDesc">
                            Learn how to do things the right way.
                          </div>
                          <div className="OptionBtn">View tutorials</div>
                        </div>
                      </div>
                    </Link>
                  </div>
                </div>
                <div className={isDesktopView? "Option3": "Option"}>
                  <Link to="/discussions" className="OptContent">
                    <div className="OptionImg">
                      <img src={icon3} alt="" />
                    </div>
                    <div className="OptionTextBox">
                      <div className="OptionTitle">
                        <h4>Questions &amp; Answers</h4>
                      </div>
                      <div className="OptionDesc">
                        Do you have a question related to anything?
                      </div>
                      <div className="OptionBtn">View discussions</div>
                    </div>
                  </Link>
                </div>
            </div>
          </div>

          {/* WELCOME AND OPTIONS SECTION END */}
        </div>

        <div className="PopularProjects">
          <h1>Popular Projects</h1>
          <div className="ProjectsSection">
            {isDesktopView? 
              <>
              <div className="ProjectIntro">
                <div
                  className="projectIntroImg"
                  style={{
                    backgroundImage: `url("https://s3.eu-central-1.amazonaws.com/uploads.devnl.nl/2021-03-16/1615890151-755285-screenshot-2021-03-16-at-112220.png")`,
                  }}
                ></div>
                <div className="postContent">
                  <div className="projectUserImg">
                    <img src={icon4} alt="" />
                  </div>
                  <div className="postTextBox">
                    <div className="projectIntroTitle">
                      <h4>Business analytics ML engineers</h4>
                    </div>
                    <div className="projectIntroPostedBy">
                      Posted by zeeshan on 15 Dec, 2022
                    </div>
                  </div>
                </div>
              </div>

              <div className="ProjectIntro">
                <div
                  className="projectIntroImg"
                  style={{
                    backgroundImage: `url("https://i.imgur.com/EPpT0zL.png")`,
                  }}
                ></div>
                <div className="postContent">
                  <div className="projectUserImg">
                    <img src={icon4} alt="" />
                  </div>
                  <div className="postTextBox">
                    <div className="projectIntroTitle">
                      <h4>Geofencing in java</h4>
                    </div>
                    <div className="projectIntroPostedBy">
                      Posted by Abdul rehman on 15 Dec, 2022
                    </div>
                  </div>
                </div>
              </div>

              <div className="ProjectIntro">
                <div
                  className="projectIntroImg"
                  style={{
                    backgroundImage: `url("https://i.imgur.com/7dneGw8.jpg")`,
                  }}
                ></div>
                <div className="postContent">
                  <div className="projectUserImg">
                    <img src={icon4} alt="" />
                  </div>
                  <div className="postTextBox">
                    <div className="projectIntroTitle">
                      <h4>Image Gallery Website in ReactJS</h4>
                    </div>
                    <div className="projectIntroPostedBy">
                      Posted by shoaib on 15 Dec, 2022
                    </div>
                  </div>
                </div>
              </div>
              </>

              :

              <div style={{position:"relative",width: "100%", height: '100%'}}>
                <Carousel 
                autoPlaySpeed={3000}
                infinite={true}
                minimumTouchDrag={80}
                pauseOnHover={true}
                renderDotsOutside={false}
                showDots={false}
                slidesToSlide={1}
                swipeable
                // centerMode
                responsive={responsive}>
               
                <div className="ProjectIntro">
                  <div
                    className="projectIntroImg"
                    style={{
                      backgroundImage: `url("https://s3.eu-central-1.amazonaws.com/uploads.devnl.nl/2021-03-16/1615890151-755285-screenshot-2021-03-16-at-112220.png")`,
                    }}
                  ></div>
                  <div className="postContent">
                    <div className="projectUserImg">
                      <img src={icon4} alt="" />
                    </div>
                    <div className="postTextBox">
                      <div className="projectIntroTitle">
                        <h4>Business analytics ML engineers</h4>
                      </div>
                      <div className="projectIntroPostedBy">
                        Posted by zeeshan on 15 Dec, 2022
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ProjectIntro">
                  <div
                    className="projectIntroImg"
                    style={{
                      backgroundImage: `url("https://i.imgur.com/EPpT0zL.png")`,
                    }}
                  ></div>
                  <div className="postContent">
                    <div className="projectUserImg">
                      <img src={icon4} alt="" />
                    </div>
                    <div className="postTextBox">
                      <div className="projectIntroTitle">
                        <h4>Geofencing in java</h4>
                      </div>
                      <div className="projectIntroPostedBy">
                        Posted by Abdul rehman on 15 Dec, 2022
                      </div>
                    </div>
                  </div>
                </div>

                <div className="ProjectIntro">
                  <div
                    className="projectIntroImg"
                    style={{
                      backgroundImage: `url("https://i.imgur.com/7dneGw8.jpg")`,
                    }}
                  ></div>
                  <div className="postContent">
                    <div className="projectUserImg">
                      <img src={icon4} alt="" />
                    </div>
                    <div className="postTextBox">
                      <div className="projectIntroTitle">
                        <h4>Image Gallery Website in ReactJS</h4>
                      </div>
                      <div className="projectIntroPostedBy">
                        Posted by shoaib on 15 Dec, 2022
                      </div>
                    </div>
                  </div>
                </div>
                
              </Carousel>
            </div>
          }
          </div>
                
          <Link to="/projects" className="seeAllDisc">
            <button className="Btn ">
              <i
                className="fas fa-project-diagram"
                style={{ color: "white" }}
              ></i>
              <span className="HomeBtn">More Projects</span>
            </button>
          </Link>
        </div>

        <div className="RecentDiscussions">
          <h1>Recent Discussions</h1>
          <div className="DiscussionSection">
          {/* posts && posts */}
            {[1,2,3,4,5].map((post) => {
              const date = new Date(post.date)
              return (
                  <Link to={`/discussions/d/${post.id}`} key={post.id}>
                      <div className="GOption" key={post.id}>
                        <div className="OptContent">
                          <div className="OptionImg">
                            <img src={post.uimg ? ("data:image/jpg;base64," + post.uimg) : icon4} alt="" />
                          </div>
                          <div className="OptionTextBox">
                            <div className="OptionTitle">
                              <h4>{post.title}</h4>
                            </div>
                            <div className="OptionDesc">
                            Posted by {post.fullname} on {`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}
                            </div>
                            <div className="btnNReply">
                              <div className="GOptionBtn">
                                Discussions &gt;&gt; {post.categ}
                              </div>
                              <div className="Replies"> <pre>{post.replies} replies</pre> {post.views} views</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
              );
            })}

          </div>

          <Link to="/discussions" className="seeAllDisc">
            <button to="/discussions" className="Btn">
              <i
                className="fa-regular fa-comments"
                style={{ color: "white" }}
              ></i>
              <span className="HomeBtn">See all discussions</span>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
