const express = require('express');

const cors = require('cors');
const blogs = require('./routes/blogs');
const user = require('./routes/user');
const about = require('./routes/about');
const path = require('path');


require('dotenv').config();
require('./conn/conn');

const app = express();

app.use(cors());
app.use(express.json());


app.use('/api/v1', blogs);
app.use('/api2/v2', user);
app.use('/api3/v3', about);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});


