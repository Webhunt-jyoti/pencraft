const router = require("express").Router();
const blogs = require("../models/blogs");


// Create a new blog
router.post('/post', async (req, res) => {
    try {
        const { title, desc, topic, authorId } = req.body;
        const newPost = new blogs({ title, desc, topic, authorId });
        await newPost.save();
        res.status(200).json({ message: 'Data saved successfully' });
    } catch (error) {
        res.status(400).json({ message: 'Some error occurred' });
    }
});
// Route to check if a topic exists
router.get('/checktopic/:topic', async (req, res) => {
    try {
        const { topic } = req.params;
        // Query your database to check if the topic exists
        const existingTopic = await blogs.findOne({  topic }); // Adjust based on your schema
        console.log(existingTopic)
        if (existingTopic) {
            return res.status(200).json({ exists: true });
        } else {
            return res.status(200).json({ exists: false });
        }
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});

// Fetch all topics
router.get('/gettopics', async (req, res) => {
    try {
        // Assuming 'topic' is a field in your Blog model
        const topics = await blogs.distinct('topic'); // Get unique topics from Blog collection
        res.status(200).json({ data: topics });
    } catch (error) {
        console.error("Error fetching topics:", error);
        res.status(500).json({ message: 'Error fetching topics' });
    }
});

//getblogsbytopic
router.get("/getblogsbytopic/:topic", async (req, res) => {
    try {
        const { topic } = req.params;
        const data = await blogs.find({ topic }).sort({ createdAt: -1 });
        res.status(200).json({ data: data });
    } catch (error) {
        res.status(400).json({ message: "Some error occurred" });
    }
});



// Get all blogs by topic
router.get('/getByTopic/:topic', async (req, res) => {
    try {
        const { topic } = req.params;
        const data = await blogs.find({ topic }).sort({ createdAt: -1 });
        res.status(200).json({ data: data });
    } catch (error) {
        res.status(400).json({ message: 'Some error occurred' });
    }
});
// Fetch blogs grouped by topic
router.get("/getall", async (req, res) => {
    try {
        const data = await blogs.find().sort({ createdAt: -1 });
        res.status(200).json({ data: data });
    } catch (error) {
        res.status(400).json({ message: "Some error occurred" });
    }
});
//get recent blogs
router.get("/getrecentblogs",async (req,res)=>{
    try {
       
       const data = await blogs.find().sort({createdAt:-1}).limit(3);
        res.status(200).json({data: data});
    } catch (error) {
        res.status(400).json({message:"some error ioccurs"})
    }
})
//get blog by id
router.get("/getblog/:id",async (req,res)=>{
    try {
       const {id} = req.params;
       const data = await blogs.findById(id);
        res.status(200).json({data: data});

    } catch (error) {
        res.status(400).json({message:"some error ioccurs"})
    }
})
//get update by id
router.put("/updateblog/:id",async (req,res)=>{
    try {
       const {id} = req.params;
       const{title,desc} = req.body;
       await blogs.findByIdAndUpdate(id ,{title,desc});
        res.status(200).json({message: "data update sucessfully"});

    } catch (error) {
        res.status(400).json({message:"some error ioccurs"})
    }
})

// Route to update a topic
router.post('/updatetopiclist', async (req, res) => {
    const { topic, newtopic } = req.body;
  
    try {
        // Log the values to verify
        console.log('Updating topic:', topic);
        console.log('New topic:', newtopic);
  
        // Perform the update
        const result = await blogs.updateMany(
            { topic: topic },
            { $set: { topic: newtopic } }
        );
  
        // Log the result to see details
        console.log('Update result:', result);
  
        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Topic updated successfully', result });
        } else {
            res.status(404).json({ message: 'Topic not found or no updates were made' });
        }
    } catch (error) {
        console.error('Error updating topic:', error);
        res.status(500).json({ message: 'Error updating topic', error });
    }
  });

  // Route to delete a topic
router.post('/deletetopic', async (req, res) => {
    const { topic, authorId } = req.body;

    if (!topic || !authorId) {
        return res.status(400).json({ message: 'Topic and authorId are required' });
    }

    try {
        // Find all blogs with the given topic and authorId
        const result = await blogs.deleteMany({ topic, authorId });

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
  // Route to delete a topic by admin
router.post('/deletetopicbyadmin', async (req, res) => {
    const { topic } = req.body;

    if (!topic ) {
        return res.status(400).json({ message: 'Topic and authorId are required' });
    }

    try {
        // Find all blogs with the given topic and authorId
        const result = await blogs.deleteMany({ topic});

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

// Route to delete a blog post by its _id
router.delete('/deleteblog/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Blog ID is required' });
    }

    try {
        const result = await blogs.findByIdAndDelete(id);

        if (result) {
            res.status(200).json({ message: 'Blog deleted successfully' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        console.error('Error deleting blog:', error);
        res.status(500).json({ message: 'Failed to delete blog' });
    }
});
  

module.exports = router;