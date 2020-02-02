const bcrypt = require("bcrypt");

const config = require("../cottonwire.config.json");
const db = require("./database");

module.exports.getUser = async function (id) {
    let conn = await db();
    let result = await conn.query("SELECT id, username, 2fa FROM users WHERE id = ?", [id]);
    conn.end();
    if(result.length > 0)
        return result[0];
    else
        return false;
}

module.exports.getUserByUsername = async function (username) {
    let conn = await db();
    let result = await conn.query("SELECT id, username, 2fa FROM users WHERE username = ?", [username]);
    conn.end();
    if (result.length > 0)
        return result[0];
    else
        return false;
}

module.exports.checkPassword = async function (username, password) {
    let conn = await db();
    let result = await conn.query("SELECT id, password FROM users WHERE username = ?", [username]);
    conn.end();
    if(result.length > 0){
        return await bcrypt.compare(password, result[0].password) ? await this.getUser(result[0].id) : undefined;
    }
    return false;
}

module.exports.getUsers = async function(){
    let conn = await db();
    let result = await conn.query("SELECT id, username FROM users");
    conn.end();
    return result;
}

module.exports.addUser = async function(username, password){
    let conn = await db();
    let result = await conn.query("INSERT INTO users (username, password) VALUES (?, ?)", [username, bcrypt.hashSync(password, 8)])
    conn.end();
    return result.affectedRows > 0;
}

module.exports.deleteUser = async function(id){
    let conn = await db();
    let result = await conn.query("DELETE FROM users WHERE id = ?", [id]);
    conn.end();
    return result.affectedRows > 0;
}

module.exports.setUsername = async function(id, username){
    if(username == "logout") return false;
    let conn = await db();
    let result = await conn.query("UPDATE users SET username = ? WHERE id = ?", [username, id]);
    conn.end();
    return result.affectedRows > 0;
}

module.exports.setPassword = async function (id, password) {
    let conn = await db();
    let result = await conn.query("UPDATE users SET password = ? WHERE id = ?", [bcrypt.hashSync(password, 8), id]);
    conn.end();
    return result.affectedRows > 0;
}

module.exports.set2FA = async function(id, token){
    let conn = await db();
    let result = await conn.query("UPDATE users SET 2fa = ? WHERE id = ?", [token, id]);
    conn.end();
    return result.affectedRows > 0;
}