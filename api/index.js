const express = require("express");
const users = require("./users");
const modpack = require("./modpack");
const mods = require("./mods");
const bodyparser = require("body-parser");
const keys = require("./keys");
const package = require("../package.json");

let router = express.Router();

router.use(bodyparser.json());

router.get("/", (req, res) => {
    res.json({
        api: "CottonWire",
        version: "v" + package.version,
        stream: "Dev"
    });
});

router.use("/", keys.middleware);

router.use("/", keys.router);
router.use("/users", users);
router.use("/modpack", modpack);
router.use("/mods", mods);


router.all("/*", (req, res) => {
    res.status(404).json({
        "status": 404,
        "error": "Endpoint not found"
    });
});

module.exports = router;