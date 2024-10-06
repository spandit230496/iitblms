const express=require("express")
const route=express.Router()
const {addBook,updateBook,deleteBook,getBookList,updateUser,deleteUser,getDeletedUser,getAllUser,getBook,viewUser}= require("../controller/librarianController")

route.post("/add-book",addBook)
route.post("/update-book",updateBook)
route.post("/delete-book",deleteBook)
route.get("/get-books",getBookList)
route.get("/get-book/:isbn",getBook)


// routes related to member


route.post("/update-member",updateUser)
route.post("/delete-member",deleteUser)
route.get("/get-deletedMember",getDeletedUser)
route.get("/get-all-user",getAllUser)
route.post("/get-user",viewUser)



module.exports=route