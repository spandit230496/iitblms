const Book = require("../model/bookSchema");
const User = require("../model/userSchema");
const BorrowHistory = require("../model/bookBorrow");
const secret = "123456";
const jwt = require("jsonwebtoken");

const viewAllBook = async (req, res) => {
    try {
        const bookList = await Book.find({});
        res.status(200).send({ "message": "Books fetched successfully", "book": bookList, success: true });
    } catch (error) {
        res.status(500).send({ "message": "An error occurred while fetching books", success: false });
    }
};

const viewBook = async (req, res) => {
    try {
        const { isbn } = req.body;
        const existingBook = await Book.find({ "isbn": isbn });
        if (existingBook) {
            res.status(200).send({ "message": "Book fetched successfully", "book": existingBook, "success": true });
        } else {
            res.status(200).send({ "message": "Book not found", success: false });
        }
    } catch (error) {
        res.status(500).send({ "message": "An error occurred while fetching the book", success: false });
    }
};

const borrowBook = async (req, res) => {
    try {
        const { isbn } = req.body;
        const book = await Book.findOne({ "isbn": isbn });
        const token = req.headers["authorization"];
        if (!token) return res.status(401).send({ "message": "Token is missing" });

        const decoded = jwt.verify(token.split(" ")[1], secret);
        const userId = decoded.userId;

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
        const { isbn } = req.body;
        const book = await Book.findOne({ "isbn": isbn });
        const token = req.headers["authorization"];
        if (!token) return res.status(401).send({ "message": "Token is missing" });

        const decoded = jwt.verify(token.split(" ")[1], secret);
        const userId = decoded.userId;

        if (!book) {
            return res.status(404).json({ "message": "Book not found", success: false });
        }

        const borrowRecord = await BorrowHistory.findOne({ user: userId, book: book._id });
        
        if (!borrowRecord) {
            return res.status(403).json({ "message": "This book is not issued to you", success: false });
        }

        await Book.findOneAndUpdate({ "isbn": isbn }, { status: "AVAILABLE" });
        borrowRecord.returnedAt = new Date();
        await borrowRecord.save();

        res.status(200).json({ "message": "Book returned successfully", "success": true });
    } catch (error) {
        console.error("Error in returnBook:", error);
        res.status(500).json({ "message": "Some error occurred", success: false });
    }
};

const viewBorrowHistory = async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).send({ "message": "Token is missing" });

        const decoded = jwt.verify(token.split(" ")[1], secret);
        const userId = decoded.userId;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const borrowHistory = await BorrowHistory.find({ user: userId })
            .populate('book', 'title author isbn status ')
            .sort({ borrowedAt: -1 })
            .lean();

        const formattedHistory = borrowHistory.map(entry => ({
            title: entry.book.title,
            author: entry.book.author,
            isbn: entry.book.isbn,
            status: entry.book.status,
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

const deleteAccount = async (req, res) => {
    try {

        const token = req.headers["authorization"];
        if (!token) return res.status(401).send({ "message": "Token is missing" });

        const decoded = jwt.verify(token.split(" ")[1], secret);
        const username = decoded.username;
        const existingUser = await User.findOne({ "username": username });

        if (existingUser) {
            await User.findOneAndUpdate({ "username": username },{"isActive":false});
            res.status(200).json({ "message": "Account Deleted Successfully", success: true });
        } else {
            res.status(404).json({ "message": "User not found", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the account", success: false });
    }
};

const viewProfile = async (req, res) => {
    try {
        const token = req.headers["authorization"];
        if (!token) return res.status(401).send({ "message": "Token is missing" });

        const decoded = jwt.verify(token.split(" ")[1], secret);
        const userId = decoded.userId;
        const userProfile = await User.findById(userId);

        if (userProfile) {
            res.status(200).json({ "message": "Account fetched successfully", data: {"username":userProfile.username,"isActive":userProfile.isActive}, success: true });
        } else {
            res.status(404).json({ "message": "User not found", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "An error occurred while retrieving the profile", error: error, success: false });
    }
};

module.exports = { viewBook, borrowBook, returnBook, viewBorrowHistory, deleteAccount, viewAllBook, viewProfile };
