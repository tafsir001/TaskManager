require('dotenv').config();

const connecrtToMongo = require('./db');
const express = require('express');
const cors = require('cors');
const port = process.env.PORT;

connecrtToMongo();
const app = express();
app.use(cors());
app.use(express.json());



// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));

app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
})
