import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./navbar.css"
import Blogimg from "./blogimg.jpg"
import { useUser } from '../contexts/UserContext';


function getCookie(name) {
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match) {
      return match[2];
    }
    return null;
  }
  const sessionCookie = getCookie('token');
  console.log(sessionCookie)
  function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }



function Navbar() {
    const isUserSignedIn = !!localStorage.getItem('token');
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { setUser } = useUser();

    const handleSignOut = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        deleteCookie('token'); 
        setUser(null); // 
        navigate('/login');
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };
    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
         <div className="nav-box">
            <nav className='navbar'>
        <div className='navbar-content'>
            {/* <img src={Blogimg} alt="Blog Logo" className='logo' /> */}
            <Link to='/'><h1 className='title'>PenCraft</h1></Link>
            <button className='menu-button' onClick={toggleMenu}>
                &#9776;
            </button>
        </div>
        <ul className={`nav-links ${isMenuOpen ? 'open' : 'close'}`}>
            {isUserSignedIn ? (
                <>
                    <Link to='/account' onClick={closeMenu}><li className='nav-item'>Account</li></Link>
                    <li><button className='nav-item' onClick={() => {navigate('/home');setIsMenuOpen(false)}}>Home</button></li>
                    <li><button className='nav-item' onClick= {() => {navigate('/blogs');setIsMenuOpen(false);} }>Blogs</button></li>
                    <li><button className='nav-item' onClick={() => { navigate('/Topic');setIsMenuOpen(false);}}>Write Blogs</button></li>
                    <li><button className='nav-item' onClick={handleSignOut}>Sign Out</button></li>
                </>
            ) : (
                <>
                    <Link to='/login' onClick={closeMenu}><li className='nav-item'>Login</li></Link>
                    <Link to='/signup' onClick={closeMenu}><li className='nav-item'>Signup</li></Link>
                </>
            )}
        </ul>
    </nav>
         </div>


        
    );
}

export default Navbar;
