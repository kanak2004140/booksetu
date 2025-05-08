const { Router } = require("express");
const { create, find } = require("../model/book.cjs");
const router = Router();
// Add a new book
router.post("/books", async (req, res) => {
  const { title, author, price, forRent, forSale, userId } = req.body;

  try {
    const book = await create({ title, author, price, forRent, forSale, owner: userId });
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ error: "Error adding book" });
  }
});

// Get all books
router.get("/books", async (req, res) => {
  const books = await find().populate("owner", "email");
  res.json(books);
});

module.exports = router;