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
    default: null
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
  ref: "Invocation"
})

BinSchema.set("toJSON", { virtuals: true })
BinSchema.set("toObject", { virtuals: true })

module.exports = mongoose.model("Bin", BinSchema)
