const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

/**
 * @function signup sign up the user
 * @param {*} req request sent by front
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.signup = (req, res, next) => {
  // using bcrypt to hash the password
  bcrypt
    .hash(req.body.password, 10)
    // put the hash to the password's place
    .then((hash) => {
      const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * @function login to log the user
 * @param {*} req request sent by front
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email }) // find the email enter by the user
    .then((user) => {
      // if user is different than the email find return 401
      if (!user) {
        return res
          .status(401)
          .json({ message: "Paire login/mot de passe incorrecte" });
      }
      // using bcrypt to compare the password enter by the user and the password in database
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          // if it's not a valid password, which means the same password as in database return 401
          if (!valid) {
            return res
              .status(401)
              .json({ message: "Paire login/mot de passe incorrecte" });
          }
          // else return user's model, using jwt to produce a token for the password
          res.status(200).json({
            firstName: user.firstName,
            lastName: user.lastName,
            userId: user._id,
            token: jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        })
        .catch((error) => res.status(500).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

/**
 * @function getUserById to get a user from the data base by his Id
 * @param {*} req request send by the front
 * @param {*} res response
 * @param {*} next pass the execution to the next
 */
exports.getUserById = (req, res, next) => {
  User.findOne({ _id: req.params.id }) // find the user with the id get in req.params (sent by the front)
    .then((user) => {
      // if there is no user match
      if (!user) {
        return res.status(401).json({ message: "Utilisateur introuvable" });
      }
      return res.status(200).json(user); // send the user to the front
    })
    .catch((error) => res.status(500).json({ error }));
};
