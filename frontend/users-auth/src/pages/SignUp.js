import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./login.css";
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';

// const render_url =" http://localhost:3000"
const render_url ="https://blognest-or4v.onrender.com";

function SignUp() {
    const [users, setUsers] = useState([]);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        axios
            .get(`${render_url}/api2/v2/register`)
            .then((res) => {
                console.log(res.data);
            });
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await axios.post(`${render_url}/api2/v2/checkEmail`, { email });
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email:', error);
            return false; // Handle error appropriately
        }
    };

    const validateEmailFormat = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        return emailRegex.test(email);
    };
    
    const validateEmailDomain = (email) => {
        const validDomains = ['gmail.com', 'yahoo.com', 'outlook.com'];
        const domain = email.split('@')[1];
        return validDomains.includes(domain);
    };
    

    const handleSubmit = async (event) => {
        setLoading(true);
        try {
            event.preventDefault();

            // Validate email format
            if (!validateEmailFormat(email) || !validateEmailDomain(email)) {
                alert('Please enter a valid email address.');
                setLoading(false);
                return;
            }

            const emailExists = await checkEmailExists(email);

            if (emailExists) {
                alert('Email already exists. Please sign in.');
                navigate("/login");
            } else {
                axios
                    .post(`${render_url}/api2/v2/register`, { email, username, password })
                    .then(() => {
                        alert('Registration Successful');
                        setLoading(false);
                        setEmail('');
                        setUsername('');
                        setPassword('');
                        fetchUsers();
                        navigate('/login');
                    })
                    .catch((error) => {
                        console.log('Unable to register user');
                    });
            }
        } catch (error) {
            alert("Error in registration");
        } finally {
            setLoading(false);
            console.log('Loading state set to false');
        }
    };

    return (
        <div className='w-full h-screen flex justify-center'>
            <div className='w-full h-screen bg-[#1a1a1a] text-white flex justify-center items-center p-4'>
                <form
                    className='text-center border rounded-lg w-full max-w-md p-6 bg-gray-800 signbox'
                    onSubmit={handleSubmit}
                >
                    {/* Email Input */}
                    <label className='block text-left mb-2'>Email</label>
                    <input
                        className='w-full h-[40px] rounded-xl bg-zinc-700 p-2 mb-4'
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    {/* Username Input */}
                    <label className='block text-left mb-2'>Username</label>
                    <input
                        className='w-full h-[40px] rounded-xl bg-zinc-700 p-2 mb-4'
                        type='text'
                        placeholder='Username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    {/* Password Input */}
                    <label className='block text-left mb-2'>Password</label>
                    <input
                        className='w-full h-[40px] rounded-xl bg-zinc-700 p-2 mb-4'
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    {/* Button */}
                    <button
                        className='w-full h-[50px] rounded-xl border bg-teal-700 text-white hover:bg-teal-900'
                        type='submit'
                        disabled={loading}
                    >
                        {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Sign up'}
                    </button>
                    <p>Already have a account? <Link to="/login" className='signup-link'>Log in</Link></p>
                </form>
            </div>
        </div>
    );
}

export default SignUp;
