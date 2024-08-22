import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import "./blogs.css";
import Chatgpt from '../components/chatgpt/chatgpt';
import { useUser } from '../components/contexts/UserContext';

const EXCLUDED_TOPICS = process.env.REACT_APP_EXCLUDED_TOPICS?.split(',') || [];
const render_url ="https://blognest-or4v.onrender.com";
// const render_url =" http://localhost:3000"




const groupByTopic = (blogs) => {
  return blogs.reduce((acc, blog) => {
    if (blog.topic) {
      (acc[blog.topic] = acc[blog.topic] || []).push(blog);
    }
    return acc;
  }, {});
};

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [paidtopic, setpaidtopic] = useState([]);
  const [about, setabout] = useState([]);
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState(''); // State for search query

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
    const fetchBlogs = async () => {
      try {
        const response = await axios.get(`${render_url}/api3/v3/getabout`);
        setabout(response.data.data);
      } catch (error) {
        alert("Some error occurred");
      }
    };
    fetchBlogs();
  }, []);

  useEffect(() => {
    const fetchpaidtopic = async () => {
      try {
        const response = await axios.get(`${render_url}/api2/v2/getPaidTopics`);
        setpaidtopic(response.data.data.paidTopics);
      } catch (error) {
        console.log(error);
      }
    }
    fetchpaidtopic();
  }, []);

  useEffect(() => {
    const updatepaidtopic = async () => {
      try {
        await axios.post(`${render_url}/api2/v2/updatePaidTopics`, {
          paidTopics: paidtopic
        });
      } catch (error) {
        console.log("error in update paid topic");
      }
    }
    updatepaidtopic();
  }, [paidtopic]);

  
  const groupedBlogs = groupByTopic(blogs);

  // Function to filter blogs based on search query
  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.topic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className='page2'>
        {/* Search bar */}
        <input
          type="text"
          placeholder="Search blogs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />

        {Object.keys(groupByTopic(filteredBlogs)).length > 0 ? (
          Object.keys(groupByTopic(filteredBlogs)).map((topic, i) => {
            const isPaid = !paidtopic.includes(topic.split("@")[0]);

            const actionContent = isPaid ? (
              <div className='topic-box' key={i}>
                <h1>{topic.split("@")[0]}</h1>
                {about.map((item, k) => (
                  item.topic.name === topic.split("@")[0] ?
                    <div className='about-box' key={k}>
                      <p>{item.topic.about}</p>
                      <p>posted by : {item.topic.author}</p>
                    </div> : null
                ))}

                {groupByTopic(filteredBlogs)[topic].slice(0, 1).map((item, j) => (
                  <div className='page2-box' key={j}>
                    <h2>{item.title}</h2>
                    <p>{item.desc.slice(0, 20)}...</p>
                  </div>
                ))}
                <Link to={`/topic/${topic}/${key}`} className='read-more-link'>
                  View All Blogs on {topic.split("@")[0]}
                </Link>

                {user.id === "66c42a21c9862ecb0dea7cb2" || user.email === "khadushboy@gmail.com" ? (
                  <>
                    {/* <Link to={`/topic/${topic}/${key}`} className='read-more-link'>
                      View All Blogs on {topic.split("@")[0]}
                    </Link> */}
                    <Link to={`/payment_update/${topic}`} className='read-more-link'>
                      <button>Update By admin</button>
                    </Link>
                    
                  </>
                ) : (""
                  // <>
                  //   <Link to='/page3'>
                  //     <button className='pay-btn'>Paid Blog go to sale section</button>
                  //   </Link>
                  // </>
                )}





              </div>
            ) : (
              <div className='topic-box' key={i}>
                <h1>{topic.split("@")[0]}</h1>
                {about.map((item, k) => (
                  item.topic.name === topic.split("@")[0] ?
                    <div className='about-box' key={k}>
                      <p>{item.topic.about}</p>
                      <p>posted by : {item.topic.author}</p>
                    </div> : null
                ))}
                {groupByTopic(filteredBlogs)[topic].slice(0, 2).map((item, j) => (
                  <div className='page2-box' key={j}>
                    <h2>{item.title}</h2>
                    <p>{item.desc.slice(0, 20)}...</p>
                  </div>
                ))}

                {user.id === "66c42a21c9862ecb0dea7cb2" || user.email === "khadushboy@gmail.com" ? (
                  <>
                    <Link to={`/topic/${topic}/${key}`} className='read-more-link'>
                      View All Blogs on {topic.split("@")[0]}
                    </Link>
                    <Link to={`/payment_update/${topic}`} className='read-more-link'>
                      <button>Update by admin</button>
                    </Link>
                    
                  </>
                ) : (
                  <>
                    <Link to='/page3'>
                      <button className='pay-btn'>Paid Blog go to sale section</button>
                    </Link>
                  </>
                )}
              </div>
            );
            // <p>Posted by : <span></span></p>
            return actionContent;
            
            })
        ) : (
          <p>No blogs available.</p>
        )}
      </div>
      <Chatgpt />
    </>
  );
};

export default Blogs;
