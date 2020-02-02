const db = require("./database");

module.exports.getMods = async function(){
	let conn = await db();
	let mods = conn.query("SELECT * FROM mods");
	conn.end();

	return mods;
}