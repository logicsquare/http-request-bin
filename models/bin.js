const mongoose = require("mongoose")
const cuid = require("cuid")

const BinSchema = new mongoose.Schema({
  shortId: {
    type: String,
    default: cuid.slug
  },

  title: {
    type: String,
    default: "New Bin"
  },

  description: String,

  lastInvocationAt: {
    type: Date,
    default: null,
    expires: process.env.MONGODB_TTL
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
})

BinSchema.virtual("_invocations", {
  localField: "_id",
  foreignField: "_bin",
  ref: "Invocation",
  options: { sort: { createdAt: -1 } }
})

BinSchema.set("toJSON", { virtuals: true })
BinSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Bin", BinSchema)
