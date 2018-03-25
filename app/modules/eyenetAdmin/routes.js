var express = require('express');
var router = express.Router();
var db = require('../../lib/database')();
var authMiddleware = require('../auth/middlewares/auth');
var counter = require('../auth/middlewares/SC');
var global = {};
router.use((req, res, next) => {
    res.locals.activeTab = req.query.active;
    return next();
});


// functions o plenty

function status(req,res,next){
    db.query(`select * from tblstatus`,(err,results,field)=>{
        req.stats = results;
        return next();
    });
}
function renderStatus(req,res){
    res.render(`eyenetAdmin/views/maintenance/forms/CourseForm`,{ships : req.fields});
}

function proctor(req,res,next){
    db.query(`select * from tblproctor`,(err,results,field)=>{
        req.proctors = results;
        return next();
    });
}
function course(req,res,next){
    db.query(`select * from tblcourse`,(err,resu,fiel)=>{
        req.courses = resu;
        return next();
    });
}

function schedStatus(req,res,next){
    db.query(`select * from tblschedstatus`,(err,resu,fiel)=>{
        req.sstats = resu;
        return next();
    });
}
function schedStatusE(req,res,next){
    db.query(`select * from tblschedstatusedit`,(err,resu,fiel)=>{
        req.statss = resu;
        return next();
    });
}
function renderSchedpage(req,res){
    db.query(`select MAX (intSchedID) AS intSchedID from tblsched`,(err,results,field)=>{
        res.locals.ID = results[0].intSchedID;
        res.render(`eyenetAdmin/views/maintenance/forms/ScheduleForm`,{nips : req.fields, tips : req.proctors, lips : req.courses});
    })
}
function renderSchedform(req,res){
    db.query(`SELECT MAX(intSchedID)AS intSchedID from tblsched`,(err,results,field)=>{
        res.locals.ID = results[0].intSchedID;
        return res.render(`eyenetAdmin/views/maintenance/forms/ScheduleForm`,{dips : req.sstats, tips : req.proctors, lips : req.courses});
    })
}
function renderSchedformE(req,res){
    db.query(`SELECT MAX(intSchedID)AS intSchedID from tblsched`,(err,results,field)=>{
        res.locals.ID = results[0].intSchedID;
        return res.render(`eyenetAdmin/views/maintenance/forms/ScheduleFormE`,{dips : req.statss, tips : req.proctors, lips : req.courses});
    })
}

function schedList(req,res,next){
    db.query(`select * from tblschedlist where MAX(StrStatusDesc);`,(err,resul,fields)=>{
        req.lists = resul;
        return next();
    });
}
function sched(req,res,next){
    db.query(`select * from tblsched`,(err,result,field)=>{
        req.scheds = result;
        return next ();
    })
}
function renderSchedList(req,res){
    res.render(`eyenetAdmin/views/maintenance/pages/schedView`,{lists :req.lists});
}

function scheduleActivities(req,res)
{
    db.query(`select * from tblschedact`,(err,results,field)=>{
        req.actives = results;
        return next ();
    });
}
function activities(req,res,next){
    db.query(`select * from tblactivities`,(err,results,field)=>{
        req.actives = results;
        return next ();
    });
}

function asched(req,res,next){
    db.query(`select * from tblsched`,(err,results,field)=>{
        req.ascheds = results;
        return next();
    })
}
function aactivities(req,res,next){
    db.query(`select * from tblactivities`,(err,results,field)=>{
        req.aactives = results;
        return next();
    })          
}
function arenderAssignActivities(req,res){
    res.render(`eyenetAdmin/views/transactions/forms/AssignActivitiesForm`,{pills: req.aactives, hills: req.ascheds});
}



router.get('/dashboard',(req,res)=>{
    res.render('eyenetAdmin/views/dashboard');
});

// dito magsisimula ang lahat ng kababalaghan sa program na ito.

//안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// activities maintenance interface backend

