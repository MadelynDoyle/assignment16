const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");

const upload = multer({ dest: __dirname + "/public/images" });

mongoose
  .connect(
    "mongodb+srv://doylemr:tr3D7lUfsErph7se@cluster0.afz2cbd.mongodb.net/?retryWrites=true&w=majority"
  )
  .then(() => console.log("mongodb"))
  .catch((err) => console.error("no mongodb", err));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const bookSchema = new mongoose.Schema({
  _id: mongoose.SchemaTypes.ObjectId,
  title: String,
  genre: String,
  rating: String,
  maincharacters: [String],
  img: String,
});

const Book = mongoose.model("Book", bookSchema);

app.get("/api/books", (req, res) => {
  getBooks(res);
});

const getBooks = async (res) => {
  const books = await Book.find();
  res.send(books);
};

app.post("/api/books", upload.single("img"), (req, res) => {
  const result = validateBook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const book = new Book({
    title: req.body.title,
    genre: req.body.genre,
    rating: req.body.rating,
    maincharacters: req.body.maincharacters.split(","),
  });

  if (req.file) {
    book.img = "images/" + req.file.filename;
  }

  createBook(book, res);
});

const createBook = async (book, res) => {
  const result = await book.save();
  res.send(book);
};

app.put("/api/book/:id", upload.single("img"), (req, res) => {
  const result = validateBook(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  updateBook(req, res);
});

const updateBook = async (req, res) => {
  let fieldsToUpdate = {
    title: req.body.title,
    genre: req.body.genre,
    rating: req.body.rating,
    maincharacters: req.body.maincharacters.split(","),
  };

  if (req.file) {
    fieldsToUpdate.img = "images/" + req.file.filename;
  }

  const result = await Book.updateOne({ _id: req.params.id }, fieldsToUpdate);
  const book = await Book.findById(req.params.id);
  res.send(book);
};

app.delete("/api/book/:id", upload.single("img"), (req, res) => {
  removeBook(res, req.params.id);
});

const removeBook = async (res, id) => {
  const book = await Book.findByIdAndDelete(id);
  res.send(book);
};

const validateBook = (book) => {
  const schema = Joi.object({
    _id: Joi.allow(""),
    maincharacters: Joi.allow(""),
    title: Joi.string().min(3).required(),
    genre: Joi.string().min(3).required(),
    rating: Joi.allow(""),
  });

  return schema.validate(book);
};

app.listen(3010, () => {
  console.log("I'm listening");
});