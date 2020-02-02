const express = require("express");
const session = require("cookie-session");
const initStats = require('@phil-r/stats');
const config  = require("./cottonwire.config.json");
const fs = require("fs");
const crypto = require("crypto");
const parcel = require("parcel-bundler");
const process = require("process");
const path = require("path");
const users = require("./db/users");

// Auto generate salt
if(config.salt === "AUTO_GENERATE" || config.salt === ""){
    console.log("Generating salt...");
    config.salt = crypto.randomBytes(8).toString("hex");
    fs.writeFileSync("cottonwire.config.json", JSON.stringify(config, null, 4));
    console.log("Salt generated.");
}

// Setup parcel-bundler if dev
if(process.env.NODE_ENV !== "production"){
    let bundler = new parcel("./public/index.html", {
        hmr: false,
        contentHash: false,
        watch: true
    });
    bundler.bundle();
}

let app = express();

const { statsMiddleware, getStats } = initStats({
    endpointStats: true,
    customStats: true,
    addHeader: true
});

app.use(statsMiddleware);
app.use(session({
    secret: config.salt
}));

app.use("/api", require("./api"));

app.use("/", express.static("dist"));
app.use("/cdn", express.static("assets"));

app.all("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
})

if(config.stats){
    app.get("/stats", (req, res) => res.send(getStats()));
} else {
    app.get("/stats", (req, res) => res.json(false));
}

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist", "index.html"));
});

app.enable('trust proxy');
app.disable('x-powered-by');

app.listen(config.port, () => {
    console.log("CottonWire running on http://127.0.0.1:" + config.port);
    users.getUsers().then((val) => {
        if(val.length < 1)
            users.addUser("admin", "admin");
    })
});