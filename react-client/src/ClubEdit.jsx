import { useState, useEffect, useRef } from 'react';
import React from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams } from 'react-router-dom';
function ClubEdit() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const [isOwner, setOwner] = useState(false);   
    const { clubId } = useParams();
    const Navigate = useNavigate();
    const [clubData, setClubData] = useState({
            club_id: '',
            club_name: '',
            owner_id: '',
            description: ''
    });

    const [ownerData, setOwnerData] = useState({
            first_name: '',
            last_name: '',
            email: '', 
        });

    const [memberData, setMemberData] = useState([])
    
    useEffect(() => {
        const token = localStorage.getItem('token');
        const savedEmail = localStorage.getItem('email');
        if (token && savedEmail) {
            setUserEmail(savedEmail);
        }
    }, []);

    useEffect(() => {
        if (userId == clubData.owner_id) {
            setOwner(true);
        }
    }, [userId, clubData.owner_id]);
    
    const [clubPicture, setClubPicture] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const fileInputRef = useRef(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setClubPicture(file);
            // Create a preview URL for the selected file
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const fetchClubData = async () => {
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
                    const club = Array.isArray(data) ? 
                        data.find(u => u.club_id === parseInt(clubId)) : 
                        data;
                    console.log('Club Data Response:', clubData); // Debugging
                    if (club){
                        setClubData({
                            club_name: club.club_name || '',
                            description: club.description || '',
                            owner_id: club.owner_id || '',
                            club_id: club.club_id||'',
                        });
                        if (club.club_picture_url) {
                            setPreviewImage(club.club_picture_url);
                        }
                    }
                } else {
                    console.error('Failed to fetch club data');
                }
            } catch (error) {
                console.error('Error fetching club data:', error);
            }
        };
        fetchClubData();
    }, [clubId, token]);

    //members
    useEffect(() => {
        const fetchUserData = async () => {
            if (!token) {
                console.error('Token not found');
                return;
            }

            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/members`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    console.log('Member Data:', data); // Debugging
                    setMemberData(data.members);
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
        const formData = new FormData();
        formData.append('club[club_name]', clubData.club_name);
        formData.append('club[description]', clubData.description);
    
        if (clubPicture) {
            formData.append('club[club_picture]', clubPicture);
        }
        try{
            const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}`,{
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            if (response.ok){
                console.log('club data changed succesfully');
                Navigate(`/clubPage/${clubId}`);
            } else{
                console.error('Failed to update club data');
            }
        } catch (error){
            console.error('Error update club data', error);
        }
    };

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
                    console.log("Fetched owner data:", data);
                    setOwnerData({
                        first_name: data.first_name,
                        last_name: data.last_name,
                        email: data.email  
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

    const handlePromote = async (userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/promote_to_admin`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }), // Pass the user_id to promote
          });
      
          if (response.ok) {
            console.log('User promoted to admin successfully');
            // Refresh the member list or update the UI
            const updatedMembers = memberData.map(member =>
              member.user_id === userId ? { ...member, role: 'admin' } : member
            );
            setMemberData(updatedMembers);
          } else {
            console.error('Failed to promote user to admin');
          }
        } catch (error) {
          console.error('Error promoting user to admin:', error);
        }
      };

      const handleDemote = async (userId) => {
        try {
          const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs/${clubId}/demote_to_member`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId }), // Pass the user_id to promote
          });
      
          if (response.ok) {
            console.log('User promoted to admin successfully');
            // Refresh the member list or update the UI
            const updatedMembers = memberData.map(member =>
              member.user_id === userId ? { ...member, role: 'member' } : member
            );
            setMemberData(updatedMembers);
          } else {
            console.error('Failed to demote to user');
          }
        } catch (error) {
          console.error('Error demoteing user to member:', error);
        }
      };

      useEffect(() => {
        return () => {
          if (previewImage && previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(previewImage);
          }
        };
      }, []);
    
    
    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">Club Name: <input style={{color: 'white'}} type="text" name= "club_name" placeholder="club_name" value={clubData.club_name} onChange={handleInputChange}/>
                    <img src={previewImage || '/default-club.png'} alt="Club" style={{width: '150px',height: '150px',borderRadius: '75px',objectFit: 'cover' }}/>
                </h1>
                <input type='file' name='club_picture' onChange={handleFileChange}ref={fileInputRef}accept="image/*"style={{ display: 'none' }}/>
                <div onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                    <button style={{borderRadius:'10px'}}>Click to change club picture</button>
                </div>
                <h2>Club Description: <input style={{color: 'white'}} type="text" name= "description" placeholder="description" value={clubData.description} onChange={handleInputChange}/> </h2>
            </header>
            <div className='profile-body'>
                <p>Members:</p>
                {memberData.length > 0 ? (
                  <ul>
                    {memberData.map((member) => (
                      <li key={member.user_id}>{member.first_name} {member.last_name}, {member.email}, {member.user_id}, {member.role}
                      {member.user_id == clubData.owner_id && ( 
                      <Button variant="warning">owner</Button> )}
                      {member.role !== 'admin' && ( 
                      <Button variant="warning" onClick={() => handlePromote(member.user_id)}>Promote to Admin</Button> )}
                      {member.role !== 'member' && member.user_id != clubData.owner_id && ( 
                      <Button variant="warning" onClick={() => handleDemote(member.user_id)}>Demote to Member</Button> )}</li>

                    ))}
                  </ul>
                ) : (
                  <p>No members found</p>
                )}
                <Button variant="primary"onClick={handleSubmit}>Save</Button>
            </div>
        </div>
    );
}


export default ClubEdit;