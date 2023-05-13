import React, { useState } from "react";
import LoginSignupPopupContext from "./LoginSignupPopupContext";

const LoginSignupPopupState = (props) => {

  const [openTheLoginPopup, setOpenTheLoginPopup] = useState(false);
  const [openTheSignupPopup, setOpenTheSignupPopup] = useState(false);

  return (
    <LoginSignupPopupContext.Provider value={{openTheLoginPopup,setOpenTheLoginPopup,openTheSignupPopup,setOpenTheSignupPopup}}>
      {props.children}
    </LoginSignupPopupContext.Provider>
  );
};

export default LoginSignupPopupState;
