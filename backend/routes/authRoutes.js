const express=require("express")
const route=express.Router()
const {loginUser,addUser}= require("../controller/authController")


route.post("/login",loginUser)
route.post("/register",addUser)



module.exports=route