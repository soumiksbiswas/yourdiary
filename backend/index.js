const connectToMongo = require('./db.js');
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors()); // NOTE: cors should be intalled in backend, this is needed to access a route from the backend server.
// Otherwise, error: Access to "https://localhost:5000/" from origin "https://localhost:3000" has been blocked by CORS policy


connectToMongo(); // note the async nature, this is printed in the console later

const port = 5000; // React app will run on port 3000, so we assign port 3000 for our API

app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.listen(port, ()=>{
    console.log(`App listening at http://localhost:${port}`)
})