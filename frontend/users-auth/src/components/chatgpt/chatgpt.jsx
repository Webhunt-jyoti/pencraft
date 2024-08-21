import React from 'react'
import "./chatgpt.css"
import send from "../chatgpt/send.png"
import gptlogo from "../chatgpt/gptlogo.png"
import bot from "../chatgpt/bot.png"
import { useState } from 'react'
import axios from 'axios'


const Chatgpt = () => {
    const [isChatVisible, setChatVisible] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    const toggleChat = () => {
        setChatVisible(!isChatVisible);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim()) {
            setMessages([...messages, { text: input, type: 'user' }]);
            setInput('');

            try {
                const responseText = await generateans(input);
                setMessages([...messages, { text: input, type: 'user' }, { text: responseText, type: 'bot' }]);
                document.querySelector('.chats').scrollTop = document.querySelector('.chats').scrollHeight;
            } catch (error) {
                console.error("Error fetching response from API:", error);
            }
        }
    };

    const generateans = async (userInput) => {
        const URL = process.env.REACT_APP_URL;
        const API_KEY = process.env.REACT_APP_API_KEY;

        try {
            const response = await axios.post(
                `${URL}`,
                {
                    contents: [
                        {
                            role: 'user',
                            parts: [{ text: userInput }]
                        }
                    ]
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            const responseText = response.data.candidates[0].content.parts[0].text;
            console.log(response)
            return responseText;
        } catch (error) {
            console.error("Error response:", error.response ? error.response.data : error.message);
            throw new Error("Failed to fetch response from API.");
        }
    };

    return (
        <>
           <div className={`main ${isChatVisible ? '' : 'hidden'}`}>
                <div className="chats">
                    <img src={gptlogo} alt="GPT Logo" />
                    {messages.map((message, index) => (
                        <div key={index} className={`message ${message.type}`}>
                            <p >{message.text}</p>
                        </div>
                        
                    ))}
                </div>
                <div className="chatfooter">
                    <form className="inp" onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Type a message..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                        />
                        <button type="submit" className="send">
                            <img src={send} alt="Send"  />
                        </button>
                    </form>
                </div>
            </div>
            <img
                src={bot}
                className={`bott ${isChatVisible ? 'rotate' : ''}`}
                alt="Bot"
                onClick={toggleChat}
            />
           
        </>
    );
};


export default Chatgpt
