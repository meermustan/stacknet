import React, { useContext, useState } from 'react'
import "../styling/LoginSignupPopup.css"
import LoginSignupPopupContext from '../contexts/LoginSignupPopupContext'

import validator from "validator"
import axios from 'axios'
import { toast } from 'react-toastify';

function SignupPopup(props) {

    const popupsState = useContext(LoginSignupPopupContext);
    const [fullname, setName] = useState("");
    const [email, setEmail] = useState("")
    const [pwd, setPassword] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [gender, setGender] = useState("Male");
    const [sec_ques, setQuestion] = useState("In what city were you born?");
    const [sec_ans, setAnswer] = useState("");
    const [errors, setErrors] = useState("");

    const onSubmit = async event => {
        event.preventDefault();
        let _errors = "";
        setErrors([]);
        if (!fullname) _errors = { nameError: "*Full name is required" };
        if (!email) _errors = { ..._errors, emailError: "*Email is required" };
        else if (!validator.isEmail(email)) _errors = { ..._errors, emailError: "*Email format is invalid" };
        if (!pwd) _errors = { ..._errors, pwdError: "*Password is required" };
        else if (pwd.length < 8) _errors = { ..._errors, pwdError: "*Password must be atleast 8 characters long" };
        if (!passwordAgain) _errors = { ..._errors, cPwdError: "*Confirm password is required" };
        else if (pwd !== passwordAgain) _errors = { ..._errors, cPwdError: "*Passwords do not match" };
        if (!sec_ans) _errors = { ..._errors, ansError: "*Answer is required" };

        if (_errors) return setErrors(_errors);
        else {
            try {
                await axios.post('http://localhost:5000/register', {

                    fullname,
                    email,
                    pwd,
                    gender,
                    sec_ques,
                    sec_ans,

                });

                toast.success('Account created successfully!', {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "light",
                });
                popupsState.setOpenTheLoginPopup(true);
                popupsState.setOpenTheSignupPopup(false)
            } catch (e) {
                setErrors(e.response.data.error);
            }
        }

    }

    function onQuestionChange() {
        var q = document.getElementById("sec_ques");
        setQuestion(q.options[q.selectedIndex].text);
    }
    function onGenderChange() {
        var g = document.getElementById("gender");
        setGender(g.options[g.selectedIndex].text);
    }


    const reset = () => {
        setName("");
        setEmail("");
        setPassword("");
        setPasswordAgain("");
        setAnswer("");
        setErrors("");
    }

    return (
        popupsState.openTheSignupPopup &&
        <div className='LoginWrapper'>
            <div className='SignupBox'>
                <div className='CloseBtn'>
                    <p className='close' onClick={() => { popupsState.setOpenTheSignupPopup(false); reset() }}>&times;</p>
                </div>
                <h1 className='SignupHeading'>Create an account</h1>
                <form onSubmit={onSubmit} className="formSignup">
                    <div className='leftSide'>
                        <div className="form-element">
                            <label htmlFor="name">Full name</label>
                            <input type="text" id="fullname" placeholder="Full name"
                                value={fullname}
                                onChange={e => setName(e.target.value)} required/>
                            {errors.nameError &&
                                <div className='error'>
                                    {errors.nameError}
                                </div>}
                        </div>
                        <div className="form-element">
                            <label htmlFor="email">Email</label>
                            <input type="email" id="email" placeholder="Email"
                                value={email}
                                onChange={e => setEmail(e.target.value)} required/>
                                {errors.emailError &&
                                <div className='error'>
                                    {errors.emailError}
                                </div>}
                        </div>

                        <div className="form-element">
                            <label htmlFor="password">Password</label>
                            <input type="password" id="pwd" placeholder="Password"
                                value={pwd}
                                onChange={e => setPassword(e.target.value)} required minLength={8}/>
                                {errors.pwdError &&
                                <div className='error'>
                                    {errors.pwdError}
                                </div>}
                        </div>
                        <div className="form-element">
                            <label htmlFor="confirmpassword">Confirm password</label>
                            <input type="password" id="confirmpassword" placeholder="Confirm password"
                                value={passwordAgain}
                                onChange={e => setPasswordAgain(e.target.value)} required minLength={8}/>
                                {errors.cPwdError &&
                                <div className='error'>
                                    {errors.cPwdError}
                                </div>}
                        </div>
                    </div>
                    <div className='rightSide'>
                        <div className='form-element'>
                            <label htmlFor="gender">Gender</label>
                            <select name="gender" id="gender" onChange={onGenderChange}>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>
                        <div className='form-element'>
                            <label htmlFor="securityquestion">Security question</label>
                            <select name="securityquestion" id="sec_ques" onChange={onQuestionChange}>
                                <option value="question1">In what city were you born?</option>
                                <option value="question2">What high school did you attend?</option>
                                <option value="question3">What was your favorite food as a child?</option>
                                <option value="question4">What was the make of your first car?</option>
                            </select>
                        </div>
                        <div className="form-element">
                            <label htmlFor="Answer">Answer</label>
                            <input type="password" id="sec_ans" placeholder="Answer"
                                value={sec_ans}
                                onChange={e => setAnswer(e.target.value)} required/>
                                {errors.ansError &&
                                <div className='error'>
                                    {errors.ansError}
                                </div>}
                        </div>
                        <div className="form-element">
                            <button className='Btn' type='submit'>Register</button>
                        </div>
                        <div className="form-element GoToRegister">
                            <p className='Dont'>Already have an account?</p>
                            <p className='Register' onClick={() => { reset(); popupsState.setOpenTheSignupPopup(false); popupsState.setOpenTheLoginPopup(true) }}>Login</p>
                        </div>
                    </div>


                </form>

            </div>
        </div>
    )
}

export default SignupPopup  