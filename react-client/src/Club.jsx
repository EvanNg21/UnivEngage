import Button from 'react-bootstrap/Button';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes, useNavigate, Link } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
function Club(){
    const Navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [clubData, setClubData] = useState([]); 
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
        const fetchClubData = async () => {
            try {
                const response = await fetch(`http://127.0.0.1:3000/api/v1/clubs`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setClubData(Array.isArray(data) ? data : [data]); // Ensure clubData is an array
                    console.log('Club Data Response:', data);
                } else {
                    console.error('Failed to fetch club data');
                }
            } catch (error) {
                console.error('Error fetching club data:', error);
            }
        };
        fetchClubData();
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const clubsPerPage = 5;
    const handleNextPage = () => {
        if (currentPage < Math.ceil(clubData.length / clubsPerPage)) {
            setCurrentPage(prevPage => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(prevPage => prevPage - 1);
        }
    };


    const [criteria, setCriteria] = useState('Members Descending')
    const sortClubs = (criteria) => {
        setCriteria(criteria);
    }

    const sortedClubs = [...clubData].sort((a, b) => {
        if (criteria === 'Date Created Descending') {
            return new Date(b.created_at) - new Date(a.created_at);
        } else if (criteria === 'Date Created Ascending') {
            return new Date(a.created_at) - new Date(b.created_at);
        } else if (criteria === 'Members Ascending') {
            return a.member_count - b.member_count;
        } else if (criteria === 'Members Descending') {
            return b.member_count - a.member_count;
        } else if (criteria === 'Date Updated Ascending') {
            return new Date(a.updated_at) - new Date(b.updated_at);
        } else if (criteria === 'Date Updated Descending') {
            return new Date(b.updated_at) - new Date(a.updated_at);
        }
        return 0;
    });

    const startIndex = (currentPage - 1) * clubsPerPage;
    const endIndex = startIndex + clubsPerPage;
    const currentClubs = sortedClubs.slice(startIndex, endIndex);

    return(
    <div className = 'base-page'>
        <div className='club-container'> 
            <h1 className="clubfade">Clubs </h1>
            <p>Explore all kinds of different clubs!</p>
            <Button onClick={createClub} variant="primary">Create a Club!</Button>
        </div>
        <div className="clubs-display">
            {/* Dropdown Menu */}
            <Dropdown style={{padding:"10px"}}>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Sort by
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item style={{backgroundColor: 'lightgrey'}} onClick ={() => sortClubs('Date Created Ascending')}>Date Created Ascending</Dropdown.Item>
                    <Dropdown.Item style={{backgroundColor: 'lightgrey'}}onClick ={() => sortClubs('Date Created Descending')}>Date Created Descending</Dropdown.Item>
                    <Dropdown.Item onClick ={() => sortClubs('Members Ascending')}>Members Ascending</Dropdown.Item>
                    <Dropdown.Item onClick ={() => sortClubs('Members Descending')}>Members Descending</Dropdown.Item>
                    <Dropdown.Item style={{backgroundColor: 'lightgrey'}}onClick ={() => sortClubs('Date Updated Ascending')}>Date Updated Ascending</Dropdown.Item>
                    <Dropdown.Item style={{backgroundColor: 'lightgrey'}}onClick ={() => sortClubs('Date Updated Descending')}>Date Updated Descending</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            {Array.isArray(currentClubs) && currentClubs.length > 0 ? (
                currentClubs.map(club => {
                    return (
                    <div key={club.club_id} style={{ margin: '10px', flex: '0 0 20%', backgroundColor: 'lightgrey', padding: '10px', borderRadius: '5px', width: "95%" }}>
                        <Nav.Link href={`/clubPage/${club.club_id}`} style={{fontSize: '30px'}}>{club.club_picture_url && <img src={club.club_picture_url} alt={`${club.club_name} picture`} style={{ width: '80px', height: '80px', borderRadius: '75px', objectFit: 'cover' }} />} {club.club_name} </Nav.Link>
                        <p>Description: {club.description}</p>
                        <p>Members: {club.member_count}</p>
                        <p style={{fontSize: '15px'}}>Created At: {new Date(club.created_at).toLocaleString()}</p>
                        <p style={{fontSize: '15px'}}>Updated At: {new Date(club.updated_at).toLocaleString()}</p>
                    </div>
                    );
                })
            ) : (
                <p>No clubs available</p>
            )}
        </div>
        <div  style={{justifyContent: 'center', alignItems: 'center', display:"flex" }}>
                <Button style={{backgroundColor:"black", borderColor:"black", width: "100px"}} onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</Button>
                <p style={{margin:"10px"}}>Page {currentPage} of {Math.ceil(clubData.length / clubsPerPage)}</p>
                <Button style={{backgroundColor:"black", borderColor:"black", width:"100px"}} onClick={handleNextPage} disabled={currentPage >= Math.ceil(clubData.length / clubsPerPage)}>Next</Button>
        </div>
    </div>
    );
}

export default Club