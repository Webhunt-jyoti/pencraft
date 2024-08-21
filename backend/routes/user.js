const express = require('express');
const cors = require('cors');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");
const blogs = require("../models/blogs");
require('dotenv').config();


const formData = require('form-data');
const Mailgun = require('mailgun.js');

// Initialize Mailgun client
const mailgun = new Mailgun(formData);
const mg = mailgun.client({ username: 'api', key: process.env.MAILGUN_API_KEY });



// mg.messages.create('sandboxc7ba3f5447824c56b88a5cdf19db844c.mailgun.org', {
//     from: "Excited User <mailgun@sandbox-123.mailgun.org>",
//     to: ["test@example.com"],
//     subject: "Hello",
//     text: "Testing some Mailgun awesomness!",
//     html: "<h1>Testing some Mailgun awesomness!</h1>"
//   })
//   .then(msg => console.log(msg)) // logs response data
//   .catch(err => console.error(err)); // logs any error




const SECRET_KEY = 'super-secret-key';



app.use(cors());


// REGISTER
// POST REGISTER
router.post('/register', async (req, res) => {
  try {
    const paidTopics = ["default"];
    const { email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, username, password: hashedPassword, paidTopics });
    await newUser.save();
    res.status(200).json({ message: 'User created successfully' });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: 'Error signing up' });
  }
});

// GET Registered Users
router.get('/register', async (req, res) => {
  try {
    const users = await User.find();
    res.status(201).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Unable to get users' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log("userId", user._id)

    const token = jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });

    // Include user details and token in the response
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        paidtopic: user.paidTopics
        // Include any other user details you need
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Error logging in' });
  }
});

router.get("/getpaidtopic", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await User.findById(id);
    res.status(200).json({ data: data });

  } catch (error) {
    res.status(400).json({ message: "some error ioccurs" })
  }
})

router.post('/notify', async (req, res) => {
  const { email, course, id } = req.body;
  // console.log(process.env.MAILGUN_DOMAIN + ok)

  const data = {
    from: email,
    to: 'jyotiranjanmahapatra899@gmail.com',
    subject: 'New Submission from Page4',
    text: `Course: ${course}\nEmail: ${email} ID:${id}`,

  };
  // console.log(data)

  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    res.status(200).json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }
});

//forget password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
      return res.status(400).send('User with this email does not exist');
  }

  // const token = crypto.randomBytes(32).toString('hex');
  const token =jwt.sign({ userId: user._id }, SECRET_KEY, { expiresIn: '1hr' });
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const data = {
      from: 'jyotiranjanmahapatra899@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Click the following link to reset your password:\n\nhttp://localhost:3001/reset-password/${token}`,
  };
 
  try {
    await mg.messages.create(process.env.MAILGUN_DOMAIN, data);
    res.status(200).json({ message: 'Notification sent successfully!' });
  } catch (error) {
    console.error('Error sending email', error);
    res.status(500).json({ error: 'Failed to send notification.' });
  }

  // mg.messages().send(data, (error, body) => {
  //     if (error) {
  //         return res.status(500).send('Error sending the email');
  //     }
  //     res.status(200).send('Password reset link has been sent to your email');
  // });
});
//forget password ending...


//reset password started
router.post('/reset-password', async (req, res) => {
  const { token, password } = req.body;

  const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
      return res.status(400).send('Password reset token is invalid or has expired');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  user.password = hashedPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.status(200).send('Your password has been successfully reset!');
});

//reset password ending...

router.use(bodyParser.urlencoded({ extended: true }));







// Store replies temporarily in memory (use a database in production)
let emailReplies = {};

app.post('/email-reply', (req, res) => {
  const { emailFrom, emailBody } = req.body;
  console.log(emailFrom)

  // Store the reply
  emailReplies[emailFrom] = { body: emailBody };

  console.log(`Received reply from ${emailFrom}: ${emailBody}`);

  // Respond to acknowledge receipt
  res.status(200).send('Reply received');
});

// In-memory store for demonstration purposes

// Endpoint to check for email replies
app.get('/check-reply/:email', (req, res) => {
  const email = req.params.email;


  if (emailReplies[email]) {
    res.status(200).json({ hasReply: true, reply: emailReplies[email] });
  } else {
    res.status(200).json({ hasReply: false });
  }
});

