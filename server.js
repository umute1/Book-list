const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const BOOKS_PATH = path.join(__dirname, "books.json");

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Book List API" });
});

function getBooks() {
  const data = fs.readFileSync(BOOKS_PATH, "utf-8");
  return JSON.parse(data);
}

function saveBooks(books) {
  fs.writeFileSync(BOOKS_PATH, JSON.stringify(books, null, 2));
}

app.get("/books", (req, res) => {
  const books = getBooks();
  res.json(books);
});

app.get("/books/:id", (req, res) => {
  const books = getBooks();
  const book = books.find((b) => b.id === Number(req.params.id));
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
});

app.post("/books", (req, res) => {
  const books = getBooks();
  const lastId = books.length ? books[books.length - 1].id : 0;
  const newBook = {
    id: lastId + 1,
    ...req.body,
  };
  books.push(newBook);
  saveBooks(books);
  res.status(201).json(newBook);
});

app.put("/books/:id", (req, res) => {
  const books = getBooks();
  const index = books.findIndex((b) => b.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ message: "Book not found" });
  }
  books[index] = { ...books[index], ...req.body };
  saveBooks(books);
  res.json(books[index]);
});

app.delete("/books/:id", (req, res) => {
  const books = getBooks();
  const filtered = books.filter((b) => b.id !== Number(req.params.id));
  if (filtered.length === books.length) {
    return res.status(404).json({ message: "Book not found" });
  }
  saveBooks(filtered);
  res.json({ message: "Book deleted" });
});

app.listen(PORT, () => {
  console.log(`Book List API running at http://localhost:${PORT}`);
});
