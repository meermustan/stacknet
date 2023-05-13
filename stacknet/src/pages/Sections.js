import React, {useEffect} from 'react'
import { Link } from 'react-router-dom'
import SectionsBox from '../components/SectionsBox'
import "../styling/Sections.css"

function Sections() {
    useEffect(() => {
        document.title = "StackNET"
        return () => {
          window.scrollTo(0, 0);
        }
      }, [])
    return (
        <div className='SectionsBody'>
            <div className='SectionsContainer'>
                <h1>Choose a category</h1>
                <p>Select the category according to the discussions you want to engage into.</p>
                <div className='sections'>
                <Link to="/discussions/announcements"><SectionsBox title="Announcements" icon={<i className="fas fa-bullhorn"></i>}/></Link>
                <Link to="/discussions/general"><SectionsBox title="General Discussions" icon={<i className="far fa-comments"></i>}/></Link>
                <Link to="/discussions/programming"><SectionsBox title="Programming" icon={<i className="fas fa-code"></i>}/></Link>
                <Link to="/discussions/sports"><SectionsBox title="Sports" icon={<i className="fas fa-baseball-bat-ball"></i>}/></Link>
                <Link to="/discussions/finances"><SectionsBox title="Finances" icon={<i className="fas fa-sack-dollar"></i>}/></Link>
                <Link to="/discussions/photography"><SectionsBox title="Photography" icon={<i className="fas fa-camera-retro"></i>}/></Link>
                <Link to='/tutorials'><SectionsBox title="Tutorials" icon={<i className="fa-sharp fas fa-person-chalkboard"></i>}/></Link>
                <Link to='/projects'><SectionsBox title="Projects Showcase" icon={<i className="fas fa-person-digging"></i>}/></Link>
                </div>
            </div>
        </div>
    )
}

export default Sections