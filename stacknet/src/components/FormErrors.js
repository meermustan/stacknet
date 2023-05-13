import React from 'react'
import '../styling/LoginSignupPopup.css'

function FormErrors({ errors }) {

    return (
        <div className='formErrors'>
            {
                errors.length > 1 ? (
                    <ul>
                        {errors.map((error, index) => {
                            return (
                                <li key={index}>{error}</li>)
                        })}
                    </ul>
                ) : (
                    <ul>
                        <li>{errors[0]}</li>
                    </ul>
                )
            }
        </div>
    )
}

export default FormErrors