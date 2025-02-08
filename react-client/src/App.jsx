import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import Clubs from './Club';
import Events from './Event';
import CreateClub from './CreateClub';
import Signup from './Signup';
import Login from './Login';
function App() {
  
  return (
  <BrowserRouter>
      <Navbar  className="navbar">
        <Container className='nav'>
          <Navbar.Brand href="/home" style={{ fontSize: '30px', color: 'black' }} >Univengage</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              <Nav.Link href="/link">Link</Nav.Link>
              <Nav.Link href="/clubs">Clubs</Nav.Link>
              <Nav.Link href="/events">Events</Nav.Link>
              <Nav.Link href="/signup">Sign Up</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
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
        <Route path="/login" element={<Login />} />
      </Routes>
  </BrowserRouter>

  );
}


function Home() {
  return (

    <div className="home-container">
    <h1 className="center fade-in">Welcome to Univengage!</h1>
    <div className="search-container">
      {/* Search Bar */}
      <div className="search-bar">
        <input type="text" placeholder="Search for CLubs, Events or more"
        /* onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSearch(e.target.value);
          }
        }}*/
        />
      </div>
    </div>
  </div>
      

  );
}

export default App;