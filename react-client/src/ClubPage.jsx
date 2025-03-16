import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
function ClubPage(){
    const { clubId } = useParams();
    const loggedinUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [memberData, setMemberData] = useState([]);
    const [eventDisplay,setEventDisplay] = useState([]);
    
    const [clubData, setClubData] = useState({
        club_id: '',
        club_name: '',
        owner_id: '',
        members: [],
        description: '',
    });

    const [eventData, setEventData] = useState({
        event_id: '',
        event_name: '',
        description: '',
        event_date: '',
        start_time: '',
        end_time: '',
        location: '',
    });

    const [showEventModal, setShowEventModal] = useState(false);
    const handleCloseEventModal = () => setShowEventModal(false);
    const handleShowEventModal = () => setShowEventModal(true);
    const [eventMessage, setEventMessage] = useState('');


    useEffect(() => {
        const loggedinUser = localStorage.getItem('id');
        if (loggedinUser === clubData.owner_id) {
            setIsOwner(true);
        }
    }, [clubData.owner_id, loggedinUser]);

    //club data
    useEffect(() => {
        const fetchClubs = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched data:", data);
                    // Check if the response contains the expected structure
                    if (data && data.club) {
                        setClubData({
                            club_id: data.club.club_id,
                            club_name: data.club.club_name,
                            owner_id: data.club.owner_id,
                            members: data.club.members,
                            description: data.club.description
                        });
                        const isMember = data.club.members.some((member) => member.user_id.toString() === loggedinUser);
                        setIsMember(isMember);
                    } else {
                        console.error("Unexpected data structure:", data);
                    }
                } else {
                    console.error("HTTP error: ", response.status);
                }
            } catch (e) {
                console.log("An error has occurred: ", e);
            }
        };
        fetchClubs();
    }, [clubId, loggedinUser]);

//join club
    const handleJoin = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/join`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                setIsMember(true);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    };
    
    //member data and check admin
    useEffect(() => {
        const fetchAdmin = async () =>{
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
            if (!token) {
                console.error('Token not found');
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/members`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Member Data:', data); // Debugging
                    setMemberData(data.members);
                    const userIsAdmin = data.members.some(member => member.user_id.toString() === loggedinUser && member.role === 'admin');
                    setIsAdmin(userIsAdmin);
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchAdmin();
    }, [clubId, loggedinUser]);

    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_name: eventData.event_name,
                    description: eventData.description,
                    event_date: eventData.event_date,
                    start_time: eventData.start_time,
                    end_time: eventData.end_time,
                    location: eventData.location,
                    club_id: clubId
                })
            });
            if (response.ok) {
                const data = await response.json();
                setEventData({
                    event_id: '',
                    event_name: '',
                    description: '',
                    event_date: '',
                    start_time: '',
                    end_time: '',
                    location: ''
                })
                console.log("Event created successfully", data);
                handleCloseEventModal();
                alert("Event created successfully");
            } else {
                console.error("HTTP error: ", response.status);
                setEventMessage("Failed to create event"); 
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
            setEventMessage("Failed to create event"); 

        }
    }

    useEffect(() => {
        const fetchEvents = async () =>{
            const token = localStorage.getItem('token'); // Assuming you store the token in localStorage
            if (!token) {
                console.error('Token not found');
                return;
            }
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/events`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Event Data:', data); // Debugging
                    const filterEvents = data.events.filter(event => event.club_id === parseInt(clubId));
                    setEventDisplay(filterEvents);
                } else {
                    console.error('Failed to fetch event data');
                }
            } catch (error) {
                console.error('Error fetching event data:', error);
            }
        };
        fetchEvents();
    }, []);
    
   
    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">{clubData.club_name}</h1>
                {isMember ? (
                  <p> you are a member</p>
                ):(
                  <Button onClick={handleJoin} style={{width:'100px'}} variant="primary">Join!</Button> 
                )}
                <h2>Club Description: {clubData.description}</h2>
            </header>
            <div style={{backgroundColor:"white"}}className='profile-body'>
                {isAdmin || isOwner ? (
                  <>
                  <Button variant="primary">New Post</Button>
                  </>
                ):(
                  <>
                  </>
                )}
                Posts?
            </div>
            <div style={{backgroundColor:"grey", maxHeight: "100vh"}}className='profile-body'>
                <h1>Events</h1>
                {eventDisplay.length > 0 ? (
                    <ul style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none' }}>
                        {eventDisplay.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                        .map((event) => (
                            <li key={event.event_id} style={{ margin: '10px', flex: '0 0 30%', backgroundColor: 'white', padding: '10px', borderRadius: '5px' }}>
                                <h3>{event.event_name}</h3>
                                <p>{event.description}</p>
                                <p>Date: {event.event_date}</p>
                                <p>Time: {event.start_time} - {event.end_time}</p>
                                <p>Location: {event.location}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found</p>
                )}
                {isAdmin || isOwner ? (
                  <>
                  <Button variant="primary" onClick={handleShowEventModal}>New Event</Button>
                  </>
                ):(
                  <>
                  </>
                )}
            </div>
            <div className='profile-body'>
                <p>Members:</p>
                {clubData.members.length > 0 ? (
                  <ul>
                    {clubData.members.map((member) => (
                      <li key={member.user_id}>{member.first_name} {member.last_name}, {member.email}
                        {member.user_id == clubData.owner_id && ( 
                            <>, Club Owner</> )}</li>
                    ))}
                  </ul>
                ) : (
                  <p>No members found</p>
                )}
                {isAdmin || isOwner ? (
                  <>
                  <Button variant="primary" href={`/clubPage/edit/${clubId}`}>Edit</Button>
                  </>
                ):(
                  <>
                  </>
                )}
            </div>
            {/* Event pop out input */}
            <Modal show={showEventModal} onHide={handleCloseEventModal}>
                <Modal.Header>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'lightgrey'}}>
                    <Form onSubmit={handleEventSubmit}>
                        <Form.Group>
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" placeholder="Enter title" required value={eventData.event_name} onChange={(e) => setEventData({...eventData, event_name: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" placeholder="Enter description" required value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Date</Form.Label>
                            <Form.Control type="date" required value={eventData.event_date} onChange={(e) => setEventData({...eventData, event_date: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control type="time" value={eventData.start_time} onChange={(e) => setEventData({...eventData, start_time: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Time</Form.Label>
                            <Form.Control type="time" value={eventData.end_time} onChange={(e) => setEventData({...eventData, end_time: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Location</Form.Label>
                            <Form.Control type="text" placeholder="Enter location" value={eventData.location} onChange={(e) => setEventData({...eventData, location: e.target.value})}/>
                        </Form.Group>
                        <p>{eventMessage}</p>
                        <Button style={{width:'100px', justifyContent:'center', alignItems:'center', display:'flex', margin:'auto', marginTop:'10px'}} variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseEventModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ClubPage