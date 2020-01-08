const bcrypt = require("bcrypt");
const db = require("./database");

module.exports.getUser = async function (id) {
    let conn = await db();
    let result = await conn.query("SELECT id, username FROM users WHERE modpack == ?", [id]);
    return result;
}

module.exports.checkPassword = async function (username, password) {
    let conn = await db();
    let result = await conn.query("SELECT password FROM users WHERE username == ?", [username]);
    if(result.length > 0){
        return await bcrypt.compare(password, result.pop().password);
    }
    return undefined;
}

module.exports.getUsers = async function(username, password){
    let conn = await db();
    let result = await conn.query("SELECT id, username FROM users");
    return result;
}

module.exports.addUser = async function(username, password){
    let conn = await db();
    let result = await conn.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, password])
}