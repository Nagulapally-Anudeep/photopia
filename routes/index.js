const router = require("express").Router();
const postController = require("../controllers/postController");
const { ensureAuthenticated } = require("../middleware");

router.get("/test", (req, res) => {
  console.log(req.user);
  res.send(req.user);
});

router
  .route("/posts/:postID")
  .get(ensureAuthenticated, postController.getPost)
  .post(ensureAuthenticated, postController.comment);

<<<<<<< HEAD
router.post(
  "/like",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  postController.likePost
);
router.post("/unlike", postController.unlikePost);
=======
router.post("/like", (req, res, next) => {
  console.log(req.body);
  next();
}, postController.likePost);
>>>>>>> bca97018a9b0f54c493cfa71c683cc51d39651fc

module.exports = router;
