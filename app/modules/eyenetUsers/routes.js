var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');


function names(req,res,next){
    db.query(`select * from tbluser where intUserID = "${req.session.user.intAUserID}"`,(err,results,field)=>{
        req.names =  results;
        return next();
    });
}
function renderDashboard(req,res){
    res.render('eyenetUsers/views/dashboard',{cats: req.names})
}
router.get(`/dashboard`,authMiddleware.hasAuth,names,renderDashboard,(req,res)=>{
    db.query(`select * from tbluser where intUserID = "${req.session.user.intAUserID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.render(`../templates/eyenetUsers`,{park : results[0]});
    });
});

router.get(`/courseinfo`,authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblusercoursedetails where intSLUserID = "${req.session.user.intAUserID}"`,(err,results,field)=>{
        res.locals.ID = results[0].intSchedID;
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/dashboard');
        res.render(`eyenetUsers/views/CourseInformation`,{form : results[0]});
    })
});

router.get(`/documents`,authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tbluser WHERE intUserID = "${req.session.user.intAUserID}"`, (err, results, field) => {
        if(err) throw err;
        console.log(err);
        if(results[0] == null) res.redirect('/dashboard');
        console.log(results[0])
        var b = JSON.stringify(results[0]);
        console.log(b);
        return res.render(`eyenetUsers/views/documents`,{course:b});
    })
});
exports.eyenetUsers = router;