router.get('/activities',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblactivities`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/Activities',{users : results});
        console.log(results);    
    })  
});
router.get('/activities/new',(req,res)=>{
    db.query(`select max(intActID) as intActID from tblactivities`,(err,results,field)=>{
        res.locals.ID = results[0].intActID
        return res.render('eyenetAdmin/views/maintenance/forms/ActivitiesForm');
    }) 
});
router.post('/activities/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblactivities (intActID,strActDesc) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/activities');
    }) 
});
router.get('/activities/:intActID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblactivities where intActID = "${req.params.intActID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/activities');
        res.render('eyenetAdmin/views/maintenance/forms/ActivitiesForm',{form : results[0] });
    })
});

router.put('/activities/:intActID',(req,res)=>{
    db.query(`update tblactivities set
    strActDesc = "${req.body.etypename}"
    where intActID = "${req.params.intActID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/activities');
    })
});

router.get('/activities/:intActID/delete',(req,res)=>{
    db.query(`DELETE FROM tblactivities WHERE intActID = "${req.params.intActID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/activities');
    });
});

// end of activities

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

//안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// course maintenance interface backend

router.get('/course',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblcourse`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/Course',{users : results});
        console.log(results);    
    })  
});
router.get('/course/new',(req,res)=>{
    db.query(`select max(intCID) as intCID from tblcourse`,(err,results,field)=>{
        res.locals.ID = results[0].intCID
        return res.render('eyenetAdmin/views/maintenance/forms/CourseForm');
    }) 
});
router.post('/course/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblcourse (intCID,strCName,strCDetails,fltCFee) VALUES ("${nID}","${req.body.etypename}","${req.body.desc}","${req.body.cfee}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/course');
    }) 
});
router.get('/course/:intCID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblcourse where intCID =  "${req.params.intCID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/course');
        res.render('eyenetAdmin/views/maintenance/forms/CourseForm',{form : results[0]});
    })
});

router.put('/course/:intCID',(req,res)=>{
    db.query(`update tblcourse set
    strCName = "${req.body.etypename}", 
    strCDetails = "${req.body.desc}",
    fltCFee = "${req.body.cfee}"
    where intCID = "${req.params.intCID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/course');
    })
});

router.get('/course/:intCID/delete',(req,res)=>{
    db.query(`DELETE FROM tblcourse WHERE intCID = "${req.params.intCID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/course');
    });
});

//end of Course

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

//안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

//equipment type maintenance interface backend

router.get('/equiptype',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblequiptype`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/EquipmentType',{users : results});
        console.log(results);    
    })  
});
router.get('/equiptype/new',(req,res)=>{
    db.query(`select max(intEquipTypeID) as intEquipTypeID from tblequiptype`,(err,results,field)=>{
        res.locals.ID = results[0].intEquipTypeID
        return res.render('eyenetAdmin/views/maintenance/forms/EquipmentForm');
    }) 
});
router.post('/equiptype/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblequiptype (intEquipTypeID,strETName) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/equiptype');
    }) 
});
router.get('/equiptype/:intEquipTypeID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblequiptype where intEquipTypeID =  "${req.params.intEquipTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/equiptype');
        res.render('eyenetAdmin/views/maintenance/forms/EquipmentForm',{form : results[0] });
    })
});

router.put('/equiptype/:intEquipTypeID',(req,res)=>{
    db.query(`update tblequiptype set
    strETName = "${req.body.etypename}"
    where intEquipTypeID = "${req.params.intEquipTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/equiptype');
    })
});

router.get('/equiptype/:intEquipTypeID/delete',(req,res)=>{
    db.query(`DELETE FROM tblequiptype WHERE intEquipTypeID = "${req.params.intEquipTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/equiptype');
    });
});

//end of equiptype

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// payment status maintenance interface backend

router.get('/paymentType',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblpaytype`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/PaymentType',{users : results});
        console.log(results);    
    })  
});
router.get('/paymentType/new',(req,res)=>{
    db.query(`select max(intPayTypeID) as intPayTypeID from tblpaytype`,(err,results,field)=>{
        res.locals.ID = results[0].intPayTypeID
        return res.render('eyenetAdmin/views/maintenance/forms/PaymentTypeForm');
    }) 
});
router.post('/paymentType/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblpaytype (intPayTypeID,strPayTypeName) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/paymentType');
    }) 
});
router.get('/paymentType/:intPayTypeID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblpaytype where intPayTypeID = "${req.params.intPayTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/paymentType');
        res.render('eyenetAdmin/views/maintenance/forms/PaymentTypeForm',{form : results[0] });
    })
});

