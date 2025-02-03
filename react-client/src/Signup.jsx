function Signup(){
    return(
    <div class='home-container'>
        <h1 className="clubfade">Sign Up!</h1>
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
         <div className="signup-container">
            <div className="signup-bar">
                <input type="text" placeholder="Confirm Password"/>
            </div>
         </div>
         <div>
            Already have an account? <a href="/login">Login</a>
         </div>
    </div>
    );
}

export default Signup