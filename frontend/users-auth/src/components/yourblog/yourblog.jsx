import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import "./yourblog.css";


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

const Yourblog = () => {
    const [blogs, setBlogs] = useState([]);
    const { user } = useUser(); // Get user from context
    const [deleteTopic, setDeleteTopic] = useState('');
    const key = "x1y2z3";

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${render_url}/api/v1/getall`);

                const allBlogs = response.data.data;
                console.log("User ID:", user.id);

                // Filter blogs to show only those created by the logged-in user
                const userBlogs = allBlogs.filter(blog => blog.authorId === user.id);
                setBlogs(userBlogs || []);
            } catch (error) {
                alert("Some error occurred");
            }
        };

        if (user) {
            fetchBlogs();
        }
    }, [user]);

    const handleDelete = async (topic) => {
        try {
            const response = await axios.post(`${render_url}/api/v1/deletetopic`, { topic, authorId: user.id });
            const response1 = await axios.post(`${render_url}/api3/v3/deletetopicc`, { topic });
            const response2 = await axios.post(`${render_url}/api2/v2/deletepaidtopicbyuser`, { topic });

            if (response.status === 200 && response1.status === 200  && response2.status === 200 ) {
                alert('Topic deleted successfully');
                // Refresh the blog list
                setBlogs(blogs.filter(blog => blog.topic !== topic));
            }
           
        } catch (error) {
            console.error('Error deleting topic:', error);
            alert('Failed to delete topic');
        }
    };

    const groupedBlogs = groupByTopic(blogs);

    return (
        <div className='page2'>
            {Object.keys(groupedBlogs).length > 0 ? (
                Object.keys(groupedBlogs).map((topic, i) => (
                    <div className='topic-box' key={i}>
                        <h1>{topic.split("@")[0]}</h1>
                        {groupedBlogs[topic].slice(0, 2).map((item, j) => (
                            <div className='page2-box' key={j}>
                                <h2>{item.title}</h2>
                                <p>{item.desc.slice(0, 200)}...</p>
                            </div>
                        ))}
                        <Link to={`/topic/${topic}/${key}`} className='read-more-link'>View All Blogs on {topic.split("@")[0]}</Link>
                        <Link to={`/writeblogs/${topic}`} className='add-blog-link'>Add Blog to {topic.split("@")[0]}</Link>
                        <button onClick={() => handleDelete(topic)} className='delete-topic-btn'>Delete Topic</button>
                    </div>
                ))
            ) : (
                <p>No blogs available.</p>
            )}
        </div>
    );
};

export default Yourblog;
