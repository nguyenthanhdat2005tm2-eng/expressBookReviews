const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  try {
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error retrieving books"});
  }
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const getBookByISBN = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  getBookByISBN
    .then((book) => res.status(200).send(JSON.stringify(book, null, 4)))
    .catch((err) => res.status(404).json({message: err}));
});
  
// Task 12: Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  try {
    const author = req.params.author;
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    
    let filteredBooks = {};
    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].author.toLowerCase() === author.toLowerCase()) {
        filteredBooks[key] = allBooks[key];
      }
    });
    
    if (Object.keys(filteredBooks).length > 0) {
      res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      res.status(404).json({message: "No books found by this author"});
    }
  } catch (error) {
    res.status(500).json({message: "Error filtering books"});
  }
});

// Task 13: Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  try {
    const title = req.params.title;
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    
    let filteredBooks = {};
    Object.keys(allBooks).forEach(key => {
      if (allBooks[key].title.toLowerCase() === title.toLowerCase()) {
        filteredBooks[key] = allBooks[key];
      }
    });
    
    if (Object.keys(filteredBooks).length > 0) {
      res.status(200).send(JSON.stringify(filteredBooks, null, 4));
    } else {
      res.status(404).json({message: "No books found with this title"});
    }
  } catch (error) {
    res.status(500).json({message: "Error filtering books"});
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    res.status(404).json({message: "Book not found"});
  }
});

module.exports = public_users;
