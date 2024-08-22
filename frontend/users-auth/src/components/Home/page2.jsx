
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./page2.css"
import { Link } from 'react-router-dom'


const render_url ="https://blognest-or4v.onrender.com"
// const render_url =" http://localhost:3000"



const EXCLUDED_TOPICS = process.env.REACT_APP_EXCLUDED_TOPICS?.split(',') || [];

const groupByTopic = (blogs) => {
    return blogs.reduce((acc, blog) => {
        if (blog.topic) {
            (acc[blog.topic] = acc[blog.topic] || []).push(blog);
        }
        return acc;
    }, {});
};




const Page2 = () => {
    const [blogs, setBlogs] = useState([]);
   

    const [paidtopic, setpaidtopic] = useState([])
    // const { user } = useUser();

    const key = "a1b2c3";

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const response = await axios.get(`${render_url}/api/v1/getall`);
                console.log(response.data.data)
                setBlogs(response.data.data || []);
            } catch (error) {
                alert("Some error occurred");
            }
        };
        fetchBlogs();
    }, []);

    useEffect(() => {
        const fetchpaidtopic = async () => {
            try {
                const response = await axios.get(`${render_url}/api2/v2/getPaidTopics`)
                console.log(response)
                setpaidtopic(response.data.data.paidTopics)
                console.log(paidtopic)


            } catch (error) {
                console.log(error)
            }
        }


        fetchpaidtopic();
    }, [])


    useEffect(() => {
        const updatepaidtopic = async () => {
            try {
                const response = await axios.post(`${render_url}/api2/v2/updatePaidTopics`, {
                    paidTopics: paidtopic // No need for userId here since it affects all users

                });
                console.log("update paidtopic succesful")
                // alert("succesfully update")

            } catch (error) {
                console.log("error in update paid topic")
            }

        }

        updatepaidtopic();
    })




    //   useEffect(() => {
    //     const fetchpaidtopic = async () => {
    //         try {
    //             const response = await axios.get(`${render_url}/api2/v2/getpaidtopic/${user.id}`);


    //             const topics = response.data.data.paidTopics;
    //             setPaidTopics(topics)


    //             console.log(paidTopics)
    //         } catch (error) {
    //             alert("Some error occurred");
    //         }
    //     };
    //     fetchpaidtopic();
    // }, [user.id]);

    // Function to handle the update operation






    const groupedBlogs = groupByTopic(blogs);



    const sortedTopics = Object.keys(groupedBlogs)
    .map(topic => ({
        topic,
        latestDate: new Date(Math.max(...groupedBlogs[topic].map(blog => new Date(blog.createdAt))))
    }))
    .sort((a, b) => b.latestDate - a.latestDate);

// Get only the first 3 latest topics
const latestThreeTopics = sortedTopics.slice(0, 3);

return (
    <div className='page2'>
        {latestThreeTopics.length > 0 ? (
            latestThreeTopics.map(({ topic }, i) => {
                const isPaid = !paidtopic.includes(topic.split("@")[0]);

                const actionContent = isPaid ? (
                    <div className='topic-box' key={i}>
                        <h1>{topic.split("@")[0]}</h1>
                        {groupedBlogs[topic].slice(0, 2).map((item, j) => (
                            <div className='page2-box' key={j}>
                                <h2>{item.title}</h2>
                                <p>{item.desc.slice(0, 20)}...</p>
                            </div>
                        ))}
                        <Link to={`/topic/${topic}/${key}`} className='read-more-link'>
                            View All Blogs on {topic.split("@")[0]}
                        </Link>
                    </div>
                ) : (
                    <div className='topic-box' key={i}>
                        <h1>{topic.split("@")[0]}</h1>
                        {groupedBlogs[topic].slice(0, 2).map((item, j) => (
                            <div className='page2-box' key={j}>
                                <h2>{item.title}</h2>
                                <p>{item.desc.slice(0, 20)}...</p>
                            </div>
                        ))}
                        <Link to='/page3'>
                            <button className='pay-btn'>Paid Blog go to sale section</button>
                        </Link>
                    </div>
                );

                return actionContent;
            })
        ) : (
            <p>No blogs available.</p>
        )}
    </div>
);
};

export default Page2;

