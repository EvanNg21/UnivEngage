import { useState, useEffect} from 'react';
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import {useParams} from 'react-router-dom';

function Profile() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const {userId} = useParams();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '', 
        last_name: '',  
        bio: '',
        date_of_birth: '',
        profile_picture: ''
    });
    

    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('email');
        if (token && savedEmail) {
            setUserEmail(savedEmail);
        }
    }, []);

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
                    console.log('API Response:', data); // Debugging
                    setUserData({
                        username: data.user.username,
                        email: data.user.email,
                        first_name: data.user.first_name, // Underscore
                        last_name: data.user.last_name,   // Underscore
                        date_of_birth: data.user.date_of_birth,
                        bio: data.user.bio, // Underscore
                        profile_picture: data.user.profile_picture
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userId]);

    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">My Profile</h1>
                <h2 style={{ paddingLeft: '100px', paddingTop: '50px' }}>Bio: {userData.bio}</h2>
            </header>
            <div className='profile-body'>
                <p>Username: {userData.username}</p>
                <p>Email: {userEmail}</p>
                <p>First Name: {userData.first_name}</p> 
                <p>Last Name: {userData.last_name}</p>   
                <p>Birthday: {userData.date_of_birth}</p> 
                <Button variant="primary"href={`edit/${userId}`}>Edit</Button>
            </div>
        </div>
    );
}

export default Profile;