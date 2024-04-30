import mongoose from "mongoose";

const FacebookUserSchema = new mongoose.Schema({
  username: {
    type: mongoose.Schema.Types.String,
    unique: true,
  },
  facebookId: {
    type: mongoose.Schema.Types.String,
    required: true,
    unique: true,
  },
});

export const FacebookUser = mongoose.model("FacebookUser", FacebookUserSchema);
