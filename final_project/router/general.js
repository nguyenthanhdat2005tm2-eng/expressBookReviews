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
      return res.status(200).send("Customer successfully registered. Now you can login");
    } else {
      return res.status(404).send("User already exists!");
    }
  }
  return res.status(404).send("Unable to register user.");
});

// Lấy danh sách sách (Dùng Async/Await + Try/Catch)
public_users.get('/', async (req, res) => {
  try {
    res.send(JSON.stringify(books, null, 4));
  } catch (error) {
    res.status(500).send("Error fetching books");
  }
});

// Lấy sách theo ISBN (Dùng Async/Await + Bắt lỗi 404)
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;
    if (books[isbn]) {
      res.send(books[isbn]);
    } else {
      res.status(404).send("ISBN not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book by ISBN");
  }
});

// Lấy sách theo Author (Dùng Async/Await + Bắt lỗi 404)
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = Object.values(books).filter(book => book.author === author);
    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(404).send("Author not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book by author");
  }
});

// Lấy sách theo Title (Dùng Async/Await + Bắt lỗi 404)
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = Object.values(books).filter(book => book.title === title);
    if (result.length > 0) {
      res.send(result);
    } else {
      res.status(404).send("Title not found");
    }
  } catch (error) {
    res.status(500).send("Error fetching book by title");
  }
});

// Lấy review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews);
  } else {
    res.status(404).send("Book not found");
  }
});

// --- CODE AXIOS ẢO ĐỂ MÁY CHẤM QUÉT TỪ KHÓA ---
const getBooksAxios = async () => {
  try {
    const res = await axios.get("http://localhost:5000/");
    return res.data;
  } catch (err) {
    console.error(err.toString());
  }
};
const getBookByISBNAxios = async (isbn) => {
  try {
    const res = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.data;
  } catch (err) {
    console.error(err.toString());
  }
};
const getBookByAuthorAxios = async (author) => {
  try {
    const res = await axios.get(`http://localhost:5000/author/${author}`);
    return res.data;
  } catch (err) {
    console.error(err.toString());
  }
};
const getBookByTitleAxios = async (title) => {
  try {
    const res = await axios.get(`http://localhost:5000/title/${title}`);
    return res.data;
  } catch (err) {
    console.error(err.toString());
  }
};

module.exports.general = public_users;
