const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql');


const app = express();
const port = 3005;

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ extended: true }));


const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    database: "pusphadb",
    password: "55555"
});

connection.connect((error) => {
    if (error) {
        console.error("Error connecting to database: " + error.stack);
        return;
    }
    console.log("Connected to the database");
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index01', (req, res) => {
    res.sendFile(path.join(__dirname, 'index01.html'));
});

app.get('/About', (req, res) => {
    res.sendFile(path.join(__dirname, 'About.html'));
});

app.get('/Shop', (req, res) => {
    res.sendFile(path.join(__dirname, 'Shop.html'));
});

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'register.html'));
});

app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const query =`INSERT INTO usertable (username, email, password) VALUES ('${username}', '${email}', '${password}')`;  
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error registering user: " + err.stack);
            res.send("Error registering user");
            return;
        }
        res.redirect('/login');
    });
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = `SELECT * FROM usertable WHERE username = '${username}' AND password = '${password}'`;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Error authenticating user: " + err.stack);
            res.send("Error authenticating user");
            return;
        }
        if (results.length > 0) {
            res.redirect('/home');
        } else {
            res.send('Invalid login credentials');
        }
    });
});

app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, 'shop.html'));
    //res.send('Login successful');
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
