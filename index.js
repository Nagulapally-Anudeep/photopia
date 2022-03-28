const express = require('express');
const app = express();

//setup ejs
app.set('view engine', 'ejs');


const port = process.env.PORT || 3000;
app.listen(port, () => console.log("Server is running on port " + port));