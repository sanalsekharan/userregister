const express = require('express');
const router = express.Router();
const credential = require('credential'), pw = credential();
const mongoose = require('mongoose');
const UserModel = require('./userModel.js');
const randomstring = require("randomstring");
const crypto = require('crypto');
const moment = require('moment')
const db = mongoose.connection;

let password = 'userEmailData';
function encrypt(text) {
    algorithm = 'aes-256-ctr';
    // password = '';
    let cipher = crypto.createCipher(algorithm, password)
    let crypted = cipher.update(text, 'utf8', 'hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
    algorithm = 'aes-256-ctr';
    // password = 'd6F3Efeq';
    let decipher = crypto.createDecipher(algorithm, password)
    let dec = decipher.update(text, 'hex', 'utf8')
    dec += decipher.final('utf8');
    return dec;
}
router.get("/activate/:email/:code", function (req, res) {
    // console.log(req.params);
    let email = decrypt(req.params.email)
    console.log(email);
    UserModel.find({ email: { $eq: email } }, function (err, users) {
        console.log(users)
        if (users.length === 0) {
            res.json({
                updated: false
            })
        } else {
            db.collection('users').update({ email: email }, { $set: { emailVarified: true } }, false, false);
            res.json({
                updated: true
            })
        }
    })
    // console.log("sending \n\n -- " + filePath);
});
router.post('/register', function (req, res) {
    let ranNumber = randomstring.generate({
        length: 5,
        charset: 'numeric'
    });
    pw.hash(req.body.password, function (err, hash) {
        if (err) { res.send(err); }
        var user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            emailVarified: false,
            password: hash,
            randomNumber: ranNumber
        };

        UserModel.find({ email: { $eq: req.body.email } }, function (err, users) {
            var response;
            if (users.length === 0) {
                db.collection('users').insert(user);
                let link = "http://127.0.0.1:3030/api/users/activate/" + encrypt(req.body.email) + '/' + ranNumber
                let data = {
                    from: 'Admin <me@sandbox09df41a6268f42dfa431e2f5b75e5924.mailgun.org>',
                    to: 'sanukerala@gmail.com',//req.body.email
                    subject: 'Hello',
                    html: '<div class=""><div class="aHl"></div><div id=":24v" tabindex="-1"></div><div id=":23y" class="ii gt"><div id=":23z" class="a3s aXjCH "><div class="adM"></div><div><div class="adM"></div>' +
                        '<p>Hi,</p><p>Thanks for using this service!  Please confirm your email address by clicking on the link below. We will communicate with you from time to time via email so its important that we have an up-to-date email address on file.</p>' +
                        '<p><a href=' + link + ' target="_blank" data-saferedirecturl="">Activate</a></p>' +
                        '<p>If you did not sign up for a account please disregard this email.</p><p>Happy day!<br>The users</p>' +
                        '</div></div>'
                };
                // console.log(data)
                mailgun.messages().send(data, function (error, body) {
                    log('body'.body);
                    log('error', error);
                });
                response = {
                    success: true,
                    message: 'done'
                }
            } else {
                response = {
                    success: false,
                    message: 'user already exists'
                }
            }
            res.json(response);
        })
    });
});

router.post('/loginUser', function (req, res) {
    UserModel.find({ email: { $eq: req.body.email } }, function (err, users) {
        if (users.length === 0) {
            res.json({
                success: false,
                message: 'user not exists'
            })
        } else {
            pw.verify(users[0].password, req.body.password, function (err, isValid) {
                var msg;
                if (err) { throw err; }
                if (isValid) {
                    let ranNumber = randomstring.generate({
                        length: 5
                    });
                    let date = new Date();
                    let token = date.getTime()
                    let link = "http://127.0.0.1:3030/api/users/login/" + encrypt(req.body.email) + '/' + ranNumber
                    db.collection('users').update({ email: req.body.email }, { $set: { loginCode: ranNumber, loginCodeValidaity: token } }, false, false);
                    let data = {
                        from: 'Admin <me@sandbox09df41a6268f42dfa431e2f5b75e5924.mailgun.org>',
                        to: 'sanukerala@gmail.com',//req.body.email
                        subject: 'Hello',
                        html: '<div class=""><div class="aHl"></div><div id=":24v" tabindex="-1"></div><div id=":23y" class="ii gt"><div id=":23z" class="a3s aXjCH "><div class="adM"></div><div><div class="adM"></div>' +
                            '<p>Hi,</p><p>Thanks for using this service!  Please clicking on the link below to login to our site.</p>' +
                            '<p><a href=' + link + ' target="_blank" data-saferedirecturl="">Log In</a></p>' +
                            '<p>If you did not sign up/login for a account please disregard this email.</p><p>Happy day!<br>The users</p>' +
                            '</div></div>'
                    };

                    mailgun.messages().send(data, function (error, body) {
                        log(body);
                        log(error);
                    });
                    response = {
                        mailSend: true,
                        message: 'Login Mail Send to ' + req.body.email
                    }
                } else {
                    response = {
                        login: false,
                        message: 'password wrong'
                    }
                }
                res.json(response);
            });
        }
    })
})
router.get("/login/:email/:code", function (req, res) {
    let email = decrypt(req.params.email)
    log(email, email);
    UserModel.find({ email: { $eq: email }, loginCode: { $eq: req.params.code } }, function (err, users) {
        if (users.length === 0) {
            res.json({
                login: false
            })
        } else {
            let diff = checkTime(users[0].loginCodeValidaity)
            if (diff) {
                req.session.email = req.params.email;
                req.session.code = users[0].loginCodeValidaity;
                req.session.save();
                res.redirect("http://127.0.0.1:3030/");
            }
        }
    })
});

router.post('/getUserData', function (req, res) {
    UserModel.find({ email: { $eq: req.session.email }, loginCode: { $eq: req.params.code } }, function (err, users) {
        if (users.length === 0) {
            res.json({
                login: false
            })
        } else {
            res.json(users[0])
        }
    })
})

router.post('/checkLogin', function (req, res) {
    log('check', req.session.email)
    if (req.session.email) {
        res.json({
            login: true
        })
    } else {
        res.json({
            login: false
        })
    }
})
function checkTime(logTime) {
    let date = new Date();
    var timestamp = moment(date.getTime());
    let diff = moment(logTime).add(1, 'hours');
    return diff.isAfter(timestamp)
}
module.exports = router;
