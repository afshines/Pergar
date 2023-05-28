const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
      name: {
        type: String,
        required: false,
      },
      roles: {
        type: [String],
        required: true,
      },
      mobile: {
        type: String,
        required: true,
        unique: true,
      },
      code: {
        type: Number,
      },
  
      last_seen: {
        type: Number,
        default: 0,
      },
  
    },
    {
      timestamps: true,
    }
  );
  var Users = mongoose.model("User", userSchema);
  module.exports = { Users, userSchema };
  