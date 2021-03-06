const Faye = require("faye")
const Bin = require("../models/bin")
const Invocation = require("../models/invocation")

module.exports = {
  async invoke(ctx) {
    try {
      const {
        method, origin, href, headers
      } = ctx
      const bin = await Bin.findOne({ shortId: ctx.params.shortid }).select("_id").lean().exec()
      if (bin === null) throw new Error("No Such Bin!!")
      const data = {
        _bin: bin._id,
        method,
        origin,
        href,
        headers,
        body: ctx.request.body,
        ip: headers["x-forwarded-for"] || ctx.request.ip
      }
      const invocation = await Invocation.create(data)
      // Real time notif:
      const client = new Faye.Client(`${process.env.FAYE_URL}`)
      client.publish(`/bin/${invocation._bin}`, { invocation: invocation.toObject() })
      ctx.status = 200
      ctx.body = "OK"
    } catch (error) {
      console.log("==> ERR: ", error);
      ctx.status = 500
      ctx.body = "NOT OK"
    }
  },
  async start(ctx) {
    const { shortId } = await Bin.create({})
    ctx.redirect(`${process.env.SITE_URL}/bin/${shortId}`)
  },
  async get(ctx) {
    const bin = await Bin.findOne({ shortId: ctx.params.shortid }).populate("_invocations").exec()
    if (bin === null) {
      ctx.status = 404
      ctx.body = "No Such Bin!!"
    } else {
      await ctx.render("single-bin", { bin })
    }
  }
}
