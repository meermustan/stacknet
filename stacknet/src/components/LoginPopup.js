import React, { useContext, useState } from 'react'
import "../styling/LoginSignupPopup.css"
import LoginSignupPopupContext from '../contexts/LoginSignupPopupContext'
import ForgotPassword from './ForgotPassword';
import IsLoggedInContext from "../contexts/IsLoggedInContext"
import validator from "validator"
// import axios from 'axios'
import httpClient from '../httpClient';


function LoginPopup(props) {

    const popupsState = useContext(LoginSignupPopupContext);
    const [forgotPassPopup, setForgotPassPopup] = useState(false);
    const loginContext = useContext(IsLoggedInContext);

    const [email, setEmail] = useState("")
    const [pwd, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const [isDisabled, setDisabled] = useState(false);

    const onSubmit = async event => {
        event.preventDefault();
        setDisabled(true);
        setErrors([]);
        let _errors = "";
        if (!email) _errors = {emailError: "*Email is required" };
        else if (!validator.isEmail(email)) _errors = {emailError: "*Email format is invalid" };
        if (!pwd) _errors = { ..._errors, pwdError: "*Password is required" };
        else if (pwd.length < 8) _errors = { ..._errors, pwdError: "*Password must be atleast 8 characters long" };

        if (_errors) {
            setDisabled(false);
            return setErrors(_errors);
        }

        else {
            try {
                await httpClient.post("//localhost:5000/login", {
                    email,
                    pwd,
                });

                window.location.reload();
                window.localStorage.setItem("isLoggedIn", true);
                loginContext.setIsLoggedIn(true);
                popupsState.setOpenTheLoginPopup(false)


            } catch (e) {
                setErrors(e.response.data.error);
                setDisabled(false);
            }
        }
    };


    const reset = () => {
        setEmail("");
        setPassword("");
        setErrors([]);
    }



    return (
        <>
            {popupsState.openTheLoginPopup &&
                <div className='LoginWrapper'>
                    <div className='LoginBox'>
                        <div className='CloseBtn'>
                            <p className='close' onClick={() => { popupsState.setOpenTheLoginPopup(false); reset() }}>&times;</p>
                        </div>
                        <form onSubmit={onSubmit} className="form" >
                            <h1>Welcome Back</h1>
                            <div className="form-element">
                                <label htmlFor="email">Email</label>
                                <input type="email" id="email" placeholder="Email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)} required />
                                {errors.emailError &&
                                    <div className='error'>
                                        {errors.emailError}
                                    </div>}
                            </div>
                            <div className="form-element">
                                <label htmlFor="password">Password</label>
                                <input type="password" id="pwd" placeholder="Password"
                                    value={pwd}
                                    onChange={e => setPassword(e.target.value)} required minLength={8} />
                                {errors.pwdError &&
                                    <div className='error'>
                                        {errors.pwdError}
                                    </div>}
                            </div>
                            <div className="form-element forgot">
                                <span onClick={() => { reset(); setForgotPassPopup(true); popupsState.setOpenTheLoginPopup(false) }}>Forgot password?</span>
                            </div>
                            <div className="form-element">
                                <button className='Btn' type='submit'>Sign in</button>
                                {/* onClick={()=>{loginContext.setIsLoggedIn(true); popupsState.setOpenTheLoginPopup(false)}} */}
                            </div>
                            <div className="form-element GoToRegister">
                                <p className='Dont'>Don't have an account?</p>
                                <p className='Register' onClick={() => { reset(); popupsState.setOpenTheLoginPopup(false); popupsState.setOpenTheSignupPopup(true) }}>Register</p>
                            </div>
                        </form>
                    </div>
                </div>}
            <ForgotPassword trigger={forgotPassPopup} setTrigger={setForgotPassPopup} />
        </>
    )
}

export default LoginPopup