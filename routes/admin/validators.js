const e = require('express');
const { check } = require('express-validator');
const usersRepo = require('../../repositories/users');

module.exports = {
    requireEmail: check('email')
                    .trim()
                    .normalizeEmail()
                    .isEmail()
                    .withMessage('Must be a valid email')
                    .custom(async (email) => {
                        const existingUser = await usersRepo.getOneBy({ email });
                        if (existingUser) {
                            throw new Error('Email in use!');
                        }
                    }),
    requirePassword: check('password')
                        .trim()
                        .isLength({ min: 4, max: 20 })
                        .withMessage('Must be between 4 and 20 characters'),
    // SYNCHRONOUS VALIDATORS FOR EXPRESS-VALIDATOR HAVE TO HAVE EXPLICIT BOOLEAN FLAG RETURN
    requirePasswordConfirmation: check('passwordConfirmation')
                                    .trim()
                                    .isLength({ min: 4, max: 20 })
                                    .withMessage('Must be between 4 and 20 characters')
                                    .custom((passwordConfirmation, { req }) => {
                                        if (passwordConfirmation !== req.body.password) {
                                            throw new Error('Passwords must match!');
                                        } else {
                                            return true;
                                        }
                                    }),
    requireEmailExists: check('email')
                            .trim()
                            .normalizeEmail()
                            .isEmail()
                            .withMessage('Must provide a valid email')
                            .custom(async (email) => {
                                const user = await usersRepo.getOneBy({ email });
                                if (!user) {
                                    throw new Error('Email not found!');
                                }
                            }),
    requireValidPasswordForUser: check('password')
                                    .trim()
                                    .custom(async (password, { req }) => {
                                        const user = await usersRepo.getOneBy({ email: req.body.email });
                                        if (!user) {
                                            throw new Error('Invalid password'); // Error message not correct
                                        }

                                        const isValidPassword = await usersRepo.comparePassword(user.password, password);
                                        if (!isValidPassword) {
                                            throw new Error('Invalid password');
                                        }
                                    })
};
