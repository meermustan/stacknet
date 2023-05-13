import React, { useState,useContext } from 'react'
import FormErrors from './FormErrors';
import validator from 'validator';
import httpClient from '../httpClient';
import axios from 'axios';
import LoginSignupPopupContext from '../contexts/LoginSignupPopupContext'
import { toast } from 'react-toastify';


function ForgotPassword(props) {

    const popupsState = useContext(LoginSignupPopupContext);

    const [securityQuestion, setsecurityQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState([]);
    const [password, setPassword] = useState("");

    const fetchQuestion = async event => {
        event.preventDefault();
        setErrors([]);
        let _errors = [];
        if (!email) _errors.push("Email is required");
        else if (!validator.isEmail(email)) _errors.push("Email format is invalid");

        if (_errors.length) return setErrors(_errors);

        try {
            const res = await httpClient.get(`//localhost:5000/get_secQues/${email}`);
            setsecurityQuestion(res.data);
        } catch (e) {
            setErrors([e.response.data.error]);
        }

    }


    const changePassword = async event => {
        event.preventDefault();
        setErrors([]);
        let _errors = [];
        if (!answer) _errors.push("Answer is required");
        if (!password) _errors.push("Password is required");
        else if (password.length < 8) _errors.push("Password must be atleast 8 characters long");

        if (_errors.length) return setErrors(_errors);

        try {
            await axios.put('http://localhost:5000/reset_password', {
                email,
                answer,
                password
            });
            setsecurityQuestion("")
            popupsState.setOpenTheLoginPopup(true);
            props.setTrigger(false);
            toast.success(' Password changed successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

        } catch (e) {
            setErrors([e.response.data.error]);
        }


    }

    return (
        props.trigger && <div className='LoginWrapper'>
            <div className='LoginBox ForgotPassBox'>
                <div className='CloseBtn'>
                    <p className='close' onClick={() => { props.setTrigger(false); setErrors([]); setsecurityQuestion("") }}>&times;</p>
                </div>
                {!!errors.length && <FormErrors errors={errors} />}
                <div className="form">
                    <h1>Reset password</h1>
                    <div className="form-element">
                        <label htmlFor="forgotpassemail">Email</label>
                        <input type="email" id="forgotpassemail" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    {!securityQuestion && <div className="form-element">
                        <button className='Btn' onClick={fetchQuestion}>Fetch security question</button>
                    </div>}
                    {securityQuestion && <>
                        <div className="form-element">
                            <label htmlFor="securityquestion" >Security question</label>
                            <input type="text" id="securityquestion" placeholder={securityQuestion} disabled={true} />
                        </div>
                        <div className="form-element">
                            <label htmlFor="forgotpassanswer">Answer</label>
                            <input type="password" id="forgotpassanswer" placeholder="Answer" onChange={(e) => setAnswer(e.target.value)} />
                        </div>
                        <div className="form-element">
                            <label htmlFor="newpassword">New password</label>
                            <input type="password" id="newpassword" placeholder="New password" onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <div className="form-element">
                            <button className='Btn' onClick={changePassword}>Submit</button>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    )
}

export default ForgotPassword