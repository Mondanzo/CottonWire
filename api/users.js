const express = require("express");
const users = require("../db/users");
const speakeasy = require("speakeasy");
const crypto = require("crypto");

let router = express.Router();

router.use(function (req, res, next) {
    //res.header("Access-Control-Allow-Origin", "Origin");
    next();
})

function restricted(req, res, next){
    if(req.session.hasOwnProperty("authenticated") && req.session.authenticated){
        next();
    } else {
        res.status(401).json({
            "status": 401,
            "error": "Not authenticated"
        })
    }
}

router.get("/", async function(req, res) {
    users.getUsers().then(result => {
        console.log(result)
        res.json(result);
    });
});

router.delete("/delete", restricted, async function(req, res){
    let result = await users.deleteUser(req.session.user.id);
    if(result){
        req.session = null;
        res.status(200).json({
            "status": 200,
            "message": "Account deleted."
        });
    } else {
        res.status(500).json({
            "status": 500,
            "error": "Error while deleting the account."
        });
    }
});

router.post("/add", restricted, async function(req, res){
    let data = req.body;
    if(!data.hasOwnProperty("username")) res.status(400).json({
        "status": 400,
        "error": "Missing Username"
    });
    let password = crypto.randomBytes(8).toString("hex");
    if(await users.getUserByUsername(data.username)){
        res.status(409).json({
            "status": 409,
            "error": "Username already taken!"
        });
    } else {
        await users.addUser(data.username, password);
        res.status(201).json({
            "status": 201,
            "result": {
                "username": data.username,
                "password": password
            }
        });
    }
})

router.put("/", async function(req, res){
    if(req.session.hasOwnProperty("authenticated") && req.session.authenticated){
        if (req.body.hasOwnProperty("username") && req.body.hasOwnProperty("password")){
            // Update Username
            if(await users.checkPassword(req.session.user.username, req.body.password)){
                if(!(await users.getUserByUsername(req.body.username))){
                    if(await users.setUsername(req.session.user.id, req.body.username)){
                        req.session.user.username = req.body.username;
                        res.status(200).json({
                            "status": 200,
                            "user": req.session.user
                        });
                    } else {
                        res.status(500).json({
                            "status": 500,
                            "error": "an error occured while trying to set the username!"
                        });
                    } 
                } else {
                    res.status(409).json({
                        "status": 409,
                        "error": "Username already taken!"
                    });
                }
            } else {
                res.status(401).json({
                    "status": 401,
                    "error": "Password wrong!"
                });
            }

        } else if (req.body.hasOwnProperty("password") && req.body.hasOwnProperty("newpassword")){
            // Udate Password
            if (await users.checkPassword(req.session.user.username, req.body.password)) {
                if (await users.setPassword(req.session.user.id, req.body.newpassword)) {
                    res.status(200).json({
                        "status": 200,
                        "message": "Password updated"
                    });
                } else {
                    res.status(500).json({
                        "status": 500,
                        "error": "an error occured while trying to set the username!"
                    });
                }
            } else {
                res.status(401).json({
                    "status": 401,
                    "error": "Password wrong!"
                });
            }
        }
    }
});

router.get("/verify", async function(req, res) {
    if(req.session.hasOwnProperty("authenticated") && req.session.authenticated){
        let u = await users.getUser(req.session.user.id);
        if(u){
            req.session.user = u;
            res.status(200).json(req.session.user);
        } else {
            req.session = null;
            res.status(301).send();
        }
    } else {
        res.status(301).send();
    }
})

router.post("/login", async function(req, res) {
    if(!req.body.hasOwnProperty("username") || !req.body.hasOwnProperty("password")){ 
        res.status(400).json({
            "status": 400,
            "error": "Username and/or password are missing."
        });
        return;
    }
    let user = await users.checkPassword(req.body.username, req.body.password);
    if(user){
        console.log(user["2fa"]);
        if(user["2fa"] !== ""){
            if(req.body.hasOwnProperty("2fa")){
                let verified = speakeasy.totp.verify({
                    secret: user["2fa"],
                    encoding: 'base32',
                    token: req.body["2fa"]
                });

                if(verified){
                    if (req.body.hasOwnProperty("rememberMe") && req.body.rememberMe) {
                        console.log("U gotta stay logged in for a looong time")
                        req.sessionOptions.maxAge = new Date("Fri, 31 Dec 9999 23:59:59 GMT") - Date.now().toFixed();
                    }
                    req.session.authenticated = true;
                    req.session.user = {
                        "id": user["id"],
                        "username": user["username"]
                    };

                    res.status(200).json({
                        "user": {
                            "id": user["id"],
                            "username": user["username"]
                        }
                    })
                } else {
                    res.status(401).json({
                        "code": 401,
                        "error": "2FA Code isn't matching."
                    })
                }
            }
            res.status(400).json({
                "code": 400,
                "error": "This account is locked with a 2FA Token which is missing."
            });
        } else {
            if (req.body.hasOwnProperty("rememberMe") && req.body.rememberMe) {
                console.log("U gotta stay logged in for a looong time")
                req.sessionOptions.maxAge = new Date("Fri, 31 Dec 9999 23:59:59 GMT") - Date.now().toFixed();
            }
            req.session.authenticated = true;
            req.session.user = {
                "id": user["id"],
                "username": user["username"]
            };

            res.status(200).json({
                "user": {
                    "id": user["id"],
                    "username": user["username"]
                }
            })
        }
    } else {
        res.status(401).json({
            "code": 401,
            "error": "Password or Username not matching!"
        })
    }
});

router.get("/:user", async function (req, res) {
    if (!isNaN(req.params.user)) {
        console.log(req.params.user);
        res.status(200).json({
            "status": 200,
            "result": (await users.getUser(+req.params.user))
        });
    } else {
        res.status(200).json({
            "status": 200,
            "result": (await users.getUserByUsername(req.params.user))
        });
    }
});

module.exports = router;