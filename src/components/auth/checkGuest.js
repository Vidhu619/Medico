// Import necessary dependencies
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// This higher-order function checks if a user is a guest and redirects accordingly
export const checkGuest = (Component) => {
  // Create a wrapper component
  function Wrapper(props) {
    // Get the user from the Redux store
    var user = useSelector((store) => store.auth.user);

    // Get the navigation function for routing
    var navigate = useNavigate();

    // Use the useEffect hook to check if the user is not a guest and redirect accordingly
    useEffect(() => {
      if (user) {
        navigate('/');
      }
    }, [user]);

    // Render the wrapped component and pass its props
    return <Component {...props} />;
  }

  // Return the wrapper component
  return Wrapper;
}

// Export the checkGuest higher-order function
export default checkGuest;
