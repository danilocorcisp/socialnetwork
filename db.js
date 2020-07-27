const spicedPg = require("spiced-pg");
let db;
if (process.env.DATABASE_URL) {
    db = spicedPg(process.env.DATABASE_URL);
} else {
    const { dbUser, dbPass } = require("./secrets.json");
    db = spicedPg(
        "postgres:" + dbUser + ":" + dbPass + "@localhost:5432/socialnetwork"
    );
}

exports.addUserAccount = (first, last, email, password) => {
    return db.query(
        `INSERT INTO users (first, last, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING id`,
        [first, last, email, password]
    );
};

module.exports.getPw = (email) => {
    return db.query(
        `SELECT *
        FROM users 
        WHERE email = $1`,
        [email]
    );
};

exports.createResetCode = (email, code) => {
    console.log("exports.createResetCode -> email, code", email, code);
    return db.query(
        `INSERT INTO reset_codes (email, code) VALUES ($1, $2) RETURNING id`,
        [email, code]
    );
};

exports.updatePass = (email, password) => {
    return db.query(
        `UPDATE users
        SET password = $2
        WHERE email = $1`,
        [email, password]
    );
};

exports.updateBio = (id, bio) => {
    return db.query(
        `UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING bio`,
        [id, bio]
    );
};

exports.resetCode = (email) => {
    console.log("exports.resetCode -> email", email);
    return db.query(
        `SELECT * FROM reset_codes
        WHERE email = $1 
        AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
        ORDER BY created_at DESC
        LIMIT 1`,
        [email]
    );
};

exports.getUser = (email) => {
    return db.query(
        `SELECT *
        FROM users 
        WHERE email = $1`,
        [email]
    );
};

exports.getUserId = (id) => {
    return db.query(
        `SELECT *
        FROM users 
        WHERE id = $1`,
        [id]
    );
};

exports.addImage = (id, image) => {
    return db.query(
        `UPDATE users
        SET image = $2
        WHERE id = $1
        RETURNING image`,
        [id, image]
    );
};

exports.findRecentUsers = () => {
    return db.query(
        `SELECT id, first, last, bio, image 
        FROM users 
        ORDER BY id DESC 
        LIMIT 3`
    );
};

exports.matchSearch = (query) => {
    return db.query(
        `SELECT id, first, last, bio, image 
        FROM users 
        WHERE first ILIKE $1`,
        [query + "%"]
    );
};

exports.getFriendStatus = (myId, friendId) => {
    return db.query(
        `SELECT * 
        FROM friendships
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [myId, friendId]
    );
};

exports.askFriendRequest = (myId, friendId) => {
    return db.query(
        `INSERT INTO friendships (sender_id, receiver_id)
        VALUES ($1, $2)`,
        [myId, friendId]
    );
};

exports.acceptFriendRequest = (myId, friendId) => {
    return db.query(
        `UPDATE friendships 
        SET accepted = true
        WHERE (receiver_id = $1 AND sender_id = $2)`,
        [myId, friendId]
    );
};

exports.killFriendship = (myId, friendId) => {
    return db.query(
        `DELETE FROM friendships 
        WHERE (receiver_id = $1 AND sender_id = $2)
        OR (receiver_id = $2 AND sender_id = $1)`,
        [myId, friendId]
    );
};

exports.getFriendList = (id) => {
    return db.query(
        `SELECT users.id, users.first, users.last, users.image, friendships.accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)`,
        [id]
    );
};

module.exports.getLastTenMessages = () => {
    return db.query(
        `SELECT chat.id, chat.text_message, chat.sender_id, users.first, users.last, users.image, chat.created_at  
        FROM chat
        JOIN users 
        ON (chat.sender_id = users.id)
        ORDER BY chat.created_at DESC
        LIMIT 10`
    );
};

exports.insertMessage = (id, message) => {
    return db.query(
        `INSERT INTO chat (sender_id, text_message)
        VALUES ($1, $2)
        RETURNING id, sender_id, text_message, created_at`,
        [id, message]
    );
};

// fim
