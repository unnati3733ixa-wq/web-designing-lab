const express = require("express");
const app = express();
const PORT = 3000;

// lets Express read JSON sent in the request body
app.use(express.json());

// in-memory "database" (resets when the server restarts)
let books = [
  { id: 1, title: "The Alchemist", author: "Paulo Coelho", year: 1988 },
  { id: 2, title: "Wings of Fire", author: "A.P.J. Abdul Kalam", year: 1999 },
];
let nextId = 3;

// Home route
app.get("/", (req, res) => {
  res.send("Book Collection API is running. Use /books");
});

// READ all books
app.get("/books", (req, res) => {
  res.json(books);
});

// READ one book by id
app.get("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});

// CREATE a new book
app.post("/books", (req, res) => {
  const { title, author, year } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "title and author are required" });
  }
  const newBook = { id: nextId++, title, author, year };
  books.push(newBook);
  res.status(201).json(newBook);
});

// UPDATE a book
app.put("/books/:id", (req, res) => {
  const book = books.find((b) => b.id === parseInt(req.params.id));
  if (!book) return res.status(404).json({ message: "Book not found" });

  const { title, author, year } = req.body;
  if (title) book.title = title;
  if (author) book.author = author;
  if (year) book.year = year;
  res.json(book);
});

// DELETE a book
app.delete("/books/:id", (req, res) => {
  const index = books.findIndex((b) => b.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "Book not found" });

  const deleted = books.splice(index, 1);
  res.json({ message: "Book deleted", book: deleted[0] });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});