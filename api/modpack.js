const express = require("express");
const modpack = require("../db/modpacks");
const config = require("../cottonwire.config.json")

let router = express.Router();

function HOST(req){
    return req.protocol + "://" + req.hostname + ":" + config.port;
}

router.use(function(req, res, next){
    if(req.method == "GET") next();
    else if (req.session.hasOwnProperty("authenticated") || req.session.authenticated) {
        next();
    } else {
        res.status(401).json({
            "status": 401,
            "error": "Not authenticated!"
        });
    }
});

router.get("/:modpack", async function (req, res){
    let mp = await modpack.getModpack(req.params.modpack);
    if(mp){
        res.status(200).json(mp);
    } else {
        res.status(200).json({
            "error": "Modpack does not exist/Build does not exist"
        });
    }
});

router.delete("/:modpack", async function (req, res){
    let result = await modpack.deleteModpack(req.params.modpack);
    res.status(result ? 200 : 500).send();
});

router.get("/", async function (req, res) {
    modpack.getModpacks().then((result) => {
        let re = {};
        for (let pack of result) {
            re[pack.name] = pack.display_name;
        }

        res.json({
            "modpacks": (req.query.hasOwnProperty("include") && req.query.include == "full") ? result : re,
            "mirror_url": HOST(req) + "/cdn/mods"
        });
    });
});

router.post("/", async function (req, res){
    if(!req.body.hasOwnProperty("slug") || !req.body.hasOwnProperty("display_name")){
        res.status(400).json({
            "status": 400,
            "error": "slug and or display name is missing!"
        });
    }
    if(await modpack.getModpack(req.body.slug)){
        res.status(409).json({
            "status": 409,
            "error": "A modpack with that slug already exists!"
        });
        return;
    }
    let okay = await modpack.createModpack({
        "name": req.body.slug,
        "display_name": req.body.display_name
    });
    if(okay){
        res.status(200).json(true)
    } else {
        res.status(500).json({
            "status": 500,
            "error": "An error occured while trying to add the modpack!"
        });
    }
})

module.exports = router;