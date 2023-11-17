import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import Navbar from './components/Navbar';
import checkAuth from './components/auth/checkAuth';
import backgroundImage from './4855148.jpg'; // Rename the image variable

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());

  const user = useSelector(state => state.auth.user); // Get user data from Redux store

  const updateCurrentTime = () => {
    setCurrentTime(new Date());
  };

  useEffect(() => {
    const timer = setInterval(updateCurrentTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const appStyles = {
    fontFamily: 'Arial, sans-serif',
    textAlign: 'center',
    background: `url(${backgroundImage}) no-repeat center center fixed`,
    backgroundSize: 'cover',
    height: '100vh', // Set the height to fill the screen
  };

  const headingStyles = {
    fontSize: '60px',
    color: '#007FFF',
    marginTop: '-20px',
    marginRight:'-150px'
    
  };

  const timeStyles = {
    fontSize: '24px',
    margin: '10px',
    color: '#007FFF',
    textAlign: 'right', // Align the text to the right
  };

  const emailStyles = {
    fontSize: '24px',
    color: '#007FFF',
    margin: '10px',
    textAlign: 'right',
   // Align the text to the right
  };

  return (
    
    <div style={appStyles}>
      <Navbar/>
      <p style={timeStyles}>Time: {currentTime.toLocaleTimeString()}</p>
      {user && <p style={emailStyles}>Welcome: {user.email}</p>}
      <h1 style={headingStyles}>
      MEDICO.
      </h1>
      
    </div>
    
  );
}

export default checkAuth(App);
