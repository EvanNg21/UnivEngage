import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import Button from 'react-bootstrap/esm/Button';
function ClubPage(){
    const { clubId } = useParams();
    const loggedinUser = localStorage.getItem('id');
    const token = localStorage.getItem('token');
    const [isAdmin, setIsAdmin] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isMember, setIsMember] = useState(false);
    const [memberData, setMemberData] = useState([]);
    const [ownerData, setOwnerData] = useState({
        first_name: '',
        last_name: '',
        email: '', 
    });
    const [clubData, setClubData] = useState({
        club_id: '',
        club_name: '',
        owner_id: '',
        members: [],
        description: '',
    });

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

    //owner data
    
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
                posts?
            </div>
            <div style={{backgroundColor:"grey"}}className='profile-body'>
                events?
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
        </div>
    );
}

export default ClubPage