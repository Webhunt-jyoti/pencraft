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
    const handleImageDelete = async (imageUrlToDelete) => {
        try {
            const updatedImageUrls = blog.imageUrls.filter(imageUrl => imageUrl !== imageUrlToDelete);

            const response = await axios.put(`${render_url}/api/v1/updateblog/${id}`, {
                ...blog,
                imageUrls: updatedImageUrls
            });

            if (response.status === 200) {
                setBlog(response.data.blog);
                alert('Image deleted successfully');
            }
        } catch (error) {
            console.error('Error deleting image:', error);
            alert('Failed to delete image');
        }
    };

    return (
        <div className="blog-page-container">
            {blog ? (
                <div className="blog-content">
                    <h1 className="blog-title">{blog.title}</h1>
                    <p className="blog-desc">{blog.desc}</p>
                    <p className="blog-date">Posted on: {new Date(blog.createdAt).toLocaleDateString()}</p>
                    <div className="blog-images">
                        {blog.imageUrls && blog.imageUrls.map((imageUrl, index) => (
                            <div key={index} className="image-container">
                                <img src={`${render_url}${imageUrl}`} alt={`Blog image ${index}`} className="blog-image" />
                                <button onClick={() => handleImageDelete(imageUrl)} className="delete-image-btn">
                                    <FaTrashAlt />
                                </button>
                            </div>
                        ))}
                    </div>

                    {(key === "x1y2z3" || (user.email === "khadushboy@gmail.com" && user.id === "66c42a21c9862ecb0dea7cb2")) &&
                            

                        (
                        <div className="blog-actions">
                            <Link to={`/updateblogs/${id}`} className="edit-logo">
                                <FaRegEdit /><span>edit</span>
                            </Link>
                            <button onClick={handleDelete} className="delete-btn">
                                <FaTrashAlt />
                            </button>
                            {/* <div className="blog-images">
                        {blog.imageUrls && blog.imageUrls.map((imageUrl, index) => (
                            <img key={index} src={`${render_url}${imageUrl}`} alt={`Blog image ${index}`} className="blog-image" />
                        ))}
                    </div> */}
                          
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
