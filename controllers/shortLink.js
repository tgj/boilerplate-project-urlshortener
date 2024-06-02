const ShortLink = require("../models/shortLink");
const asyncHandler = require("express-async-handler");

const { validationResult } = require("express-validator");
let mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI);

// Handle ShortLink create on POST
exports.shortLink_create_post = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.json({ error: "invalid url" });
  }

  const sanitizedLink = req.body.url.replace(/\/$/, "");
  ShortLink.findOne({ originalLink: sanitizedLink })
    .then((doc) => {
      console.log("ShortLink exists, sending id: ");
      res.json({
        short_url: doc.numberId,
        original_url: doc.originalLink,
      });
    })
    .catch((err) => {
      const shortLink = new ShortLink({
        originalLink: sanitizedLink,
      });
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
});

exports.shortLink_get = asyncHandler(async (req, res, next) => {
  const validationErrors = validationResult(req);
  if (!validationErrors.isEmpty()) {
    return res.json({ error: "invalid id" });
  }

  id = Number(req.params.numberId);
  ShortLink.findOne({ numberId: id })
    .then((doc) => {
      console.log("ShortLink found, redirecting to: " + doc.originalLink);
      res.redirect(doc.originalLink);
    })
    .catch((err) => {
      res.json({ error: `shortlink with id: ${id} not found` });
    });
});
