import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './topic.css'; // Create this CSS file for styling
import axios from 'axios';
import { ClipLoader } from 'react-spinners';

const render_url = "https://blognest-or4v.onrender.com";

const Topic = () => {
    const [topic, setTopic] = useState('');
    const [about, setAbout] = useState(''); // Description field
    const [language, setLanguage] = useState(''); // Language field
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [author, setAuthor] = useState('');
    const [checktopic, setCheckTopic] = useState(false);
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

    const goWrite = () => {
        navigate(`/writeblogs/${topic}`);
    };

    const handleSubmit = async () => {
        setLoading(true); // Start loading

        try {
            if (topic.trim()) {
                const exists = await checkTopicExists();
                if (exists) {
                    setCheckTopic(true);
                    setError('Topic already taken by someone or you, try a different one or use  small or capital letter ,');
                    setLoading(false);
                } else {
                    const topicData = {
                        name: topic,
                        about: about ,// Automatically add language to description
                        author: author
                    };

                    // Send POST request with the correct data structure
                    console.log(topicData);
                    const response = await axios.post(`${render_url}/api3/v3/aboutpost`, { sub: topic, topic: topicData });

                    if (response.status === 200) {
                        alert('Topic Set');
                        setLoading(false);
                        setError('');
                        setAbout('');
                        setTopic('');
                        setLanguage('');
                        navigate(`/writeblogs/${topic}`);
                    }
                }
            } else {
                setError('Please enter a topic name.');
                setLoading(false);
            }
        } catch (error) {
            console.error(error);
            setError('An error occurred while saving the topic.');
            setLoading(false);
        }
    };

    // Handle language change and automatically update description
    const handleLanguageChange = (e) => {
        const enteredLanguage = e.target.value;
        setLanguage(enteredLanguage);
        setAbout(`Language: ${enteredLanguage}\n${about.split('\n').slice(1).join('\n')}`);
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
                onChange={(e) => setAuthor(e.target.value)}
            />
            < p className='language-p'>choose your language like if you are writing in english but logic in odia ,<br /> then write English + Hindi    (e.g:English + Bengali...) </p>
            <input
                type='text'
                placeholder='Enter your language'
                value={language}
                onChange={handleLanguageChange}
            />


            {/* <select
                value={language}
                onChange={handleLanguageChange}
            >
                <option value=''>Select Language</option>
                <option value='English'>English</option>
                <option value='Spanish'>Spanish</option>
                <option value='French'>French</option>
               
            </select> */}

            <h1>Write a small description, What is this For !!! So that users can buy before purchase</h1>
            <textarea
                className='formtext'
                id='desc'
                name='about'
                value={about}
                onChange={(e) => setAbout(`Language: ${language},\n${e.target.value.split('\n').slice(1).join('\n')}`)} // Prevent editing the first line
                placeholder='Write Description'
                cols="20"
                rows="10"
            ></textarea>

            <button onClick={handleSubmit} disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={20} /> : 'Next'}
            </button>

            {/* <button onClick={goWrite} className={`go-write ${checktopic ? 'open' : 'close'}`}>Go to writeBlog section</button> */}
            {error && <p className='error-message'>{error}</p>}
        </div>
    );
};

export default Topic;
