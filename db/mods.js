const db = require("./database");

module.exports.getMods = async function(){
	let conn = await db();
	let mods = await conn.query("SELECT * FROM mods");
	conn.end();

	return mods;
}

module.exports.getMod = async function (slug) {
	let conn = await db();
	let mod = (await conn.query("SELECT * FROM mods WHERE name = ?", [slug]))[0];
	conn.end();

	return mod;
}

module.exports.addMod = async function (data){
	let conn = await db();
	let result = (await conn.query("INSERT INTO mods (name, pretty_name, author, description, link, donate, type, side, curseforge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", [
		data.slug, data.name, data.author, data.description, data.link, data.donate, data.type, data.side.length == 1 ? data.side[0] : 'BOTH', data.curse ? 1 : 0
	]));	
	conn.end();

	return result.affectedRows > 0;
}

module.exports.getBuilds = async function (slug){
	let conn = await db();
	let result = await conn.query("SELECT * FROM mods_builds WHERE mod_id")
}