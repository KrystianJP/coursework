const User = require("./models/User");
require("dotenv").config();

var mongoose = require("mongoose");
var mongoDB = process.env.MONGODB_URI;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

let sampleUser = new User({
  username: "hello",
  password: "1234",
});

sampleUser.save((err, result) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log("Saved " + result.username);
});
