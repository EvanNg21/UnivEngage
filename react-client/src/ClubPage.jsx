import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
function ClubPage(){
    const {clubId} = useParams();
    const [isAdmin, setIsAdmin] = useState(false);
    const [ownerData, setOwnerData] = useState({
        first_name: '',
        last_name: '',
        email: '', 
    });
    const [clubData, setClubData] = useState({
        club_id: '',
        club_name: '',
        owner_id: '',
        members: 0,
        description: '',
    });

    useEffect(() => {
        const loggedinUser = localStorage.getItem('id');
        if (loggedinUser === clubData.owner_id) {
            setIsAdmin(true);
        }
    }, [clubData.owner_id]);


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
    }, [clubId]);

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
                <h2>Club Description: {clubData.description}</h2>
            </header>
            <div className='profile-body'>
                <p>Club Owner: {ownerData.first_name} {ownerData.last_name}, {ownerData.email}</p>
                {isAdmin ? (
                  <>
                  <Button variant="primary">Edit</Button>
                  </>
                ):(
                  <>
                  </>
                )}
            </div>
        </div>
    );
}

export default ClubPage