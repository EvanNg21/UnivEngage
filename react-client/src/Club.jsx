import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';
import CreateClub from './CreateClub';
function Club(){
    const Navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
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

    return(
    <div className = 'base-page'>
        <div className='club-container'> 
            <h1 className="clubfade">Clubs </h1>
        </div>
        <div className = 'butt'>
            <Button onClick={createClub} variant="outline-primary">Create a Club!</Button>
        </div>
    </div>
    );
}

export default Club