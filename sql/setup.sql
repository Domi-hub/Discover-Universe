DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    url VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image_id INT REFERENCES images(id)
);

INSERT INTO images (url, username, title, description) VALUES (
    'https://s3.amazonaws.com/spicedling/s2sB2FutuTuY16LdHPFJpsWWBmPV0-Yj.jpg',
    'Mer',
    'Mercury',
    'Along with Venus, Earth, and Mars, Mercury is one of the rocky planets. It has a solid surface that is covered with craters. It has a thin atmosphere, and it does not have any moons. Mercury likes to keep things simple.'
), (
    'https://s3.amazonaws.com/spicedling/ATs7h_R9xEffHkIvlypff_pzf0Z0aU4H.jpg',
    'funky',
    'Uranius',
    'Uranus is blue-green in color, as a result of the methane in its mostly hydrogen-helium atmosphere. The planet is often dubbed an ice giant, since at least 80% of its mass is a fluid mix of water, methane and ammonia ice.'
), (
    'https://s3.amazonaws.com/spicedling/xJfO_Z-98nioIjCY43LTXint5H92j1K8.png',
    'funkychicken',
    'Venus',
    'Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty. As the second-brightest natural object in the night sky after the Moon, Venus can cast shadows and, rarely, is visible to the naked eye in broad daylight.'
), (
    'https://s3.amazonaws.com/spicedling/VAL-kKrHiQH-s2-f99f6lDtzGHJgWNTW.jpg',
    'Ell',
    'Planet Earth',
    'Earth, our home, is the third planet from the sun. It is the only planet known to have an atmosphere containing free oxygen, oceans of water on its surface and, of course, life. Earth is the fifth largest of the planets in the solar system.'
), (
    'https://s3.amazonaws.com/spicedling/HyFNfGvKCCW2cnCHBBrwoJR2EkCknFge.jpeg',
    'Discoduck',
    'Jupiter',
    'Jupiter is the fifth planet from the Sun and the largest in the Solar System. It is a gas giant with a mass one-thousandth that of the Sun, but two-and-a-half times that of all the other planets in the Solar System combined. Jupiter has been known to astronomers since antiquity. It is named after the Roman god Jupiter.'
), (
    'https://s3.amazonaws.com/spicedling/zVGk49n2eFueRfNysur9MjSNAm8IMI2i.jpg',
    'Neptune',
    'Neptune',
    'Neptune is the eighth and farthest known planet from the Sun in the Solar System. In the Solar System, it is the fourth-largest planet by diameter, the third-most-massive planet, and the densest giant planet. '
), (
    'https://s3.amazonaws.com/spicedling/s2sB2FutuTuY16LdHPFJpsWWBmPV0-Yj.jpg',
    'Marsie',
    'Mars',
    'Mars is a terrestrial planet with a thin atmosphere, having surface features reminiscent both of the impact craters of the Moon and the valleys, deserts, and polar ice caps of Earth.'
);
