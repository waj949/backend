const Group = require("../models/group");
const Friendship = require("../models/friendship");

exports.addMember = (req, res) => {
  const group = req.params.id;
  const friend = req.user;
  const newMember = req.body.user;
  Friendship.exists({
    $or: [
      { first: friend, second: newMember },
      { first: newMember, second: friend }
    ]
  }).then(data => {
    if (!data) return res.json({ success: false, msg: "you're not friends" });
    Group.findByIdAndUpdate(group, { $push: { users: newMember } }).then(
      data => {
        res.json({ success: true });
      }
    );
  });
};

exports.getGroups = (req, res) => {
  Group.find({ users: { $in: req.user._id } }).then(data => res.json(data));
};
exports.createGroup = (req, res) => {
  req.body.admin = req.user._id;
  Group.create(req.body).then(data => {
    Group.findByIdAndUpdate(data._id, {
      $push: { users: ObjectId(req.user._id) }
    }).then(data => {
      res.json(data);
    });
  });
};

exports.leaveGroup = (req, res) => {
  const user = req.user;
  Group.findOne({ admin: user._id, _id: req.params.id }).then(found => {
    if (found) {
      Group.findByIdAndRemove(req.params.id).then(deleted => {
        res.json({ success: true });
      });
    } else {
      Group.findByIdAndUpdate(req.params.id, {
        $pull: { users: user._id }
      }).then(data => {
        res.json(data);
      });
    }
  });
};
