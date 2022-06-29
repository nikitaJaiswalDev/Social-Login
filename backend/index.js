const express = require('express');
const mongoose = require('mongoose')
const routes = require('./routes')
var cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);

// const mongoString = 'mongodb://127.0.0.1:27017/brightFuture'
// mongoose.connect(mongoString);
// const database = mongoose.connection

// database.on('error', (error) => {
//     console.log(error)
// })

// database.once('connected', () => {
//     console.log('Database Connected');
// })

app.listen(5000, () => {
    console.log(`Server Started at ${5000}`)
})