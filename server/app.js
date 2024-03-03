const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const connectDB = require('./config/db'); 
const appRoutes = require('./routes/index')

const app = express();


const PORT = process.env.PORT || 5000;


// Call the connectDB function to establish the database connection
connectDB();

// Use bodyParser middleware for JSON data
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(appRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});

