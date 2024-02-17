const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const slugify = require("slugify");

const Schema = mongoose.Schema;

//? Schema Factory
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileImage: {
    type: String,
  },
  status: {
    type: String,
    default: "offline",
  },
});

//? Static Signup Check Email Method
userSchema.statics.signup = async function (name, email, password) {
  //? Validation
  if (!email || !password || !name) {
    throw Error("All fields must filled");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not Valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not Strong");
  }

  const existsEmail = await this.findOne({ email });

  if (existsEmail) {
    throw Error("Email already in use");
  }

  let slug = slugify(name, { lower: true });

  const existingUserSlug = await this.findOne({ slug });

  if (existingUserSlug) {
    let counter = 1;
    let newSlug = slug;

    // Keep appending a counter until a unique slug is found
    while (await this.findOne({ slug: newSlug })) {
      newSlug = `${slug}-${counter}`;
      counter++;
    }

    slug = newSlug;
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({ name, slug, email, password: hash });

  return user;
};

//? Static Login Check Email Method
userSchema.statics.login = async function (email, password) {
  //? Validation
  if (!email || !password) {
    throw Error("All fields must filled");
  }

  const user = await this.findOne({ email });

  if (!user) {
    throw Error("Email or Password Incorrect");
  }

  //? Compare
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Email or Password Incorrect");
  }

  return user;
};

//? Model Factory
const UserModel = mongoose.model("Users", userSchema);

//? Export Factory
module.exports = {
  UserModel,
};
