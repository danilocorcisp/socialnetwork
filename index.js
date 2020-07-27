const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 127.0.0.1:8080",
});
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const { sendEmail } = require("./ses");
const s3 = require("./s3");
let secrets;
if (process.env.PORT) {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

app.use(compression());

app.use(express.json());

// app.use(
//     cookieSession({
//         secret: secrets.key,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//         cookie: {
//             sameSite: true,
//         },
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: secrets.key,
    maxAge: 1000 * 60 * 60 * 24 * 90,
    cookie: {
        sameSite: true,
    },
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());

    next();
});

const secretCode = cryptoRandomString({
    length: 6,
});

app.use(express.static("public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// ROUTES

app.post("/register", (req, res) => {
    console.log("req.body: ", req.body);

    let { first, last, email, password } = req.body;

    hash(password)
        .then((hashedPw) => {
            password = hashedPw;

            db.addUserAccount(first, last, email, password).then((response) => {
                req.session.userId = response.rows[0].id;

                res.json({ success: true });
            });
        })
        .catch((err) => {
            console.log("error in register: ", err);
            res.json({ success: false });
        });
});

app.post("/login", (req, res) => {
    if ((req.body.email, req.body.password)) {
        db.getPw(req.body.email)
            .then((data) => {
                let userId = data.rows[0].id;
                let firstName = data.rows[0].first;
                compare(req.body.password, data.rows[0].password).then(
                    (match) => {
                        if (match) {
                            req.session.userId = userId;
                            req.session.firstName = firstName;
                            res.json({ success: true });
                        } else {
                            res.json({ success: false });
                        }
                    }
                );
            })
            .catch((err) => {
                console.log(err);
                res.json({ success: false });
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/password/change", (req, res) => {
    let { email } = req.body;
    // console.log("email: ", email);

    db.getUser(email)
        .then((response) => {
            let currentEmail = response.rows[0].email;

            if (currentEmail == email) {
                let code = secretCode;

                db.createResetCode(email, code)
                    .then(() => {
                        sendEmail(
                            email,
                            `This is your reset code: ${code}`,
                            "Your reset password code"
                        );

                        res.json({ success: true });
                    })
                    .catch((err) => {
                        console.log("error in insert code query: ", err);
                    });
            } else {
                res.json({ sucess: false });
            }
        })
        .catch((err) => {
            console.log("error in post reset-password/email: ", err);
            res.json({ success: false });
        });
});

app.post("/password/change/verify", (req, res) => {
    if (req.body.code && req.body.novaSenha) {
        db.resetCode(req.body.email)
            .then((data) => {
                if (data.rows.length < 1) {
                    res.json({
                        success: false,
                    });
                } else if (data.rows[0].code == req.body.code) {
                    hash(req.body.novaSenha)
                        .then((hashedPw) => {
                            password = hashedPw;
                            db.updatePass(req.body.email, password);
                        })
                        .then(() => {
                            res.json({ success: true });
                        });
                }
            })
            .catch((err) => {
                console.log(err);
                res.json({
                    success: false,
                });
            });
    } else {
        res.json({ success: false });
    }
});

app.post("/upload-img", uploader.single("file"), s3.upload, (req, res) => {
    console.log("wohoo subiu pra amazon");

    let url = `https://s3.amazonaws.com/universeimage/${req.file.filename}`;

    if (req.file) {
        db.addImage(req.session.userId, url)
            .then((data) => {
                res.json(data.rows);
            })

            .catch((err) => {
                res.json({
                    error:
                        "There was a problem with your Image. Please try again",
                });
                console.log(err);
            });
    } else {
        res.json({ error: "Select an image file" });
    }
});

app.get("/user", async function (req, res) {
    try {
        const user = await db.getUserId(req.session.userId);
        res.json(user.rows[0]);
    } catch (err) {
        console.log(err);
        res.json({ error: "Ops, something went wrong. Try again" });
    }
});

app.get("/user/:id.json", async (req, res) => {
    if (req.session.userId == req.params.id) {
        res.json({ self: true });
    } else {
        try {
            const user = await db.getUserId(req.params.id);
            res.json(user.rows[0]);
        } catch (err) {
            console.log(err);
            res.json({ error: "Nothing here!" });
        }
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.post("/update-bio", async function (req, res) {
    try {
        console.log(req.body.rascunho);
        const bio = await db.updateBio(req.session.userId, req.body.rascunho);
        res.json(bio.rows[0]);
        console.log("bio.rows[0]:", bio.rows[0]);
    } catch (err) {
        console.log(err);
        res.json({ error: "Something went wrong. Try again." });
    }
});

app.get("/new-users.json", async (req, res) => {
    try {
        const users = await db.findRecentUsers();
        res.json(users.rows);
    } catch (err) {
        console.log(err);
        res.json({ error: "There was a problem updating the page." });
    }
});

app.get("/users/:query.json", async (req, res) => {
    try {
        const users = await db.matchSearch(req.params.query);
        res.json(users.rows);
    } catch (err) {
        console.log(err);
        res.json({ error: "There was a problem updating the page." });
    }
});

app.get("/friends-relation/:id", async (req, res) => {
    try {
        const friend = await db.getFriendStatus(
            req.session.userId,
            req.params.id
        );

        res.json(friend.rows);
    } catch (err) {
        console.log(err);
        res.json({ error: "Bad robot. An error happened. Try again" });
    }
});

app.post("/friends-request/:id", async (req, res) => {
    try {
        await db.askFriendRequest(req.session.userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ error: "Bad robot. An error happened. Try again" });
    }
});

app.post("/accept-friends-request/:id", async (req, res) => {
    try {
        await db.acceptFriendRequest(req.session.userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ error: "Bad robot. An error happened. Try again" });
    }
});

app.post("/delete-friend/:id", async (req, res) => {
    try {
        await db.killFriendship(req.session.userId, req.params.id);
        res.json({ success: true });
    } catch (err) {
        console.log(err);
        res.json({ error: "Bad robot. An error happened. Try again" });
    }
});

app.get("/friends-relation", async (req, res) => {
    try {
        const friendList = await db.getFriendList(req.session.userId);
        res.json(friendList.rows);
    } catch (err) {
        console.log(err);
        res.json({ error: "Bad robot. An error happened. Try again" });
    }
});

app.get("*", function (req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// io.on("conection", (socket) => {
//     socket.on("disconnet", () => {
//         console.log(`Socket with id ${socket.id} just DISCONNECTED`);
//     });
// });

if (require.main === module) {
    server.listen(process.env.PORT || 8080, () =>
        console.log("Social Network is up")
    );
}

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    let messages = await db.getLastTenMessages();
    allMessages = messages.rows
        .map((row) => {
            return (row = {
                ...row,
            });
        })
        .reverse();
    io.sockets.emit("10 last messages", allMessages);

    socket.on("chatMessage", async (message) => {
        const mensagem = await db.insertMessage(userId, message);

        const user = await db.getUserId(userId);

        const newMsg = {
            id: mensagem.rows[0].id,
            text_message: mensagem.rows[0].text_message,
            user_id: userId,
            first: user.rows[0].first,
            last: user.rows[0].last,
            image: user.rows[0].image,
        };

        console.log("chatMessage", newMsg);

        io.sockets.emit("chat message", newMsg);
    });
});

// make sure you write all your socket code INSIDE io.on('connection')
// io.on("connection", function (socket) {
//     console.log(`socket id ${socket.id} is now connected`);

//     // we don't want logged out users to use sockets!
//     if (!socket.request.session.userId) {
//         return socket.disconnect(true);
//     }

//     const userId = socket.request.session.userId;

// if user makes it to this point in the code, then it means they're logged in
// & are successfully connected to sockets

// this is a good place to go get the last 10 chat messages
// we'll need to make a new table for chats
// your db query for getting the last 10 messages will need to be a JOIN
// you'll need info from both the users table and chats!
// i.e. user's first name, last name, image, and chat msg
//the most recent chat message should be displayed at the BOTTOM

// db.getLastTenMsgs().then(chat => {
//     console.log(chat.rows);
//     io.sockets.emit('chatMessages', chat.rows);
//     // console.log(chat.rows);
// });

// ADDING A NEW MSG - let's listen for a new chat msg being sent from the client
// socket.on("My amazing chat message", (newMsg) => {
//     console.log("This message is coming from chat.js component", newMsg);
//     console.log("user who sent newMsg is: ", userId);

// do a db query to store the new chat message into the chat table!!
// also do a db query to get info about the user (first name, last name, img) - will probably need to be a JOIN
// once you have your chat object, you'll want to EMIT it to EVERYONE so they can see it immediately.
// try {
//     await db.insertMessage(userId, newMsg);
//     io.sockets.emit("addChatMsg", newMsg);
// } catch (err) {
//     console.log("ERROR in socket insert (to database)", err);
// }
// });

// 1st argument ('My amazing chat message') - listens to the event that will be coming from chat.js
// 2nd argument (newMsg) - is the info that comes along with the emit from chat.js
// })
