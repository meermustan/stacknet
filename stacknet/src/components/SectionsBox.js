import React from 'react'
import '../styling/SectionsBox.css'

function SectionsBox(props) {
  return (
    <div className='sectionBox'>
      <div className='sectionBoxImg'>
        {props.icon}
        <div className='viewMore'><p>View More</p></div>
      </div>
      <div className='sectionBoxHeading'>
        <h2>{props.title}</h2>
      </div>
    </div>
  )
}

export default SectionsBox