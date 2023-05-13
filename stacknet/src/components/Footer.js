import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import "../styling/Footer.css"
import ContactUs from './ContactUs';

function Footer() {

    const [contactUsPopup, setContactUsPopup] = useState(false);

    return (
        <div className='Footer'>
            <div className='FooterContainer'>
                <div className='FooterText'>
                    <h2 className='AboutStackNET'>StackNET</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Suscipit illo nobis, quisquam repellat et sed,
                        quibusdam porro voluptas optio dicta facilis voluptates fugit similique eum placeat delectus architecto
                        numquam nostrum?</p>
                </div>
                <div className='FooterLinksOuter'>
                    <div className='FooterLinks'>
                        <Link to='/'><h5>Home</h5></Link>
                        <Link to='/discussions'><h5>Discussions</h5></Link>
                        <Link to='/projects'><h5>Projects Showcase</h5></Link>
                        <Link to='/tutorials'><h5>Tutorials</h5></Link>
                    </div>
                    <div className='FooterLinks'>
                        <h5>About</h5>
                        <Link to='/privacypolicy'><h5>Privary Policy</h5></Link>
                        <h5 onClick={() => setContactUsPopup(true)}>Contact us</h5>
                    </div>
                </div>

            </div>
            <div className="copyright">
                <p>© 2022 - 2023 StackNET</p>
            </div>
            <ContactUs trigger={contactUsPopup} setTrigger={setContactUsPopup} />
        </div>
    )
}

export default Footer