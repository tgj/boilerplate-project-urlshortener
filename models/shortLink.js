const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

let shortLinkSchema = new mongoose.Schema({
  originalLink: {
    type: String,
    required: true,
  },
});

shortLinkSchema.plugin(AutoIncrement, { inc_field: "numberId" });

module.exports = mongoose.model("ShortLink", shortLinkSchema);
