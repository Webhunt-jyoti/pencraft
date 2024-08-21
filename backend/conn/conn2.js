const mongoose = require("mongoose");
const conn2 = async () => {
    try {
        await mongoose.connect(`${process.env.uri2}`)
            .then(() => console.log("username coonected to db"))


    } catch (error) {
        console.log(error);

    }
};
conn2();