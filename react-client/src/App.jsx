import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clubs from './Club';
import Events from './Event';
import CreateClub from './CreateClub';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import React, { useState, useEffect } from 'react';
function App() {
  const[isLoggedIn, setIsLoggedIn] = useState(false);
  const[userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('email');
    if (token && savedEmail) {
      setIsLoggedIn(true);
      setUserEmail(savedEmail);
    }
  }, []);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email')
    setIsLoggedIn(false);
    setUserEmail('');
  };
  
  return (
    <BrowserRouter>
        <Navbar  className="navbar">
            <Navbar.Brand className='univengage' href="/home"  >Univengage</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Nav className="ms-auto">
                <Nav.Link style={{color:'black'}}href="/">News</Nav.Link>
                <Nav.Link style={{color:'black'}}href="/clubs">Find Orginizations</Nav.Link>
                <Nav.Link style={{color:'black'}}href="/events">Attend Events</Nav.Link>
                <Nav.Link style={{color:'black'}}href="/">Forms</Nav.Link>
                <Nav.Link style={{color:'black'}}href="/">Campus Resources</Nav.Link>
              </Nav>
              <Nav className = "navsignup">
                <input className ="search-bar"type="text" placeholder="Search for CLubs, Events or more"/>
                {isLoggedIn ? (
                  <>
                  <Nav.Link style={{color:'black'}} href="/profile">{userEmail}</Nav.Link>
                  <Nav.Link style={{color:'black'}} onClick={handleLogout}>Logout</Nav.Link>
                  </>
                ):(
                  <>
                  <Nav.Link style={{color:'black'}} href="/signup"  >Sign Up</Nav.Link>
                  <Nav.Link style={{color:'black'}}href="/login" >Login</Nav.Link>
                  </>
                )}
              </Nav>
        </Navbar>
      <Routes>
          {/* Redirect from / to /home */}
          <Route path="/" element={<Navigate to="/home" />} />
          {/* Define route for /home */}
          <Route path="/home" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create" element={<CreateClub />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
    </BrowserRouter>
 
  );
}



function Home() {
  return (
  <div>

    <div className="home-top">
      <h1 className="center fade-in">Welcome to Univengage!</h1>
    </div>

    <div className = "home-button">
        <button style={{width:'100px'}}>Previous</button>
        <button style={{width:'100px'}}>Next</button>
    </div>

    <div className="home-body">
      <h2>This is a new section with a different color!</h2>
      <p>You can add more content here.</p>
    </div>

  </div>
  );
}

export default App;