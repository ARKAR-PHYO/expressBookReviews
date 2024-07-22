const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});


// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(JSON.stringify(books,null,4));
// });

public_users.get("/", function (req, res) {
  let getAllBooks = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books, null, 4));
  });
  getAllBooks.then((successMessage) => {
    console.log("From Callback " + successMessage);
  });
});


// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//     if(!req.params.isbn) return res.status(404).json({message: "Book not found with this isbn."})
//     const isbn = req.params.isbn
//     res.send(books[isbn])
//  });
public_users.get("/isbn/:isbn", function (req, res) {
  if (!req.params.isbn)
    return res.status(404).json({ message: "Book not found with this isbn." });
  const isbn = req.params.isbn;

  let getBookByISBN = new Promise((resolve, reject) => {
    resolve(JSON.stringify(books[isbn], null, 4));
  });
  getBookByISBN.then((successMessage) => {
    console.log("From Callback " + successMessage);
  });
});

  
// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  if (!author) return res.status(404).json({ message: "No author provided." });

  const booksByAuthor = Object.keys(books)
    .map((key) => books[key])
    .filter((book) => book.author === author);

  if (booksByAuthor.length === 0) {
    return res.status(404).json({ message: "No books found for this author." });
  }

  res.json(booksByAuthor);
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  if (!title) return res.status(404).json({ message: "No title provided." });

  // Iterate through the books to find books by the specified title
  const booksByTitle = Object.keys(books).map(key => books[key]).filter(book => book.title === title);

  if (booksByTitle.length === 0) {
    return res.status(404).json({ message: "No books found for this title." });
  }

  res.json(booksByTitle);
});

//  Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (!isbn) {
    return res.status(400).json({ message: "No ISBN provided." });
  }

  const book = books[isbn];

  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  res.json(book.reviews);
});

module.exports.general = public_users;
