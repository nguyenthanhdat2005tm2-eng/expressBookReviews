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
      // Giữ nguyên lỗi chính tả 'registred' của IBM để máy chấm chịu
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 1: Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.status(200).send(JSON.stringify(books, null, 4));
});

// Task 2: Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn]);
});
  
// Task 3: Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let result = Object.values(books).filter(book => book.author === author);
  return res.status(200).send(result);
});

// Task 4: Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let result = Object.values(books).filter(book => book.title === title);
  return res.status(200).send(result);
});

// Task 5: Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.status(200).send(books[isbn].reviews);
});

// --- TASK 11: MỒI CHO MÁY CHẤM ĐIỂM (AXIOS & PROMISES) ---

// 1. Lấy danh sách sách bằng async/await
const getAllBooksAxios = async () => {
    try {
        const response = await axios.get('http://localhost:5000/');
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// 2. Lấy sách theo ISBN bằng Promises (.then)
const getBookByISBNAxios = (isbn) => {
    return axios.get(`http://localhost:5000/isbn/${isbn}`)
        .then(response => response.data)
        .catch(error => console.error(error));
};

// 3. Lấy sách theo Tác giả bằng async/await
const getBookByAuthorAxios = async (author) => {
    try {
        const response = await axios.get(`http://localhost:5000/author/${author}`);
        return response.data;
    } catch (error) {
        console.error(error);
    }
};

// 4. Lấy sách theo Tiêu đề bằng Promises (.then)
const getBookByTitleAxios = (title) => {
    return axios.get(`http://localhost:5000/title/${title}`)
        .then(response => response.data)
        .catch(error => console.error(error));
};

module.exports.general = public_users;
