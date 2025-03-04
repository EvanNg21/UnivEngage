import { useState, useEffect } from 'react';
import React from 'react';

function Profile() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '', 
        last_name: '',  
        bio: '',
        date_of_birth: '',
        profile_picture: ''
    });
    const userID = localStorage.getItem('id');

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
                const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userID}`, {
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
                        date_of_birth: data.user.date_of_birth // Underscore
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [userID]);

    return (
        <div className='profile-page'>
            <header className='profile-header'>
                <h1 className="clubfade">My Profile</h1>
                <h2 style={{ paddingLeft: '100px', paddingTop: '50px' }}>Bio:</h2>
            </header>
            <div className='profile-body'>
                <p>Username: {userData.username}</p>
                <p>Email: {userEmail}</p>
                <p>First Name: {userData.first_name}</p> 
                <p>Last Name: {userData.last_name}</p>   
                <p>Birthday: {userData.date_of_birth}</p> 
                <p>token: {token}</p>
            </div>
        </div>
    );
}

export default Profile;