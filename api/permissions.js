const db = require("./../db/database");

module.exports.hasPermission = function(id, PERMISSION){
    return true;
}

module.exports.setPerms = function (id, PERMISSIONS) {
    return true;
}

module.exports.PERMISSIONS = Object.freeze({
    "MANAGE_MODPACKS": 0,
    "ADMINISTRATOR": 0,
    "MANAGE_USERS": 0,
    "MANAGE_MODS": 0,
    "MANAGE_KEYS": 0,
    "MANAGE_CLIENTS": 0
})