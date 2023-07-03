//import express,path,mysql

const express = require('express')
const app = express()
const path = require("path")
const mysql = require("mysql")
const { connect } = require('http2')


const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'keesha'
})

con.connect((err) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log("connected")
    }
})

app.use(express.static('public'))                  //access files within public folder   
app.use(express.static(path.join(__dirname, '/views')))
app.use(express.urlencoded({ extended: true }))        //helps us access info coming from forms
app.use(express.json())                             //json data

app.set('view engine', 'ejs')                       //setting up view engine


app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/home.html")
})

app.get("/donor", function (req, res) {
    res.sendFile(__dirname + "/public/donorlogin.html")
})
app.get("/ngo", function (req, res) {
    res.sendFile(__dirname + "/public/ngologin.html")
})

app.get("/admin", function (req, res) {
    res.sendFile(__dirname + "/public/admin_login.html")
})

app.get("/contact", function (req, res) {
    res.sendFile(__dirname + "/public/contactus.html")
})

app.get('/donorRegister', function (req, res) {
    res.sendFile(__dirname + "/public/donorRegister.html")
})

app.get('/ngoRegister', function (req, res) {
    res.sendFile(__dirname + "/public/ngoRegister.html")
})

app.get('/donate', function (req, res) {
    res.sendFile(__dirname + "/public/donate.html")
})

app.get('/request', function (req, res) {
    res.sendFile(__dirname + "/public/request.html")
})

app.get('/check', function (req, res) {
    var sql = `select distinct first,city,type,quantity from donate`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error ocurred")
            console.log(error)
        }
        else {
            // console.log(results)
            if (results.length == 0) {
                res.render(__dirname + "/views/index", { text: [{ "first": "NA", "city": "NA", "type": "NA", "quantity": "NA" }] })
            }
            else {
                res.render(__dirname + "/views/index", { text: results })
            }
        }
    })
})

app.get('/admincheck', function (req, res) {

    var sql = `select count(request.type) from donate,request where donate.email=request.email`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occured")
            console.log(error)
        }
        else {
            if (results.length == 0) {
                res.render(__dirname + "/views/admin", { text: [{ "type": "NA", "food": "NA" }] })
            }
            else {
                res.render(__dirname + "/views/admin", { text: results })
            }
        }
    })
})

app.get('/forgot', function (req, res) {
    res.sendFile(__dirname + "/public/forgot.html")
})

app.post("/donorlogin", function (req, res) {
    var e = req.body.email
    var p = req.body.pass

    var sql = `select * from login where email='${e}' and password='${p}'`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occured")
            console.log(error)
        }
        else if (results.length == 0) {
            res.redirect('/donor')
        }
        else {
            res.sendFile(__dirname + "/public/donor.html")
        }
    }
    )
})

app.post('/donorRegister', function (req, res) {
    var name = req.body.name
    var email = req.body.email
    var phone = req.body.phone
    var password = req.body.pass
    var c = req.body.cpass

    if (password == c) {
        var sql = `insert into login values('${email}','${password}')`
        con.query(sql, (error, results, fields) => {
            if (error) {
                res.send("error occured")
                console.log(error)
            }
            else {
                res.sendFile(__dirname + "/public/donor.html")
            }
        })
    }
    else {
        res.redirect('/donorRegister')
    }

})

app.post('/donate', function (req, res) {
    var f = req.body.first
    var l = req.body.last
    var e = req.body.email
    var pass = req.body.password
    var a = req.body.address
    var c = req.body.city
    var z = req.body.zip
    var phone = req.body.phone
    var type = req.body.inlineRadioOptions
    var q = req.body.quantity

    var sql = `insert into donate values('${f}','${l}','${e}','${pass}','${a}','${c}','${z}','${phone}','${type}','${q}')`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occured")
            console.log(error)
        }
        else {
            res.sendFile(__dirname + '/public/donor.html')
        }
    })

})

app.post("/ngologin", function (req, res) {
    var e = req.body.email
    var p = req.body.pass

    var sql = `select * from login where email='${e}' and password='${p}'`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occured")
            console.log(error)
        }
        else if (results.length == 0) {
            res.redirect('/ngo')
        }
        else {
            res.sendFile(__dirname + "/public/ngo.html")
        }
    }
    )
})

app.post('/ngoRegister', function (req, res) {
    var name = req.body.name
    var email = req.body.email
    var phone = req.body.phone
    var password = req.body.pass
    var c = req.body.cpass

    if (password == c) {
        var sql = `insert into login values('${email}','${password}')`
        con.query(sql, (error, results, fields) => {
            if (error) {
                res.send("error occured")
                console.log(error)
            }
            else {
                res.sendFile(__dirname + "/public/ngo.html")
            }
        })
    }
    else {
        res.redirect('/ngoRegister')
    }

})

app.post('/request', function (req, res) {
    var n = req.body.name
    var e = req.body.email
    var a = req.body.address
    var f = req.body.inlineRadioOptions
    var q = req.body.quantity

    var sql = `insert into request values('${n}','${e}','${a}','${f}',${q})`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occured")
            console.log(error)
        }
        else {
            res.sendFile(__dirname + '/public/ngo.html')
        }
    })
})


app.post("/admin_login", function (req, res) {
    var adminEmail = req.body.email
    var password = req.body.password

    var sql = `SELECT * from admin where email='${adminEmail}' and password='${password}'`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error occurred")
            console.log(error);
        } else if (results.length == 0) {
            res.redirect('/admin_login.html')
        } else {
            res.sendFile(__dirname + "/public/admin.html")
        }
    })
})

app.post('/contact', function (req, res) {
    var f = req.body.first;
    var l = req.body.last;
    var e = req.body.email;
    var s = req.body.subject;
    var m = req.body.message;

    var sql = `insert into contact values('${f}','${l}','${e}','${s}','${m}')`

    con.query(sql, (error, results, fields) => {
        if (error) {
            res.send("error ocurred")
            console.log(error)
        }
        else {
            res.redirect('/')
        }

    })
})

app.post('/forgot', function (req, res) {
    var e = req.body.email
    var p = req.body.pass
    var c = req.body.cpass

    if (p == c) {
        var sql = `update login set password='${p}'where email='${e}'`
        con.query(sql, (error, results, fields) => {
            if (error) {
                res.send("error occured")
                console.log(error)
            }
            else {
                res.redirect('/donor')
            }
        })
    }
})

app.listen(3000, function (err) {
    console.log("server running " + 3000);
})