router.put('/paymentType/:intPayTypeID',(req,res)=>{
    db.query(`update tblpaytype set
    strPayTypeName = "${req.body.etypename}"
    where intPayTypeID = "${req.params.intPayTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/paymentType');
    })
});

router.get('/paymentType/:intPayTypeID/delete',(req,res)=>{
    db.query(`DELETE FROM tblpaytype WHERE intPayTypeID = "${req.params.intPayTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/paymentType');
    });
});

// payment status end

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// proctor maintenance interface backend

router.get('/proctors',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblproctor`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/Proctor',{users : results});
        console.log(results);    
    })  
});
router.get('/proctors/new',(req,res)=>{
    db.query(`select max(intProctorID) as intProctorID from tblproctor`,(err,results,field)=>{
        res.locals.ID = results[0].intProctorID
        return res.render('eyenetAdmin/views/maintenance/forms/ProctorForm');
    }) 
});
router.post('/proctors/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblproctor (intProctorID,strProctorName) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/proctors');
    }) 
});
router.get('/proctors/:intProctorID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblproctor where intProctorID = "${req.params.intProctorID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/proctors');
        res.render('eyenetAdmin/views/maintenance/forms/ProctorForm',{form : results[0] });
    })
});

router.put('/proctors/:intProctorID',(req,res)=>{
    db.query(`update tblproctor set
    strProctorName = "${req.body.etypename}"
    where intProctorID = "${req.params.intProctorID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/proctors');  
    })
});

router.get('/proctors/:intProctorID/delete',(req,res)=>{
    db.query(`DELETE FROM tblproctor WHERE intProctorID = "${req.params.intProctorID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/proctors');
    });
});

// end of proctor

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// Schedule

router.get('/createSchedule',authMiddleware.hasAuth,schedStatus,proctor,course,renderSchedform);
router.get(`/:intSchedID/edit`,authMiddleware.hasAuth,schedStatus,proctor,course,renderSchedform,(req,res)=>{
    db.query(`select * from tblsched where intSchedID = "${req.params.intSchedID}"`,(err,results,fields)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect(`eyenetAdmin/scheduleList`);
        res.render(`eyenetAdmin/views/maintenance/forms/ScheduleForm`,{push : results[0]});
    });
});
router.put(`/intSchedID/edit`,(req,res)=>{
    db.query(`update tblsched set
            intStatusID = ${req.body.stats}`,(err,results,field)=>{
                if(err) throw(err);
                res.redirect(`eyenetAdmin/scheduleList`);
            })
});
router.post(`/createSchedule`,(req,res)=>{
    var newID = counter.smart(req.body.SID);
    var logs = req.body;
    console.log(logs);
    db.query(`INSERT INTO tblsched
    (intSchedID,
    strSDesc,datStartDate,datEndDate,
    strSRemarks,
    intSCourseID,intSStatusID,intProctorID)
    VALUES (${newID},"${req.body.schedname}","${req.body.dstart}","${req.body.dend}",
            "${req.body.rem}",
        ${req.body.scourse},${req.body.stats},${req.body.procs});`,(err,results,fields)=>{
            if(err) throw err;
            return res.redirect(`/eyenetAdmin/scheduleList`);
    })
});

router.get('/scheduleList',(req,res)=>{
    db.query(`select * from tblschedlist`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/schedule',{users : results});
        console.log(results);  
    })
});
router.get('/scheduleList/:intSchedID/delete',(req,res)=>{
    db.query(`Delete from tblsched where intSchedID = "${req.params.intSchedID}"`,(err,results,field)=>{
        if(err) throw err;
        return res.redirect(`/eyenetAdmin/scheduleList`);
    })
});

//end Schedule

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

//status Type interface backend 

router.get('/statustype',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblstatus`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/StatusType',{users : results});
        console.log(results);    
    })  
});
router.get('/statustype/new',(req,res)=>{
    db.query(`select max(intStatusID) as intStatusID from tblstatus`,(err,results,field)=>{
        res.locals.ID = results[0].intStatusID
        return res.render('eyenetAdmin/views/maintenance/forms/StatusTypeForm');
    }) 
});
router.post('/statustype/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblstatus (intStatusID,strStatusDesc) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/statustype');
    }) 
});
router.get('/statustype/:intStatusID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblstatus where intStatusID =  "${req.params.intStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/statustype');
        res.render('eyenetAdmin/views/maintenance/forms/StatusTypeForm',{form : results[0] });
    })
});

