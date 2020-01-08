const express = require("express");

let router = express.Router();

router.use((req, res, next) => {

})

router.get("/", (req, res) => {
    res.json({
        api: "CottonWire",
        version: "v1.0.0",
        stream: "Dev"
    });
});

router.get("/modpack", (req, res) => {

});

router.get("*", (req, res) => {
    res.status(404).json({
        "status": 404,
        "error": "Endpoint does not exist."
    })
})

module.exports = router;