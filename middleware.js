module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log(req.session);
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
} 

module.exports.storeReturnTo = (req, res,next) => {
    if(req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}