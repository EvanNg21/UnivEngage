import { useState, useEffect} from 'react';
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import {useParams} from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';

function Profile() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const {userId} = useParams();
    const loggedinUserId = localStorage.getItem('id');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '', 
        last_name: '',  
        bio: '',
        date_of_birth: '',
        profile_picture: ''
    });
    const [clubData, setClubData] = useState([]);
    const [ownedClubs, setOwnedClubs] = useState([]);
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('email');
        if (token && savedEmail) {
            setUserEmail(savedEmail);
        }
    }, []);

    const [previewImage, setPreviewImage] = useState('');
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                console.error('Token not found');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('API Response:', data);
                    
                    // Handle both array response and single object response
                    const user = Array.isArray(data) ? 
                        data.find(u => u.user_id === parseInt(userId)) : 
                        data;

                    if (user) {
                        setUserData({
                            username: user.username || '',
                            email: user.email || '',
                            first_name: user.first_name || '',
                            last_name: user.last_name || '',  
                            date_of_birth: user.date_of_birth || '',
                            bio: user.bio || '',
                            profile_picture_url: user.profile_picture_url || ''
                        });
                        
                        // Set the preview image if it exists
                        if (user.profile_picture_url) {
                            setPreviewImage(user.profile_picture_url);
                        }
                    }
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId, token]);

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
                    const clubsArray = Array.isArray(data) ? data : [data];
                    setClubData(clubsArray);
                    console.log('club data', clubData)
                    
                    const filterClubs = clubsArray.filter(club => club.owner_id === userId);
                    setOwnedClubs(filterClubs);
                    console.log('owned clubs', ownedClubs)
                    
                } else {
                    console.error('Failed to fetch club data');
                }
            } catch (error) {
                console.error('Error fetching club data:', error);
            }
        };
        fetchClubData();
    }, [userId]);

    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">My Profile <img src={previewImage || '/default-profile.png'} alt="Profile" style={{width: '150px',height: '150px',borderRadius: '75px',objectFit: 'cover' }}/></h1>
                <h2 style={{ paddingLeft: '100px', paddingTop: '50px' }}>Bio: {userData.bio}</h2>
            </header>
            <div className='profile-body'>
                <p>Username: {userData.username}</p>
                <p>Email: {userEmail}</p>
                <p>First Name: {userData.first_name}</p> 
                <p>Last Name: {userData.last_name}</p>   
                <p>Birthday: {userData.date_of_birth}</p>
                {loggedinUserId === userId?(
                    <Button variant="primary"href={`edit/${userId}`}>Edit</Button>
                    ):(
                        <></>
                )}
            </div>
            <div className='profile-body'>
                <p>My clubs</p>
                {ownedClubs.length > 0 ? (
                ownedClubs.map(club => (
                    <div key={club.club_id}>
                        <Nav.Link href={`/clubPage/${club.club_id}`} style={{fontSize: '30px'}}>{club.club_name} {club.club_picture_url && <img src={club.club_picture_url} alt={`${club.club_name} picture`} style={{ width: '50px', height: '50px', borderRadius: '75px', objectFit: 'cover' }} />}</Nav.Link>
                        <p>Description: {club.description}</p>
                        <p>_____________________________________________________</p>
                        </div>
                    ))
                ) : (
                    <p>No clubs available</p>
                )}
            </div>
        </div>
    );
}

export default Profile;