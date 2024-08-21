const mongoose = require("mongoose");
const conn = async () => {
    try {
        await mongoose.connect(`${process.env.uri}`)
            .then(() => console.log("coonected to db"))


    } catch (error) {
        console.log(error);

    }
};
conn();