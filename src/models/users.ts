import mongoose from "mongoose";
import bcrypt from "bcrypt";
import messages from "../helper/messages.js";
import validator from "validator";

const schema = new mongoose.Schema({
  first_name: {
    type: String,
    trim: true,
    required: [true, messages.require.replace("##name##", "First name")],
  },
  last_name: {
    type: String,
    trim: true,
    required: [true, messages.require.replace("##name##", "Last name")],
  },
  email: {
    type: String,
    lowercase: true,
    unique: true,
    trim: true,
    required: [true, messages.require.replace("##name##", "Email")],
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error(messages.invalid.replace("##name##", "Email"));
      }
    },
  },
  password: {
    type: String,
    required: [true, messages.require.replace("##name##", "password")],
  },
});

schema.pre("save", async function (next) {
  const newUser = this;
  if (newUser.isModified("password")) {
    newUser.password = await bcrypt.hash(newUser.password, 10);
  }
  next();
});

const user = mongoose.model("user", schema);
export default user;
