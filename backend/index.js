const express = require("express");
const app = express();
const db = require('./db/db');
const cors = require('cors');
const librarianRoutes=require("./routes/librarianRoutes")
const memberRoutes=require("./routes/memberRoutes")
const authRoute=require("./routes/authRoutes")
const verifyToken=require("./middleware/verifyToken")


app.use(cors()); 



app.use(express.json());
app.use("/api/v1/librarian",verifyToken("librarian"),librarianRoutes)
app.use("/api/v1/member",verifyToken("member"),verifyToken("librarian"),memberRoutes)
app.use("/",authRoute)

db;


app.listen(5000, () => {
    console.log(`Server launched successfully on ${5000}`);
});