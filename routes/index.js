const router = require("express").Router();

router.get("/test", (req, res) => {
  console.log(req.user);
  res.render("comments");
});

module.exports = router;
