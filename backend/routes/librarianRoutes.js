const express=require("express")
const route=express.Router()
const {addBook,updateBook,deleteBook,addUser,updateUser,deleteUser,getDeletedUser,getAllUser}= require("../controller/librarianController")

route.post("/add-book",addBook)
route.post("/update-book",updateBook)
route.post("/delete-book",deleteBook)

// routes related to member


route.post("/update-member",updateUser)
route.post("/delete-member",deleteUser)
route.get("/get-deletedMember",getDeletedUser)
route.get("/get-user",getAllUser)



module.exports=route