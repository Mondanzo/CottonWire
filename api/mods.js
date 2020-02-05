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

router.get("/:slug/builds", async function(req, res){

});

router.post("/", async function(req, res){
	const requiredProps = {
		slug: "string",
		name: "string",
		author: "string",
		description: "string",
		link: "string",
		donate: "string",
		type: "string",
		side: "object",
		curse: "boolean"
	}

	let valid = true;
	for(let prop of Object.keys(requiredProps)){
		if (!(req.body.hasOwnProperty(prop) && typeof req.body[prop] == requiredProps[prop])) console.log(prop, typeof req.body[prop])
		if(!(req.body.hasOwnProperty(prop) && typeof req.body[prop] == requiredProps[prop])) valid = false;
	}
	if(!valid){
		// Error with Payload
		res.status(400).json({
			"status": 400,
			"error": "Payload was missing required props!"
		});
	} else {
		// On Valid
		let exists = await mods.getMod(req.body.slug.toLowerCase());
		if(!exists){
			let ok = await mods.addMod(req.body)
			if(ok) res.status(200).send();
			else res.status(500).json({
				"status": 500,
				"error": "an error occured while trying to add the mod!"
			})
		} else {
			res.status(409).json({
				"status": 409,
				"error": "The mod slug already exists!"
			})
		}
	}
});

module.exports = router;