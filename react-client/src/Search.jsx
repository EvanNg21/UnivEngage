import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link, useParams } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
function Search() {
    const {searchInput} = useParams();

    const [events, setFilteredEvents] = useState([]);
    const [clubInfo, setFilteredClubs] = useState([]);
    const [posts, setFilteredPosts] = useState([]);

    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventInfo, setShowEventInfo] = useState(false);
    const closeEventInfo = () => setShowEventInfo(false);
    const handleShowEventInfo = (event) => {
        setSelectedEvent(event);
        setShowEventInfo(true);
    };

    const [selectedPost, setSelectedPost] = useState(null);
    const [showPostInfo, setShowPostInfo] = useState(false);
    const closePostInfo = () => {
        setShowPostInfo(false);
        setPreviewPostImage(null);
    } 
    const handleShowPostInfo = (post) => {
        setSelectedPost(post);
        setShowPostInfo(true);
    };

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all data in parallel
                const [eventsRes, clubsRes, postsRes] = await Promise.all([
                    fetch('http://127.0.0.1:3000/api/v1/events'),
                    fetch('http://127.0.0.1:3000/api/v1/clubs'),
                    fetch('http://127.0.0.1:3000/api/v1/posts')
                ]);

                const [eventsData, clubsData, postsData] = await Promise.all([
                    eventsRes.json(),
                    clubsRes.json(),
                    postsRes.json()
                ]);

                // Filter data
                setFilteredEvents(
                    eventsData.events?.filter(event => 
                        event.event_name.toLowerCase().includes(searchInput.toLowerCase())
                    ) || []
                );

                setFilteredClubs(
                    clubsData.filter(club => 
                        club.club_name.toLowerCase().includes(searchInput.toLowerCase())
                    ) || []
                );

                setFilteredPosts(
                    postsData.filter(post => 
                        post.content.toLowerCase().includes(searchInput.toLowerCase())
                    ) || []
                );

            } catch (e) {
                console.log("An error occurred:", e);
            }
        };
        fetchAllData();
    }, [searchInput]);

    useEffect(() => {
        console.log("events",events);
        console.log("clubs",clubInfo);
        console.log("posts",posts);
    }, [events, clubInfo, posts]);
    return (
    <div className = 'base-page'>
        <div className='club-container'> 
            <h1 className="clubfade">Searchs for "{searchInput}" </h1>
        </div>

        <div style={{backgroundColor:"white", padding:"10px"}}>
            <h1>Clubs</h1>
            {clubInfo.length > 0 ? (
                clubInfo.map(club => (
                    <div key={club.club_id} style={{ margin: '10px', flex: '0 0 20%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px', width: "95%" }}>
                        <Nav.Link href={`/clubPage/${club.club_id}`} style={{fontSize: '30px'}}>{club.club_picture_url && <img src={club.club_picture_url} alt={`${club.club_name} picture`} style={{ width: '80px', height: '80px', borderRadius: '75px', objectFit: 'cover' }} />} {club.club_name} </Nav.Link>
                        <p>Description: {club.description}</p>
                        <p style={{fontSize: '15px'}}>Created At: {new Date(club.created_at).toLocaleString()}</p>
                        <p style={{fontSize: '15px'}}>Updated At: {new Date(club.updated_at).toLocaleString()}</p>
                    </div>
                ))
            ) : (
                <p>No clubs found</p>
            )}
        </div>

        <div style={{backgroundColor: "white", padding:"10px"}}>
            <h1>Events</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', backgroundColor: 'white', justifyContent:"left" }}>
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
        </div>

        

        <div style={{backgroundColor:"white", padding:"10px"}}>
            <h1>Posts</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', backgroundColor: 'white', justifyContent:"left" }}>
                {posts.length > 0 ? (
                <ul style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', width: "100%"}}>
                    {posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .map((posts) => (
                        <li key={posts.post_id} style={{ margin: '10px', flex: '0 0 23%',  padding: '10px', borderRadius: '5px', backgroundColor:"lightgrey"}}>
                            <button style={{borderRadius:"10px", width:"100%"}} onClick={() => handleShowPostInfo(posts)} >
                                <h3>{posts.post_name}</h3>
                                {posts.post_image && <img src={posts.post_image} alt={`${posts.post_name} picture`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                            </button>
                            <p>{posts.content}</p>
                            <p>{new Date(posts.created_at).toLocaleDateString('en-US', dateOptions)}</p>
                        </li>
                    ))}
                </ul>
                ) : (
                    <p>No posts found</p>
                )}
            </div>
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

        {/* Post info pop out input */}
        <Modal show={showPostInfo} onHide={closePostInfo}>
            <Modal.Header closeButton>
                <Modal.Title>Post Information</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {selectedPost && (
                    <>
                        <h3>{selectedPost.post_name}</h3>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            {selectedPost.post_image && <img src={selectedPost.post_image} alt={`${selectedPost.post_name} picture`} style={{ width: '60%', height: '60%', objectFit: 'cover' }} />}
                        </div>
                        <p>{selectedPost.content}</p>
                        <p>{new Date(selectedPost.created_at).toLocaleDateString('en-US', dateOptions)}</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={closePostInfo}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    </div>
    )
}

export default Search