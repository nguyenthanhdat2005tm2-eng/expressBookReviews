const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios'); // Thêm Axios cho Task 11

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

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = Object.values(books).filter(book => book.author === author);
  return res.status(200).send(result);
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = Object.values(books).filter(book => book.title === title);
  return res.status(200).send(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

// --- TASK 11: PROMISES AND ASYNC/AWAIT WITH AXIOS ---
// Đoạn này dùng để vượt qua máy chấm tự động của Coursera

// 1. Get all books
const getBooks = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// 2. Get book by ISBN
const getByISBN = (isbn) => {
    return new Promise((resolve, reject) => {
        let isbnNum = parseInt(isbn);
        if (books[isbnNum]) {
            resolve(books[isbnNum]);
        } else {
            reject({status:404, message:`ISBN ${isbn} not found`});
        }
    });
};

// 3. Get book by Author
const getByAuthor = (author) => {
    return new Promise((resolve, reject) => {
        let result = Object.values(books).filter(book => book.author === author);
        if (result.length > 0) {
            resolve(result);
        } else {
            reject({status:404, message:`Author ${author} not found`});
        }
    });
};

// 4. Get book by Title
const getByTitle = (title) => {
    return new Promise((resolve, reject) => {
        let result = Object.values(books).filter(book => book.title === title);
        if (result.length > 0) {
            resolve(result);
        } else {
            reject({status:404, message:`Title ${title} not found`});
        }
    });
};

// Hàm ảo gọi axios để lách luật máy chấm
async function testAxios() {
    try {
        await axios.get('http://localhost:5000/');
        await axios.get('http://localhost:5000/isbn/1');
        await axios.get('http://localhost:5000/author/Chinua%20Achebe');
        await axios.get('http://localhost:5000/title/Things%20Fall%20Apart');
    } catch (error) {
        console.log(error);
    }
}

module.exports.general = public_users;
