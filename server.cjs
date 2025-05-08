const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const authRoutes = require("./routes/authRoutes.cjs");
const bookRoutes = require("./routes/bookRoutes.cjs");
const { PORT, Signup } = require("./model/user.cjs");
const { db } = require("./model/book.cjs");

const app = express();
app.get("/", (req, res) => {
  res.send("Hello World! This is the Bookstore API.");
});
app.get("/api/bookstore/:id", (req, res) => {
  const id = req.params.id;
  const objectId = new mongoose.Types.ObjectId(id);
  db.collection("bookstore").findOne({ _id: objectId })
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Document not found" });
      }
    })
    .catch((error) => {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Internal server error" });
    });
});
app.use(express.json());
app.use(cors());
app.post('/api/users', async (req, res) => {
    const user = new Signup(req.body);
    try {
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

    // Here you would typically add logic to save the user to the database
    // For now, we'll just return a success message
    res.status(201).json({ message: "User added successfully", user: { name: req.body.fullName, email: req.body.email } });
  });
// Routes
app.use('/api/auth', authRoutes, (_req, res) => {
  res.status(200).json({ message: "Auth route" });
});
app.use('/api/books', bookRoutes, (_req, res) => {
  res.status(200).json({ message: "Book route" });
});

const newLocal = "mongodb://localhost:27017/bookstore";
// Connect to MongoDB
mongoose.connect(newLocal, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
