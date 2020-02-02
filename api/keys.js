const express = require("express");
const db = require("../db/database");


const router = express.Router();

module.exports.middleware = async (req, res, next) => {
	if(req.query.hasOwnProperty("k")){
		let conn = await db();
		let results = await conn.query("SELECT * FROM keys WHERE key == ?", [req.query.k]);
		conn.end();
		if(results.length){
			req.key = {
				"name": result[0].name,
				"key": req.query.k
			};
		};
	}
	next();
}

router.get("/verify/:key", async (req, res) => {

})

module.exports.router = router;