// ログイン確認用
module.exports.isLoggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        console.log('isAuthenticated:', req.isAuthenticated());
        console.log('originalUrl:', req.originalUrl);
        console.log('before set returnTo:', req.session.returnTo);

        req.session.returnTo = req.originalUrl;
        req.flash('error', 'ログインしてください');
        return res.redirect('/login');
    }
    next();
} 
// usenameをEJSで使えるようにするためのミドルウェア
module.exports.setUsername = (req, res, next) => {
    res.locals.username = req.user ? req.user.username : null; 
    next();
};
