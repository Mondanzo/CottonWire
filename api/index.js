const express = require("express");
const users = require("./users");
const package = require("../package.json");

let router = express.Router();

router.get("/", (req, res) => {
    res.json({
        api: "CottonWire",
        version: "v" + package.version,
        stream: "Dev"
    })
})

router.use("/users", users);


router.all("/*", (req, res) => {
    res.json({
        "status": 404,
        "error": "Endpoint not found"
    })
})

module.exports = router;