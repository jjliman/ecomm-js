const express = require('express');
const bodyParser = require('body-parser'); // Not needed!
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth')

const app = express();

app.use(express.static('public'));
// Newer version of express has urleconded, so can just do express(NOT app!).urlencoded(), no need bodyParser
app.use(express.urlencoded({ extended: true }));
app.use(cookieSession( {
    keys: ['aascohjzc3934901odc']
}));

// IMPORTANT! Add router after middleware
app.use(authRouter);


app.listen(3000, () => {
    console.log('Listening');
});

