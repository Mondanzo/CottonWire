const express = require("express");
const users = require("../db/users");

let router = express.Router();

router.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "Origin");
    next();
})

router.get("/", async function(req, res) {
    users.getUsers().then(result => {
        console.log(result)
        res.json(result);
    });
});


module.exports = router;