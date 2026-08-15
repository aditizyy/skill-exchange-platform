const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    fromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from sending duplicate pending requests to the same person
requestSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

module.exports = mongoose.model("Request", requestSchema);
