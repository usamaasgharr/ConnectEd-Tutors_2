const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');


const connectDB = require('./config/db'); 
const appRoutes = require('./routes/index')

const app = express();


const PORT = process.env.PORT || 5000;


// Call the connectDB function to establish the database connection
connectDB();

app.set('view engine', 'ejs');
app.set('views', 'views');


app.use(express.static('public'));

// Use bodyParser middleware for JSON data
app.use(bodyParser.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser());


// route to sereve images outside of public folder
/////////////////////////////////////////////////////////
app.get('/uploads/:imageName', (req, res) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(__dirname, 'uploads', imageName);
    console.log(imagePath)

    // Check if the image file exists
    if (fs.existsSync(imagePath)) {
        // Read the image file and send it as a response
        const imageStream = fs.createReadStream(imagePath);
        imageStream.pipe(res);
    } else {
        // If the image doesn't exist, send a 404 error
        res.status(404).send('Image not found');
    }
});
/////////////////////////////////////////////////////////


app.use(appRoutes);





// Start the server
app.listen(PORT, () => {
    console.log(`Server is listening at http://localhost:${PORT}`);
});

