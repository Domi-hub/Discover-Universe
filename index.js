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

uidSafe(24);

app.post("/upload", uploader.single("image"), s3.upload, (req, res) => {
    const { username, title, desc } = req.body;
    const imageUrl = `${s3Url}${req.file.filename}`;

    db.addImage(username, title, desc, imageUrl)
        .then(function({ rows }) {
            res.json({
                username,
                title,
                desc,
                url: imageUrl,
                id: rows[0].id
            });
        })
        .catch(function(err) {
            console.log(err);
            res.sendStatus(500);
        });
});

app.use(express.static("./public"));
app.use(express.json());

app.get("/images", (req, res) => {
    const { lastImageId } = req.query;
    const promise = lastImageId
        ? db.getMoreImages(lastImageId)
        : db.getImages();
    promise
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/images/:imageId", (req, res) => {
    db.getImageById(req.params.imageId)
        .then(({ rows }) => {
            if (rows.length < 1) {
                res.sendStatus(404);
                return;
            }
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.post("/images/:imageId/comment", (req, res) => {
    const { username, message } = req.body;
    db.addComment(req.params.imageId, username, message)
        .then(({ rows }) => {
            if (rows.length < 1) {
                res.sendStatus(404);
                return;
            }
            res.json(rows[0]);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.get("/images/:imageId/comments", (req, res) => {
    db.getComments(req.params.imageId)
        .then(({ rows }) => {
            res.json(rows);
        })
        .catch(err => {
            console.log(err);
            res.sendStatus(500);
        });
});

app.listen(8080, () => console.log("Server is listening..."));
