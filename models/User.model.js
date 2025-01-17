// models/User.model.js
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required.'],
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Email is required.'],
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required.']
    },
    movies: 
      {
        type: [{ type: Schema.Types.ObjectId, ref: 'Movie' }]
      }, 
    characters:
      {
        type: []
      },
    picture: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);