router.put('/statustype/:intStatusID',(req,res)=>{
    db.query(`update tblstatus set
    strStatusDesc = "${req.body.etypename}"
    where intStatusID = "${req.params.intStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/statustype');
    })
});

router.get('/statustype/:intStatusID/delete',(req,res)=>{
    db.query(`DELETE FROM tblstatus WHERE intStatusID = "${req.params.intStatusID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/statustype');
    });
});

// End of Status Type

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// usertype Interface

router.get('/usertype',authMiddleware.hasAuth,(req,res)=>{
    db.query(`select * from tblusertype`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/UserType',{users : results});
        console.log(results);    
    })  
});
router.get('/usertype/new',(req,res)=>{
    db.query(`select max(intUserTypeID) as intUserTypeID from tblusertype`,(err,results,field)=>{
        res.locals.ID = results[0].intUserTypeID
        return res.render('eyenetAdmin/views/maintenance/forms/UserTypeForm');
    }) 
});
router.post('/usertype/new',(req,res)=>{
    var nID = counter.smart(req.body.smid);
    db.query(`insert into tblusertype (intUserTypeID,strUTName) VALUES ("${nID}","${req.body.etypename}");`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        return res.redirect('/eyenetAdmin/usertype');
    }) 
});
router.get('/usertype/:intUserTypeID',authMiddleware.hasAuth,(req,res)=>{
    db.query(`SELECT * FROM tblusertype where intUserTypeID =  "${req.params.intUserTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect('/eyenetAdmin/usertype');
        res.render('eyenetAdmin/views/maintenance/forms/UserTypeForm',{form : results[0] });
    })
});

router.put('/usertype/:intUserTypeID',(req,res)=>{
    db.query(`update tblusertype set
    strUTName = "${req.body.etypename}"
    where intUserTypeID = "${req.params.intUserTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/usertype');
    })
});

router.get('/usertype/:intUserTypeID/delete',(req,res)=>{
    db.query(`DELETE FROM tblusertype WHERE intUserTypeID = "${req.params.intUserTypeID}"`,(err,results,field)=>{
        if(err) throw err;
        res.redirect('/eyenetAdmin/usertype');
    });
});

// end of usertype

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

//student list

router.get('/studentList',(req,res)=>{
    res.render('eyenetAdmin/views/reports/students');
});

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

//

// transactions transactions transactions transactions transactions transactions transactions transactions transactions transactions transactions transactions

//

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// assign activities

router.get(`/assignActivities`,aactivities,asched,arenderAssignActivities);
router.post('/assignActivities/new',(req,res)=>{
    db.query(`insert into tblschedact (intSASchedID,intSAActivitiesID,strSADetails) 
    values (${req.body.schedule},${req.body.act},"${req.body.details}");`,(err,results,field)=>{
        if(err) throw err;
        res.redirect(`/eyenetAdmin/assignActivities`);
    }) 
});

// end of assign activities

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// enrollment

function course(req,res,next){
    db.query(`select * from tblcourse`,(err,resu,fiel)=>{
        req.courses = resu;
        return next();
    });
}
function vcourseSched(req,res,next){
    db.query(`SELECT strSDesc,datStartDate, datEndDate FROM tblsched JOIN tblcourse ON intCID = intSCourseID WHERE intCID = '${req.body.selcourse}'`,(err,resu,fiel)=>{
        req.vcourses = resu;
        return next();
    }); 
}
function renderSchedpage(req,res){
    res.render(`eyenetAdmin/views/maintenance/forms/ScheduleForm`,{nips : req.fields, tips : req.proctors, lips : req.courses, vcourses: req.vcourses});
}
function courseSched(req,res){
    db.query(`select * from tblsched where "${req.params.intCourseID}"`)

}
function schedList(req,res,next){
    db.query(`select * from tblschedlist`,(err,resul,fields)=>{
        req.lists = resul;
        return next();
    });
}

