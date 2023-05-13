import React, { useState } from "react";
import IsLoggedInContext from "./IsLoggedInContext"

const IsLoggedInState = (props) => {

  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);

  return (
    <IsLoggedInContext.Provider value={{ IsLoggedIn, setIsLoggedIn, adminLoggedIn, setAdminLoggedIn }}>
      {props.children}
    </IsLoggedInContext.Provider>
  );
};

export default IsLoggedInState;
