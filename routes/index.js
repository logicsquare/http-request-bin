const router = require("koa-router")()

const bins = require("./bins")

router.all("/:shortid", bins.invoke) // the url where one makes the requests

router.get("/", bins.start) // Landing page: creates a new bin and redirect to its page...
router.get("/bin/:shortid", bins.get) // show invocations for a single bin

// router.prefix("/bin")
// router.get("/", bins.find)
// router.post("/", bins.post)

module.exports = router
