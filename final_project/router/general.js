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

// Task 10: Get the book list available in the shop using Promises
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
      resolve(books);
  })
  .then(bookList => res.status(200).send(JSON.stringify(bookList, null, 4)))
  .catch(error => res.status(500).json({message: "Error fetching books"}));
});

// Task 11: Get book details based on ISBN using Promises
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
      if (books[isbn]) {
          resolve(books[isbn]);
      } else {
          reject({status: 404, message: "ISBN not found"});
      }
  })
  .then(book => res.status(200).send(book))
  .catch(error => res.status(error.status).json({message: error.message}));
});
  
// Task 12: Get book details based on author using Promises
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
      let result = Object.values(books).filter(book => book.author === author);
      if (result.length > 0) {
          resolve(result);
      } else {
          reject({status: 404, message: "Author not found"});
      }
  })
  .then(result => res.status(200).send(result))
  .catch(error => res.status(error.status).json({message: error.message}));
});

// Task 13: Get all books based on title using Promises
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
      let result = Object.values(books).filter(book => book.title === title);
      if (result.length > 0) {
          resolve(result);
      } else {
          reject({status: 404, message: "Title not found"});
      }
  })
  .then(result => res.status(200).send(result))
  .catch(error => res.status(error.status).json({message: error.message}));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  if(books[isbn]) {
      res.status(200).send(books[isbn].reviews);
  } else {
      res.status(404).send("Book not found");
  }
});

module.exports.general = public_users;
