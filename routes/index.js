const router = require("express").Router();
const postController = require("../controllers/postController");

router.get("/test", (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router
  .route("/posts/:postID")
  .get(postController.getPost)
  .post(postController.comment);

module.exports = router;
