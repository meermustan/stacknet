import React from "react";
import { Link } from "react-router-dom";
import "../styling/SideLinksBox.css";

function SideLinksBox(props) {

  const data = props.data;

  return (
    <div className="SideLinksBox">
      <h4 className="BoxTitle">
        <i
          className="fa-solid fa-star"
          style={{ color: "#3f3e3e", marginRight: "12px" }}
        ></i>
        {props.title}
      </h4>
      {data && data.map((post) => {
        return (
          <div key={post.id} className="SideLink">
            <Link className="SideLink" to={`/discussions/d/${post.id}`}>
            <p className="sideLinkTitle">{post.title}</p>
            <p className="TitleReplies">
              {props.type === "views" ? post.views : post.replies}
              <i
                className={`${props.type === "views" ? "fa-regular fa-eye" : "fa-regular fa-comment-dots"}`}
                style={{ color: "var(--clrlight)", marginLeft: "8px", fontSize: "13px" }}
              ></i>
            </p>
            </Link>
          </div>
        );
      })}

    </div>
  );
}

export default SideLinksBox;
