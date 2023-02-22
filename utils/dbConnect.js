const mongoose = require("mongoose");
const colors = require("colors");

const dbConnect = () =>{
    mongoose.connect(process.env.MONGODB_URI,{ useNewUrlParser: true })
  .then(()=>{
    console.log("Database connection established".red.bold);
  }).catch((error)=>{
    console.log(error)
  })
}

module.exports = dbConnect;