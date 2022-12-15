const mongoose = require('mongoose');
const mongoURI = "mongodb://localhost:27017/inotebook"

const connectToMongo=()=>{
    mongoose.connect(mongoURI,()=>{ // (mongoURI, callback funtion)
        console.log("Connected to mongoose successfully");
    });
};

module.exports = connectToMongo;

