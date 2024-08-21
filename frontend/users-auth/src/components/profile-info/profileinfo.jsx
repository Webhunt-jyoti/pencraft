import React from 'react';
import "./profileinfo.css"

function Profileinfo({ user }) {
    if (!user) {
        return <p>No user data available.</p>;
    }

    // Extract the part before the @ symbol from the email
    const username = user.email.split('@')[0];

    return (
        <div className='profile-info '>
            <h1 className='text'>Welcome, {username}</h1>
            <p>Username: {user.username}</p>
        </div>
        
    );
}

export default Profileinfo;
