import { useState, useEffect, useRef } from 'react';
import Button from 'react-bootstrap/esm/Button';
import { useNavigate, useParams } from 'react-router-dom';

function Edit() {
    const [userEmail, setUserEmail] = useState('');
    const token = localStorage.getItem('token');
    const { userId } = useParams();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const loggedInUser = localStorage.getItem('id');


    useEffect(() => {
        if (parseInt(userId) !== parseInt(loggedInUser)) {
            navigate(`/profile/${loggedInUser}`);
            alert("You can only edit your own profile");
        }
    }, [userId, loggedInUser]);

    const [userData, setUserData] = useState({
        username: '',
        email: '',
        first_name: '', 
        last_name: '',  
        bio: '',
        date_of_birth: '',
        profile_picture_url: ''
    });

    const [profilePicture, setProfilePicture] = useState(null);
    const [previewImage, setPreviewImage] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setProfilePicture(file);
            // Create a preview URL for the selected file
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        if (token && savedEmail) {
            setUserEmail(savedEmail);
        }
    }, [token]);

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

    // Clean up object URLs when component unmounts
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value,
        }));
    };
 
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('user[username]', userData.username);
        formData.append('user[email]', userData.email);
        formData.append('user[first_name]', userData.first_name);
        formData.append('user[last_name]', userData.last_name);
        formData.append('user[bio]', userData.bio);
        formData.append('user[date_of_birth]', userData.date_of_birth);
        
        if (profilePicture) {
            formData.append('user[profile_picture]', profilePicture);
        }
    
        try {
            const response = await fetch(`http://127.0.0.1:3000/api/v1/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });
            
            if (response.ok) {
                console.log('User data updated successfully');
                Navigate(`/profile/${userId}`);
            } else {
                console.error('Failed to update user data');
            }
        } catch (error) {
            console.error('Error updating user data', error);
        }
    };
        
    return (
        <div className='base-page'>
            <header className='profile-header'>
                <h1 className="clubfade">My Profile <img src={previewImage || '/default-profile.png'} alt="Profile" style={{width: '150px',height: '150px',borderRadius: '75px',objectFit: 'cover' }}/></h1>
                <input type='file' name='profile_picture' onChange={handleFileChange}ref={fileInputRef}accept="image/*"style={{ display: 'none' }}/>
                <div onClick={() => fileInputRef.current.click()} style={{ cursor: 'pointer' }}>
                    <button style={{borderRadius:'10px'}}>Click to change profile picture</button>
                </div>
                <h2 style={{ paddingLeft: '100px', paddingTop: '50px' }}>
                    Bio: <input style={{color: 'white'}} type="text" name="bio" placeholder="bio" value={userData.bio} onChange={handleInputChange}/>
                </h2>
            </header>
            <div className='profile-body'>
                <p>
                    Username: <input style={{color: 'white'}} type="text" name="username" placeholder="username" value={userData.username} onChange={handleInputChange}/>
                </p>
                <p>Email: {userEmail}</p>
                <p>
                    First Name: <input style={{color: 'white'}} type="text" name="first_name" placeholder="First Name" value={userData.first_name} onChange={handleInputChange}/>
                </p> 
                <p>
                    Last Name: <input style={{color: 'white'}} type="text" name="last_name"placeholder="Last Name" value={userData.last_name} onChange={handleInputChange}/>
                </p>   
                <p>
                    Birthday: <input style={{color: 'white'}} type="date" name="date_of_birth" placeholder="Birthday" value={userData.date_of_birth} onChange={handleInputChange}/>
                </p> 
                <Button variant="primary" onClick={handleSubmit}>
                    Save
                </Button>
            </div>
        </div>
    );
}

export default Edit;