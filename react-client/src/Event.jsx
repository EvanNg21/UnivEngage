import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

function Event(){

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
                    setClubData(Array.isArray(data) ? data : [data]); // Ensure clubData is an array
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
        
    return(
    <div className = 'base-page'>
        <div className='club-container'> 
            <h1 className="clubfade">Events </h1>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', backgroundColor: 'white', justifyContent:"center" }}>
        {events.length > 0 ? (
                events.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(event => {
                    const club = clubInfo.find((club) => club.club_id === event.club_id);
                    return(
                    <div key={event.event_id} style={{ margin: '10px', flex: '0 0 23%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px' }}>
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

export default Event