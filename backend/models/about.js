const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
    sub:{type:String,required:true},
    topic: {
        name: {
            type: String,
            required: true,
        },
        about: {
            type: String,
            required: true,
        },
        author: {
            type: String,
            required: true,
        }
    }
},{ timestamps: true });

module.exports = mongoose.model('About', aboutSchema);
