import React from 'react'
import '../styling/ContactUs.css'

function ContactUs(props) {
    return (
        props.trigger &&         
        <div className='LoginWrapper'>
            <div className='ContactUsBox'>
                <div className='CloseBtn'>
                    <p className='close' onClick={()=>props.setTrigger(false)}>&times;</p>
                </div>
                <div className="form">
                    <h2 className='contactUs'>Contact Us</h2>
                    <p>If you have any queries, write to us ~ info.stacknet@gmail.com</p>
                    <div className="form-element">
                        <label htmlFor="name">Name</label>
                        <input type="text" id="name" placeholder="Name" />
                    </div>
                    <div className="form-element">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" placeholder="Email" />
                    </div>
                    <div className="form-element">
                        <label htmlFor="textarea">Messgae</label>
                        <textarea id="textarea" placeholder='Your message' name="textarea" rows="4" cols="50"/>
                    </div>
                    <div className="form-element">
                        <button className='Btn'>Send</button>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ContactUs