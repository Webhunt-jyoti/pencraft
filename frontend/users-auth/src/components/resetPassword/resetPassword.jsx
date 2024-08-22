import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
// import './reset-password.css';

const render_url = "https://blognest-or4v.onrender.com";
// const render_url =" http://localhost:3000"

function ResetPassword() {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const { token } = useParams();
    const navigate = useNavigate();

    const handleResetPassword = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${render_url}/api2/v2/reset-password`, { token, password });
            setMessage('Your password has been reset successfully.');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (error) {
            console.log('Reset Password Error', error);
            setMessage('Failed to reset password. Please try again.');
        }
    };

    return (
        <div className='w-full h-screen flex justify-center'>
            <div className='w-[100%] h-[100%] bg-[#1a1a1a] text-white flex justify-center items-center'>
                <form 
                    className='text-center h-auto p-5 mx-auto max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl form'
                    onSubmit={handleResetPassword}
                >
                    <label className='block text-left'>Enter your new password</label>
                    <input 
                        className='w-full h-[40px] rounded-xl bg-zinc-700 p-2 mb-4'
                        type='password'
                        placeholder='New Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button 
                        className='w-full h-[50px] rounded-xl border bg-teal-700 text-white hover:bg-teal-900'
                        type='submit'
                    >
                        Reset Password
                    </button>
                    {message && <p className='mt-4'>{message}</p>}
                </form>
            </div>
        </div>
    );
}

export default ResetPassword;
