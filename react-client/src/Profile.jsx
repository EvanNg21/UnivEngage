import Button from 'react-bootstrap/Button';
import React from 'react';

function Profile(){
    return(
    <div className = 'profile-page'>
        <header className='profile-header'> 
            <h1 className="clubfade" >My Profile</h1>
        </header>
        <div className = 'profile-body'>
            <p>Username</p>
        </div>
    </div>
    );
}

export default Profile