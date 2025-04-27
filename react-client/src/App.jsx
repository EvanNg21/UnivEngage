import { BrowserRouter, Route, Routes, useParams, useNavigate, Navigate} from 'react-router-dom';
import './App.css';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/esm/Button';
import Clubs from './Club';
import Events from './Event';
import CreateClub from './CreateClub';
import Signup from './Signup';
import Login from './Login';
import Profile from './Profile';
import Edit from './Edit';
import ClubPage from './ClubPage';
import ClubEdit from './ClubEdit';
import Search from './Search';
import React, { useState, useEffect } from 'react';
function App() {
  const[isLoggedIn, setIsLoggedIn] = useState(false);
  const[userEmail, setUserEmail] = useState('');
  const userId = localStorage.getItem('id');
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
    localStorage.removeItem('id');
    setIsLoggedIn(false);
    setUserEmail('');
  };


  const [searchInput, setSearchInput] = useState('');
  const handleSearch = (event) => {
    event.preventDefault();
    const searchQuery = searchInput.trim();
    console.log("searching",searchInput.toLowerCase());
    if (!searchQuery){
      return;
    }
    window.location.href = `/search/${searchInput}`
  }
  
  
  return (
    <BrowserRouter>
        <Navbar  className="navbar" style={{position:"fixed", top:0, zIndex:100}}>
            <Navbar.Brand className='univengage' href="/home"  >Univengage</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Nav className="ms-auto">
                <Nav.Link style={{color:'black'}}href="/clubs">Explore Clubs</Nav.Link>
                <Nav.Link style={{color:'black'}}href="/events">Attend Events</Nav.Link>
              </Nav>
              <Nav className = "navsignup">
                <form onSubmit={handleSearch}>
                  <input className ="search-bar"type="text" placeholder="Search for Clubs, Events or more" value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
                </form>
                {isLoggedIn ? (
                  <>
                  <Nav.Link style={{color:'black'}} href={`/profile/${userId}`}>{userEmail}</Nav.Link>
                  <Nav.Link style={{color:'black'}} href="/login" onClick={handleLogout}>Logout</Nav.Link>
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
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/clubs" element={<Clubs />} />
          <Route path="/events" element={<Events />} />
          <Route path="/create" element={<CreateClub />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login handleLogin={handleLogin} />} />
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/profile/edit/:userId" element={<Edit />} />
          <Route path="/clubPage/:clubId" element={<ClubPage />} />
          <Route path="/clubPage/edit/:clubId" element={<ClubEdit />} />
          <Route path="/search/:searchInput" element={<Search />} />
      </Routes>
    </BrowserRouter>
 
  );
}



function Home() {
  const[posts, setPosts] = useState([]);
  const[events,setEvents] = useState([]);
  const[clubInfo,setClubInfo] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventInfo, setShowEventInfo] = useState(false);
  const closeEventInfo = () => setShowEventInfo(false);
  const handleShowEventInfo = (event) => {
      setSelectedEvent(event);
      setShowEventInfo(true);
  };

 
const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  

  useEffect(() => {
    const fetchEvents = async () => {
        try{
            const response = await fetch('http://127.0.0.1:3000/api/v1/events', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });
            if (response.ok) {
                const json = await response.json();
                setEvents(json.events);
                console.log("succuess  ", json);
            } else {
                throw response;
            } 
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    }
    fetchEvents();
  },[])

  useEffect(() => {
    const fetchClubData = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                setClubInfo(Array.isArray(data) ? data : [data]); // Ensure clubData is an array
                console.log('Club Data Response:', data);
            } else {
                console.error('Failed to fetch club data');
            }
        } catch (error) {
            console.error('Error fetching club data:', error);
        }
    };
    fetchClubData();
  }, []);

  useEffect(() => {
    const fetchPosts = async () =>{
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/posts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const data = await response.json();
                console.log('Posts Data:', data);
                setPosts(data);
            } else {
                console.error('Failed to fetch post data');
            }
        } catch (error) {
            console.error('Error fetching post data:', error);
        }
    };
    fetchPosts();
  }, []);
  return (
  <div>

    <div className="home-top">
      <h1 className="center fade-in">Welcome to Univengage!</h1>
      <p> 
        Welcome to our website, where you can connect with your university community and find events and clubs that suit your interests.
      </p>
    </div>
    
    <div className="home-body">
      <h2 style={{paddingLeft:"50px"}}>Top Clubs</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', backgroundColor: 'white', justifyContent:"center" }}>
      {Array.isArray(clubInfo) && clubInfo.length > 0 ? (
          clubInfo.sort((a, b) => (b.member_count) - (a.member_count)).slice(0,4).map(club => {
              return (
                <div key={club.club_id} style={{ margin: '10px', flex: '0 0 20%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px', width: "300px" }}>
                  <Nav.Link href={`/clubPage/${club.club_id}`} style={{fontSize: '30px', borderRadius: '5px', backgroundColor: "#1f1e1e", color: "white"}}>{club.club_picture_url && <img src={club.club_picture_url} alt={`${club.club_name} picture`} style={{ width: '80px', height: '80px', borderRadius: '75px', objectFit: 'cover' }} />} {club.club_name} </Nav.Link>
                  <p>Description: {club.description}</p>
                  <p>Members: {club.member_count}</p>
                  <p style={{fontSize: '15px'}}>Created At: {new Date(club.created_at).toLocaleString()}</p>
                  <p style={{fontSize: '15px'}}>Updated At: {new Date(club.updated_at).toLocaleString()}</p>
                </div>
              );
          })
      ) : (
          <p>No events available</p>
      )}
      </div>
      <button style={{ display:"flex", marginLeft:"auto", marginRight:"10px", borderRadius: "5px" }} onClick={() => window.location.href = '/clubs'}>More Clubs</button>
    </div>

    <div className="home-body">
      <h2 style={{paddingLeft:"50px"}}>Latest Events</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', backgroundColor: 'white', justifyContent:"center" }}>
      {Array.isArray(events) && events.length > 0 ? (
          events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0,4).map(event => {
              const club = clubInfo.find((club) => club.club_id === event.club_id);
              return (
              <div key={event.event_id} style={{ margin: '10px', flex: '0 0 20%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px', width: "300px" }}>
                  <button style={{borderRadius:"10px", width:"100%", fontSize: "20px"}} onClick={() => handleShowEventInfo(event)}>{event.event_name}</button>
                  <p>Club: {club ? club.club_name : 'Unknown Club'}</p>
                  <p>Description: {event.description}</p>
                  <p>Created At: {new Date(event.created_at).toLocaleString()}</p>
                  <p>Updated At: {new Date(event.updated_at).toLocaleString()}</p>
              </div>
              );
          })
      ) : (
          <p>No events available</p>
      )}
      </div>
      <button style={{ display:"flex", marginLeft:"auto", marginRight:"10px", borderRadius:"5px" }} onClick={() => window.location.href = '/events'}>More Events</button>
    </div>

    {/* Event info pop out input */}
    <Modal show={showEventInfo} onHide={closeEventInfo}>
        <Modal.Header closeButton>
            <Modal.Title>Event Information</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {selectedEvent && (    
                <>
                    <h3>{selectedEvent.event_name}</h3>
                    <p>
                        Club: {
                            (() => {
                                const club = clubInfo.find((club) => club.club_id === selectedEvent.club_id);
                                return club ? club.club_name : 'Unknown Club';
                            })()
                        }
                    </p>
                    <p>{selectedEvent.description}</p>
                    <p>Date: {new Date(selectedEvent.event_date).toLocaleDateString('en-US', dateOptions)}</p>
                    <p>Time: {new Date(selectedEvent.start_time).toLocaleTimeString('en-US', dateOptions)} - {new Date(selectedEvent.end_time).toLocaleTimeString('en-US', dateOptions)}</p>
                    <p>Location: {selectedEvent.location}</p>
                </>
            )}
        </Modal.Body>
        <Modal.Footer>
            {selectedEvent && (
                <>
                    <Button href={`/clubPage/${selectedEvent.club_id}`}variant="primary" onClick={closeEventInfo}>
                        Visit Club
                    </Button>
                    <Button variant="danger" onClick={closeEventInfo}>
                        Close
                    </Button>
                </>
            )}
        </Modal.Footer>
    </Modal>
  </div>
  );
}

export default App;