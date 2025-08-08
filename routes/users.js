const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const { storeReturnTo } = require('../middleware')
router.get('/register', (req, res) => {
    res.render('users/register')
});
router.post('/register', async (req, res, next) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username })
        const registerdUser = await User.register(user, password);
        req.login(registerdUser, err =>  {
            if (err) return next(err);
            req.flash('success', 'ようこそ');
            res.redirect('/tasks/home');
        })
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/register');
    }
});

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login', storeReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    req.flash('success', 'おかえりなさい');
    const redirectUrl = res.locals.returnTo || 'tasks/home';
    res.redirect(redirectUrl);
});

router.get('/logout', async (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success', 'ログアウトしました');
        res.redirect('/tasks/home');
    });
});

module.exports = router;