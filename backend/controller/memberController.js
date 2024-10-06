const Book = require("../model/bookSchema")
const User = require("../model/userSchema")
const BorrowHistory=require("../model/bookBorrow")

const viewBook=async (req,res)=>{
    try{
        const{isbn}=req.body
        const existingBook=await Book.find({"isbn":isbn})
        if(existingBook){
            res.status(200).send({"message":"book fetched successfully","book":existingBook,"success":true})
        }
        else
        res.status(200).send({"message":"Book not found",success:false})



    }
    catch(error){
        res.status(500).send({"message":"some error occured"})
    }
}

const borrowBook = async (req, res) => {
    try {
        const { isbn, userId } = req.body;
        const book = await Book.findOne({ "isbn": isbn });

        if (book) {
            if (book.status === "BORROWED") {
                res.status(200).json({ "message": "Book is already borrowed", "success": false });
                return;
            } else {
                await Book.findOneAndUpdate({ "isbn": isbn }, { status: "BORROWED" });

                const borrowHistory = new BorrowHistory({
                    user: userId,
                    book: book._id,
                    borrowedAt: new Date()
                });
                await borrowHistory.save();

                res.status(200).json({ "message": "Book assigned successfully", "success": true });
            }
        } else {
            res.status(200).json({ "message": "Book not found", success: false });
        }
    } catch (error) {
        console.error("Error in borrowBook:", error);
        res.status(500).json({ "message": "Some error occurred", success: false });
    }
};

const returnBook = async (req, res) => {
    try {
        const { isbn, userId } = req.body;
        const book = await Book.findOne({ "isbn": isbn });

        if (book) {
            {
                await Book.findOneAndUpdate({ "isbn": isbn }, { status: "AVAILABLE" });

                const borrowHistory = new BorrowHistory({
                    user: userId,
                    book: book._id,
                    borrowedAt:book.borrowedAt,
                    returnedAt: new Date()
                });
                await borrowHistory.save();

                res.status(200).json({ "message": "Book returned successfully", "success": true });
            }
        } else {
            res.status(200).json({ "message": "Book not found", success: false });
        }
    } catch (error) {
        console.error("Error in borrowBook:", error);
        res.status(500).json({ "message": "Some error occurred", success: false });
    }
};

const viewBorrowHistory = async (req, res) => {
    try {
        const {userId} = req.body; 

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const borrowHistory = await BorrowHistory.find({ user: userId })
            .populate('book', 'title author isbn') 
            .sort({ borrowedAt: -1 })
            .lean();

        const formattedHistory = borrowHistory.map(entry => ({
            bookTitle: entry.book.title,
            author: entry.book.author,
            isbn: entry.book.isbn,
            borrowedAt: entry.borrowedAt,
            returnedAt: entry.returnedAt || 'Not returned yet'
        }));

        res.status(200).json({
            message: "Borrow history retrieved successfully",
            success: true,
            history: formattedHistory
        });

    } catch (error) {
        console.error("Error in viewBorrowHistory:", error);
        res.status(500).json({ message: "An error occurred while retrieving borrow history", success: false });
    }
};

const deleteAccount= async (req,res)=>{
  try{
    const {username}=req.body
    const existingUser=User.find({"username":username})

    if(existingUser){
        await User.findOneAndDelete({"username":username})
        res.status(200).json({"message":"Account Deleted Successfully",success:true})
    }
  }
  catch(error){
    res.status(500).json({ message: "An error occurred while retrieving borrow history", success: false });
  }
}

module.exports = { viewBook ,borrowBook,returnBook,viewBorrowHistory,deleteAccount}