function selectccna(req,res,next){db.query(`select * from tblschedview where intSCourseID = 1`,(err,res,fields)=>{req.pans = res;return next();});}
function selectccnp(req,res,next){db.query(`select * from tblschedview where intSCourseID = 2`,(err,res,fields)=>{req.hats = res;return next();});}
function selectcybs(req,res,next){db.query(`select * from tblschedview where intScourseID = 3`,(err,res,fields)=>{req.ants = res;return next();});}
function renderCCNA(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,field)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenetAdmin/views/transactions/forms/EnrollmentFormCCNA`,{pans: req.pans});})}
function renderCCNP(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,field)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenetAdmin/views/transactions/forms/EnrollmentFormCCNP`,{hats: req.hats});})}
function renderCybersec(req,res){db.query(`select MAX(intUserID) as intUserID from tbluser`,(err,results,fields)=>{res.locals.ID = results[0].intUserID;return res.render(`eyenetadmin/views/transactions/forms/EnrollmentFormCybersec`,{ants : req.ants});})}

router.get(`/enrollment/ccna`,authMiddleware.hasAuth,selectccna,renderCCNA);
router.get(`/enrollment/ccnp`,authMiddleware.hasAuth,selectccnp,renderCCNP);
router.get(`/enrollment/cybersecurity`,authMiddleware.hasAuth,selectcybs,renderCybersec);
router.post(`/enrollment/ccna`,(req,res)=>{
    var newID = counter.smart(req.body.PID);
    var nnID = counter.smart(req.body.PID);
    var active = 1; 
    var utype = 2;
    var ccna = `ccna for ${newID}`;
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
    return res.redirect('/eyenetAdmin/enrollment');
});
router.post(`/enrollment/ccnp`,(req,res)=>{
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
    return res.redirect('/eyenetAdmin/enrollment');
});
router.post(`/enrollment/cybersecurity`,(req,res)=>{
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
    return res.redirect('/eyenetAdmin/enrollment');
});
router.get('/enrollment',authMiddleware.hasAuth,(req,res)=>{
    res.render(`eyenetAdmin/views/transactions/pages/Enrollment`);
});

router.get(`/contact`,(req,res)=>{
    res.render(`/eyenetAdmin/views/contacts`);
});

router.get('/scheduleList',authMiddleware.hasAuth,course);

router.get('/scheduleList',(req,res)=>{
    db.query(`select * from tblschedlist`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/maintenance/pages/schedule',{users : results});
        console.log(results);  
    })
});
router.get(`/scheduleList/:intSchedID/view`,(req,res)=>{
    db.query(`select * from tblschedlist where intSchedID = "${req.params.intSchedID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect(`/eyenetAdmin/scheduleList`);
        return res.render(`eyenetAdmin/views/maintenance/pages/schedView`,{form: results[0]});
    })
});

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

// inquiries

router.get('/inquiries',(req,res)=>{
    db.query(`select * from tblinquirylist`,(err,results,field)=>{
        return res.render('eyenetAdmin/views/transactions/pages/inquiries',{users : results});
        console.log(results);  
    })
});
router.get(`/inquiries/:intInquiryID`,(req,res)=>{
    db.query(`select * from tblinquirylist where intInquiryID = "${req.params.intInquiryID}"`,(err,results,field)=>{
        if(err) throw err;
        console.log(err);
        if(results[0]==null) res.redirect(`/eyenetAdmin/inquiries`);
        return res.render(`eyenetAdmin/views/transactions/pages/inquiryView`,{form: results[0]});
    })
});

router.get(`/inquiries/:intInquiryID/delete`,(req,res)=>{
    db.query(`DELETE FROM tblinquiry WHERE intInquiryID = "${req.params.intInquiryID}"`,(err,results,field)=>{
        if(err) throw err;
        res. redirect(`/eyenetAdmin/inquiries`);
    })
});

// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

router.get(`/students`,(req,res)=>{
    db.query(`select * from tblusercoursedetails order by strSDesc ASC`,(err,results,fields)=>{
        if(err) throw err;
        res.render(`eyenetAdmin/views/reports/students`,{users : results});
    });
});


// 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 안냐 

// 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 안녕 

router.get(`/reports/students`,(req,res)=>{
    db.query(`select * from tblusercoursedetails order by strSDesc ASC`,(err,results,fields)=>{
        if(err) throw err;
        res.render(`eyenetAdmin/views/reports/students`,{kits : results});
    });
});

router.get(`/reports/equipments`,(req,res)=>{
    db.query(`select * from tblequipmentlist`,(err,results,fields)=>{
        if(err) throw err;
        res.render(`eyenetAdmin/views/reports/equipments`,{sits : results});
    });
});

exports.eyenetAdmin = router;