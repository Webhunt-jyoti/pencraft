import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import "./topicblogs.css"
// import "./components/Home/page2.css";


// const render_url =" http://localhost:3000"
const render_url ="https://blognest-or4v.onrender.com"



const TopicBlogs = () => {
    const { topic } = useParams(); // Get topic from URL params
    const [blogs, setBlogs] = useState([]);
    const key = useParams().key;


    useEffect(() => {
        const fetchBlogsByTopic = async () => {
            try {
                const response = await axios.get(`${render_url}/api/v1/getblogsbytopic/${topic}`);
                console.log(response)
                setBlogs(response.data.data || []);
            } catch (error) {
                alert("Some error occurred");
            }
        };
        fetchBlogsByTopic();
    }, [topic]);
    console.log(blogs)
    return (
        <div className='topic-blogs-container'>
            <h1 className='topic-title'>Blogs on {topic.split("@")[0]}</h1>
            <div className='blogs-grid'>
                {blogs.length > 0 ? (
                    blogs.map((item, i) => (

                        
                        <div key={i}>
                            <Link to={`/blogspage/${topic}/${item._id}/${key}`}    >
                                <div className='blog-box' >

                                    <h1 className='blog-title' to={`/blogspage/${item._id}`}>{item.title}</h1>

                                    <p className='blog-desc'>{item.desc.slice(0,50)}...click more </p>
                                </div>
                            </Link>

                        </div>


                        



                    ))
                ) : (
                    <p className='no-blogs-message'>No blogs available for this topic.</p>
                )}
            </div>
        </div>
    );
};

export default TopicBlogs;
