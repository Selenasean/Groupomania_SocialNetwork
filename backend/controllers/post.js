const Post = require("../models/Post");
const fs = require("fs"); // file systeme to manipulated files

/**
 * @function createPost expose POST routes logic to create a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.createPost = (req, res, next) => {
  if (req.file != null) {
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let legend = req.body.legend;
    let likes = req.body.likes;
    let usersLiked = req.body.usersLiked;
    delete userId; // delete _userId send by the user's request
    const post = new Post({
      userId: req.auth.userId, // using userId find in the authorization middleware token
      firstName: firstName,
      lastName: lastName,
      imageUrl: `${req.protocol}://${req.get("host")}/images/${
        req.file.filename
      }`, // defined complete image's URL
      legend: legend,
      likes: likes,
      usersLiked: usersLiked,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  } else {
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let legend = req.body.legend;
    let likes = req.body.likes;
    let usersLiked = req.body.usersLiked;
    delete userId; // delete _userId send by the user's request
    const post = new Post({
      userId: req.auth.userId, // using userId find in the authorization middleware token
      firstName: firstName,
      lastName: lastName,
      legend: legend,
      imageUrl: req.file,
      likes: likes,
      usersLiked: usersLiked,
    });
    post
      .save()
      .then(() => {
        res.status(201).json({ message: "Post enregistré !" });
      })
      .catch((error) => {
        res.status(400).json({ error });
      });
  }
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
  console.log(req.file);
  const postObject = req.file
    ? // if req.file exist - user tries to import image
      {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // req.fil doesn't exist - user doesn't modify the image or doesn't import image
      { ...req.body };
  console.log(postObject.imageUrl);
  delete postObject._userId;

  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to modify
    .then((post) => {
      // verify if userId = user's Id who wants to modify the product
      if (post.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        //else post.userId == req.auth.userId : means the user modifying the post is the same user who create the post : authorize

        console.log(postObject.image);

        if (postObject.imageUrl != post.imageUrl) {
          // if image send by user isn't the same as the image in database
          console.log("req.body.imageUrl du front != post.imageUrl du back");

          if (!postObject.imageUrl) {
            // if there is no image file at all -- the image send by the front = ''
            console.log("ya pas d'image - c'est que le text qui est modifié");
            Post.updateOne(
              { _id: req.params.id },
              { ...postObject, _id: req.params.id }
            )
              .then(() => res.status(200).json({ message: "Post modifié!" }))
              .catch((error) => res.status(401).json({ error }));

            if (postObject.image == "deleteImg") {
              // if the image send by the front = 'deleteImg'
              console.log(
                "l'image est null - supp par l'user - doit être supp"
              );
              // delete the path of the previous picture, save in 'images' repo
              const filename = post.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                // update the post, with an empty tag for imageUrl
                Post.updateOne(
                  { _id: req.params.id },
                  { ...postObject, imageUrl: "", _id: req.params.id }
                )
                  .then(() =>
                    res
                      .status(200)
                      .json({ message: "Post modifié, image supprimée !" })
                  )
                  .catch((error) => res.status(401).json({ error }));
              });
            }
          } else {
            // there is an image file to update
            console.log(
              "ya une image à modifiée - faut supp celle deja existante"
            );

            if (!post.imageUrl) {
              //if post.imageUrl = image in database doesn't exist, save the new post model with imageUrl inside
              console.log("ya pas post.imageUrl dans la database");
              Post.updateOne(
                { _id: req.params.id },
                { ...postObject, _id: req.params.id }
              )
                .then(() => res.status(200).json({ message: "Post modifié!" }))
                .catch((error) => res.status(401).json({ error }));
            } else {
              // post.imageUrl exist in database
              // delete the path of the image
              const filename = post.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                Post.updateOne(
                  { _id: req.params.id },
                  { ...postObject, _id: req.params.id }
                )
                  .then(() =>
                    res.status(200).json({ message: "Post modifié!" })
                  )
                  .catch((error) => res.status(401).json({ error }));
              });
            }
          }
        }
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
        // if there is an image in the post :
        if (post.imageUrl) {
          // delete the path of the image
          const filename = post.imageUrl.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Post.deleteOne({ _id: req.params.id })
              .then(() => {
                res.status(200).json({ message: "Post deleted !" });
              })
              .catch((error) => res.status(401).json({ error }));
          });
        } else {
          // if there is NOT image in the post
          Post.deleteOne({ _id: req.params.id })
            .then(() => {
              res.status(200).json({ message: "Post deleted !" });
            })
            .catch((error) => res.status(401).json({ error }));
        }
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
    .sort({ _id: "desc" }) // ordre descendant
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
        let userFound = post.usersLiked.findIndex(
          (userId) => userId == req.body.userId
        );
        if (userFound != -1) {
          post.usersLiked.splice(userFound, 1); // delete the user from the usersLiked array
          post.likes--; // remove 1 from the likes
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
