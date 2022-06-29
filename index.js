const express = require('express');
const bodyParser = require('body-parser'); // Not needed!
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const app = express();


// Newer version of express has urleconded, so can just do express(NOT app!).urlencoded(), no need bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession( {
    keys: ['aascohjzc3934901odc']
}));


app.listen(3000, () => {
    console.log('Listening');
});

