import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
function Club(){
    const Navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clubs, setClubs] = useState([]);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
        }
    },);
    const createClub = () => {
        if (!isLoggedIn) {
            alert("you must be logged in to create a club");
        } else{
            Navigate("/create")
        }
    };

    useEffect(() => {
        const fetchClubs = async () => {
            try{
                const response = await fetch('http://127.0.0.1:3000/api/v1/clubs', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                });
                if (response.ok) {
                    const json = await response.json();
                    setClubs(json.clubs);
                    console.log("succuess  ", json);
                } else {
                    throw response;
                } 
            } catch (e) {
                console.log("An error has occurred: ", e);
            }
        }
        fetchClubs();
    },[])

    return(
    <div className = 'base-page'>
        <div className='club-container'> 
            <h1 className="clubfade">Clubs </h1>
        </div>
        <div className = 'butt'>
            <Button onClick={createClub} variant="outline-primary">Create a Club!</Button>
        </div>
        <div className="clubs-display">
            {clubs.length > 0 ? (
                clubs.map(club => (
                    <div key={club.club_id}>
                        <Nav.Link href={`/clubPage/${club.club_id}`} style={{fontSize: '30px'}}>{club.club_name}</Nav.Link>
                        <p>Description: {club.description}</p>
                        <p>Created At: {new Date(club.created_at).toLocaleString()}</p>
                        <p>Updated At: {new Date(club.updated_at).toLocaleString()}</p>
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

export default Club