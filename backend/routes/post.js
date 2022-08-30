const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const postCtrl = require("../controllers/post");

/**
 * Router GET all posts
 */
router.get("/", auth, postCtrl.getAllPosts);

/**
 * Router POST to create a post
 */
router.post("/", auth, multer, postCtrl.createPost);

/**
 * Router GET single post
 */
router.get("/:id", auth, postCtrl.getOnePost);

/**
 * Router PUT update post
 */
router.put("/:id", auth, multer, postCtrl.modifyPost);

/**
 * Router DELETE post
 */
router.delete("/:id", auth, postCtrl.deletePost);

/**
 * Router POST to like or dislike
 */
router.post("/:id/like", auth, postCtrl.likePost);

module.exports = router;
