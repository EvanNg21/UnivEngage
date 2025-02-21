import React, {useState} from 'react'
function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        const loginData = {
            user: {
                email: email,
                password: password
            }
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/logins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginData)
            });

            if (response.ok) {
                const data = await response.json();
                setMessage("logged in!");
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
    <div class='signup-page'>
        <h1 className="clubfade">Log In!</h1>
            <form onSubmit={handleSubmit}>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                </div>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                    <button className="signup-button" type="submit">Login</button>
                    Dont have an account? <a href="/signup">Sign Up</a>
                </div>
            </form>
    </div>
    );
}

export default Login