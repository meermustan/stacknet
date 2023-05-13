import React from "react";
import icon4 from "../icons/icon4.png";
import "../styling/PostBox.css";

function PostBox(props) {

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let date = new Date(props.postedOn)

  return (
    <div className="postBoxContainer">
      <div className="postUserImg">
        <img src={props.uimg ? ("data:image/jpg;base64," + props.uimg) : icon4} alt="" />
      </div>
      <div className="postBoxContent">
        {props.title && <div className="Title"><h2>{props.title}</h2>
        </div>}
        <div className="nameAndDate">
          <div className="postedByName">{props.authorName}</div>
          <div className="postedDate"><i className="far fa-clock"></i>{`${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`}</div>
        </div>
        <div className="postBoxDesc" dangerouslySetInnerHTML={{ __html: props.desc }}></div>
        {/* <div className="likes"><i className="far fa-thumbs-up"></i>  (5) People liked this</div> */}
      </div>
    </div>
  );
}
PostBox.defaultProps = {
  desc: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. Vero a, cupiditate harum molestiae laboriosam illum laudantium voluptate, error quisquam sint id quia ullam quidem iusto! Ipsum laudantium aliquam.",
  authorName: "Jasper",
  postedOn: "20 Dec, 2022"
};
export default PostBox;
