const config = require("../cottonwire.config");
const mariadb = require("mariadb");

let pool = mariadb.createPool({
    host: config.database,
    user: config.database.user,
    password: config.database.password,
    database: config.database.database,
    port: config.database.port
});

/**
 * @returns Promise<PoolConnection>
 */
module.exports = function(){
    return pool.getConnection();
}