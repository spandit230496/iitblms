const express=require("express")
const route=express.Router()
const {viewBook,borrowBook,returnBook,viewBorrowHistory,deleteAccount,viewAllBook,viewProfile}= require("../controller/memberController")

route.post("/view-book",viewBook)
route.post("/borrow-book",borrowBook)
route.post("/return-book",returnBook)
route.post("/book-borrow-history",viewBorrowHistory)
route.post("/delete-account",deleteAccount)
route.post("/view-all-book",viewAllBook)
route.post("/view-profile",viewProfile)



module.exports=route