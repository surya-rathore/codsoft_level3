const express = require("express");
const hbs = require("hbs");
const path = require("path");
const app = express();
const fs = require("fs");
const multer = require("multer");
const staticPath = path.join(__dirname, "../public");
const templetsPath = path.join(__dirname, "../templets/partials");
const viewsPath = path.join(__dirname, "../templets/views");
const port = process.env.PORT || 3000;
require("./db/connection");
const Product = require("./models/schema");
const bcrypt = require('bcrypt');
const { MongoClient, GridFSBucket } = require('mongodb');
const mongoose = require('mongoose');
var conn = mongoose.connection;
var gfsbucket;
var gfsbucketsave;

conn.once("open", () => {
  gfsbucket = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "post",
  });
});
conn.once("open", () => {
  gfsbucketsave = new mongoose.mongo.GridFSBucket(conn.db, {
    bucketName: "save",
  });
});

const storage1 = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploade/image");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const Save = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploade/cimage");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
});
const upload1 = multer({ storage: storage1 });
const upload2 = multer({ storage: Save });
const saved = multer({ storage: Save });

const session = require('express-session');

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(staticPath));
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(templetsPath);

app.use('/public', express.static(staticPath));

// Predefined images
mongoose.connect("mongodb://localhost:27017/jewellery", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("MongoDB connected...");
  const predefinedData = new Product({
    ring: [
      { img: "collection_img/img1.webp" },
      { img: "collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
      { img: "public/collection_img/img1.webp" },
    ],
    gift: [
      { img: "/public/collection_img/img1.webp" },
      { img: "/public/collection_img/img1.webp" }
    ]
  });
  return predefinedData.save();
}).then((doc) => {
  console.log("Predefined data saved:", doc);
}).catch((err) => {
  console.error(err);
});

// Search bar functionality
app.post("/index", async (req, res) => {
  const search = req.body.search;
  console.log(req.body.search);
  try {
    let results;
    if (search === 'rings' || search === 'ring') {
      results = await Product.find({}, 'ring');
    } else if (search === 'gifts' || search === 'gift') {
      results = await Product.find({}, 'gift');
    } else {
      return res.status(400).send("Not Found");
    }
    res.render("searchResults", { results: results });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/daimand", (req, res) => {
  res.render("daimand");
});

app.get("/collection", (req, res) => {
  res.render("collection");
});

app.get("/errings", (req, res) => {
  res.render("errings");
});

app.get("/rings", (req, res) => {
  res.render("rings");
});

app.get("/wedding", (req, res) => {
  res.render("wedding");
});

app.get("/gifting", (req, res) => {
  res.render("gifting");
});

app.get("/searchResults", (req, res) => {
  res.render("searchResults");
});

app.get("/gold", (req, res) => {
  res.render("gold");
});

app.get("/candidate", (req, res, next) => {
  res.render("candidate");
});

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
