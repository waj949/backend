const Friendship = require("../models/friendship.js");

const getFriends = (req, res) => {
  Friendship.find({ $or: [{ first: req.user._id }, { second: req.user._id }] })
    .populate(["first", "second"])
    .exec((err, found) => {
      if (err) return res.json({ success: false, err });
      res.json(
        found.map(one => {
          if (!(one.first && one.second)) {
            return null;
          }
          return one.first._id.toString() == req.user._id.toString()
            ? one.second
            : one.first;
        })
      );
    });
};

module.exports = {
  getFriends
};
