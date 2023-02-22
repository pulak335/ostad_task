
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");
const signinRouter = require("./routes/user.route")

//use all middleware
app.use(express.json());
app.use(cors());

app.use('/api/user', signinRouter)

module.exports = app;