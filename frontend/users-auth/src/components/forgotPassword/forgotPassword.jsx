import React, { useState } from 'react';
import axios from 'axios';
// import './forgot-password.css';

// const render_url = "https://blognest-or4v.onrender.com";
const render_url =" http://localhost:3000"

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleForgotPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${render_url}/api2/v2/forgot-password`, { email });
            setMessage('Password reset link has been sent to your email.');
        } catch (error) {
            console.log('Forgot Password Error', error);
            setMessage('Failed to send password reset email. Please try again.');
        }
    };

    return (
        <div className='w-full h-screen flex justify-center'>
            <div className='w-[100%] h-[100%] bg-[#1a1a1a] text-white flex justify-center items-center'>
                <form 
                    className='text-center h-auto p-5 mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl form'
                    onSubmit={handleForgotPassword}
                >
                    <label className='block text-left'>Enter your email to reset password</label>
                    <input 
                        className='w-full h-[40px] rounded-xl bg-zinc-700 p-2 mb-4'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button 
                        className='w-full h-[50px] rounded-xl border bg-teal-700 text-white hover:bg-teal-900'
                        type='submit'
                    >
                        Send Reset Link
                    </button>
                    {message && <p className='mt-4'>{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
