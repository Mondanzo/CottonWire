const express = require("express");
const session = require("cookie-session");
const initStats = require('@phil-r/stats');
const config  = require("./cottonwire.config.json");
const fs = require("fs");
const crypto = require("crypto");
const process = require("process");
const path = require("path");
const Bundler = require('parcel-bundler');

// Auto generate salt
if(config.salt === "AUTO_GENERATE" || config.salt === ""){
    console.log("Generating salt...");
    config.salt = crypto.randomBytes(8).toString("hex");
    fs.writeFileSync("cottonwire.config.json", JSON.stringify(config, null, 4));
    console.log("Salt generated.");
}

let app = express();

const { statsMiddleware, getStats } = initStats({
    endpointStats: true,
    customStats: true,
    addHeader: true
});

app.use(statsMiddleware)
app.use(session({
    secret: config.salt
}))

app.use("/api", require("./api"));

app.use(express.static("dist"));

if(config.stats){
    app.get("/stats", (req, res) => res.send(getStats()));
}

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
})

if(process.env.NODE_ENV !== "production"){
    new Bundler("./public/index.html", {
        watch: true
    }).bundle();
}

app.enable('trust proxy');
app.disable('x-powered-by');

app.listen(config.port, () => {
    console.log("CottonWire running on http://127.0.0.1:" + config.port);
});