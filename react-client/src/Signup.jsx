import React, {useState} from 'react'
function Signup(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (password !== confirmPassword) {
            alert('Passwords do not match');
            return;
        }

        if (password.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }

        if (!/\S+@\S+\.\S+/.test(email)) {
            alert('Invalid email');
            return;
        }
        const userData = {
            user:{
                email: email,
                password: password,
                first_name: firstName,
                last_name: lastName
            }
        };

        try {
            const response = await fetch('http://127.0.0.1:3000/api/v1/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                const data = await response.json();
                setEmail('');
                setPassword('');
                setConfirmPassword('');
                setFirstName('');
                setLastName('');
                console.log('success', data);
                setMessage("signup successful");

            } else {
                const errorData = await response.json();
                console.error(errorData);
                setMessage("signup failed");
            }
        } catch (error) {
            console.error(error);
            setMessage("error occured");   
        }
    };
       

    return(
    <div className='signup-page'>
        <header>
            <h1 className="clubfade">Sign Up!</h1>
        </header>
        <main>
            <form onSubmit={handleSubmit}>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} required/>
                    </div>
                </div>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} required/>
                    </div>
                </div>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                    </div>
                </div>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/>
                    </div>
                </div>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required/>
                    </div>
                    {message}
                    <button className="signup-button" type="submit">Sign Up</button>
                    Already have an account? <a href="/login">Login</a>
                </div>
            </form>
        </main>
    </div>
    );
}

export default Signup