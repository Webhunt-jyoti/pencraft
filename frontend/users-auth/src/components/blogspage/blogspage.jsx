import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaRegEdit, FaTrashAlt } from "react-icons/fa";
import "./BlogPage.css";
import { useUser } from '../contexts/UserContext';


// const render_url =" http://localhost:3000"
const render_url ="https://blognest-or4v.onrender.com"  




const BlogPage = () => {
    const { id } = useParams();
    const {topic} = useParams();
    console.log(topic)
    const key = useParams().key;
    const [blog, setBlog] = useState(null);
    const { user } = useUser();
    

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const response = await axios.get(`${render_url}/api/v1/getblog/${id}`);
                setBlog(response.data.data);
            } catch (error) {
                alert("Some error occurred");
            }
        };
        fetchBlog();
    }, [id]);

    const handleDelete = async () => {
        try {
            const response = await axios.delete(`${render_url}/api/v1/deleteblog/${id}`);
            if (response.status === 200) {
                alert('Blog deleted successfully');
                // Redirect or update UI to reflect deletion
                window.location.href = `/topic/${topic}/${key}`; // Redirect to your blogs page
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Failed to delete blog');
        }
    };

    return (
        <div className="blog-page-container">
            {blog ? (
                <div className="blog-content">
                    <h1 className="blog-title">{blog.title}</h1>
                    <p className="blog-desc">{blog.desc}</p>
                    <p className="blog-date">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>

                    {(key === "x1y2z3" || (user.email === "khadushboy@gmail.com" && user.id === "66c42a21c9862ecb0dea7cb2")) &&
                            

                        (
                        <div className="blog-actions">
                            <Link to={`/updateblogs/${id}`} className="edit-logo">
                                <FaRegEdit /><span>edit</span>
                            </Link>
                            <button onClick={handleDelete} className="delete-btn">
                                <FaTrashAlt />
                            </button>
                          
                        </div>
                       
                    )}
                </div>
            ) : (
                <p className="loading-message">Loading...</p>
            )}
        </div>
    );
};

export default BlogPage;
