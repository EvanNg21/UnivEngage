import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'

function CreateClub(){
    const [clubName, setClubName] = useState('');
    const userId = localStorage.getItem('id');
    const [message, setMessage] = useState('');
    const handleSubmit = async (event) => {
        event.preventDefault();
        // Handle form submission here
        const clubData = { 
            club_name: clubName,
            owner_id: userId
         };
        try{
            const response = await fetch('http://127.0.0.1:3000/api/v1/clubs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(clubData), // Send the club name as the request body
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data);
                setMessage('Club created successfully!');
            } else{
                console.error('Failed to create club');
                setMessage('Failed to create club');
            }
        } catch (error){
            console.error('Error creating club', error);
            setMessage('Error creating club');
        } 
    };

    return(
        <div className='signup-page'>
        <header>
            <h1 className="createfade" style={{justifyContent:"center", display:"flex"}}>Create a Club!</h1>
            <h2 className="createfade" style={{fontSize:"40px"}}>Come up with a name for your club</h2>
        </header>
        <main>
            <form onSubmit={handleSubmit}>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Club Name" value={clubName} onChange={(e) => setClubName(e.target.value)}  required/>
                    </div>
                    {message}
                    <button className="signup-button" type="submit">Create</button>
                </div>
            </form>
        </main>
    </div>
    );
}

export default CreateClub