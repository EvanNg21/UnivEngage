function Login(){
    return(
    <div class='home-container'>
        <h1 className="clubfade">Log In!</h1>
        <div className="signup-container">
            <div className="signup-bar">
                <input type="text" placeholder="Email"/>
            </div>
         </div>
         <div className="signup-container">
            <div className="signup-bar">
                <input type="text" placeholder="Password"/>
            </div>
         </div>
         <div>
            Already have an account? <a href="/login">Login</a>
         </div>
    </div>
    );
}

export default Login