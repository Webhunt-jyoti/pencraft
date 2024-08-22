import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import './writeblogs.css';
import { ClipLoader } from 'react-spinners';

const render_url = "https://your-backend-url.com"; 
// const render_url =" http://localhost:3000"

const WriteBlogsAndUpdate = ({ titlename }) => {
    const { topic } = useParams();
    const id = useParams().id;
    const { user } = useUser();
    const history = useNavigate();
    const [blog, setBlog] = useState({ title: "", desc: "", topic: topic || "" });
    const [imageFile, setImageFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingg, setLoadingg] = useState(false);

    useEffect(() => {
        if (titlename === "Update") {
            const res = axios.get(`${render_url}/api/v1/getblog/${id}`)
            
                .then(response => setBlog(response.data.data))
               
                .catch(error => alert("Something went wrong"));
                console.log(blog)
        }
    }, [id, titlename]);

    const change = (e) => {
        const { name, value } = e.target;
        setBlog({ ...blog, [name]: value });
    };

    const handleImageChange = (e) => {
        
        setImageFile(e.target.files); // Use FileList
    };
    

    const submit = async () => {
        try {
            setLoading(true); // Start loading
            let imageUrls = [];
            if (imageFile && imageFile.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('images', imageFile[i]);
                }
    
                const imageResponse = await axios.post(`${render_url}/api/v1/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrls = imageResponse.data.imageUrls; // Assuming the backend returns an array of image URLs
            }
    
            const blogData = {
                ...blog,
                imageUrls,  // Store array of image URLs in blog data
                authorId: user.id,
            };
    
            if (titlename === "Write") {
                await axios.post(`${render_url}/api/v1/post`, blogData);
                alert("Blog sent successfully");
            } else {
                await axios.put(`${render_url}/api/v1/updateblog/${id}`, blogData);
                alert("Blog updated successfully");
            }
    
            setBlog({ title: "", desc: "", topic: "" });
            setImageFile(null); // Reset file input
            history("/blogs");
        } catch (error) {
            alert("Something went wrong");
        } finally {
            setLoading(false); // Stop loading
        }
    };
    
    const lock = async () => {
        setLoadingg(true); // Start loading
        try {
            let imageUrls = [];
            if (imageFile && imageFile.length > 0) {
                const formData = new FormData();
                for (let i = 0; i < imageFile.length; i++) {
                    formData.append('images', imageFile[i]);
                }
    
                const imageResponse = await axios.post(`${render_url}/api/v1/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                imageUrls = imageResponse.data.imageUrls; // Assuming the backend returns an array of image URLs
            }
    
            const blogData = {
                ...blog,
                imageUrls,  // Store array of image URLs in blog data
                authorId: user.id,
            };
            const response = await axios.post(`${render_url}/api2/v2/updatePaidTopics`, {
                paidTopics: topic // No need for userId here since it affects all users
            });

            const response1 = await axios.post(`${render_url}/api/v1/post`, blogData);

            // Handle success (e.g., show a success message or redirect)
            alert("succesfully lock and publish");
            setBlog({ title: "", desc: "", topic: topic || "" });
            setLoadingg(false); // Start loading
            history("/blogs")
        } catch (error) {
            // Handle error (e.g., show an error message)
            alert("Something went wrong while updating paid topics or please add all fields");
            setLoadingg(false);
        }
        finally{
            setLoadingg(false); // Start loading
        }
    };

    return (
        <div className='write-container'>
        <h1>{titlename}</h1>
        <div className='write-box'>
            <div className='form-group'>
                <label htmlFor='title'>Title</label>
                <input
                className='formtext'
                    type="text"
                    id='title'
                    name='title'
                    value={blog.title}
                    onChange={change}
                    placeholder='Write Title'
                />
            </div>
            <div className='form-group'>
                <label htmlFor='desc'>Description</label>
                <textarea
                className='formtext'
                    id='desc'
                    name='desc'
                    value={blog.desc}
                    onChange={change}
                    placeholder='Write Description'
                    cols="30"
                    rows="10"
                ></textarea>
            </div>
            <div className='form-group'>
                <label htmlFor='imageUpload'>Upload Images</label>
                <input
                    type="file"
                    id='imageUpload'
                    accept="image/*"
                    multiple // Allow multiple file selections
                    onChange={handleImageChange}
                />
            </div>
            <div className='user-info'>
                    <p>
                        Thank you for share your memories , thoughts ,past things and many more.. with us .please 
                        note : Below is two option  (write ) and (Lock and publish). <br />

                        1.If you click write : It will be considered as unpaid blog and it will be visible publicly. <br />
                        2.If you click Lock and publish : It will be considered as paid blog and You  should contact admin
                        through below contact info to fix the price of the blog ,Until then no one can access to your blog . It will be lock.  <br />
        
                        3. All blog would be checked by Admin , you should make your blog likewise so that others will not be harm any type. <br />
                        4. After succesful checked by Admin the amount will be fix  <br />
                        5. You can also add your blog in any category you want . <br />
                        6. If you don't want to publish your blog now ,you can click lock and publish button ,and later time 
                        you can edit it also by clicking view blogs link in your account section.

                        ***     Admin contact info  : Gmail id : pencraft98@gmail.com    ***  <br />
                        ***     For any issue contact Admin ,our service are very Quick touching    ***  <br />
                                               ***** Happy Blogging **** <br />
                    </p>

                </div>
            <button className='add-blog-button' onClick={submit} disabled={loading}>
                {loading ? <ClipLoader color="#ffffff" size={20} /> : `${titlename}`}
            </button><br /> <br />
            <button className='add-blog-button' onClick={lock} disabled={loadingg}>
                {loadingg ? <ClipLoader color="#ffffff" size={20} /> : 'Lock and publish'}
            </button>
        </div>
    </div>
    
    );
};

export default WriteBlogsAndUpdate;
