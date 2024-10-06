const express=require("express")
const route=express.Router()
const {viewBook,borrowBook,returnBook,viewBorrowHistory,deleteAccount}= require("../controller/memberController")

route.post("/view-book",viewBook)
route.post("/borrow-book",borrowBook)
route.post("/return-book",returnBook)
route.post("/book-borrow-history",viewBorrowHistory)
route.post("/delete-account",deleteAccount)




module.exports=route