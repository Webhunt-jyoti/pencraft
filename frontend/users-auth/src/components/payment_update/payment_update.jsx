import React, { useState } from 'react'
import "./payment_update.css"
import { useParams, } from 'react-router-dom'
import axios from 'axios';



const render_url =" http://localhost:3000"
// const render_url ="https://blognest-or4v.onrender.com"





const Payment_update = () => {
    const topic = useParams().topic;
    const [newtopic, setnewtopic] = useState()

    const [userId, setUserId] = useState('');
    const [topicToDelete, setTopicToDelete] = useState('');
    const [topicToDisplay, setTopicToDisplay] = useState('');
  
    console.log(topic)

    const handleUpdate = async () => {
        console.log(topic + "ok");
        console.log(newtopic + "okkk");
        try {
            const response = await axios.post(`${render_url}/api/v1/updatetopiclist`, { topic, newtopic });
            if (response.status === 200) {
                alert('Topic updated successfully');
                // Optionally, refresh the page or update the state to reflect changes
            }
        } catch (error) {
            console.error('Error updating topic:', error);
            alert('Failed to update topic');
        }
    };

   
    const handleDelete = async () => {
      try {
        const response = await axios.post(`${render_url}/api2/v2/deletePaidTopic`, { userId, topicToDelete ,topicToDisplay});
        if (response.status === 200) {
          alert('Topic removed successfully');
          // Optionally refresh data or update state
        }
      } catch (error) {
        console.error('Error removing topic:', error);
        alert('Failed to remove topic');
      }
    };



    //full blogs delete by admin
  const handleDeletefullblogbyadmin = async (topic) => {
    try {
        const response = await axios.post(`${render_url}/api/v1/deletetopicbyadmin`, { topic });
        if (response.status === 200) {
            alert(`full ${topic} blog deleted successfully`);
            // Refresh the blog list
            // setBlogs(blogs.filter(blog => blog.topic !== topic));
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Failed to delete topic');
    }
};
//topic end delete by admin 
    //full blogs delete by admin
  const handleDeletefulltopicbyadmin = async (topic) => {
    try {
        const response = await axios.post(`${render_url}/api3/v3/deletetopicc`, { topic });
        if (response.status === 200) {
            alert(`full ${topic} blog deleted successfully`);
            // Refresh the blog list
            // setBlogs(blogs.filter(blog => blog.topic !== topic));
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        alert('Failed to delete topic');
    }
};
//topic end delete by admin 



    return (
        <div className='pay-box'>
            <h1>Topic update here</h1>
            <label htmlFor="Write your updated topic"></label>
            <input
                className='formtext'
                type="text"
                id='topic'
                name='topic'
                value={newtopic}
                onChange={
                    (e) => {
                        setnewtopic(e.target.value)
                    }
                }
                placeholder='Write Title'
            />
            <button className='btn' onClick={() => handleUpdate()}>Update</button> <br /> <br />
            <hr />

            <div className='delete-topic'>
                <input
                    type="text"
                    placeholder="User ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Topic to Delete"
                    value={topicToDelete}
                    onChange={(e) => setTopicToDelete(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Topic to display"
                    value={topicToDisplay}
                    onChange={(e) => setTopicToDisplay(e.target.value)}
                />
                <button onClick={handleDelete}>Delete Topic</button>
            </div>

            <hr />
            <hr />
            <h1>Delete full blog by admin from blogs database</h1>
            <button onClick={() => handleDeletefullblogbyadmin(topic)} className='delete-topic btn'>Delete full blog</button>
            <hr /><hr /><hr />
            <h1>Delete topic from about database</h1>
            <button onClick={() => handleDeletefulltopicbyadmin(topic)} className='delete-topic btn'>Delete full Topic</button>
            






        </div>
    )
}

export default Payment_update
