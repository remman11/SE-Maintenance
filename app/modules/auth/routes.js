var express = require('express');
var loginRouter = express.Router();
var logoutRouter = express.Router();
var signupRouter = express.Router();

var authMiddleware = require('./middlewares/auth');

loginRouter.route('/')
    .get(authMiddleware.noAuthed, (req, res) => {
        res.render('eyenet/views/eyenetLogin', req.query);
    })
    .post((req, res) => {
        var db = require('../../lib/database')();

        db.query(`SELECT * FROM tblaccount WHERE strAUsername="${req.body.username}"`,(err, results, fields)=>{
            if(err) throw err;
            console.log(err);

            if (results.length === 0) 
            {
                return res.redirect('/login?e=1');
            }
            var user = results[0];

            if (user.strAPassword !== req.body.password) return res.redirect('/login?e=1');

            delete user.strAPassword;

            req.session.user = user;
            if(req.session.user.intAUserTypeID===1)
            return res.redirect(`/eyenetAdmin/dashboard`);
            else
            return res.redirect(`/eyenetUsers/dashboard`);
        });
    });
logoutRouter.get('/', (req, res) => {
    req.session.destroy(err => {
        if (err) throw err;
        res.redirect('/login');
    });
});


exports.login = loginRouter;
exports.logout = logoutRouter;      