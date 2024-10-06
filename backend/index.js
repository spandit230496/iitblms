const express = require("express");
const app = express();
const db = require('./db/db');
const cors = require('cors');
const librarianRoutes=require("./routes/librarianRoutes")
const memberRoutes=require("./routes/memberRoutes")
const authRoute=require("./routes/authRoutes")
const verifyToken=require("./middleware/verifyToken")


app.use(cors()); 

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'https://pgguide.netlify.app', 'http://localhost:3000');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

app.use(express.json());
app.use("/api/v1",verifyToken("LIBRARIAN"),librarianRoutes)
app.use("/api/v1",verifyToken("MEMBER"),memberRoutes)
app.use("/",authRoute)

db;


app.listen(5000, () => {
    console.log(`Server launched successfully on ${5000}`);
});