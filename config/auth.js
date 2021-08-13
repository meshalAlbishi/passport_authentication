function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    req.flash('error_msg', 'login please');
    res.redirect('/users/login');
}

module.exports = { ensureAuthenticated }