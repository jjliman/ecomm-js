// const bodyParser = require('body-parser'); // Not needed!

const express = require('express');

const { handleErrors } = require('./middlewares');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const { requireEmail, requirePassword, requirePasswordConfirmation, requireEmailExists, requireValidPasswordForUser } = require('./validators');

const router = express.Router();


router.get('/signup', (req, res) => {
    res.send(signupTemplate({}));
});

router.post(
    '/signup',
    [requireEmail, requirePassword, requirePasswordConfirmation], 
    handleErrors(signupTemplate),
    async (req, res) => {
        const { email, password, passwordConfirmation } = req.body;

        const user = await usersRepo.create({ email, password });

        req.session.userId = user.id;

        // console.log('POST REQUEST HANDLER');
        res.redirect('/admin/products');
});

router.get('/signout', (req, res) => {
    req.session = null;
    res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
    res.send(signinTemplate({}));
});

router.post(
    '/signin', 
    [requireEmailExists, requireValidPasswordForUser], 
    handleErrors(signinTemplate),
    async (req, res) => {        
        const { email } = req.body;
        const user = await usersRepo.getOneBy({ email });

        req.session.userId = user.id;
        res.redirect('/admin/products');
});

module.exports = router;



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