//fetch allpaid topics
router.get('/getPaidTopics', async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find();
    // console.log('Users:', users); // Log all users

    // Create a Set to hold unique paid topics
    const paidTopicsSet = new Set();

    // Extract and aggregate paid topics from each user
    users.forEach(user => {
      // Check the type of user.paidTopics
      // console.log('Paid Topics:', user.paidTopics); // Log paid topics

      if (typeof user.paidTopics === 'string') {
        // If paidTopics is a string, split it into an array
        const topics = user.paidTopics.split(',');
        topics.forEach(topic => paidTopicsSet.add(topic.trim())); // Trim whitespace and add to the set
      } else if (Array.isArray(user.paidTopics)) {
        // If paidTopics is already an array
        user.paidTopics.forEach(topic => paidTopicsSet.add(topic.trim())); // Trim whitespace and add to the set
      } else {
        console.warn('Unexpected data format for paidTopics:', user.paidTopics);
      }
    });

    // Convert the Set to an array
    const paidTopicsArray = Array.from(paidTopicsSet);

    // Respond with the aggregated list of paid topics
    res.json({ data: { paidTopics: paidTopicsArray } });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paid topics', error });
  }
});

// Endpoint to update paid topics
router.post('/updatePaidTopics/:id', async (req, res) => {
  const { userId, topic } = req.body;

  try {
    // Find the user and update the paidTopics field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Add the topic to the paidTopics field if it's not already there
    let paidTopics = user.paidTopics.split(',').map(t => t.trim());
    if (!paidTopics.includes(topic)) {
      paidTopics.push(topic);
      user.paidTopics = paidTopics.join(',');
      await user.save();
    }

    res.status(200).json({ message: "Paid topics updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post('/updatePaidTopics', async (req, res) => {
  const { paidTopics } = req.body;

  try {
    // const users = await User.find({ paidTopics: { $type: 'string' } });

    // for (const user of users) {

    //   user.paidTopics = user.paidTopics.split(','); // Adjust the split logic if needed
    //   await user.save();
    // }
    // Update all users with the new topic
    await User.updateMany(
      {}, // Empty filter to match all users
      { $addToSet: { paidTopics: paidTopics } } // Use $addToSet to avoid duplicates
    );
    res.status(200).json({ message: 'Paid topics updated for all users' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating paid topics', error });
  }
});

//check email
router.post('/checkEmail', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      // Email exists
      return res.status(200).json({ exists: true });
    }
    // Email does not exist
    res.status(200).json({ exists: false });
  } catch (error) {
    res.status(500).json({ message: 'Error checking email', error });
  }
});


//delete a paid topic
router.post('/deletePaidTopic', async (req, res) => {
  const { userId, topicToDelete, topicToDisplay } = req.body;
  console.log(topicToDelete + "ok" + topicToDisplay)

  try {
    // Update the user's paidTopics array by removing the specified topic
    const result = await User.updateOne(
      { _id: userId }, // Find user by ID
      {
        $pull: { paidTopics: topicToDelete },
        $addToSet: { ontopics: topicToDisplay }
      }

    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Topic removed and added successfully' });
    } else {
      res.status(404).json({ message: 'User not found or topic not in paidTopics' });
    }
  } catch (error) {
    console.error('Error removing topic:', error);
    res.status(500).json({ message: 'Error removing topic', error });
  }
});

// Route to add a topic to the array
router.post('/addTopic', async (req, res) => {
  const { documentId, newTopic, topicToDisplay } = req.body;

  try {
    // Update the document's topics array by adding the new topic
    const result = await YourModel.updateOne(
      { _id: documentId }, // Find document by ID
      { $addToSet: { topics: newTopic } },
      { $addToSet: { ontopics: topicToDisplay } } // Add newTopic to topics array, avoid duplicates
    );

    if (result.modifiedCount > 0) {
      res.status(200).json({ message: 'Topic added successfully' });
    } else {
      res.status(404).json({ message: 'Document not found' });
    }
  } catch (error) {
    console.error('Error adding topic:', error);
    res.status(500).json({ message: 'Error adding topic', error });
  }
});

//fetch on topics
//fetch allpaid topics
router.get('/getonTopics/:id', async (req, res) => {
  const {id} = req.params;
  try {
    // Fetch all users
    const users = await User.findById(id);

    
    res.status(200).json({ data:  users } );
  } catch (error) {
    res.status(500).json({ message: 'Error fetching paid topics', error });
  }
})






module.exports = router;
