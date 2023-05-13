import React, { useState } from 'react'
import FormErrors from './FormErrors';
import axios from 'axios'
import { toast } from 'react-toastify';
import { useUser } from "../contexts/UserContext";

function ChangePassword(props) {

    const [password, setPassword] = useState("");
    const [new_password, setNew_password] = useState("");
    const [passwordAgain, setPasswordAgain] = useState("");
    const [errors, setErrors] = useState([]);
    const { user } = useUser();

    const onSubmit = async event => {
        event.preventDefault();
        let email = user.email
        setErrors([]);
        let _errors = [];
        if (!password) _errors.push("Password is required");
        if (!new_password) _errors.push("New password is required");
        if (!passwordAgain) _errors.push("Confirm password  is required");
        else if (password.length < 8 || passwordAgain.length < 8 || new_password.length < 8) _errors.push("Password must be atleast 8 characters long");
        if (password === new_password) _errors.push("New password cannot be your current password")
        else if (new_password !== passwordAgain) _errors.push("New passwords do not match");

        if (_errors.length) return setErrors(_errors);

        try {
            await axios.put('http://127.0.0.1:5000/update_password', {

                email,
                password,
                new_password
            });

            reset();

            toast.success('Password changed successfully!', {
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

    const reset = () => {
        setPassword("");
        setPasswordAgain("");
        setNew_password("");
        setErrors([]);
    }

    return (
        props.trigger &&
        <div className='LoginWrapper'>
            <div className='LoginBox changeEmail'>
                <div className='CloseBtn'>
                    <p className='close' onClick={() => {props.setTrigger(false); reset();}}>&times;</p>
                </div>
                {!!errors.length && <FormErrors errors={errors} />}
                <div className="form">
                    <h1>Change password</h1>
                    <div className="form-element">
                        <input type="password" id="currentpassword" placeholder="Current password" onChange={(e)=> setPassword(e.target.value)}/>
                    </div>
                    <div className="form-element">
                        <input type="password" id="newpassword" placeholder="New password" onChange={(e)=> setNew_password(e.target.value)}/>
                    </div>
                    <div className="form-element">
                        <input type="password" id="confirmnewpassword" placeholder="Confirm new password" onChange={(e)=> setPasswordAgain(e.target.value)}/>
                    </div>
                    <div className="form-element">
                        <button className='Btn' onClick={onSubmit}>Update</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePassword