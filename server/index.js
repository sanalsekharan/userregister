const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const moment = require('moment')
var api_key = '';// mailgun api key here
var domain = 'sandbox09df41a6268f42dfa431e2f5b75e5924.mailgun.org';
global.mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
const app = express();
app.use(cookieParser());

app.use(session({ secret: 'user register', resave: false, cookie: { secure: false } }));
app.use(cors());
app.use(bodyParser());
app.use('/static', express.static('./build/static'))
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'build')));

global.log = function (title, data) {
    const d = new Date();
    console.log('\n------------------------------------------------------------------------------\n')
    console.log('          ' + title + '       ' + d.toLocaleDateString() + ' ' + d.toLocaleTimeString());
    console.log('\n------------------------------------------------------------------------------\n')
    if (arguments.length > 1) {
        for (let i = 1; i < arguments.length; i++) {
            console.log(arguments[i]);
        }
    }
    console.log('\n------------------------------------------------------------------------------\n')
}

mongoose.connect('mongodb://localhost:27017/userRegister', function (err) {
    console.log('connected to local mongodb');
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));

const usersRouter = require('./config/userRouter');
app.use('/api/users', usersRouter);


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.listen(3030, function () {
    console.log('Example app listening on port 3030!')
})
