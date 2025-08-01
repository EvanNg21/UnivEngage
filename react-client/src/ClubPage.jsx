import React, { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Dropdown from 'react-bootstrap/Dropdown';
function ClubPage(){
    const { clubId } = useParams();
    const loggedinUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [memberData, setMemberData] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [likedData, setLikedData] = useState([]);
    const [liked,  setLiked] = useState(false);
    const [isAttending, setIsAttending] = useState(false);
    
    const [clubData, setClubData] = useState([]);

    const [eventData, setEventData] = useState([]);

    const [postData, setPostData] = useState([]);

    const dateOptions = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' };

    const [eventDisplay,setEventDisplay] = useState([]);
    const [showEventModal, setShowEventModal] = useState(false);
    const handleCloseEventModal = () => setShowEventModal(false);
    const handleShowEventModal = () => setShowEventModal(true);
    const [eventMessage, setEventMessage] = useState('');

    const [postDisplay,setPostDisplay] = useState([]);
    const [showPostModal, setShowPostModal] = useState(false);
    const handleClosePostModal = () => {
        setShowPostModal(false);
        setPreviewPostImage(null);
    };
    const handleShowPostModal = () => setShowPostModal(true);
    const [postMessage, setPostMessage] = useState('');

    const [selectedEvent, setSelectedEvent] = useState(null);
    const [showEventInfo, setShowEventInfo] = useState(false);
    const closeEventInfo = () => {
        setShowEventInfo(false);
        setEditMode(false);
    };
    const handleShowEventInfo = (event) => {
        setSelectedEvent(event);
        setShowEventInfo(true);
    };

    const [isEditMode, setEditMode] = useState(false);
    const handleEditClick = () => {
        setEditMode(true);
    };

    const [selectedPost, setSelectedPost] = useState(null);
    const [showPostInfo, setShowPostInfo] = useState(false);
    const closePostInfo = () => {
        setShowPostInfo(false);
        setEditPostMode(false);
        setPreviewPostImage(null);
    } 
    const handleShowPostInfo = (post) => {
        setSelectedPost(post);
        setShowPostInfo(true);
    };

    const [isEditPostMode, setEditPostMode] = useState(false);
    const handleEditPostClick = () => {
        setEditPostMode(true);
    };

    useEffect(() => {
        const loggedinUser = localStorage.getItem('id');
        if (loggedinUser === clubData.owner_id) {
            setIsOwner(true);
        }
    }, [clubData.owner_id, loggedinUser]);

    
    const [previewImage, setPreviewImage] = useState('');
    
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);


    const [postImage, setPostImage] = useState(null);
    const [previewPostImage, setPreviewPostImage] = useState('');
    const filePostInputRef = useRef(null);
    
    const handlePostFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setPostImage(file);
            setPreviewPostImage(URL.createObjectURL(file));
        }
    };

    //club data____________________________________________________________________________________________
    useEffect(() => {
        const fetchClubData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const club = Array.isArray(data) ? 
                        data.find(u => u.club_id === parseInt(clubId)) : 
                        data;
                    if (club){
                        setClubData(data);
                        console.log('Club Data Response:', clubData);
                        if (club.club_picture_url) {
                            setPreviewImage(club.club_picture_url);
                        }
                    }
                    const isMember = data.members.some((member) => member.user_id.toString() === loggedinUser);
                    setIsMember(isMember);
                } else {
                    console.error('Failed to fetch club data');
                }
            } catch (error) {
                console.error('Error fetching club data:', error);
            }
        };
        fetchClubData();
    }, [clubId, token]);
    
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
//leave club
    const handleLeave = async () => {
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/leave`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                setIsMember(false);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    }

    //get users attending event________________________________________________________________________________________________
    useEffect(() => {
        if (selectedEvent){
            const getAttendance = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:3000/api/v1/events/${selectedEvent.event_id}/attending`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("Attendance Data", data);
                        setAttendanceData(data.attending);
                        setIsAttending(data.attending.some(user => user.user_id.toString() === loggedinUser));
                    } else {
                        console.error("HTTP error: ", response.status);
                    }
                } catch (e) {
                    console.log("An error has occurred: ", e);
                }
            };
            getAttendance();
        }
    }, [selectedEvent, loggedinUser]);

    //attend event
    const attendEvent = async () => {
        if (!selectedEvent) return;
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/events/${selectedEvent.event_id}/attend`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Event attended successfully", data);
                setIsAttending(true);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    };

    //unattend event
    const unattendEvent = async () => {
        if (!selectedEvent) return;
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/events/${selectedEvent.event_id}/unattend`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Event unattended successfully", data);
                setIsAttending(false);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    };
    
    //member data and check admin_________________________________________________________________________________________
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

    //create event____________________________________________________________________________________________
    const handleEventSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/events`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event_id: eventData.event_id,
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
    //get event data
    useEffect(() => {
        const fetchEvents = async () =>{
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

    //create post____________________________________________________________________________________________
    const handlePostSubmit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('post[post_name]', postData.post_name);
        formData.append('post[content]', postData.content);
        formData.append('post[views_count]', postData.views_count);
        formData.append('post[likes_count]', postData.likes_count);
        formData.append('post[comments_count]', postData.comments_count);
        formData.append('post[user_id]', loggedinUser);
        formData.append('post[club_id]', clubId);
    
        // Append the image file if you have one
        if (postImage) {
            formData.append('post[post_image]', postImage);
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/posts`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token if needed
                },
                body: formData,
            });
    
            if (response.ok) {
                const data = await response.json();
                setPostData({
                    post_id: '',
                    post_name: '',
                    content: '',
                    user_id: '',
                    club_id: '',
                    views_count: '',
                    likes_count: '',
                    comments_count: '',
                    image: null, // Reset image
                });
                console.log("Post created successfully", data);
                handleClosePostModal();
                alert("Post created successfully");
            } else {
                console.error("HTTP error: ", response.status);
                setPostMessage("Failed to create Post");
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
            setPostMessage("Failed to create Post");
        }
    };

    //get post data
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
                    const filterPosts = data.filter(post => post.club_id === parseInt(clubId));
                    setPostDisplay(filterPosts);
                    console.log('Filtered posts:', postDisplay);
                } else {
                    console.error('Failed to fetch post data');
                }
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };
        fetchPosts();
    }, []);

    //save edit for events____________________________________________________________________________________________
    const handleSaveEdit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/events/${selectedEvent.event_id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    event: {
                        event_name: selectedEvent.event_name,
                        description: selectedEvent.description,
                        event_date: selectedEvent.event_date,
                        start_time: selectedEvent.start_time,
                        end_time: selectedEvent.end_time,
                        location: selectedEvent.location,
                        club_id: selectedEvent.club_id
                    }
                })
            });
            if (response.ok) {
                const updatedEvent = await response.json();
                console.log("Event updated successfully", updatedEvent);
                alert("Event updated successfully");
                setEventDisplay((prevEvents) => prevEvents.map(event => event.event_id === updatedEvent.event_id ? updatedEvent : event));
                setEditMode(false);
                closeEventInfo();
            } else {
                console.error("HTTP error: ", response.status);
                alert("Failed to update event");
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
            alert("error updating event");
        }
    };

    const handleSavePostEdit = async (e) => {
        e.preventDefault();
    
        const formData = new FormData();
        formData.append('post[post_name]', selectedPost.post_name);
        formData.append('post[content]', selectedPost.content);
    
        // Append the image file if you have one
        if (postImage) {
            formData.append('post[post_image]', postImage);
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/posts/${selectedPost.post_id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`, // Include token if needed
                },
                body: formData,
            });
    
            if (response.ok) {
                const updatedPost = await response.json();
                console.log("Post updated successfully", updatedPost);
                alert("Post updated successfully");
                setPostDisplay((prevPosts) => prevPosts.map(post => post.post_id === updatedPost.post_id ? updatedPost : post));
                setEditPostMode(false);
                closePostInfo();
            } else {
                console.error("HTTP error: ", response.status);
                alert("Failed to update post");
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
            alert("error updating post");
        }
    };
    //Post Pages and Sort____________________________________________________________________________________________________________

    const [postCriteria, setPostCriteria] = useState('Date Created Descending');
    const sortPosts = (postCriteria) => {
        setPostCriteria(postCriteria);
    }
    const sortedPosts = [...postDisplay].sort((a, b) => {
        if (postCriteria === 'Date Created Descending') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (postCriteria === 'Date Created Ascending') {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (postCriteria === 'Date Updated Ascending') {
            return new Date(a.updated_at) - new Date(b.updated_at);
        } else if (postCriteria === 'Date Updated Descending') {
            return new Date(b.updated_at) - new Date(a.updated_at);
        }
    })
    const [currentPostPage, setCurrentPost] = useState(1);
    const postsPerPage = 4;
    const startPostIndex = (currentPostPage - 1) * postsPerPage;
    const endPostIndex = startPostIndex + postsPerPage;
    const currentPosts = sortedPosts.slice(startPostIndex, endPostIndex);

    const handleNextPosts = () => {
        if (currentPostPage < Math.ceil(postDisplay.length / postsPerPage)) {
            setCurrentPost(prevPage => prevPage + 1);
        }
    }

    const handlePreviousPosts = () => {
        if (currentPostPage > 1) {
            setCurrentPost(prevPage => prevPage - 1);
        }
    }

    //Events Pages and Sort____________________________________________________________________________________________________________

    const [eventCriteria, setEventCriteria] = useState('Date Created Descending');
    const sortEvents = (eventCriteria) => {
        setEventCriteria(eventCriteria);
    }
    const sortedEvents = [...eventDisplay].sort((a, b) => {
        if (eventCriteria === 'Date Created Descending') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (eventCriteria === 'Date Created Ascending') {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (eventCriteria === 'Date Updated Ascending') {
            return new Date(a.updated_at) - new Date(b.updated_at);
        } else if (eventCriteria === 'Date Updated Descending') {
            return new Date(b.updated_at) - new Date(a.updated_at);
        }
    })
    const [currentEventPage, setCurrentEvent] = useState(1);
    const eventsPerPage = 3;
    const startEventIndex = (currentEventPage - 1) * eventsPerPage;
    const endEventIndex = startEventIndex + eventsPerPage;
    const currentEvents = sortedEvents.slice(startEventIndex, endEventIndex);

    const handleNextEvents = () => {
        if (currentEventPage < Math.ceil(eventDisplay.length / eventsPerPage)) {
            setCurrentEvent(prevPage => prevPage + 1);
        }
    }

    const handlePreviousEvents = () => {
        if (currentEventPage > 1) {
            setCurrentEvent(prevPage => prevPage - 1);
        }
    }

    //likes_________________________________________________
    useEffect(() => {
        if (selectedPost) {
            const getLikedData = async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:3000/api/v1/posts/${selectedPost.post_id}/likes`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                    });
                    if (response.ok) {
                        const data = await response.json();
                        console.log("liked Data", data);
                        setLikedData(data.liked);
                        // Check if the logged-in user has liked the post
                        setLiked(data.liked.some(user => user.user_id.toString() === loggedinUser));
                    } else {
                        console.error("HTTP error: ", response.status);
                    }
                } catch (e) {
                    console.log("An error has occurred: ", e);
                }
            };
            getLikedData();
        }
    }, [selectedPost, loggedinUser]);

    const handleLike = async () => {
        if (!selectedPost) return;
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/posts/${selectedPost.post_id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Post Liked successfully", data);
                setLiked(true);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    };

    const handleUnlike = async () => {
        if (!selectedPost) return;
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/posts/${selectedPost.post_id}/unlike`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ user_id: loggedinUser })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("Post Unliked successfully", data);
                setLiked(false);
            } else {
                console.error("HTTP error: ", response.status);
            }
        } catch (e) {
            console.log("An error has occurred: ", e);
        }
    };
    

    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">{clubData.club_name} <img src={previewImage || ""}  style={{width: '150px',height: '150px',borderRadius: '75px',objectFit: 'cover' }}/></h1>
                {isOwner?(
                    <>
                    <p>you are the owner</p>
                    </>
                ) : (
                    <>
                        {isMember ? (
                            <>
                                <p> you are a member <Button onClick={handleLeave}>Leave</Button></p>
                            </>
                        ):(
                        <>
                        {loggedinUser? ( 
                            <Button onClick={handleJoin} style={{width:'100px'}} variant="primary">Join!</Button>
                            ):(
                            <Button href='/login'style={{width:'300px'}} variant="primary">You need to log in to join a club</Button>)}
                        </> 
                        )}
                    </>
                )}
                <h2>Club Description: {clubData.description}</h2>
            </header>
            <div style={{backgroundColor:"lightgrey"}}className='profile-body'>
                <h1>Posts {isAdmin || isOwner ? (
                  <>
                  <Button variant="primary" onClick={handleShowPostModal}>New Post</Button>
                  </>
                ):(
                  <>
                  </>
                )}</h1>
                <Dropdown style={{padding:"10px"}}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item style={{backgroundColor: 'lightgrey'}} onClick ={() => sortPosts('Date Created Ascending')}>Date Created Ascending</Dropdown.Item>
                        <Dropdown.Item style={{backgroundColor: 'lightgrey'}}onClick ={() => sortPosts('Date Created Descending')}>Date Created Descending</Dropdown.Item>
                        <Dropdown.Item onClick ={() => sortPosts('Date Updated Ascending')}>Date Updated Ascending</Dropdown.Item>
                        <Dropdown.Item onClick ={() => sortPosts('Date Updated Descending')}>Date Updated Descending</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {postDisplay.length > 0 ? (
                    <ul style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none', width: "100%"}}>
                        {currentPosts.map(post => (
                            <li key={post.post_id} style={{ margin: '10px', flex: '0 0 20%', backgroundColor: 'white', padding: '10px', borderRadius: '5px'}}>
                                <button style={{borderRadius:"10px", width:"100%"}} onClick={() => handleShowPostInfo(post)}>
                                    <h3>{post.post_name}</h3>
                                    {post.post_image && <img src={post.post_image} alt={`${post.post_name} picture`} style={{ width: '100px', height: '100px', objectFit: 'cover' }} />}
                                </button>
                                <p>{post.content}</p>
                                <p style={{fontSize:"15px"}}>{new Date(post.created_at).toLocaleDateString('en-US', dateOptions)}</p>
                                <p style={{fontSize:"15px"}}>❤: {post.likes_count}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No posts found</p>
                )}
                <div  style={{justifyContent: 'center', alignItems: 'center', display:"flex", margin:"auto" }}>
                    <Button style={{backgroundColor:"black", borderColor:"black", width: "100px"}} onClick={handlePreviousPosts} disabled={currentPostPage === 1}>Previous</Button>
                    <p style={{margin:"10px"}}>Page {currentPostPage} of {Math.ceil(postDisplay.length / postsPerPage)}</p>
                    <Button style={{backgroundColor:"black", borderColor:"black", width:"100px"}} onClick={handleNextPosts} disabled={currentPostPage >= Math.ceil(postDisplay.length / postsPerPage)}>Next</Button>
                </div>
            </div>
            <div style={{backgroundColor:"grey", maxHeight: "100vh"}}className='profile-body'>
                <h1>Events {isAdmin || isOwner ? (
                  <>
                  <Button variant="primary" onClick={handleShowEventModal}>New Event</Button>
                  </>
                ):(
                  <>
                  </>
                )}</h1>
                <Dropdown style={{padding:"10px"}}>
                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                        Sort by
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item style={{backgroundColor: 'lightgrey'}} onClick ={() => sortEvents('Date Created Ascending')}>Date Created Ascending</Dropdown.Item>
                        <Dropdown.Item style={{backgroundColor: 'lightgrey'}}onClick ={() => sortEvents('Date Created Descending')}>Date Created Descending</Dropdown.Item>
                        <Dropdown.Item onClick ={() => sortEvents('Date Updated Ascending')}>Date Updated Ascending</Dropdown.Item>
                        <Dropdown.Item onClick ={() => sortEvents('Date Updated Descending')}>Date Updated Descending</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                {eventDisplay.length > 0 ? (
                    <ul style={{ display: 'flex', flexWrap: 'wrap',  listStyleType: 'none' }}>
                        {currentEvents.map(event => (
                            <li key={event.event_id} style={{ margin: '10px', flex: '0 0 29%', backgroundColor: 'white', padding: '10px', borderRadius: '5px', minWidth: '300px' }}>
                                <button style={{borderRadius:"10px", width:"100%"}} onClick={() => handleShowEventInfo(event)}>
                                    <h3>{event.event_name}</h3>
                                </button>
                                <p>{event.description}</p>
                                <p>Date: {new Date(event.event_date).toLocaleDateString('en-US', dateOptions)}</p>
                                <p>Time: {new Date(event.start_time).toLocaleDateString('en-US', dateOptions)} - {new Date(event.end_time).toLocaleDateString('en-US', dateOptions)}</p>
                                <p>Location: {event.location}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No events found</p>
                )}
                <div  style={{justifyContent: 'center', alignItems: 'center', display:"flex", margin:"auto" }}>
                    <Button style={{backgroundColor:"black", borderColor:"black", width: "100px"}} onClick={handlePreviousEvents} disabled={currentEventPage === 1}>Previous</Button>
                    <p style={{margin:"10px"}}>Page {currentEventPage} of {Math.ceil(eventDisplay.length / eventsPerPage)}</p>
                    <Button style={{backgroundColor:"black", borderColor:"black", width:"100px"}} onClick={handleNextEvents} disabled={currentEventPage >= Math.ceil(eventDisplay.length / eventsPerPage)}>Next</Button>
                </div>
            </div>
            <div className='profile-body'>
                <p>Members({clubData.member_count}):</p>
                {clubData.members && clubData.members.length > 0 ? (
                  <ul>
                    {clubData.members.map((member) => (
                      <li key={member.user_id}>{member.first_name} {member.last_name}, {member.email}
                        {member.user_id == clubData.owner_id && ( 
                            <> Club Owner</> )}</li>
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
            {/* Event create pop out input */}
            <Modal show={showEventModal} onHide={handleCloseEventModal}>
                <Modal.Header>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'white'}}>
                    <Form onSubmit={handleEventSubmit}>
                        <Form.Group>
                            <Form.Label>*Title</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="text" placeholder="Enter title" required value={eventData.event_name} onChange={(e) => setEventData({...eventData, event_name: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>*Description</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} as="textarea" placeholder="Enter description" required value={eventData.description} onChange={(e) => setEventData({...eventData, description: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>*Date</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="date" required value={eventData.event_date} onChange={(e) => setEventData({...eventData, event_date: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Start Time</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="time" value={eventData.start_time} onChange={(e) => setEventData({...eventData, start_time: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>End Time</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="time" value={eventData.end_time} onChange={(e) => setEventData({...eventData, end_time: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>*Location</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="text" placeholder="Enter location" value={eventData.location} onChange={(e) => setEventData({...eventData, location: e.target.value})}/>
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


            {/* Posts create pop out input */}
            <Modal show={showPostModal} onHide={handleClosePostModal}>
                <Modal.Header>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{backgroundColor: 'white'}}>
                    <Form onSubmit={handlePostSubmit}>
                        <Form.Group>
                        <h3 style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src={previewPostImage || '/default-club.png'} alt="post-Image" style={{width: '50%',height: '50%', objectFit: 'cover' }}/>
                        </h3>
                            <Form.Label>Title</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} type="text" placeholder="Enter title" value={postData.post_name} onChange={(e) => setPostData({...postData, post_name: e.target.value})} />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>*Content</Form.Label>
                            <Form.Control style={{backgroundColor:"lightgrey"}} as="textarea" placeholder="Enter content" required value={postData.description} onChange={(e) => setPostData({...postData, content: e.target.value})}/>
                        </Form.Group>
                        <Form.Group>
                            <input type='file' name='post_picture' onChange={handlePostFileChange}ref={filePostInputRef}accept="image/*"style={{ display: 'none' }}/>
                            <div onClick={() => filePostInputRef.current.click()} style={{ cursor: 'pointer' }}>
                                <button type="button" style={{borderRadius:'10px'}}>Click to change post image</button>
                            </div>
                        </Form.Group>
                        <p>{postMessage}</p>
                        <Button style={{width:'100px', justifyContent:'center', alignItems:'center', display:'flex', margin:'auto', marginTop:'10px'}} variant="primary" type="submit">
                            Create
                        </Button>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleClosePostModal}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            
            {/* Event info pop out input */}
            <Modal show={showEventInfo} onHide={closeEventInfo}>
                <Modal.Header closeButton >
                    <Modal.Title>Event Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && (
                        isEditMode ? (
                            <Form>
                                <Form.Group>
                                    <Form.Label>Event Name</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="text" value={selectedEvent.event_name} onChange={(e) => setSelectedEvent({...selectedEvent, event_name: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} as="textarea" value={selectedEvent.description} onChange={(e) => setSelectedEvent({...selectedEvent, description: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Date</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="date" value={selectedEvent.event_date} onChange={(e) => setSelectedEvent({...selectedEvent, event_date: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Start Time</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="time" value={selectedEvent.start_time} onChange={(e) => setSelectedEvent({...selectedEvent, start_time: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>End Time</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="time" value={selectedEvent.end_time} onChange={(e) => setSelectedEvent({...selectedEvent, end_time: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="text" value={selectedEvent.location} onChange={(e) => setSelectedEvent({...selectedEvent, location: e.target.value})} />
                                </Form.Group>
                            </Form>
                        ) : (
                            <>
                                <h3>{selectedEvent.event_name}</h3>
                                <p>{selectedEvent.description}</p>
                                <p>Date: {new Date(selectedEvent.event_date).toLocaleDateString('en-US', dateOptions)}</p>
                                <p>Time: {new Date(selectedEvent.start_time).toLocaleTimeString('en-US', dateOptions)} - {new Date(selectedEvent.end_time).toLocaleTimeString('en-US', dateOptions)}</p>
                                <p>Location: {selectedEvent.location}</p>
                                <h3>Members Attending</h3>
                                {attendanceData.length > 0 ? (
                                <p>
                                    {attendanceData.map((attendee) => (
                                    <>
                                        <li  key={attendee.user_id}>{attendee.first_name} {attendee.last_name}, {attendee.email}</li>
                                    </>
                                    ))}
                                </p>
                                ) : (
                                <p>No attendees found</p>
                                )}
                            </>
                        )
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {isAdmin || isOwner ? (
                        <>
                            {isEditMode ? (
                                <Button variant="primary" onClick={handleSaveEdit} >
                                    Save
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={handleEditClick}>
                                    Edit
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    {isMember ? (
                        isAttending?(
                            <>
                                <Button variant="success" onClick={unattendEvent}>
                                    Unattend
                                </Button>
                                <Button variant="danger" onClick={closeEventInfo}>
                                    Close
                                </Button>
                            </>
                        ) : (
                            <>
                            <Button variant="success" onClick={attendEvent}>
                                    Attend
                                </Button>
                                <Button variant="danger" onClick={closeEventInfo}>
                                    Close
                                </Button>
                            </>
                        )
                    ) : (
                        <>
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
                        isEditPostMode ? (
                            <Form>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {previewPostImage && <img src={previewPostImage} alt="Preview" style={{ width: '60%', height: '60%', objectFit: 'cover' }} />}
                                </div>
                                <input type='file' name='post_picture' onChange={handlePostFileChange}ref={filePostInputRef}accept="image/*"style={{ display: 'none' }}/>
                                <div onClick={() => filePostInputRef.current.click()} style={{ cursor: 'pointer' }}>
                                    <button type='button' style={{borderRadius:'10px'}}>Click to change post image</button>
                                </div>
                                <Form.Group>
                                    <Form.Label>Post Name</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="text" value={selectedPost.post_name} onChange={(e) => setSelectedPost({...selectedPost, post_name: e.target.value})} />
                                </Form.Group>
                                <Form.Group>
                                    <Form.Label>Content</Form.Label>
                                    <Form.Control style={{backgroundColor:"lightgrey"}} type="text" value={selectedPost.content} onChange={(e) => setSelectedPost({...selectedPost, content: e.target.value})} />
                                </Form.Group>
                            </Form>
                        ) : (
                            <>
                                <h3>{selectedPost.post_name}</h3>
                                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                    {selectedPost.post_image && <img src={selectedPost.post_image} alt={`${selectedPost.post_name} picture`} style={{ width: '60%', height: '60%', objectFit: 'cover' }} />}
                                </div>
                                <p>{selectedPost.content}</p>
                                <p>Created {new Date(selectedPost.created_at).toLocaleDateString('en-US', dateOptions)}</p>
                                <p>Edited {new Date(selectedPost.updated_at).toLocaleDateString('en-US', dateOptions)}</p>
                            </>
                        )
                    )}
                </Modal.Body>
                <Modal.Footer>
                    {loggedinUser?(
                        liked?(
                            <>
                                <Button onClick={handleUnlike} style={{justifyContent:'right', marginRight:"auto", backgroundColor:"transparent"}} variant="success">
                                    💔
                                </Button>
                            </>
                        ):(
                        <>
                            <Button  onClick={handleLike} style={{justifyContent:'right', marginRight:"auto"}} variant="success">
                                ❤ 
                            </Button>
                        </>
                        )
                    ) : (
                        <>
                        </>
                    )}
                    {isAdmin || isOwner ? (
                        <>
                            {isEditPostMode ? (
                                <Button variant="success" onClick={handleSavePostEdit} >
                                    Save
                                </Button>
                            ) : (
                                <Button variant="primary" onClick={handleEditPostClick}>
                                    Edit
                                </Button>
                            )}
                        </>
                    ) : (
                        <>
                        </>
                    )}
                    <Button variant="danger" onClick={closePostInfo}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

        
    );
}

export default ClubPage