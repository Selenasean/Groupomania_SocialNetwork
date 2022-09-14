const Post = require("../models/Post");
const User = require("../models/User");
const fs = require("fs"); // file systeme to manipulated files

/**
 * @function createPost expose POST routes logic to create a post
 * @param {*} req request
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.createPost = (req, res, next) => {
  //if there is a file
  if (req.file != null) {
    let userId = req.body.userId;
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let legend = req.body.legend;
    let likes = req.body.likes;
    let usersLiked = req.body.usersLiked;
    delete userId; // delete userId send by the user's request

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
    // else if there is NOT a file - don't defined a URL

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
      imageUrl: req.file, // which is null
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
  const postObject = req.file
    ? // if req.file exist - user tries to import image - convert to an URL
      {
        ...req.body,
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : // req.file doesn't exist - user doesn't modify the image or doesn't import image - no need to convert
      { ...req.body };
  delete postObject._userId;

  Post.findOne({ _id: req.params.id }) // find the _id of the post we want to modify
    .then((post) => {
      const userIdCreator = post.userId; // defined id of the user who create the post

      User.findOne({ _id: req.auth.userId }) // find the user who made the request
        .then((user) => {
          //verify if userId of the post = user's Id who wants to modify the post OR if user is Administrator -- Authorize
          if ((post.userId = req.auth.userId) || user.isAdmin) {
            if (!postObject.imageUrl) {
              // if there isn't image file sent by the front - means there isn't image's URL

              if (postObject.image == "deleteImg" && post.imageUrl != "") {
                // if 'image' params sent by front = 'deleteImg' AND 'imageUrl' params in database = something -- means user wants to DELETE picture

                if (user.isAdmin) {
                  // delete the path of the previous picture saved in 'images' repo
                  const filename = post.imageUrl.split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {
                    // update the post, with an empty tag for imageUrl
                    Post.updateOne(
                      { _id: req.params.id },
                      {
                        ...postObject,
                        userId: userIdCreator,
                        firstName: post.firstName,
                        lastName: post.lastName,
                        imageUrl: "",
                        _id: req.params.id,
                      }
                    )
                      .then(() =>
                        res
                          .status(200)
                          .json({ message: "Post modifié par Admin !" })
                      )
                      .catch((error) => res.status(401).json({ error }));
                  });
                } else {
                  // is not Admin
                  // delete the path of the previous picture saved in 'images' repo
                  const filename = post.imageUrl.split("/images/")[1];
                  fs.unlink(`images/${filename}`, () => {
                    // update the post, with an empty tag for imageUrl
                    Post.updateOne(
                      { _id: req.params.id },
                      { ...postObject, imageUrl: "", _id: req.params.id }
                    )
                      .then(() =>
                        res.status(200).json({ message: "Post modifié!" })
                      )
                      .catch((error) => res.status(401).json({ error }));
                  });
                }
              }
              if (!post.imageUrl && !postObject.image) {
                //if there isn't 'imageUrl' params in database & front does'nt sent 'image' params -- means user modified text on a post only composed of text

                if (user.isAdmin) {
                  Post.updateOne(
                    { _id: req.params.id },
                    {
                      ...postObject,
                      userId: userIdCreator,
                      firstName: post.firstName,
                      lastName: post.lastName,
                      _id: req.params.id,
                    }
                  )
                    .then(() =>
                      res
                        .status(200)
                        .json({ message: "Post modifié par Admin !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                } else {
                  // is not Admin
                  Post.updateOne(
                    { _id: req.params.id },
                    { ...postObject, _id: req.params.id }
                  )
                    .then(() =>
                      res
                        .status(200)
                        .json({ message: "Texte du post modifié!" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                }
              }
              if (!postObject.image && post.imageUrl) {
                // if 'image' params sent by front does'nt exist AND there is 'imageUrl' params in database -- means user modified text on a post composed of img+text

                if (user.isAdmin) {
                  Post.updateOne(
                    { _id: req.params.id },
                    {
                      ...postObject,
                      userId: userIdCreator,
                      firstName: post.firstName,
                      lastName: post.lastName,
                      _id: req.params.id,
                    }
                  )
                    .then(() =>
                      res
                        .status(200)
                        .json({ message: "Post modifié par Admin !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                } else {
                  //is not Admin
                  Post.updateOne(
                    { _id: req.params.id },
                    { ...postObject, _id: req.params.id }
                  )
                    .then(() =>
                      res.status(200).json({ message: "Post modifié !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                }
              }
            }
            if (postObject.imageUrl && post.imageUrl && !postObject.image) {
              // if there is 'imageUrl' (so there's not 'image' params) sent by front & 'imageUrl' exist in database -- means user modified image on a post composed of img +text

              if (user.isAdmin) {
                // delete the path of the previous picture, save in 'images' repo
                const filename = post.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                  Post.updateOne(
                    { _id: req.params.id },
                    {
                      ...postObject,
                      userId: userIdCreator,
                      firstName: post.firstName,
                      lastName: post.lastName,
                      _id: req.params.id,
                    }
                  )
                    .then(() =>
                      res
                        .status(200)
                        .json({ message: "Post modifié par Admin !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                });
              } else {
                // is not Admin
                // delete the path of the previous picture, save in 'images' repo
                const filename = post.imageUrl.split("/images/")[1];
                fs.unlink(`images/${filename}`, () => {
                  Post.updateOne(
                    { _id: req.params.id },
                    { ...postObject, _id: req.params.id }
                  )
                    .then(() =>
                      res.status(200).json({ message: "Post modifié !" })
                    )
                    .catch((error) => res.status(401).json({ error }));
                });
              }
            }
            if (postObject.imageUrl && !post.imageUrl && !postObject.image) {
              //if there is 'imageUrl' (so there's not 'image' params) sent by front & there's not 'imageUrl' params in database -- means user add an image to a post only composed of text

              if (user.isAdmin) {
                Post.updateOne(
                  { _id: req.params.id },
                  {
                    ...postObject,
                    userId: userIdCreator,
                    firstName: post.firstName,
                    lastName: post.lastName,
                    imageUrl: postObject.imageUrl,
                    _id: req.params.id,
                  }
                )
                  .then(() =>
                    res.status(200).json({ message: "Post modifié par Admin!" })
                  )
                  .catch((error) => res.status(401).json({ error }));
              } else {
                Post.updateOne(
                  { _id: req.params.id },
                  {
                    ...postObject,
                    imageUrl: postObject.imageUrl,
                    _id: req.params.id,
                  }
                )
                  .then(() =>
                    res.status(200).json({ message: "Post modifié !" })
                  )
                  .catch((error) => res.status(401).json({ error }));
              }
            }
          } else {
            res.status(401).json({ message: "Not authorized" });
          }
        })
        .catch((error) => res.status(500).json({ error }));
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
      // find the user who made the request to see if he is admin
      User.findOne({ _id: req.auth.userId })
        .then((user) => {
          //if userId 's post = the Id of the user who want to delete OR is the Administrator -- Authorize
          if ((post.userId = req.auth.userId) || user.isAdmin) {
            // if there is an image in the post :
            if (post.imageUrl) {
              // delete the path of the image
              const filename = post.imageUrl.split("/images/")[1];
              fs.unlink(`images/${filename}`, () => {
                Post.deleteOne({ _id: req.params.id })
                  .then(() => {
                    return res.status(200).json({ message: "Post deleted !" });
                  })
                  .catch((error) => res.status(401).json({ error }));
              });
            } else {
              // if there is NOT image in the post
              Post.deleteOne({ _id: req.params.id })
                .then(() => {
                  return res.status(200).json({ message: "Post deleted !" });
                })
                .catch((error) => res.status(401).json({ error }));
            }
          } else {
            // else, the user is not the same as the one who edit de post AND he's not the Administrator
            return res.status(401).json({ message: "Not authorized" });
          }
        })
        .catch((error) => res.status(500).json({ error }));
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
    .sort({ _id: "desc" }) // anterochronological order - from the newest to the oldest
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
      // if like == -1 it means user unliked
      if (req.body.like == -1) {
        let userFound = post.usersLiked.findIndex(
          (userId) => userId == req.body.userId
        );
        if (userFound != -1) {
          // userFound !=-1 means userFound exist
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
