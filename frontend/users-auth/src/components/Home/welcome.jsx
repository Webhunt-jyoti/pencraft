import React from 'react';
import "./welcome.css";
import { Link } from 'react-router-dom';
import img1 from "./slide1.jpg";
import img2 from "./slide2.jpg";
import img3 from "./slide3.jpg";
import vdo from "./Your paragraph text.mp4";
import vdo1 from "./welcomevdo.mp4";

const Welcome = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-box">
        <h1 className="main-heading">Creativity of Mind is Intelligent</h1>
        <Link to="/login">
          <button className="sign-in-btn">Sign In</button>
        </Link>
      </div>

      <div className="vdo-text-box">
        <div className="vdo">
          <video src={vdo1} autoPlay={true} loop muted></video>
        </div>
        <div className="vdo">
          <video src={vdo} autoPlay={true} loop muted></video>
        </div>
        <div className="vdo-text">
          <h1>Start earning by posting any kind of blog but not Anti-Social</h1><br />
          <h1>Start Blogging,Start Earning Here</h1>
        </div>
      </div>

      <div id="carouselExampleInterval" className="carousel slide" data-bs-ride="carousel">
        <div className="carousel-inner">
          <div className="carousel-item active" data-bs-interval="3000">
            <img src={img1} className="d-block w-80" alt="Slide 1" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src={img2} className="d-block w-80" alt="Slide 2" />
          </div>
          <div className="carousel-item" data-bs-interval="3000">
            <img src={img3} className="d-block w-80" alt="Slide 3" />
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleInterval" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
      <div >
      <h1 className="noticee">Notice</h1>
      <p className="noticee">No updates </p>
      </div>
      
    </div>
  );
}

export default Welcome;
