function CreateClub(){
    return(
        <div className='signup-page'>
        <header>
            <h1 className="createfade" style={{justifyContent:"center", display:"flex"}}>Create a Club!</h1>
            <h2 className="createfade" style={{fontSize:"40px"}}>Come up with a name for your club</h2>
        </header>
        <main>
            <form>
                <div className="signup-container">
                    <div className="signup-bar">
                        <input type="text" placeholder="Club Name"  required/>
                    </div>
                    <button className="signup-button" type="submit">Create</button>
                </div>
            </form>
        </main>
    </div>
    );
}

export default CreateClub