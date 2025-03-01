import React, {useState} from 'react'
import {useNavigate} from 'react-router-dom'


function Login({handleLogin}){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    

    const handleSubmit = async (event) => {
        event.preventDefault();
        const loginData = {
            login:{
                user: {
                    email: email,
                    password: password
                }
            }
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/logins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData),
                
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('email', email);
                handleLogin(email);
                console.log(data);
                setMessage("logged in!");
                alert(`welcome ${email}`);
                navigate('/home');
            } else {
                const errorData = await response.json();
                console.error(errorData);
                setMessage("error logging in");
            }
        } catch (error) {
            console.error(error);
            setMessage('An error occurred. Please try again.');
        }
    };

    return(
    <div className='login-page'>
        <header>
        <h1 className="clubfade">Log In!</h1>
        </header>
        <main>
            <form onSubmit={handleSubmit}>
                <div className="login-container">
                    <div className="login-bar">
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                </div>
                <div className="login-container">
                    <div className="login-bar">
                        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    {message}
                    <button className="login-button" type="submit">Login</button>
                    Dont have an account? <a href="/login">Sign Up</a>
                </div>
            </form>
        </main>
    </div>
    );
}

export default Login