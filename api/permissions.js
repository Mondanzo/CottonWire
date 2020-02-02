const db = require("./../db/database");

module.exports.hasPermission = function(id, PERMISSION){
    return true;
}

module.exports.setPerms = function (id, PERMISSIONS) {
    return true;
}

module.exports.PERMISSIONS = Object.freeze({
    "MANAGE_MODPACKS": 1,
    "MANAGE_USERS": 10,
    "MANAGE_MODS": 100,
    "MANAGE_KEYS": 1000,
    "MANAGE_CLIENTS": 10000,
    "ADMINISTRATOR": 11111
})