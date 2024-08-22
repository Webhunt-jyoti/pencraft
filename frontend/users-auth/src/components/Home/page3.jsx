import React, { useState } from 'react'
import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import "./page3.css"
import { useUser } from '../contexts/UserContext';
import { Navigate } from 'react-router-dom'


const render_url ="https://blognest-or4v.onrender.com"
// const render_url = " http://localhost:3000"



const EXCLUDED_TOPICS = process.env.REACT_APP_EXCLUDED_TOPICS?.split(',') || [];

const groupByTopic = (blogs) => {
    return blogs.reduce((acc, blog) => {
        if (blog.topic) {
            (acc[blog.topic] = acc[blog.topic] || []).push(blog);
        }
        return acc;
    }, {});
};

const Page3 = ({ amount, checkoutHandler }) => {
    const [blogs, setBlogs] = useState([]);
    const [paidTopics, setPaidTopics] = useState([]);
    const { user } = useUser();
    const navigate = useNavigate();
    // console.log(user.paidtopic);

    // Parse the paid topics string into an array


    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${render_url}/api/v1/getall`);
                setBlogs(response.data.data || []);
            } catch (error) {
                alert("Some error occurred");
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const fetchPaidTopics = async () => {
            try {
                const response = await axios.get(`${render_url}/api2/v2/getPaidTopics`);
                const topics = response.data.data.paidTopics;
                // console.log(topics)
                setPaidTopics(topics);
            } catch (error) {
                console.log(error)
                // alert('Some error occurredttt');
            }
        };
        fetchPaidTopics();
    }, []);

    useEffect(() => {
        const updatepaidtopic = async () => {
            try {
                const response = await axios.post(`${render_url}/api2/v2/updatePaidTopics`, {
                    paidTopics: paidTopics // No need for userId here since it affects all users

                });
                console.log("update paidtopic succesful")
                // alert("succesfully update")

            } catch (error) {
                console.log("error in update paid topic")
            }

        }

        updatepaidtopic();
    })





    const groupedBlogs = groupByTopic(blogs);
    console.log(groupedBlogs)

    // Filter topics based on paidTopics and EXCLUDED_TOPICS
    const filteredTopics = Object.keys(groupedBlogs).filter(topic =>
        paidTopics.includes(topic.split("@")[0])
    );


    //get pay amount
    const getPaymentAmount = (topic) => {
        if (topic === 'java@20') {
            // Assuming the payment amount is extracted from a specific format
            // If you need to get the amount from an environment variable or similar
            // Replace with the appropriate logic
            console.log(topic)
            return topic.split('@')[1]?.trim(); // Default to '2' if no amount found
        }
        return '0'; // Default payment amount if not 'java'
    };

    return (
        <div className='page2'>
            {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, i) => {
                    console.log(topic)

                    // const pay = getPaymentAmount(topic);

                    return (
                        <div className='topic-box' key={i}>
                            <h1>{topic.split("@")[0]}</h1>
                            {groupedBlogs[topic] && groupedBlogs[topic].slice(0, 2).map((item, j) => (
                                <div className='page2-box' key={j}>
                                    <h2>{item.title}</h2>
                                    <p>{item.desc.slice(0, 20)}...</p>
                                </div>
                            ))}
                            {/* Render payment button with calculated pay */}
                            {topic.split('@')[1] > 0 ? (
                                <Link to={`/page4/${user.id}`}>
                                    <button className='pay-btn'>
                                        {`Pay ${topic.split('@')[1]?.trim()}`}
                                    </button>
                                </Link>
                            ) : (
                                <button className='pay-btn' disabled>
                                    Price not decided by Author
                                </button>
                            )}
                            {/* <Link   to={`/page4/${user.id}`}>
                            <button className='pay-btn'>
                                {`Pay ${topic.split('@')[1]?.trim()}`}
                            </button>
                        </Link> */}
                            {/* <Link to={`/writeblogs/${topic}`} className='add-blog-link'>Add Blog to {topic}</Link> */}
                        </div>
                    );
                })
            ) : (
                <p>No blogs available.</p>
            )}
        </div>
    );
};

export default Page3;