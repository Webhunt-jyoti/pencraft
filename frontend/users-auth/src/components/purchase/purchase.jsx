import React, { useState } from 'react';
import "./purchase.css"
import axios from 'axios'
import { useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { Link } from 'react-router-dom'; 



// const render_url =" http://localhost:3000"
const render_url ="https://blognest-or4v.onrender.com"



const groupByTopic = (blogs) => {
    return blogs.reduce((acc, blog) => {
        if (blog.topic) {
            (acc[blog.topic] = acc[blog.topic] || []).push(blog);
        }
        return acc;
    }, {});
};







function Purchase() {

    const [blogs, setBlogs] = useState([]);
    const [paidTopics, setPaidTopics] = useState([]);
    const { user } = useUser();

    const key = "a1b2c3";


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
                const response = await axios.get(`${render_url}/api2/v2/getonTopics/${user.id}`);
                const topics = response.data.data.ontopics;
                console.log(topics)
                setPaidTopics(topics);
            } catch (error) {
                console.log(error)
                // alert('Some error occurredttt');
            }
        };
        fetchPaidTopics();
    }, []);

    const groupedBlogs = groupByTopic(blogs);
    console.log(groupedBlogs)

    // Filter topics based on paidTopics and EXCLUDED_TOPICS
    const filteredTopics = Object.keys(groupedBlogs).filter(topic =>
        paidTopics.includes(topic.split("@")[0])
    );





    return (
        <div className='page2'>
            {filteredTopics.length > 0 ? (
                filteredTopics.map((topic, i) => (
                    <div className='topic-box' key={i}>
                        <h1>{topic.split("@")[0]}</h1>
                        {groupedBlogs[topic].map((item, j) => (
                            <div className='page2-box' key={j}>
                                <h2>{item.title}</h2>
                                <p>{item.desc}</p>
                            </div>
                        ))}
                        
                       
                        <Link to={`/topic/${topic}/${key}`} className='read-more-link'>View All Blogs on {topic}</Link>
                        {/* <Link to={`/writeblogs/${topic}`} className='add-blog-link'>Add Blog to {topic}</Link> */}
                    </div>
                ))
            ) : (
                <p>No blogs available.</p>
            )}
        </div>
    );
}

export default Purchase;
