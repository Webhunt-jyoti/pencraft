import React, { useState, useEffect } from 'react';
import './writeblogs.css';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { ClipLoader } from 'react-spinners';




// const render_url =" http://localhost:3000"
const render_url = "https://blognest-or4v.onrender.com"





const WriteBlogsAndUpdate = ({ titlename }) => {
    const { topic } = useParams(); // Get topic from URL params
    const id = useParams().id;
    const { user } = useUser();
    const history = useNavigate();
    const [blog, setBlog] = useState({ title: "", desc: "", topic: topic || "" });
    const [loading, setLoading] = useState(false);
    const [loadingg, setLoadingg] = useState(false);

    useEffect(() => {
        const fetch = async () => {
            try {
                if (titlename === "Update") {
                    const response = await axios.get(`${render_url}/api/v1/getblog/${id}`);
                    setBlog(response.data.data);
                }
            } catch (error) {
                alert("Something went wrong");
            }
        };
        fetch();
    }, [id, titlename]);

    const change = (e) => {
        const { name, value } = e.target;
        setBlog({ ...blog, [name]: value });
    };

    const submit = async () => {
        setLoading(true); // Start loading
        try {
            const blogData = {
                ...blog,
                authorId: user.id
            };
            if (titlename === "Write") {
                if( blogData != null) {
                    const response = await axios.post(`${render_url}/api/v1/post`, blogData);
                    console.log(response.data.data);
                    setBlog({ title: "", desc: "", topic: topic || "" });
                    alert("blog send succesfully")
                    setLoading(false); 

                }
                else {
                    alert("Please fill all fields");
                }


            } else {
                const response = await axios.put(`${render_url}/api/v1/updateblog/${id}`, blogData);
                alert(response.data.message);
                setBlog({ title: "", desc: "", topic: topic || "" });
                setLoading(false); 
                history(`/account`);
             
            }
        } catch (err) {
            setLoading(false); 
            alert("Something went wrong ,please fill the field");
        }
        finally{
            setLoading(false); 
        }
    };

    console.log(user.id)
    const lock = async () => {
        setLoadingg(true); // Start loading
        try {
            const blogData = {
                ...blog,
                authorId: user.id
            };
            const response = await axios.post(`${render_url}/api2/v2/updatePaidTopics`, {
                paidTopics: topic // No need for userId here since it affects all users
            });

            const response1 = await axios.post(`${render_url}/api/v1/post`, blogData);

            // Handle success (e.g., show a success message or redirect)
            alert("succesfully lock and publish");
            setBlog({ title: "", desc: "", topic: topic || "" });
            setLoadingg(false); // Start loading
        } catch (error) {
            // Handle error (e.g., show an error message)
            alert("Something went wrong while updating paid topics");
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
                <div className='user-info'>
                    <p>
                        Thank you for share your memories , thoughts ,past things and many more.. with us .please 
                        note : Below is two option  (write ) and (Lock and publish). <br />

                        1.If you click write : It will be considered as unpaid blog and it will be visible publicly. <br />
                        2.If you click Lock and publish : It will be considered as paid blog and You  should contact admin
                        to fix the price of the blog ,Until then no one can access to your blog . It will be lock.  <br />
        
                        3. All blog would be checked by Admin , you should make your blog likewise so that others will not be harm any type. <br />
                        4. After succesful checked by Admin the amount will be fix  <br />
                        5. You can also add your blog in any category you want . <br />
                        6. If you don't want to publish your blog now ,you can click lock and publish button ,and later time 
                        you can edit it also by clicking view blogs link in your account section.

                        ***     Admin contact info  : Gmail id jyotiranjanmahapatra377@gmail.com    ***  <br />
                        ***     For any issue contact Admin ,our service are very Quick touching    ***  <br />
                                               ***** Happy Blogging **** <br />
                    </p>

                </div>


                <button className='add-blog-button' onClick={submit}  disabled={loading}>
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