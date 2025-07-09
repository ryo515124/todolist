const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register')
});
router.post('/register', async (req, res) => {
    try {
        const {email, username, password} = req.body;
        const user = new User({ email, username })
        const registerdUser = await User.register(user, password);
        console.log(registerdUser);
        req.flash('success', 'ようこそ');
        res.redirect('/tasks/home');
    } catch(e) {
        console.log(e);
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
});

module.exports = router;