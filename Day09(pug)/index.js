const express = require("express");
const app = express();
app.set('view engine', 'pug');
app.set('views', './views');
app.use(express.static("public"));
app.get('/', function(req, res){
  res.render('template', {
    welcome: "Welcome from My Portfolio Website,Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,",
    age: 19,
    greet: "Hey I am Jonathan , a programmer and web developer",
    skills:["PHP","Node.js","HTML","CSS","Mongoose"]
  }  
  );
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
})