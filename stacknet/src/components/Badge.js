import React from 'react'

function Badge(props) {
    return (
        <div className="badge">
            <i
                className="fa-solid fa-check"
                style={{ marginRight: "5px" }}
            ></i>
            {props.badgeName}
        </div>
    )
}

export default Badge