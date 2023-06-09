const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const bodyparser = require('body-parser');
const path = require('path');
const cors = require('cors');
const cookie = require('cookie-parser');


const connectDB = require('./server/database/connection');

const app = express();
app.use(cors());

dotenv.config({ path: 'config.env' });
const PORT = process.env.PORT || 8080;

app.use(cookie());

// log requests
app.use(morgan('tiny'));

// MongoDB connection
connectDB();

// parse - request to body parser
app.use(bodyparser.urlencoded({ extended: true }));

// set view engine
app.set("view engine", "ejs");
// app.set("views", path.resolve(__dirname, "views/ejs"));

// load assets
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
// use - css/style.css
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));

// Load router
app.use('/', require('./server/routes/router'))

app.listen(PORT, () =>
{
    console.log(`server is running on http://localhost:${PORT}`);
})