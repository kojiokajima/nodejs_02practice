const express = require("express")
const mysql = require("mysql2")
const cors = require("cors")
require('dotenv').config()

const app = express()

// app.use(express.urlencoded({extended: true}));
app.use(express.json())
app.use(cors())
// app.use(express.urlencoded({ extended: true }));


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

    db.query(
        "INSERT INTO users VALUES (?, ?)",
        [username, password],
        (err, res) => {
            // console.log(err);
        }
    )
})

app.post('/login', (req, res) => {
    const username = req.body.username
    const password = req.body.password
    db.query(
        "SELECT * from users WHERE username = ? AND password = ?",
        [username, password],
        (err, result) => {
            if (err) {
                res.send({ err: err })
            }

            if (result.length > 0) {
                res.send(result)
            } else {
                res.send({ message: "Wrong Combination" })
            }
        }
    )
})

app.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})