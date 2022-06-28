const express = require('express');
const bodyParser = require('body-parser'); // Not needed!

const app = express();


// Newer version of express has urleconded, so can just do express(NOT app!).urlencoded(), no need bodyParser
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email">
                <input name="password" placeholder="password">
                <input name="passwordConfirmation" placeholder="password confirmation">
                <button>Sign Up</button>
            </form>
        </div>
    `);
});

// const bodyParser = (req, res, next) => {
//     if (req.method === 'POST') {
//         req.on('data', (data) => {
//             const parsed = data.toString('utf8').split('&');
//             // console.log(parsed);
//             const formData = {};
//             for (let pair of parsed) {
//                 const [key, value] = pair.split('=');
//                 // console.log(`${key} is ${value}`)
//                 formData[key] = value;
//             }
//             req.body = formData;
//             next();
//         });
//     } else {
//         next();
//     }
// };

app.post('/', (req, res) => {
    console.log(req.on, req.body, req.method);
    console.log('POST REQUEST HANDLER');
    res.send('Account created!!');
});

app.listen(3000, () => {
    console.log('Listening');
})

