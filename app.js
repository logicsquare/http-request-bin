const Koa = require("koa")
const mongoose = require("mongoose")
const app = new Koa()
const views = require("koa-views")
const json = require("koa-json")
const onerror = require("koa-onerror")
const bodyparser = require("koa-bodyparser")
const logger = require("koa-logger")

require("dotenv").config()

const index = require("./routes/index")

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes: ["json", "form", "text"]
}))
app.use(json())
app.use(logger())
app.use(require("koa-static")(`${__dirname}/public`))

app.use(views(`${__dirname}/views`, {
  extension: "ejs"
}))
// Database setup
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useCreateIndex: true
})

// routes
app.use(index.routes(), index.allowedMethods())

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx)
})

module.exports = app
