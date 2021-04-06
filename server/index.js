const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")

const cookieParser = require("cookie-parser")
const bodyParser = require('body-parser')
const session = require("express-session")

const bcrypt = require("bcrypt")
const saltRounds = 10

require('dotenv').config()

const app = express()

// app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST"],
    credentials: true
}));

app.use(cookieParser());
// app.use(bodyParser.urlencoded({extended: true}));
app.use(express.urlencoded({ extended: true }));

app.use(session({
    key: "userId",
    secret: process.env.NODE_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    },
}))


const db = mysql.createConnection({
    user: process.env.NODE_USER,
    host: process.env.NODE_HOST,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    port: process.env.NODE_PORT,
})

// db.connect((error, results) => {
//     if (error) {
//         console.log("FAILED TO CONNECT TO DATABASE");
//         console.error(error);
//     } else {
//         console.log("CONNECTED TO DATABSE");
//     }
// })

app.post('/register', (req, res) => {
    const username = req.body.username
    const password = req.body.password


    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            console.log(err);
        }
        db.query(
            "INSERT INTO users VALUES (?, ?)",
            [username, hash],
            (err, res) => {
                // console.log(err);
            }
        )
    })
})

app.get('/login', (req, res) => {
    if (req.session.user) {
        res.send({ loggedIn: true, user: req.session.user })
    } else {
        res.send({ loggedIn: false })

    }
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.query(
        "SELECT * from users WHERE username = ?",
        username,
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }

            if (result.length > 0) {
                bcrypt.compare(password, result[0].password, (error, response) => {
                    if (response) {
                        req.session.user = result;
                        console.log(req.session.user);
                        res.send(result)
                    } else {
                        res.send({ message: "Wrong Combination" })
                    }
                    // if (error) {
                    //     console.log(error)
                    // }
                })
            } else {
                res.send({ message: "User does not exist" })
            }
        }
    )
})

app.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})