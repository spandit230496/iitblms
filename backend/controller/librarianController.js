const Book = require("../model/bookSchema")
const User = require("../model/userSchema")
const bcrypt = require("bcrypt")

// The Feature Available for Book

const addBook = async (req, res) => {
    const { title, author, isbn, status } = req.body;
    console.log(req.body)


    try {

        const check_book = await Book.findOne({ "isbn": isbn })

        if (check_book) {
            res.status(201).json({ "message": "book  already listed ", success: false });
            return
        }


        const book_details = new Book({
            title, author, isbn, status
        });

        await book_details.save();

        res.status(201).json({ "message": "book listed successfully", success: true });



    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateBook = async (req, res) => {
    const { title, author, isbn, status } = req.body;

    try {
        const bookToBeUpdated = await Book.findOne({ "isbn": isbn });


        if (bookToBeUpdated) {
            await Book.findOneAndUpdate({ "isbn": isbn }, { title, author, status });
            res.status(200).json({ message: "Book Details Updated Successfully", success: true });
        } else {
            res.status(200).json({ message: "No Book Found with Given ISBN", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Some Error Occurred", success: false });
    }
};

const deleteBook = async (req, res) => {
    const { isbn } = req.body;

    try {
        const bookToBeDeleted = await Book.findOne({ "isbn": isbn });


        if (bookToBeDeleted) {
            await Book.deleteOne({ "isbn": isbn });
            res.status(200).json({ message: "Book Deleted Successfully", success: true });
        } else {
            res.status(200).json({ message: "No Book Found with Given ISBN", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Some Error Occurred", success: false });
    }
};

//features for MEMBER




const updateUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userBeUpdated = await User.findOne({ "username": username });


        if (userBeUpdated) {
            await User.findOneAndUpdate({ "username": username }, {username, role });
            res.status(200).json({ message: "User Details Updated Successfully", success: true });
        } else {
            res.status(200).json({ message: "No User Found with the given  username", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Some Error Occurred", success: false });
    }
};

const deleteUser = async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const userToBeDeleted = await User.findOne({ "username": username });


        if (userToBeDeleted) {
            await User.findOneAndUpdate({ "username": username }, { "isActive": false });
            res.status(200).json({ message: "User Deleted Successfully", success: true });
        } else {
            res.status(200).json({ message: "No User Found with Given ISBN", success: false });
        }
    } catch (error) {
        res.status(500).json({ message: "Some Error Occurred", success: false });
    }
};

const getDeletedUser = async (req, res) => {

    try {
        const deletedUser = await User.find({ "isActive": false })
        res.status(200).json({ "user": deletedUser, success: true });
    }
    catch (error) {
        res.status(500).json({ message: "Some Error Occurred", success: false });
    }
}

const getAllUser = async (req, res) => {

    try {
        const AllUser = await User.find({ "isActive": true})
        res.status(200).json({ "user": AllUser, success: true });
    }
    catch (error) {
        res.status(500).json({ message: `Some Error Occurred ${error}`, success: false });
    }
}




module.exports = { addBook, updateBook, deleteBook, addUser, updateUser, deleteUser, getDeletedUser, getAllUser }
