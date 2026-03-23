const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');


public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // 1. Check if both username and password are provided
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // 2. Check if the username already exists
  const userExists = users.some((user) => user.username === username);

  if (userExists) {
    return res.status(409).json({ message: "Username already exists!" });
  }

  // 3. Register the user (push to the users array)
  users.push({ "username": username, "password": password });
  
  return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  // Use JSON.stringify with null and 4 spaces for a "pretty" printed output
  res.send(JSON.stringify(books, null, 4));
});

/* Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
}); */

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn];    // Find the book in the books object using the ISBN key

  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});

/* Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
 }); */
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author; // Retrieve the author from parameters
  const keys = Object.keys(books); // Obtain all the keys for the 'books' object
  const filteredBooks = []; // Array to store matching books

  // Iterate through the keys and check if the author matches
  keys.forEach(key => {
    if (books[key].author === author) {
      filteredBooks.push({
        isbn: key,
        ...books[key]
      });
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found for this author" });
  }
});

/* Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
}); */

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title; // Retrieve the title from parameters
  const keys = Object.keys(books); // Obtain all the keys for the 'books' object
  const filteredBooks = []; // Array to store matching books

  // Iterate through the keys and check if the title matches
  keys.forEach(key => {
    if (books[key].title === title) {
      filteredBooks.push({
        isbn: key,
        ...books[key]
      });
    }
  });

  if (filteredBooks.length > 0) {
    return res.status(200).json(filteredBooks);
  } else {
    return res.status(404).json({ message: "No books found with this title" });
  }
});

/* Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
}); */

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Retrieve ISBN from request parameters
  const book = books[isbn];    // Find the book in the books object

  if (book) {
    // Return only the reviews of the book
    return res.status(200).json(book.reviews);
  } else {
    return res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

/* Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
}); */

// Task 10: Get the book list available in the shop using async-await
public_users.get('/async-get-books', async function (req, res) {
    try {
        // In a real scenario, you'd fetch from an external API
        // Here we simulate it by returning the local 'books' object via a Promise
        const getBooks = new Promise((resolve, reject) => {
            resolve(books);
        });
        const bookList = await getBooks;
        res.status(200).send(JSON.stringify(bookList, null, 4));
    } catch (error) {
        res.status(500).json({ message: "Error fetching books" });
    }
});


module.exports.general = public_users;
