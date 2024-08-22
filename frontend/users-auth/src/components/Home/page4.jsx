import React, { useState, useEffect } from 'react';
import './page4.css'; // Make sure to include this CSS file
import img from './qrcode.jpg'
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ClipLoader } from 'react-spinners';


const render_url ="https://blognest-or4v.onrender.com"
// const render_url =" http://localhost:3000"







const Page4 = () => {
  const [email, setEmail] = useState('');
  const [course, setCourse] = useState('');
  const [polling, setPolling] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyReceived, setReplyReceived] = useState(false);
  const [checkingReply, setCheckingReply] = useState(false);

  const navigate = useNavigate();

  const [copySuccess, setCopySuccess] = useState('');
  const upiId = process.env.REACT_APP_UPI_ID;
  const id = useParams().id;
  const { user } = useUser();
  console.log(id)


  const handleCopyClick = () => {
    navigator.clipboard.writeText(upiId)
    
      .then(() => {
        setCopySuccess('UPI ID copied to clipboard!');
        setTimeout(() => setCopySuccess(''), 2000); // Clear message after 2 seconds
      })
      .catch(() => {
        setCopySuccess('Failed to copy UPI ID.');
      });
  };





  const handleSubmit = async (e) => {
    setLoading(true); // Start loading
    e.preventDefault();
    try {
      // Send data to the backend
      await axios.post(`${render_url}/api2/v2/notify`, { email, course ,id});
      alert('You will get your blog within 12hr ,check your purchase section or inbox in mail');

      setLoading(false); 
      setCourse("")
      setEmail("")
      // setCheckingReply(true);
      // const intervalId = setInterval(async () => {
      //   try {
      //     const response = await axios.get(`${render_url}/api2/v2/check-reply/${email}`);
      //     if (response.data.status === 'confirmed') {
      //       setReplyReceived(true);
      //       clearInterval(intervalId);
      //     }
      //   } catch (error) {
      //     console.error('Error checking reply', error);
      //   }
      // }, 5000); // Check every 5 seconds // Start polling for replies
    } catch (error) {
      console.error('Error sending notification', error);
      alert('Failed to send notification.');
      setLoading(false); 
    }
    finally{
      setLoading(false);
    }
  };

  // useEffect(() => {
  //   const checkForReply = async () => {
  //     try {
  //       const encodedEmail = encodeURIComponent(email);
  //       const response = await axios.get(`${render_url}/api2/v2/check-reply/${encodedEmail}`);
  //       console.log(response.data.data)
  //       if (response.data.hasReply) {
  //         navigate(`/page5/${encodedEmail}`);
  //       }
  //     } catch (error) {
  //       console.error('Error checking for reply:', error);
  //     }
  //   };

  //   const intervalId = setInterval(() => {
  //     if (checkingReply) {
  //       checkForReply();
  //     }
  //   }, 5000); 

  //   return () => clearInterval(intervalId);
  // }, [checkingReply, email, navigate]);



  return (
    <div className="page4-container">
      <h1 className="page4-title">Please Scan or Pay Through UPI if price is defined</h1>
      <img src={img} alt="UPI" className="upi-image" />
     
      <h1 className='upi-id'>UPI ID:</h1>
      <h1 className='upi-id'>{upiId}</h1>
      <button className='copy-btn' onClick={handleCopyClick}>
        Copy upi
      </button>
      {copySuccess && <p className='copy-message'>{copySuccess}</p>}
      
      
      <h2 className="page4-subtitle">Please Fill the Details ,otherwise blog can not be given ,it is mandatory</h2>
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Write your accurate course name with no typo</label>
          <input
            className="form-input"
            type="text"
            id="title"
            name="title"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            placeholder="Write Course"
          />
        </div>
        <div className="form-group">
          <label htmlFor="desc">Write your registered email</label>
          <textarea
            className="form-textarea"
            id="desc"
            name="desc"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Write email"
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <button className="submit-button" type="submit" onClick={handleSubmit} disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={20} /> : 'submit'}
            </button>
        {/* <button className="submit-button" type="submit">Submit</button> */}
       
        <h1 className='mailme'>If you are facing any issue with sending mail with above then,mail me directly with this email id - pencraft98@gmail.com</h1>
      </form>
    </div>
  );
};

export default Page4;
