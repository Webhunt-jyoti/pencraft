import React from 'react';
import { useUser } from '../components/contexts/UserContext';
import Profileinfo from '../components/profile-info/profileinfo'; // Adjust the path as needed
import Yourblog from '../components/yourblog/yourblog'; // Adjust the path as needed
import "../components/yourblog/yourblog.css"
import './Account.css';
import { useState ,useEffect} from 'react';
import { useNavigate } from 'react-router-dom';


// const render_url =" http://localhost:3000"
const render_url ="https://blognest-or4v.onrender.com"



function Account() {
    const { user } = useUser();
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate(); // Initialize navigate function

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    const toggleTheme = () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
    };

    // Apply saved theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
    }, []);

    const navigateTo = (path) => {
        navigate(path);
        setSidebarOpen(false); // Close sidebar after navigation
    };

    return (
        <div className='container1'>
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <button className='close-btn' onClick={toggleSidebar}>×</button>
                <div className='sidebar-content'>
                    <button className='theme-toggle-btn' onClick={toggleTheme}>
                        Toggle Dark Mode
                    </button>
                    <button className='sidebar-btn' onClick={() => navigateTo('/settings')}>
                        Settings
                    </button>
                    <button className='sidebar-btn' onClick={() => navigateTo('/purchase')}>
                        My Purchase
                    </button>
                </div>
            </div>
            <button className='sidebar-btn toggle-sidebar-btn' onClick={toggleSidebar}>
                ☰
            </button>
            <div className='content'>
                <div className='profilebox'>
                    {user ? (
                        <Profileinfo user={user} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                <Yourblog />
            </div>
        </div>
    );
}

export default Account;