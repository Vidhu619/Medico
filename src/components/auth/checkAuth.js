import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// This is a higher-order component (HOC) that checks if the user is authenticated before rendering the wrapped component.
export const checkAuth = (Component) => {
  // Wrapper component that checks the user's authentication status
  function Wrapper(props) {
    // Get the user data from the Redux store
    const user = useSelector((store) => store.auth.user);

    // Get the navigation function from React Router
    const navigate = useNavigate();

    useEffect(() => {
      // Check if the user is not authenticated
      if (!user) {
        // If not authenticated, navigate to the home page
        navigate('/');
      }
    }, [user, navigate]);

    // Render the wrapped component with its props
    return <Component {...props} />;
  }

  // Return the wrapper component
  return Wrapper;
};

// Export the checkAuth HOC
export default checkAuth;
