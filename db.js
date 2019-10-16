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

module.exports.getImageById = imageId => {
    return db.query(
        `
        SELECT *
        FROM images
        WHERE id = $1;
        `,
        [imageId]
    );
};

module.exports.addImage = (username, title, desc, imageUrl) => {
    return db.query(
        `
        INSERT INTO images (username, title, description, url)
        VALUES($1, $2, $3, $4)
        RETURNING id
        `,
        [username, title, desc, imageUrl]
    );
};
