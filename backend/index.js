const express = require('express');
const routes = require('./routes');
var cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);


app.listen(5000, () => {
    console.log(`Server Started at ${5000}`)
})