import React, { useState } from 'react'
import FormErrors from './FormErrors';
import axios from 'axios'
import { toast } from 'react-toastify';
import validator from "validator"
import { useUser } from "../contexts/UserContext";

function ChangeEmail(props) {

    const [new_email, setNew_email] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState([]);
    const { user, setUser } = useUser();

    const onSubmit = async event => {
        event.preventDefault();
        let email = user.email
        setErrors([]);
        let _errors = [];
        if (!new_email) _errors.push("Email is required");
        else if (!validator.isEmail(new_email)) _errors.push("Email format is invalid");
        if (!password) _errors.push("Password is required");
        else if (password.length < 8) _errors.push("Password must be atleast 8 characters long");

        if (_errors.length) return setErrors(_errors);

        try {
            await axios.put('http://127.0.0.1:5000/update_email', {

                email,
                new_email,
                password
            });

            setUser({
                ...user,
                email: new_email
            })
            setNew_email("");
            setPassword("");

            toast.success('Email changed successfully!', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "light",
            });

            props.setTrigger(false)
        } catch (e) {
            setErrors([e.response.data.error]);
        }

    }


    return (
        props.trigger &&
        <div className='LoginWrapper'>
            <div className='LoginBox changeEmail'>
                <div className='CloseBtn'>
                    <p className='close' onClick={() => { props.setTrigger(false); setNew_email(""); }}>&times;</p>
                </div>
                {!!errors.length && <FormErrors errors={errors} />}
                <div className="form">
                    <h1>Change email</h1>
                    <div className="form-element">
                        <input type="email" id="newemail" placeholder="New email" onChange={(e) => setNew_email(e.target.value)} />
                    </div>
                    <div className="form-element">
                        <input type="password" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="form-element">
                        <button className='Btn' onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangeEmail