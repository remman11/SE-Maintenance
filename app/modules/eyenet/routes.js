var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC')

var aboutRouter = express.Router();
var contactRouter = express.Router();
var indexRouter = express.Router();
var loginRouter = express.Router();
var signupRouter = express.Router();
var inquireRouter = express.Router();
indexRouter.get('/',(req,res)=>{
    res.render('eyenet/views/home');
});

aboutRouter.get('/',(req,res)=>{
    res.render('eyenet/views/about');
});
contactRouter.get('/',(req,res)=>{
    res.render('eyenet/views/contact');
});
inquireRouter.get('/',(req,res)=>{
    res.render('eyenet/views/inquire');
});
inquireRouter.post('/',(req,res)=>{
    db.query(`insert into tblinquiry
        (datIDate,strGuestName,
        strISubject,
        strGuestEmail,
        strIMessage) 
        values
        (curdate(),"${req.body.gname}","${req.body.subject}","${req.body.email}","${req.body.message}");`,(err,results,field)=>{
            if(err) throw err;
            res.redirect('/login?success=inq');
    });
});




function selectccna(req,res,next){db.query(`select * from tblschedview where intSCourseID = 1`,(err,res,fields)=>{req.pans = res;return next();});}
function selectccnp(req,res,next){db.query(`select * from tblschedview where intSCourseID = 2`,(err,res,fields)=>{req.hats = res;return next();});}
function selectcybs(req,res,next){db.query(`select * from tblschedview where intScourseID = 3`,(err,res,fields)=>{req.ants = res;return next();});}
function renderCCNA(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,field)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenet/views/signupforms/EnrollmentFormCCNA`,{pans: req.pans});})}
function renderCCNP(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,field)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenet/views/signupforms/EnrollmentFormCCNP`,{hats: req.hats});})}
function renderCybersec(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,fields)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenet/views/signupforms/EnrollmentFormCybersec`,{ants : req.ants});})}

signupRouter.get(`/`,(req,res)=>{
    res.render(`eyenet/views/signupforms/enrollment`);
});
signupRouter.get(`/enrollment/ccna`,selectccna,renderCCNA);
signupRouter.get(`/enrollment/ccnp`,selectccnp,renderCCNP);
signupRouter.get(`/enrollment/cybersecurity`,selectcybs,renderCybersec);
signupRouter.post(`/enrollment/ccna`,(req,res)=>{
    var newID = counter.smart(req.body.PID);
    var nnID = counter.smart(req.body.PID);
    var active = 1; 
    var utype = 2;
    var ccna = `ccna for ${newID}`;
    db.query(`insert into tbluser
            (intUserID,
            strUFName,  strUMName,strULName,
            strUMobNum,strUTelNum,strUEmail,
            datUBirthday,intUStatusID) values
            ("${newID}",
            "${req.body.fname}","${req.body.mname}","${req.body.lname}",
            "${req.body.mobnum}","${req.body.telnum}","${req.body.email}",
            "${req.body.bday}","${active}");`,(err,results,field)=>{
                if(err) throw err;
    });
    db.query(`insert into tblaccount 
            (intAUserID,strAUsername,strAPassword,intAStatusID,intAUserTypeID)
            values("${newID}","${req.body.username}","${req.body.password}","${active}","${utype}")`,
            `insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            value("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;   
            });
    db.query(`insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            values 
            ("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;
            });
    return res.redirect('/login?success=1');
});
signupRouter.post(`/enrollment/ccnp`,(req,res)=>{
    var newID = counter.smart(req.body.PID);
    var nnID = counter.smart(req.body.PID);
    var active = 1; 
    var utype = 2;
    var ccna = `ccnp for ${newID}`;
    db.query(`insert into tbluser
            (intUserID,
            strUFName,strUMName,strULName,
            strUMobNum,strUTelNum,strUEmail,
            datUBirthday,intUStatusID) values
            ("${newID}",
            "${req.body.fname}","${req.body.mname}","${req.body.lname}",
            "${req.body.mobnum}","${req.body.telnum}","${req.body.email}",
            "${req.body.bday}","${active}");`,(err,results,field)=>{
                if(err) throw err;
    });
    db.query(`insert into tblaccount 
            (intAUserID,strAUsername,strAPassword,intAStatusID,intAUserTypeID)
            values("${newID}","${req.body.username}","${req.body.password}","${active}","${utype}")`,
            `insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            value("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;   
            });
    db.query(`insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            values 
            ("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;
            });
    return res.redirect('/login?success=1');
});
signupRouter.post(`/enrollment/cybersecurity`,(req,res)=>{
    var newID = counter.smart(req.body.PID);
    var nnID = counter.smart(req.body.PID);
    var active = 1; 
    var utype = 2;
    var ccna = `cybersec for ${newID}`;
    db.query(`insert into tbluser
            (intUserID,
            strUFName,strUMName,strULName,
            strUMobNum,strUTelNum,strUEmail,
            datUBirthday,intUStatusID) values
            ("${newID}",
            "${req.body.fname}","${req.body.mname}","${req.body.lname}",
            "${req.body.mobnum}","${req.body.telnum}","${req.body.email}",
            "${req.body.bday}","${active}");`,(err,results,field)=>{
                if(err) throw err;
    });
    db.query(`insert into tblaccount 
            (intAUserID,strAUsername,strAPassword,intAStatusID,intAUserTypeID)
            values("${newID}","${req.body.username}","${req.body.password}","${active}","${utype}")`,
            `insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            value("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;   
            });
    db.query(`insert into tblschedline
            (strSchedListDesc,intSLSchedID,intSLUserID)
            values 
            ("${ccna}",${req.body.sched},${newID});`,(err,results,field)=>{
                if(err) throw err;
            });
    return res.redirect('/login?success=1');
});

exports.signup = signupRouter;
exports.inquire = inquireRouter;
exports.home = indexRouter;
exports.about = aboutRouter;
exports.contact = contactRouter;