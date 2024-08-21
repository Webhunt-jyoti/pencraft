import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './topic.css'; // Create this CSS file for styling
import axios from 'axios'
import { ClipLoader } from 'react-spinners';


// const render_url ="https://blognest-or4v.onrender.com"
const render_url =" http://localhost:3000"





const Topic = () => {
    const [topic, setTopic] = useState('');
    const [about, setAbout] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [author, setauthor] = useState('');
    const [checktopic, setchecktopic] = useState(false);
    const navigate = useNavigate();

    const checkTopicExists = async () => {
        try {
            const response = await axios.get(`${render_url}/api3/v3/checktopic/${topic}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking topic:', error);
            return false;
        }
    };

    const gowrite = ()=>{
        navigate(`/writeblogs/${topic}`);
    }

    const handleSubmit = async () => {
        setLoading(true); // Start loading
        
        try {
            if (topic.trim()) {
                const exists = await checkTopicExists();
                if (exists) {
                    setchecktopic(true)
                    setError('Topic already taken by someone or you, try a different one.');
                    setLoading(false); 
                    
                   
                } else {
                    const topicData = {
                        name: topic,
                        about: about,
                        author:author
                    };
    
                    // Send POST request with the correct data structure
                    console.log(topicData)
                    const response = await axios.post(`${render_url}/api3/v3/aboutpost`, {sub:topic, topic: topicData });
    
                    if (response.status === 200) {
                        alert('Topic Set');
                        setLoading(false); 
                        setError('');
                        setAbout('');
                        setTopic('');
                        navigate(`/writeblogs/${topic}`);
                    }
                }
            } else {
                setError('Please enter a topic name.');
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while saving the topic.');
            setLoading(false); 
        }
    };

    return (
        <div className='topic-container'>
            <h1>Create a New Topic</h1>
            <input
                type='text'
                placeholder='Enter topic name'
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
            />
            <input
                type='text'
                placeholder='Enter Author name'
                value={author}
                onChange={(e) => setauthor(e.target.value)}
            />
            <h1>Write a small descrition ,What is this For !!! So that uses can Buy before purchase</h1>
            
                    <textarea
                        className='formtext'
                        id='desc'
                        name='about'
                        value={about}
                        onChange={(e)=>{setAbout(e.target.value)}}
                        placeholder='Write Description'
                        cols="20"
                        rows="10"
                    ></textarea>

            <button onClick={handleSubmit}  disabled={loading}>
            {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Next'}
            </button>
           
            <button onClick={gowrite} className={`go-write ${checktopic ? 'open' : 'close'}`}>Go to writeBlog section</button>
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
};

export default Topic;

