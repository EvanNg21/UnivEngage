import Button from 'react-bootstrap/Button';
import React from 'react';
import { BrowserRouter, Route, Routes, Navigate, Link } from 'react-router-dom';
import CreateClub from './CreateClub';
function Club(){
    return(
    <div className = 'back'>
        <div className='club-container'> 
            <h1 className="clubfade">Clubs</h1>
        </div>
        <div className = 'butt'>
            <Button href="/create" variant="outline-primary">Create a Club!</Button>
        </div>
    </div>
    );
}

export default Club