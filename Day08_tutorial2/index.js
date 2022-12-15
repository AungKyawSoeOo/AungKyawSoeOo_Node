const express = require("express");
const route = require("./route");
const app = express();
app.use("/", route);


app.listen(3000, () => {
  console.log("Server is listening on port 3000");
})