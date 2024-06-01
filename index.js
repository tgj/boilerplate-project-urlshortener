require("dotenv").config();
const bodyParser = require("body-parser");
const express = require("express");
const cors = require("cors");
const app = express();
const { body, param } = require("express-validator");
let mongoose = require("mongoose");

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

mongoose.connect(process.env.MONGO_URI);

const shortLinkController = require("./controllers/shortLink.js");

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post(
  "/api/shorturl",
  body("url").isURL({
    message: "Must be a Valid URL",
    protocols: ["http", "https", "ftp"],
    require_protocol: true,
  }),
  shortLinkController.shortLink_create_post
);

app.get(
  "/api/shorturl/:numberId",
  param("numberId").isNumeric().isFloat({ min: 1 }),
  shortLinkController.shortLink_get
);

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
