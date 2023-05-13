import React from 'react'
import spinner from '../icons/spinner.gif'
import "../styling/Spinner.css";

function Spinner() {
  return (
    <div className='Spinner'>
        <img src={spinner} alt=""/>
    </div>
  )
}

export default Spinner