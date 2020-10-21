const express = require("express");
const app = express();
const cors = require("cors");

/* sets it up so that anytime I want to access data from client side
I'm going to have to access acress that body and this allows us to do that access

allows us to access req.body
*/
app.use(express.json()); //req.body

// cors allows backend to interact with frontend
app.use(cors());

// ROUTES //

// register and login routes

app.use("/auth", require("./routes/jwtAuth"));

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
