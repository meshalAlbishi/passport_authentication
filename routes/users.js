const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const passport = require('passport');

// login page
router.get('/login', (req, res) => {
    res.render('login');
});


// login handle
router.post('/login',
    passport.authenticate('local', {

        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true

    })
);


// register page
router.get('/register', (req, res) => {
    res.render('register');
});


// register handle
router.post('/register', async (req, res) => {

    const { name, email, password, password2 } = req.body;
    let errors = [];

    if (!name || !email || !password || !password2) {
        errors.push({ msg: 'Please fill all fields' });
    }

    if (password !== password2) {
        errors.push({ msg: 'password need to match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'password need to be 6 or more' });
    }

    if (errors.length > 0) {

        res.render('register', { errors, name, email, password, password2 });

    } else {

        const user = await User.findOne({ email: email });
        if (user) {
            errors.push({ msg: "user alreadu registred" })
            return res.render('register', { errors, name, email, password, password2 });
        }

        const newUser = new User({
            name, email, password
        });


        const hashedPassword = bcrypt.hash(password, 10);

        newUser.password = (await hashedPassword).toString();

        try {
            await newUser.save();
            console.log(newUser);

            res.redirect('/login');

        } catch (error) {
            console.log(error);
        }
    }

});


// logout handle
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'you are logged out');
    res.redirect('/users/login');
});



module.exports = router;