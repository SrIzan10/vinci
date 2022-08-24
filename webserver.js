const express = require('express');
const app = express();

// use the express-static middleware
app.use(express.static("public"))

// define the first route
app.get("/", function (req, res) {
  res.send("<p>This is the first server for the Vinci discord bot!</p>")
})

// start the server listening for requests
app.listen(process.env.PORT || 3000, 
	() => console.log("The webserver is listening on port " + process.env.PORT || 3000));