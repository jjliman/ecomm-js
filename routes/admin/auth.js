// const bodyParser = require('body-parser'); // Not needed!

const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();


router.get('/signup', (req, res) => {
    res.send(signupTemplate({ req }));
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

router.post('/signup', async (req, res) => {
    // console.log(req.body);
    const { email, password, passwordConfirmation } = req.body;

    const existingUser = await usersRepo.getOneBy({ email });
    if (existingUser) {
        return res.send('Email in use!');
    }

    if (password !== passwordConfirmation) {
        return res.send('Passwords must match!');
    }

    const user = await usersRepo.create({ email, password });

    req.session.userId = user.id;

    // console.log('POST REQUEST HANDLER');
    res.send('Account created!!');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    const user = await usersRepo.getOneBy({ email });

    if (!user) {
        return res.send('Email not found');
    }

    const isValidPassword = await usersRepo.comparePassword(user.password, password);
    if (!isValidPassword) {
        return res.send('Invalid password');
    }


    req.session.userId = user.id;
    res.send('You are signed in!!');
});

module.exports = router;
