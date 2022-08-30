const Post = require("../models/Post");
const fs = require("fs"); // file systeme to manipulated files

/**
 * @function createPost expose POST routes logic to create a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.createPost = (req, res, next) => {
  const postObject = JSON.parse(req.body.post);
  delete postObject._id; // delete _id send by the user's request
  delete postObject._userId; // delete _userId send by the user's request
  const post = new Post({
    ...postObject,
    userId: req.auth.userId, // using userId find in the authorization middleware token
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`, // defined complete image's URL
  });

  post
    .save()
    .then(() => {
      res.status(201).json({ message: "Post enregistré !" });
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/**
 * @function getOnePost expose GET routes logic to get single post
 * @param {*} req request
 * @param {*} res  response
 * @param {*} next pass the execution to the next
 */
exports.getOnePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to get
    .then((post) => {
      res.status(200).json(post);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

/**
 * @function modifyPost expose PUT routes logic to modify the post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.modifyPost = (req, res, next) => {
  const postObject = req.file
    ? // if req.file exist - user tries to import image
      {
        ...JSON.parse(req.body.post),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // req.fil doesn't exist - user doesn't modify the image
      { ...req.body };

  delete postObject._userId;
  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to modify
    .then((post) => {
      // verify if userId = user's Id who wants to modify the product
      if (post.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // delete the existing post's image
        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.updateOne(
            { _id: req.params.id },
            { ...postObject, _id: req.params.id }
          )
            .then(() => res.status(200).json({ message: "Post modifié!" }))
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

/**
 * @function deletePost expose DELETE routes logic to delete post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.deletePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to delete
    .then((post) => {
      // if the userId is different than the user's Id who want to delete the post
      if (post.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        // delete the path of the image
        const filename = post.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Post deleted !" });
            })
            .catch((error) => res.status(401).json({ error }));
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error });
    });
};

/**
 * @function getAllPosts expose GET routes logic to get all the post in the database
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.getAllPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      res.status(200).json(posts);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};

/**
 * @function likePost expose POST routes to like or dislike a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.likePost = (req, res, next) => {
  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to like
    .then((post) => {
      // if like == 1 it means user liked, add likes +1 and add the user inside [usersLiked]
      if (req.body.like == 1) {
        post.likes++;
        post.usersLiked.push(req.body.userId);
      }
      // if like == -1 it means user disliked, add dislikes +1 and add usser inside [usersDisliked]
      if (req.body.like == -1) {
        post.dislikes++;
        post.usersDisliked.push(req.body.userId);
      }
      // if like == 0 it means user canceled a liked or a disliked
      if (req.body.like == 0) {
        // find user's index in the usersLiked array
        let userFound = post.usersLiked.findIndex(
          (userId) => userId == req.body.userId
        );
        if (userFound != -1) {
          post.usersLiked.splice(userFound, 1); // delete the user from the usersLiked array
          post.likes--; // remove 1 from the likes
        } else {
          // find user's index in the usersDisliked array
          let userFound = post.usersDisliked.findIndex(
            (userId) => userId == req.body.userId
          );
          post.usersDisliked.splice(userFound, 1); // delete the user from the usersDisliked array
          post.dislikes--; // remove 1 from the dislikes
        }
      }
      post.save();
      res.status(201).json({ message: "Avis modifiée !" });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
