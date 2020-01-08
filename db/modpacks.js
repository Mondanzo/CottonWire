const db = require("./database");

module.exports.getModpacks = async function(){
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpacks");
    return result;
}

module.exports.getModpack = async function(name){
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpacks WHERE name == ?", [name]);
    return result;
}

module.exports.updateModpack = function(){

}