import { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams } from 'react-router-dom';
function Edit() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const { userId } = useParams();
    const Navigate = useNavigate();
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
                        bio: data.user.bio // Underscore
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

    const handleInputChange = (event) => {
        const { name, value} = event.target;
        setUserData((prevData) => ({...prevData,
            [name]: value,
        }));
    };
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform form submission logic here
        try{
            const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userId}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userData),
            });
            if (response.ok){
                console.log('User data changed succesfully');
                Navigate(`/profile/${userId}`);
            } else{
                console.error('Failed to update user data');
            }
        } catch (error){
            console.error('Error update user data', error);
        }
    };
        
    

    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">My Profile</h1>
                <h2 style={{ paddingLeft: '100px', paddingTop: '50px' }}>Bio: <input style={{color: 'white'}} type="text" name= "bio" placeholder="bio" value={userData.bio} onChange={handleInputChange}/></h2>
            </header>
            <div className='profile-body'>
                <p>Username: <input style={{color: 'white'}} type="text" name="username" placeholder="username" value={userData.username} onChange={handleInputChange}/></p>
                <p>Email: {userEmail}</p>
                <p>First Name: <input style={{color: 'white'}} type="text" name= "first_name" placeholder="First Name" value={userData.first_name} onChange={handleInputChange}/></p> 
                <p>Last Name: <input style={{color: 'white'}} type="text" name= "last_name"placeholder="Last Name" value={userData.last_name} onChange={handleInputChange}/></p>   
                <p>Birthday: <input style={{color: 'white'}} type="text" name= "date_of_birth" placeholder="Birthday" value={userData.date_of_birth} onChange={handleInputChange}/></p> 

                <Button variant="primary"onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    );
}

export default Edit;