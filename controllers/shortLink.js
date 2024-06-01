const ShortLink = require("../models/shortLink");
const asyncHandler = require("express-async-handler");

const { validationResult } = require("express-validator");
let mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

// Handle ShortLink create on POST
exports.shortLink_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ error: "invalid url" });
  }

  const shortLink = new ShortLink({
    originalLink: req.body.url,
  });
  console.log(shortLink);
  shortLink
    .save()
    .then((doc) => {
      console.log("ShortLink saved: " + doc);
      res.json({
        short_url: doc.numberId,
        original_url: doc.originalLink,
      });
    })
    .catch((err) => console.log(err));
});

exports.shortLink_get = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.status(422).json({ error: "invalid id" });
  }

  id = Number(req.params.numberId);
  ShortLink.findOne({ numberId: id })
    .then((doc) => {
      console.log("ShortLink found, redirecting to: " + doc.originalLink);
      res.redirect(doc.originalLink);
    })
    .catch((err) => {
      res.status(422).json({ error: `shortlink with id: ${id} not found` });
    });
});
