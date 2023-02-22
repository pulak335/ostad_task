const dotenv = require("dotenv").config();
const colors = require("colors");
const app = require("./app");
const dbConnect = require("./utils/dbConnect");



// database connection
dbConnect();



// server
const port = process.env.PORT ||8080;



app.listen(port, () => {
    console.log(`App is running on port ${port}`.yellow.bold);
  });

