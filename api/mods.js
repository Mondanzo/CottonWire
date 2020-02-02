const express = require("express");
const mods = require("../db/mods");
const config = require("../cottonwire.config.json")

let router = express.Router();

router.use(function (req, res, next) {
	if (req.method == "GET") next();
	else if (req.session.hasOwnProperty("authenticated") || req.session.authenticated) {
		next();
	} else {
		res.status(401).json({
			"status": 401,
			"error": "Not authenticated!"
		});
	}
});

router.get("/", async function(req, res){
	res.status(200).json({
		"status": 200,
		"result": await mods.getMods()
	});
})

module.exports = router;