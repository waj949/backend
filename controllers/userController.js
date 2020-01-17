const User = require("../models/user.js"),
  bcrypt = require("bcrypt"),
  config = require("../config.js"),
  Request = require("../models/request.js"),
  Friendship = require("../models/friendship.js");

const functions = {
  getUsers: (req, res) => {
    User.find({}, (err, users) => {
      if (err) throw err;
      else res.json(users);
    });
  },

  getUser: (req, res) => {},

  signUp: (req, res) => {
    if (!req.body.username)
      return res.json({ success: false, msg: "username is required" });
    if (!req.body.password)
      return res.json({ success: false, msg: "password is required" });
    if (req.body.password.length < 8)
      return res.json({
        success: false,
        msg: "password should be 8 characters or more"
      });
    if (!req.body.firstname)
      return res.json({ success: false, msg: "firstname is required" });
    if (!req.body.lastname)
      return res.json({ success: false, msg: "lastname is required" });
    if (!req.body.email)
      return res.json({ success: false, msg: "email is required" });

    User.findOne({ username: req.body.username }, (err, found) => {
      if (err) res.json({ success: false, err });
      else {
        if (found) return res.json({ success: false, msg: "username exists" });
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) res.json({ err });
          else {
            req.body.password = hash;
            User.create(req.body, (err, created) => {
              if (err) return res.json({ err });
              created.password = undefined;
              res.json({ success: true });
            });
          }
        });
      }
    });
  },

  signIn: (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({ username }, (err, user) => {
      if (err) throw err;
      if (!user) {
        return res.json({ success: false, msg: "User not found" });
      }
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) return res.json({ success: false, err });
        if (isMatch) {
          user.password = undefined;
          const token = jwt.sign(user.toJSON(), config.secret, {
            expiresIn: 604800 // 1 week
          });
          res.json({
            success: true,
            token: "jwt " + token,
            user
          });
        } else {
          return res.json({ success: false, msg: "Wrong password" });
        }
      });
    });
  },

  sendFriendRequest: (req, res) => {
    Friendship.findOne(
      {
        $or: [
          { first: req.user._id, second: req.params.id },
          { first: req.params.id, second: req.user._id }
        ]
      },
      (err, friends) => {
        if (friends)
          return res.json({ success: false, msg: "you're already friends" });
        Request.findOne(
          {
            $or: [
              { sender: req.user._id, receiver: req.params.id },
              { sender: req.params.id, receiver: req.user._id }
            ]
          },
          (err, found) => {
            if (err) return res.json({ success: false, err });
            if (found)
              return res.json({
                success: false,
                msg: "request already exists"
              });
            Request.create(
              { sender: req.user._id, receiver: req.params.id },
              (err, created) => {
                if (err) return res.json({ success: false, err });
                res.json({ success: true });
              }
            );
          }
        );
      }
    );
  },

  removeFriendRequest: (req, res) => {
    Request.findOne(
      {
        $or: [
          { sender: req.user._id, receiver: req.params.id },
          { sender: req.params.id, receiver: req.user._id }
        ]
      },
      (err, found) => {
        if (err) return res.json({ success: false, err });
        if (!found)
          return res.json({ success: false, msg: "there's no request" });
        Request.findByIdAndDelete(found._id, (err, removed) => {
          if (err) return res.json({ success: false, err });
          res.json({ success: true });
        });
      }
    );
  }
};
module.exports = functions;
