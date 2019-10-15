const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getImages = () => {
    return db.query(
        `
        SELECT *
        FROM images
        ORDER BY id DESC;
        `
    );
};
