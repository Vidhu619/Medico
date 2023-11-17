// Import necessary dependencies
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setuserfromlocal } from "../../store/authslice";

// Autologin component responsible for automatically logging in the user if there are saved credentials
function Autologin(props) {
  // Get the dispatch function from the Redux store
  const dispatch = useDispatch();

  // Use the useEffect hook to dispatch the setuserfromlocal action when the component mounts
  useEffect(() => {
    dispatch(setuserfromlocal());
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Render the child components
  return props.children;
}

// Export the Autologin component
export default Autologin;
