const mongoose = require("mongoose")

const InvocationSchema = new mongoose.Schema({
  _bin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bin",
    required: true
  },

  method: {
    type: String,
    toUpperCase: true,
    enum: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
  },
  ip: String,
  origin: String,
  href: String,
  headers: {},
  body: {},

  createdAt: {
    type: Date,
    default: Date.now,
    expires: process.env.MONGODB_TTL
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
})

// eslint-disable-next-line prefer-arrow-callback
InvocationSchema.post("save", async function (doc) {
  await mongoose.model("Bin").update(
    { _id: doc._bin },
    { lastInvocationAt: Date.now() }
  ).exec()
})

InvocationSchema.set("toJSON", { virtuals: true })
InvocationSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Invocation", InvocationSchema)
