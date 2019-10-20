const spicedPg = require("spiced-pg");
const db = spicedPg(`postgres:postgres:postgres@localhost:5432/imageboard`);

module.exports.getImages = () => {
    return db.query(
        `
        SELECT *, (
            SELECT id
            FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS lowest_id
        FROM images
        ORDER BY id DESC
        LIMIT 5;
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

module.exports.addImage = (username, title, description, imageUrl) => {
    return db.query(
        `
        INSERT INTO images (username, title, description, url)
        VALUES($1, $2, $3, $4)
        RETURNING id;
        `,
        [username, title, description, imageUrl]
    );
};

module.exports.getComments = imageId => {
    return db.query(
        `
        SELECT comments.*
        FROM comments
        LEFT JOIN images
        ON comments.image_id = images.id
        WHERE images.id = $1;
        `,
        [imageId]
    );
};

module.exports.addComment = (imageId, username, message) => {
    return db.query(
        `
        INSERT INTO comments (image_id, username, message)
        VALUES($1, $2, $3)
        RETURNING id, username, message, created_at;
        `,
        [imageId, username, message]
    );
};

module.exports.getMoreImages = lastImageId => {
    return db.query(
        `
        SELECT *, (
            SELECT id
            FROM images
            ORDER BY id ASC
            LIMIT 1
        ) AS lowest_id
        FROM images
        WHERE id < $1
        ORDER BY id DESC
        LIMIT 5;
        `,
        [lastImageId]
    );
};
