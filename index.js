const express = require("express");
const app = express();
const db = require("./db");
const multer = require("multer");
const uidSafe = require("uid-safe"); //generates guaranteed unique ids
const path = require("path");
const s3 = require("./s3");
const { s3Url } = require("./config");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});

uidSafe(24).then(console.log);

app.post("/upload", uploader.single("image"), s3.upload, function(req, res) {
    const { username, title, desc } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;

    console.log(imageUrl);
    db.addImage(username, title, desc, imageUrl)
        .then(function({ rows }) {
            res.json({
                username,
                title,
                desc,
                url: imageUrl,
                id: rows[0].id
            });
            // send image info to client
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.use(express.static("./public"));

app.get("/images", (req, res) => {
    db.getImages()
        .then(({ rows }) => {
            res.json(rows);
            console.log(rows);
        })
        .catch(err => {
            console.log("Error", err);
        });
});

app.listen(8080, () => console.log("Server is listening..."));
