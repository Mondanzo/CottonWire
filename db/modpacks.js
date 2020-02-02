const db = require("./database");

module.exports.getModpacks = async function(){
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpacks");
    conn.end();
    return result;
}

module.exports.getModpack = async function(name){
    let conn = await db();
    let result = await conn.query("SELECT * FROM modpacks WHERE name = ?", [name]);
    conn.end();
    return result[0];
}

/**
 * @param {object} modpackData
 * @param {string} modpackData.name
 * @param {string} modpackData.display_name
 * @param {string} modpackData.url
 * @param {Image} modpackData.icon
 * @param {Image} modpackData.logo
 * @param {Image} modpackData.background
 * @param {string} recommended
 * @param {string} latest
 */
module.exports.updateModpack = function(modpackData){
    
}
/**
 * @param {string} slug
 */
module.exports.deleteModpack = async function(slug){
    let conn = await db();
    let result = await conn.query("DELETE FROM modpacks WHERE name = ?", [slug]);
    conn.end();
    return result.affectedRows > 0;
}

/**
 * @param {object} modpackData
 * @param {string} modpackData.name
 * @param {string} modpackData.display_name
 * @param {string} modpackData.url
 * @param {Image} modpackData.icon
 * @param {Image} modpackData.logo
 * @param {Image} modpackData.background
 */
module.exports.createModpack = async function(modpackData){

    if (!modpackData.hasOwnProperty("name") || !modpackData.hasOwnProperty("display_name")){
        return false;
    }

    modpackData.url = modpackData.hasOwnProperty("url") ? modpackData.url : "";

    modpackData.icon = modpackData.hasOwnProperty("icon") ? modpackData.icon : {
        "link": "/cdn/template_icon.png",
        "md5": "bb395dc3cd131f28df5542f287fd1526"
    };

    modpackData.logo = modpackData.hasOwnProperty("logo") ? modpackData.logo : {
        "link": "/cdn/template_logo.png",
        "md5": "80959e710f12c14c9882da5ddfae8cdb"
    };

    modpackData.background = modpackData.hasOwnProperty("background") ? modpackData.background : {
        "link": "/cdn/template_background.png",
        "md5": "dfa1517c74dfc8882052360530642244"
    };

    let conn = await db();
    let result = await conn.query("INSERT INTO modpacks (name, display_name, url, icon, icon_md5, logo, logo_md5, background, background_md5) "+
    "VALUES (?,?,?,?,?,?,?,?,?)",[
        modpackData.name, 
        modpackData.display_name, 
        modpackData.url, 
        modpackData.icon.link, 
        modpackData.icon.md5, 
        modpackData.logo.link, 
        modpackData.logo.md5,
        modpackData.background.link,
        modpackData.background.md5
    ]);
    conn.end();
    return result.affectedRows > 0;
}

module.exports.addBuild = function(buildData){
    
}