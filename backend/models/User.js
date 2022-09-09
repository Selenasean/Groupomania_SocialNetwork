const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator"); // import validator

const userSchema = mongoose.Schema({
  isAdmin: { type: Boolean, default: false },
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.plugin(uniqueValidator); // add validator as plugin of the schema

module.exports = mongoose.model("User", userSchema);
