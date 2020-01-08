const db = require("./database");

module.exports.getBuildsForModpack = async function (id) {
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpack_builds WHERE modpack == ?", [id]);
    return result;
}

module.exports.getBuild = async function (name) {
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpack_builds WHERE name == ?", [name]);
    return result;
}