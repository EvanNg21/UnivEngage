import { useState, useEffect } from 'react';
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams } from 'react-router-dom';
function ClubEdit() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const { clubId } = useParams();
    const Navigate = useNavigate();
    const [clubData, setClubData] = useState({
            club_id: '',
            club_name: '',
            owner_id: '',
            members: 0,
            description: '',
    });

    const [ownerData, setOwnerData] = useState({
            first_name: '',
            last_name: '',
            email: '', 
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
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('API Response:', data); // Debugging
                    setClubData({
                        club_id: data.club.club_id,
                        club_name: data.club.club_name,
                        owner_id: data.club.owner_id,
                        members: data.club.members,
                        description: data.club.description
                    });
                } else {
                    console.error('Failed to fetch user data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };
        fetchUserData();
    }, [clubId]);

    const handleInputChange = (event) => {
        const { name, value} = event.target;
        setClubData((prevData) => ({...prevData,
            [name]: value,
        }));
    };
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Perform form submission logic here
        try{
            const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(clubData),
            });
            if (response.ok){
                console.log('User data changed succesfully');
                Navigate(`/clubPage/${clubId}`);
            } else{
                console.error('Failed to update club data');
            }
        } catch (error){
            console.error('Error update club data', error);
        }
    };

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${clubData.owner_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log("Fetched data:", data);
                    setOwnerData({
                        first_name: data.user.first_name,
                        last_name: data.user.last_name,
                        email: data.user.email  
                    });
                } else {
                    console.error("HTTP error: ", response.status);
                }
            } catch (e) {
                console.log("An error has occurred: ", e);
            }
        };
        fetchOwner();
    }, [clubData.owner_id]);
        
    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">{clubData.club_name}</h1>
                <h2>Club Description: <input style={{color: 'white'}} type="text" name= "description" placeholder="description" value={clubData.description} onChange={handleInputChange}/> </h2>
            </header>
            <div className='profile-body'>
                <p>Club Owner: {ownerData.first_name} {ownerData.last_name}, {ownerData.email}</p>
                <Button variant="primary"onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    );
}


export default ClubEdit;