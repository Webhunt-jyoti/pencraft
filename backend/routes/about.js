const router = require("express").Router();
const About = require("../models/about");
const express = require('express');
const cors = require('cors');



// Create a new topic
router.post('/aboutpost', async (req, res) => {
    console.log("Received body:", req.body); // Debugging line to see what the server receives
    try {
        const { name, about ,author} = req.body.topic;
        const{sub} = req.body;
        console.log(req.body.topic + "ok"+ sub)
        

        // Validate if `name` and `about` fields are present
        if (!name || !about) {
            return res.status(400).json({ message: 'Name and About fields are required' });
        }
        console.log(name+ "ok"+ about+"ok"+author)

        const newPost = new About({
            sub:sub,
            topic: {
                name,
                about,
                author
            }
        });

        await newPost.save();
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Some error occurred' });
    }
});

router.get('/getabout', async (req, res) => {
    try {
       const data = await About.find();
       res.status(200).json({ data :data});
       
        
    } catch (error) {
        res.status(400).json({ message: 'Some error occurred' });
    }
});

router.get('/checktopic/:topicc', async (req, res) => {
    try {
        const { topicc} = req.params;
        const trimmedTopic = topicc.trim();
        // console.log(topicc + "okokok")
        

        // Query your database to check if the topic exists
        const existingTopic = await About.findOne({  sub:topicc }); // Adjust based on your schema
        // console.log(existingTopic+ "huuu")
        if (existingTopic) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

 // Route to delete a topic
 router.post('/deletetopicc', async (req, res) => {
    const { topic} = req.body ;
    console.log(topic)

    if (!topic ) {
        return res.status(400).json({ message: 'Topic and authorId are required' });
    }

    try {
        // Find all topic with the given topic 
        const result = await About.deleteOne( {sub:topic});

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Topic deleted successfully' });
        } else {
            res.status(404).json({ message: 'No blogs found for the given topic and authorId' });
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ message: 'Failed to delete topic' });
    }
});

module.exports = router;