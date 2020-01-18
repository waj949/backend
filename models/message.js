const mongoose = require("mongoose");

module.exports = mongoose.model(
  "message",
  mongoose.Schema({
    content: String,
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "group"
    }
  })
);
