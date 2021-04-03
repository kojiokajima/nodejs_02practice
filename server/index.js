const express = require("express")
const mysql = require("mysql2")
require('dotenv').config()

const app = express()

app.use(express.json())

const connection = mysql.createConnection({
    user: process.env.NODE_USER,
    host: process.env.NODE_HOST,
    password: process.env.NODE_PASSWORD,
    database: process.env.NODE_DATABASE,
    port: process.env.NODE_PORT,

})

connection.connect((error, results) => {
    if (error) {
        console.log("FAILED TO CONNECT TO DATABASE");
        console.error(error);
    } else {
        console.log("CONNECTED TO DATABSE");
    }
})

app.listen(3001, () => {
    console.log("SERVER IS RUNNING");
})